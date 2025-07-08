"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import LoadingUI from "@/components/common/Loading";
import { Button } from "@/components/ui/button";

import OperationMemoSection from "@/components/views/sm-pay/components/OperationMemoSection";
import JudgementMemoSection from "@/components/views/sm-pay/components/JudgementMemoSection";
import OperationAccountStatusSection from "@/components/views/sm-pay/components/OperationAccountStatusSection";
import { RuleSectionShow } from "@/components/views/sm-pay/components/RuleSection";
import { ScheduleSectionShow } from "@/components/views/sm-pay/components/ScheduleSection";
import AdvertiserInfoSection from "./AdvertiserInfoSection";

import RejectSendModal from "./RejectSendModal";
import CompleteModal from "./ApproveDialog";

import {
  useSmPayAdminOverviewAlarm,
  useSmPayAdminOverviewChargeRule,
  useSmPayAdminDetail,
  useSmPayAdminOverviewPrePaymentSchedule,
  useSmPayAdminOverviewReviewerMemo,
  useSmPayAdminOverviewApprovalMemo,
} from "@/hooks/queries/sm-pay";

import type { ParamsSmPayAdminOverviewOperatorDecision } from "@/types/api/smpay";

type Props = {
  id: string;
};

const SmPayAdminOverviewDetailView = ({ id }: Props) => {
  const agentId = useSearchParams().get("agentId");
  const userId = useSearchParams().get("userId");
  const read = useSearchParams().get("read");

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);

  const { mutate: patchRead, isPending: loadingPatchRead } =
    useSmPayAdminOverviewAlarm();

  const { data: chargeRule, isPending: loadingChargeRule } =
    useSmPayAdminOverviewChargeRule(Number(id));

  const { data: prePaymentScheduleData, isPending: loadingPrePaymentSchedule } =
    useSmPayAdminOverviewPrePaymentSchedule(Number(id));

  const { data: smpayInfo, isPending: loadingSmpayInfo } = useSmPayAdminDetail(
    Number(id),
    Number(agentId),
    Number(userId)
  );

  const { data: reviewerMemo, isPending: loadingReviewerMemo } =
    useSmPayAdminOverviewReviewerMemo(Number(id));

  const { data: approvalMemo, isPending: loadingApprovalMemo } =
    useSmPayAdminOverviewApprovalMemo(Number(id));

  useEffect(() => {
    if (id && read === "unread") {
      patchRead({ advertiserId: Number(id), isOperatorRead: true });
    }
  }, [id, read]);

  const prePaymentSchedule = {
    initialAmount: prePaymentScheduleData?.initialAmount || 0,
    maxChargeLimit: prePaymentScheduleData?.maxChargeLimit || 0,
    minChargeLimit: prePaymentScheduleData?.minChargeLimit || 0,
  };

  const upChargeRule = {
    standardRoasPercent:
      chargeRule?.find((rule) => rule.rangeType === "UP")
        ?.standardRoasPercent || 0,
    rangeType: "UP",
    boundType: "FIXED_AMOUNT",
    changePercentOrValue: 0,
  };
  const downChargeRule = {
    standardRoasPercent:
      chargeRule?.find((rule) => rule.rangeType === "DOWN")
        ?.standardRoasPercent || 0,
    rangeType: "DOWN",
    boundType: "FIXED_AMOUNT",
    changePercentOrValue: 0,
  };

  const approveParams: ParamsSmPayAdminOverviewOperatorDecision = {
    decisionType: "APPROVE",
    chargeRule: [upChargeRule, downChargeRule],
    prePaymentSchedule,
    reviewerMemo: reviewerMemo?.description || "",
    approvalMemo: approvalMemo?.description || "",
    rejectStatusMemo: "",
  };

  const rejectParams: ParamsSmPayAdminOverviewOperatorDecision = {
    decisionType: "REJECT",
    chargeRule: [upChargeRule, downChargeRule],
    prePaymentSchedule,
    reviewerMemo: reviewerMemo?.description || "",
    approvalMemo: approvalMemo?.description || "",
    rejectStatusMemo: "",
  };

  const isLoading =
    loadingPatchRead ||
    loadingChargeRule ||
    loadingSmpayInfo ||
    loadingApprovalMemo ||
    loadingPrePaymentSchedule ||
    loadingReviewerMemo;

  return (
    <div>
      {isLoading && <LoadingUI title="SM Pay 정보 조회 중..." />}
      {rejectModalOpen && (
        <RejectSendModal
          open={rejectModalOpen}
          params={{
            ...rejectParams,
            advertiserId: Number(id),
            agentId: Number(smpayInfo?.agentId),
            userId: Number(smpayInfo?.userId),
          }}
          onClose={() => setRejectModalOpen(false)}
        />
      )}
      {completeModalOpen && (
        <CompleteModal
          open={completeModalOpen}
          params={{
            ...approveParams,
            advertiserId: Number(id),
            agentId: Number(smpayInfo?.agentId),
            userId: Number(smpayInfo?.userId),
          }}
          onClose={() => setCompleteModalOpen(false)}
        />
      )}

      <AdvertiserInfoSection advertiserData={smpayInfo} />

      <RuleSectionShow
        upChargeRule={upChargeRule}
        downChargeRule={downChargeRule}
      />

      <ScheduleSectionShow prePaymentSchedule={prePaymentSchedule} />
      <OperationAccountStatusSection
        advertiserId={Number(id)}
        initialAmount={prePaymentSchedule.initialAmount}
      />

      <JudgementMemoSection
        type="show"
        text={reviewerMemo?.description || ""}
      />
      <OperationMemoSection
        type="show"
        text={approvalMemo?.description || ""}
      />

      <div className="flex justify-center gap-4 py-5">
        <Button
          className="w-[150px]"
          onClick={() => setCompleteModalOpen(true)}
        >
          운영 검토 완료
        </Button>
        <Button
          variant="cancel"
          className="w-[150px]"
          onClick={() => setRejectModalOpen(true)}
        >
          운영 검토 거절
        </Button>
      </div>
    </div>
  );
};

export default SmPayAdminOverviewDetailView;
