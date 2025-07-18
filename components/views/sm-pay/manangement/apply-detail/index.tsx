"use client";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import LoadingUI from "@/components/common/Loading";

import OperationMemoSection from "@/components/views/sm-pay/components/OperationMemoSection";
import JudgementMemoSection from "@/components/views/sm-pay/components/JudgementMemoSection";
import StatIndicatorSection from "@/components/views/sm-pay/components/StatIndicatorSection";
import { ScheduleSectionShow } from "@/components/views/sm-pay/components/ScheduleSection";
import { RuleSectionShow } from "@/components/views/sm-pay/components/RuleSection";
import AdvertiserInfoSection from "@/components/views/sm-pay/components/AdvertiserInfoSection";

import { useSmPayFormDetail } from "@/hooks/queries/sm-pay";

interface Props {
  id: string;
}

const SmPayApplyDetailView = ({ id }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formId = searchParams.get("formId");

  const { data: formInfo, isPending: loading } = useSmPayFormDetail(
    Number(id),
    Number(formId)
  );

  const prePaymentSchedule = {
    initialAmount: formInfo?.initialAmount || 0,
    maxChargeLimit: formInfo?.maxChargeLimit || 0,
    minChargeLimit: formInfo?.minChargeLimit || 0,
  };

  const statIndicator = {
    operationPeriod: formInfo?.advertiserOperationPeriod || 0,
    dailyAverageRoas: formInfo?.advertiserDailyAverageRoas || 0,
    monthlyConvAmt: formInfo?.advertiserMonthlyConvAmt || 0,
    dailySalesAmt: formInfo?.advertiserDailySalesAmt || 0,
    recommendRoas: formInfo?.advertiserRecommendRoasPercent || 0,
  };

  console.log("formInfo", formInfo);

  const upChargeRule = formInfo?.chargeRules.find(
    (rule) => rule.rangeType === "UP"
  ) || {
    standardRoasPercent: 0,
    rangeType: "UP",
    boundType:
      formInfo?.chargeRules.find((rule) => rule.rangeType === "UP")
        ?.boundType || "FIXED_AMOUNT",
    changePercentOrValue:
      formInfo?.chargeRules.find((rule) => rule.rangeType === "UP")
        ?.changePercentOrValue || 0,
  };
  const downChargeRule = formInfo?.chargeRules.find(
    (rule) => rule.rangeType === "DOWN"
  ) || {
    standardRoasPercent: 0,
    rangeType: "DOWN",
    boundType:
      formInfo?.chargeRules.find((rule) => rule.rangeType === "DOWN")
        ?.boundType || "FIXED_AMOUNT",
    changePercentOrValue:
      formInfo?.chargeRules.find((rule) => rule.rangeType === "DOWN")
        ?.changePercentOrValue || 0,
  };

  return (
    <div>
      {loading && <LoadingUI title="SM Pay 정보 조회 중..." />}

      <AdvertiserInfoSection
        advertiserId={Number(id)}
        description={formInfo?.advertiserRejectDescription || ""}
        date={formInfo?.registerDt || ""}
      />

      <StatIndicatorSection
        advertiserId={Number(id)}
        statIndicator={statIndicator}
      />

      <RuleSectionShow
        upChargeRule={upChargeRule}
        downChargeRule={downChargeRule}
      />
      <ScheduleSectionShow prePaymentSchedule={prePaymentSchedule} />
      <JudgementMemoSection type="show" text={formInfo?.reviewerMemo || ""} />

      <OperationMemoSection type="show" text={formInfo?.approvalMemo || ""} />

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
