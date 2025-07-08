"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import LoadingUI from "@/components/common/Loading";

import OperationMemoSection from "@/components/views/sm-pay/components/OperationMemoSection";
import JudgementMemoSection from "@/components/views/sm-pay/components/JudgementMemoSection";
import StatIndicatorSection from "@/components/views/sm-pay/components/StatIndicatorSection";
import { ScheduleSectionShow } from "@/components/views/sm-pay/components/ScheduleSection";
import { RuleSectionShow } from "@/components/views/sm-pay/components/RuleSection";
import AdvertiserInfoSection from "@/components/views/sm-pay/components/AdvertiserInfoSection";

import { RejectDialog } from "@/components/views/sm-pay/manangement/dialog";

import {
  useSmPayAdvertiserChargeRule,
  useSmPayAdvertiserPrePaymentSchedule,
  useReviewerMemoDto,
  useSmPayScreeningIndicator,
  useSmPayDetailApprovalMemo,
} from "@/hooks/queries/sm-pay";

interface Props {
  id: string;
}

const SmPayApplyDetailView = ({ id }: Props) => {
  const router = useRouter();

  const [isReject, setIsReject] = useState(false);

  const { data: chargeRule, isPending: loadingChargeRule } =
    useSmPayAdvertiserChargeRule(Number(id));

  const { data: screeningIndicator, isPending: loadingScreeningIndicator } =
    useSmPayScreeningIndicator(Number(id));

  const { data: prePaymentScheduleData, isPending: loadingPrePaymentSchedule } =
    useSmPayAdvertiserPrePaymentSchedule(Number(id));

  const { data: reviewerMemo, isPending: loadingReviewerMemo } =
    useReviewerMemoDto(Number(id));

  const { data: approvalMemo, isPending: loadingApprovalMemo } =
    useSmPayDetailApprovalMemo(Number(id));

  const prePaymentSchedule = {
    initialAmount: prePaymentScheduleData?.initialAmount || 0,
    maxChargeLimit: prePaymentScheduleData?.maxChargeLimit || 0,
    minChargeLimit: prePaymentScheduleData?.minChargeLimit || 0,
  };

  const statIndicator = {
    operationPeriod: screeningIndicator?.advertiserOperationPeriod || 0,
    dailyAverageRoas: screeningIndicator?.advertiserDailyAverageRoas || 0,
    monthlyConvAmt: screeningIndicator?.advertiserMonthlyConvAmt || 0,
    dailySalesAmt: screeningIndicator?.advertiserDailySalesAmt || 0,
    recommendRoas: screeningIndicator?.advertiserRecommendRoasPercent || 0,
  };

  const upChargeRule = {
    standardRoasPercent:
      chargeRule?.find((rule) => rule.rangeType === "UP")
        ?.standardRoasPercent || 0,
    rangeType: "UP",
    boundType: "FIXED_AMOUNT",
    changePercentOrValue:
      chargeRule?.find((rule) => rule.rangeType === "UP")
        ?.changePercentOrValue || 0,
  };
  const downChargeRule = {
    standardRoasPercent:
      chargeRule?.find((rule) => rule.rangeType === "DOWN")
        ?.standardRoasPercent || 0,
    rangeType: "DOWN",
    boundType: "FIXED_AMOUNT",
    changePercentOrValue:
      chargeRule?.find((rule) => rule.rangeType === "DOWN")
        ?.changePercentOrValue || 0,
  };

  return (
    <div>
      {(loadingChargeRule ||
        loadingScreeningIndicator ||
        loadingPrePaymentSchedule ||
        loadingReviewerMemo ||
        loadingApprovalMemo) && <LoadingUI title="SM Pay 정보 조회 중..." />}

      {isReject && (
        <RejectDialog
          id={id}
          onClose={() => setIsReject(false)}
          onConfirm={() => setIsReject(false)}
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
        type="show"
        text={approvalMemo?.description || ""}
      />

      <div className="flex justify-center gap-4 py-5">
        <Button
          variant="cancel"
          className="w-[150px]"
          onClick={() => router.push("/sm-pay/management")}
        >
          뒤로
        </Button>
      </div>
    </div>
  );
};

export default SmPayApplyDetailView;
