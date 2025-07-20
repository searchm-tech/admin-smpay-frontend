"use client";
import { useEffect, useState } from "react";
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

import type { ChargeRule } from "@/types/smpay";

interface Props {
  id: string;
}

const SmPayApplyDetailView = ({ id }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formId = searchParams.get("formId");

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
