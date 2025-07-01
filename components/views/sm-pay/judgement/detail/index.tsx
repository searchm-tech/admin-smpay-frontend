"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import LoadingUI from "@/components/common/Loading";

import OperationMemoSection from "@/components/views/sm-pay/components/OperationMemoSection";
import JudgementMemoSection from "@/components/views/sm-pay/components/JudgementMemoSection";
import AdvertiserSimulationModal from "@/components/views/sm-pay/components/AdvertiserSimulationModal";

import AdvertiserInfoSection from "@/components/views/sm-pay/components/AdvertiserInfoSection";
import StatIndicatorSection from "@/components/views/sm-pay/components/StatIndicatorSection";
import RuleSection2 from "@/components/views/sm-pay/components/RuleSection2";
import ScheduleSection2 from "@/components/views/sm-pay/components/ScheduleSection2";

import ApproveModal from "./ApproveModal";
import RejectSendModal from "./RejectSendModal";
import { RejectDialog } from "@/components/views/sm-pay/manangement/dialog";

import {
  useSmPayRead,
  useSmPayScreeningIndicator,
  useSmPayReviewerMemo,
  useSmPayAdvertiserChargeRule,
  useSmPayAdvertiserPrePaymentSchedule,
} from "@/hooks/queries/sm-pay";

import type { ChargeRule, PrePaymentSchedule } from "@/types/smpay";
import type {
  ParamsSmPayApproval,
  StatIndicatorParams,
} from "@/types/api/smpay";

type Props = {
  id: string;
};

