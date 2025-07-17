"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// import LoadingUI from "@/components/common/Loading";
import { Button } from "@/components/ui/button";

import { RuleSectionShow } from "../../../components/RuleSection";
import { ScheduleSectionShow } from "../../../components/ScheduleSection";
import JudgementMemoSection from "../../../components/JudgementMemoSection";
import OperationMemoSection from "../../../components/OperationMemoSection";

import RejectModal from "./RejectModal";
import {
  useSmPayAdminDetail,
  useSmPayAdminOverviewApplyFormDetail,
  useSmPayAdminOverviewApprovalMemo,
  useSmPayAdminOverviewChargeRule,
  useSmPayAdminOverviewPrePaymentSchedule,
  useSmPayAdminOverviewReviewerMemo,
} from "@/hooks/queries/sm-pay";

import AdvertiserInfoSection from "../../overview/detail/AdvertiserInfoSection";
import AccountSection from "../../../components/AccountSection";

type Props = {
  id: string;
};

const SmPayAdminAdversiterStatusDetailView = ({ id }: Props) => {
  const router = useRouter();
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  const searchParams = useSearchParams();
  const agentId = searchParams.get("agentId");
  const userId = searchParams.get("userId");
  const formId = searchParams.get("formId");

  const { data: advertiserData } = useSmPayAdminOverviewApplyFormDetail(
    Number(id),
    Number(formId),
    Number(agentId),
    Number(userId)
  );

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

  const isLoading =
    loadingChargeRule ||
    loadingSmpayInfo ||
    loadingApprovalMemo ||
    loadingPrePaymentSchedule ||
    loadingReviewerMemo;

  return (
    <div className="flex flex-col gap-4">
      {/* {isPending && <LoadingUI title="SM Pay 정보 조회 중..." />} */}
      {rejectModalOpen && (
        <RejectModal
          open={rejectModalOpen}
          onClose={() => setRejectModalOpen(false)}
          onConfirm={() => setRejectModalOpen(false)}
        />
      )}

      <AdvertiserInfoSection
        advertiserData={smpayInfo}
        isShowAgentInfo={false}
      />

      <AccountSection accounList={advertiserData?.accounts || []} />

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
        type="show"
        text={approvalMemo?.description || ""}
      />
      <div className="flex justify-center gap-4 py-5">
        <Button
          className="w-[150px]"
          onClick={() => router.push("/sm-pay/admin/adversiter-status")}
        >
          뒤로
        </Button>
        <Button variant="cancel" className="w-[150px]">
          버튼명
        </Button>
      </div>
    </div>
  );
};

export default SmPayAdminAdversiterStatusDetailView;
