"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import LoadingUI from "@/components/common/Loading";

import OperationMemoSection from "@/components/views/sm-pay/components/OperationMemoSection";
import JudgementMemoSection from "@/components/views/sm-pay/components/JudgementMemoSection";
import StatIndicatorSection from "@/components/views/sm-pay/components/StatIndicatorSection";
import { ScheduleSectionShow } from "@/components/views/sm-pay/components/ScheduleSection";
import { RuleSectionShow } from "@/components/views/sm-pay/components/RuleSection";
import AdvertiserInfoSection from "@/components/views/sm-pay/components/AdvertiserInfoSection";

import { RejectDialog } from "@/components/views/sm-pay/manangement/dialog";

import { useSmPayFormDetail } from "@/hooks/queries/sm-pay";

interface Props {
  id: string;
}

const SmPayApplyDetailView = ({ id }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formId = searchParams.get("formId");

  const [isReject, setIsReject] = useState(false);

  const { data: smpayInfo, isPending: loading } = useSmPayFormDetail(
    Number(id),
    Number(formId)
  );

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

  const upChargeRule = smpayInfo?.chargeRules.find(
    (rule) => rule.rangeType === "UP"
  ) || {
    standardRoasPercent: 0,
    rangeType: "UP",
    boundType:
      smpayInfo?.chargeRules.find((rule) => rule.rangeType === "UP")
        ?.boundType || "FIXED_AMOUNT",
    changePercentOrValue:
      smpayInfo?.chargeRules.find((rule) => rule.rangeType === "UP")
        ?.changePercentOrValue || 0,
  };
  const downChargeRule = smpayInfo?.chargeRules.find(
    (rule) => rule.rangeType === "DOWN"
  ) || {
    standardRoasPercent: 0,
    rangeType: "DOWN",
    boundType:
      smpayInfo?.chargeRules.find((rule) => rule.rangeType === "DOWN")
        ?.boundType || "FIXED_AMOUNT",
    changePercentOrValue:
      smpayInfo?.chargeRules.find((rule) => rule.rangeType === "DOWN")
        ?.changePercentOrValue || 0,
  };

  return (
    <div>
      {loading && <LoadingUI title="SM Pay 정보 조회 중..." />}

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
      <JudgementMemoSection type="show" text={smpayInfo?.reviewerMemo || ""} />

      <OperationMemoSection type="show" text={smpayInfo?.approvalMemo || ""} />

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
