"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/composite/modal-components";

import LoadingUI from "@/components/common/Loading";

import OperationMemoSection from "@/components/views/sm-pay/components/OperationMemoSection";
import JudgementMemoSection from "@/components/views/sm-pay/components/JudgementMemoSection";
import AdvertiserSimulationModal from "@/components/views/sm-pay/components/AdvertiserSimulationModal";
import GuidSection from "@/components/views/sm-pay/components/GuideSection";

import ApproveModal from "./ApproveModal";
import RejectSendModal from "./RejectSendModal";
import { RejectDialog } from "@/components/views/sm-pay/manangement/dialog";

import {
  useSmPaySubmitDetail,
  useSmPayStatusUpdate,
  useSmPayAdvertiserDetail,
  useSmPayRead,
  useSmPayDetail,
} from "@/hooks/queries/sm-pay";

import AdvertiserInfoSection from "../../components/AdvertiserInfoSection";
import StatIndicatorSection from "../../components/StatIndicatorSection";
import RuleSection2 from "../../components/RuleSection2";
import ScheduleSection2 from "../../components/ScheduleSection2";

import type { AdvertiserData } from "@/types/adveriser";
import type { ChargeRule } from "@/types/smpay";

type SmPayJudgementDetailViewProps = {
  id: string;
};

const status = "reject";

const SmPayJudgementDetailView = ({ id }: SmPayJudgementDetailViewProps) => {
  console.log("id", id);
  const [isApproved, setIsApproved] = useState(false);
  const [isRejectSend, setIsRejectSend] = useState(false);
  const [isReject, setIsReject] = useState(false);
  const [isRestart, setIsRestart] = useState(false);
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

  const { data: smpayInfo, isPending: loading } = useSmPayDetail(
    Number(id),
    Number(0)
  );

  const { mutate: updateStatus, isPending: isUpdating } = useSmPayStatusUpdate({
    onSuccess: () => {
      setIsRestart(false);
    },
  });

  const { mutate: patchRead } = useSmPayRead();

  const handleOpenRejectModal = () => {
    setIsReject(true);
  };

  useEffect(() => {
    if (id && smpayInfo) {
      patchRead({ advertiserId: Number(id), isReviewerRead: true });
    }

    if (smpayInfo) {
      const { advertiserStandardRoasPercent, chargeRules } = smpayInfo;

      const findUpChargeRule = chargeRules.find(
        (rule) => rule.rangeType === "UP"
      );
      const findDownChargeRule = chargeRules.find(
        (rule) => rule.rangeType === "DOWN"
      );

      if (findUpChargeRule) {
        setUpChargeRule({
          ...findUpChargeRule,
          standardRoasPercent: advertiserStandardRoasPercent,
        });
      }
      if (findDownChargeRule) {
        setDownChargeRule({
          ...findDownChargeRule,
          standardRoasPercent: advertiserStandardRoasPercent,
        });
      }
    }
  }, [smpayInfo, id]);

  const prePaymentSchedule = {
    initialAmount: smpayInfo?.initialAmount || 0,
    maxChargeLimit: smpayInfo?.maxChargeLimit || 0,
    minChargeLimit: smpayInfo?.minChargeLimit || 0,
  };

  const statIndicator = {
    operationPeriod: smpayInfo?.advertiserOperationPeriod || 0,
    dailyAverageRoas: smpayInfo?.advertiserDailyAverageRoas || 0,
    monthlyConvAmt: smpayInfo?.advertiserMonthlyConvAmt || 0,
    dailySalesAmt: smpayInfo?.advertiserDailySalesAmt || 0,
    recommendRoas: smpayInfo?.advertiserRecommendRoasPercent || 0,
  };

  return (
    <div>
      {isApproved && (
        <ApproveModal
          onClose={() => setIsApproved(false)}
          onConfirm={() => setIsApproved(false)}
        />
      )}
      {isRejectSend && (
        <RejectSendModal
          onClose={() => setIsRejectSend(false)}
          onConfirm={() => setIsRejectSend(false)}
        />
      )}

      {isReject && (
        <RejectDialog
          id={id}
          onClose={() => setIsReject(false)}
          onConfirm={() => setIsReject(false)}
        />
      )}
      {isRestart && (
        <ConfirmDialog
          open
          title="광고주 심사 재개" // TODO : 노출 되는지 확인 필요
          onClose={() => setIsRestart(false)}
          onConfirm={() => updateStatus({ id, status: "REVIEW_APPROVED" })}
          content="광고주 상태를 다시 활성화 하시겠습니까?"
        />
      )}

      {isSimulation && (
        <AdvertiserSimulationModal
          open={isSimulation}
          onClose={() => setIsSimulation(false)}
        />
      )}

      <GuidSection
        viewType={
          smpayInfo?.advertiserStatus === "OPERATION_REJECT"
            ? "reject"
            : "master-judgement"
        }
      />

      <AdvertiserInfoSection advertiserId={Number(id)} isHistory />

      <StatIndicatorSection
        advertiserId={Number(id)}
        statIndicator={statIndicator}
      />

      <RuleSection2
        type="show"
        upChargeRule={upChargeRule}
        downChargeRule={downChargeRule}
      />
      <ScheduleSection2 type="show" prePaymentSchedule={prePaymentSchedule} />
      <JudgementMemoSection type="show" text={smpayInfo?.reviewerMemo || ""} />
      <OperationMemoSection type="write" text={smpayInfo?.approvalMemo || ""} />

      {status === "reject" && (
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
      )}
    </div>
  );
};

export default SmPayJudgementDetailView;