const SmPayJudgementDetailView = ({ id }: Props) => {
  const router = useRouter();

  const read = useSearchParams().get("read");

  const [isApproved, setIsApproved] = useState(false);
  const [isRejectSend, setIsRejectSend] = useState(false);
  const [isReject, setIsReject] = useState(false);
  const [isSimulation, setIsSimulation] = useState(false);

  const [statIndicator, setStatIndicator] = useState<StatIndicatorParams>({
    operationPeriod: 0,
    dailyAverageRoas: 0,
    monthlyConvAmt: 0,
    dailySalesAmt: 0,
    recommendRoasPercent: 0,
  });

  const [operationMemo, setOperationMemo] = useState("");

  const [upChargeRule, setUpChargeRule] = useState<ChargeRule>({
    standardRoasPercent: 0,
    rangeType: "UP",
    boundType: "FIXED_AMOUNT",
    changePercentOrValue: 0,
  });

  const [downChargeRule, setDownChargeRule] = useState<ChargeRule>({
    standardRoasPercent: 0,
    rangeType: "DOWN",
    boundType: "FIXED_AMOUNT",
    changePercentOrValue: 0,
  });

  const [prePaymentSchedule, setPrePaymentSchedule] =
    useState<PrePaymentSchedule>({
      initialAmount: 0,
      maxChargeLimit: 0,
      minChargeLimit: 0,
    });

  const { data: screeningIndicator, isPending: loadingScreeningIndicator } =
    useSmPayScreeningIndicator(Number(id));

  const { data: reviewerMemo, isPending: loadingReviewerMemo } =
    useSmPayReviewerMemo(Number(id));

  const { data: chargeRule, isPending: loadingChargeRule } =
    useSmPayAdvertiserChargeRule(Number(id));

  const { data: prePaymentScheduleData, isPending: loadingPrePaymentSchedule } =
    useSmPayAdvertiserPrePaymentSchedule(Number(id));

  const { mutate: patchRead } = useSmPayRead();

  useEffect(() => {
    // 심사 목록 읽음 상태 변경
    if (id && read === "unread") {
      patchRead({ advertiserId: Number(id), isApprovalRead: true });
    }

    if (chargeRule) {
      const findUpChargeRule = chargeRule.find(
        (rule) => rule.rangeType === "UP"
      );
      const findDownChargeRule = chargeRule.find(
        (rule) => rule.rangeType === "DOWN"
      );

      if (findUpChargeRule) {
        setUpChargeRule({
          ...findUpChargeRule,
          standardRoasPercent: findUpChargeRule.standardRoasPercent,
        });
      }

      if (findDownChargeRule) {
        setDownChargeRule({
          ...findDownChargeRule,
          standardRoasPercent: findDownChargeRule.standardRoasPercent,
        });
      }
    }

    if (screeningIndicator) {
      setStatIndicator({
        operationPeriod: screeningIndicator?.advertiserOperationPeriod || 0,
        dailyAverageRoas: screeningIndicator?.advertiserDailyAverageRoas || 0,
        monthlyConvAmt: screeningIndicator?.advertiserMonthlyConvAmt || 0,
        dailySalesAmt: screeningIndicator?.advertiserDailySalesAmt || 0,
        recommendRoasPercent:
          screeningIndicator?.advertiserRecommendRoasPercent || 0,
      });
    }

    if (prePaymentScheduleData) {
      setPrePaymentSchedule({
        initialAmount: prePaymentScheduleData.initialAmount,
        maxChargeLimit: prePaymentScheduleData.maxChargeLimit,
        minChargeLimit: prePaymentScheduleData.minChargeLimit,
      });
    }
  }, [screeningIndicator, chargeRule, prePaymentScheduleData, id, read]);

  const statIndicatorData = {
    operationPeriod: statIndicator.operationPeriod,
    dailyAverageRoas: statIndicator.dailyAverageRoas,
    monthlyConvAmt: statIndicator.monthlyConvAmt,
    dailySalesAmt: statIndicator.dailySalesAmt,
    recommendRoas: statIndicator.recommendRoasPercent,
  };

  const isLoading =
    loadingScreeningIndicator ||
    loadingReviewerMemo ||
    loadingChargeRule ||
    loadingPrePaymentSchedule;

  const defaultParams: Partial<ParamsSmPayApproval> = {
    statIndicator: statIndicator,
    chargeRule: [upChargeRule, downChargeRule],
    prePaymentSchedule,
    reviewerMemo: reviewerMemo?.description || "",
    approvalMemo: operationMemo,
  };

  return (
    <div>
      {isLoading && <LoadingUI title="심사 정보 조회중" />}

      {isApproved && (
        <ApproveModal
          advertiserId={Number(id)}
          params={defaultParams}
          onClose={() => setIsApproved(false)}
          onConfirm={() => {
            setIsApproved(false);
            router.push("/sm-pay/judgement");
          }}
        />
      )}
      {isRejectSend && (
        <RejectSendModal
          advertiserId={Number(id)}
          params={defaultParams}
          onClose={() => setIsRejectSend(false)}
          onConfirm={() => {
            setIsRejectSend(false);
            router.push("/sm-pay/judgement");
          }}
        />
      )}

      {isReject && (
        <RejectDialog
          id={id}
          onClose={() => setIsReject(false)}
          onConfirm={() => setIsReject(false)}
        />
      )}

      {isSimulation && (
        <AdvertiserSimulationModal
          open={isSimulation}
          upChargeRule={upChargeRule}
          downChargeRule={downChargeRule}
          prePaymentSchedule={prePaymentSchedule}
          onClose={() => setIsSimulation(false)}
        />
      )}

      {/* <AdvertiserInfoSection
        advertiserId={Number(id)}
        userId={Number(userId)}
        isHistory
      /> */}

      <StatIndicatorSection
        advertiserId={Number(id)}
        statIndicator={statIndicatorData}
      />

      <RuleSection2
        type="show"
        upChargeRule={upChargeRule}
        downChargeRule={downChargeRule}
      />
      <ScheduleSection2 type="show" prePaymentSchedule={prePaymentSchedule} />
      <JudgementMemoSection
        type="show"
        text={reviewerMemo?.description || ""}
      />
      <OperationMemoSection
        type="write"
        text={operationMemo}
        handleChange={setOperationMemo}
      />

      <div className="flex justify-center gap-4 py-5">
        <Button
          className="minw-[150px]"
          variant="orangeOutline"
          onClick={() => setIsSimulation(true)}
        >
          광고 성과 예측 시뮬레이션
        </Button>

        <Button className="w-[150px]" onClick={() => setIsApproved(true)}>
          심사 승인
        </Button>

        <Button
          variant="secondary"
          className="w-[150px]"
          onClick={() => setIsRejectSend(true)}
        >
          심사 반려
        </Button>
      </div>
    </div>
  );
};

export default SmPayJudgementDetailView;
