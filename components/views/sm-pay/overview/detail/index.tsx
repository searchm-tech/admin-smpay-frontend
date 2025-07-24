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
import AdvertiserInfoSection from "../../components/AdvertiserInfoSection";

import RejectSendModal from "./RejectSendModal";
import CompleteModal from "./ApproveDialog";

import {
  useSmPayAdminOverviewAlarm,
  useSmPayAdminDetail,
  useSmPayAdminOverviewPrePaymentSchedule,
  useSmPayAdminOverviewReviewerMemo,
  useSmPayAdminOverviewApprovalMemo,
  useSmPayAdminOverviewApplyFormDetail,
} from "@/hooks/queries/sm-pay";

import type { ParamsSmPayAdminOverviewOperatorDecision } from "@/types/api/smpay";
import type { ChargeRule } from "@/types/smpay";

type Props = {
  id: string;
};

const SmPayAdminOverviewDetailView = ({ id }: Props) => {
  const agentId = useSearchParams().get("agentId");
  const userId = useSearchParams().get("userId");
  const formId = useSearchParams().get("formId");
  const read = useSearchParams().get("read");

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
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

  const { mutate: patchRead, isPending: loadingPatchRead } =
    useSmPayAdminOverviewAlarm();

  const { data: prePaymentScheduleData, isPending: loadingPrePaymentSchedule } =
    useSmPayAdminOverviewPrePaymentSchedule(Number(id));

  const { data: formInfo } = useSmPayAdminOverviewApplyFormDetail(
    Number(id),
    Number(formId),
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
    loadingApprovalMemo ||
    loadingPrePaymentSchedule ||
    loadingReviewerMemo;

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

  return (
    <div>
      {isLoading && <LoadingUI />}
      {rejectModalOpen && (
        <RejectSendModal
          open={rejectModalOpen}
          params={{
            ...rejectParams,
            advertiserId: Number(id),
            agentId: Number(agentId),
            userId: Number(userId),
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
            agentId: Number(agentId),
            userId: Number(userId),
          }}
          onClose={() => setCompleteModalOpen(false)}
        />
      )}

      <AdvertiserInfoSection
        advertiserData={formInfo}
        agentId={Number(agentId)}
        userId={Number(userId)}
      />

      <RuleSectionShow
        upChargeRule={upChargeRule}
        downChargeRule={downChargeRule}
      />

      <ScheduleSectionShow prePaymentSchedule={prePaymentSchedule} />
      <OperationAccountStatusSection
        advertiserId={Number(id)}
        initialAmount={prePaymentSchedule.initialAmount}
      />

      <JudgementMemoSection text={reviewerMemo?.description || ""} />
      <OperationMemoSection text={approvalMemo?.description || ""} />

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
