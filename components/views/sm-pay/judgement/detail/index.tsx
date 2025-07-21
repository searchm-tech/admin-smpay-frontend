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
import { RuleSectionShow } from "@/components/views/sm-pay/components/RuleSection";
import { ScheduleSectionShow } from "@/components/views/sm-pay/components/ScheduleSection";

import ApproveModal from "./ApproveModal";
import RejectSendModal from "./RejectSendModal";
import { RejectDialog } from "@/components/views/sm-pay/manangement/dialog";

import {
  useSmPayRead,
  useSmPayScreeningIndicator,
  useReviewerMemoDto,
  useSmPayAdvertiserChargeRule,
  useSmPayAdvertiserPrePaymentSchedule,
  useSmPayFormDetail,
} from "@/hooks/queries/sm-pay";

import type { StatIndicatorParams } from "@/types/api/smpay";
import type { ChargeRule, PrePaymentSchedule } from "@/types/smpay";

export type JudgementModalProps = {
  statIndicator: StatIndicatorParams;
  chargeRule: ChargeRule[];
  prePaymentSchedule: PrePaymentSchedule;
  reviewerMemo: string;
  approvalMemo: string;
};

type Props = {
  id: string;
};

const SmPayJudgementDetailView = ({ id }: Props) => {
  const router = useRouter();

  const formId = useSearchParams().get("formId");
  const read = useSearchParams().get("read");

  const [isApproved, setIsApproved] = useState(false);
  const [isRejectSend, setIsRejectSend] = useState(false);
  const [isReject, setIsReject] = useState(false);
  const [isSimulation, setIsSimulation] = useState(false);

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

  const [operationMemo, setOperationMemo] = useState("");

  const { data: screeningIndicator, isPending: loadingScreeningIndicator } =
    useSmPayScreeningIndicator(Number(id));

  const { data: reviewerMemo, isPending: loadingReviewerMemo } =
    useReviewerMemoDto(Number(id));

  const { data: chargeRule, isPending: loadingChargeRule } =
    useSmPayAdvertiserChargeRule(Number(id));

  const { data: formInfo, isPending: loading } = useSmPayFormDetail(
    Number(id),
    Number(formId)
  );

  const { data: prePaymentScheduleData, isPending: loadingPrePaymentSchedule } =
    useSmPayAdvertiserPrePaymentSchedule(Number(id));

  const { mutate: patchRead } = useSmPayRead();

  useEffect(() => {
    // 심사 목록 읽음 상태 변경
    if (id && read === "unread") {
      patchRead({ advertiserId: Number(id), isApprovalRead: true });
    }
  }, [id, read]);

  useEffect(() => {
    if (formInfo) {
      const upChargeRuleData = formInfo.chargeRules.find(
        (rule) => rule.rangeType === "UP"
      );
      const downChargeRuleData = formInfo.chargeRules.find(
        (rule) => rule.rangeType === "DOWN"
      );

      if (upChargeRuleData) {
        setUpChargeRule({
          standardRoasPercent: formInfo?.advertiserStandardRoasPercent || 0,
          rangeType: upChargeRuleData.rangeType,
          boundType: upChargeRuleData.boundType,
          changePercentOrValue: upChargeRuleData.changePercentOrValue,
        });
      }
      if (downChargeRuleData) {
        setDownChargeRule({
          standardRoasPercent: formInfo?.advertiserStandardRoasPercent || 0,
          rangeType: downChargeRuleData.rangeType,
          boundType: downChargeRuleData.boundType,
          changePercentOrValue: downChargeRuleData.changePercentOrValue,
        });
      }
    }
  }, [formInfo]);

  const statIndicator = {
    operationPeriod: screeningIndicator?.advertiserOperationPeriod || 0,
    dailyAverageRoas: screeningIndicator?.advertiserDailyAverageRoas || 0,
    monthlyConvAmt: screeningIndicator?.advertiserMonthlyConvAmt || 0,
    dailySalesAmt: screeningIndicator?.advertiserDailySalesAmt || 0,
    recommendRoas: screeningIndicator?.advertiserRecommendRoasPercent || 0,
  };

  const prePaymentSchedule = {
    initialAmount: prePaymentScheduleData?.initialAmount || 0,
    maxChargeLimit: prePaymentScheduleData?.maxChargeLimit || 0,
    minChargeLimit: prePaymentScheduleData?.minChargeLimit || 0,
  };

  const isLoading =
    loadingScreeningIndicator ||
    loadingReviewerMemo ||
    loadingChargeRule ||
    loadingPrePaymentSchedule;

  const defaultParams: JudgementModalProps = {
    statIndicator: {
      operationPeriod: statIndicator.operationPeriod,
      dailyAverageRoas: statIndicator.dailyAverageRoas,
      monthlyConvAmt: statIndicator.monthlyConvAmt,
      dailySalesAmt: statIndicator.dailySalesAmt,
      recommendRoasPercent: statIndicator.recommendRoas,
    },
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

      {/* {isReject && (
        <RejectDialog
          id={id}
          onClose={() => setIsReject(false)}
          onConfirm={() => setIsReject(false)}
        />
      )} */}

      {isSimulation && (
        <AdvertiserSimulationModal
          open={isSimulation}
          upChargeRule={upChargeRule}
          downChargeRule={downChargeRule}
          prePaymentSchedule={prePaymentSchedule}
          onClose={() => setIsSimulation(false)}
        />
      )}

      <AdvertiserInfoSection advertiserId={Number(id)} />

      <StatIndicatorSection
        advertiserId={Number(id)}
        statIndicator={statIndicator}
      />

      <RuleSectionShow
        upChargeRule={upChargeRule}
        downChargeRule={downChargeRule}
      />
      <ScheduleSectionShow prePaymentSchedule={prePaymentSchedule} />
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
