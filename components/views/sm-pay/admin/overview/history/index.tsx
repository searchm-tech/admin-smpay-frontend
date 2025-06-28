"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import LoadingUI from "@/components/common/Loading";

import OperationMemoSection from "@/components/views/sm-pay/components/OperationMemoSection";
import JudgementMemoSection from "@/components/views/sm-pay/components/JudgementMemoSection";
import GuidSection from "@/components/views/sm-pay/components/GuideSection";
import StatIndicatorSection from "@/components/views/sm-pay/components/StatIndicatorSection";
import ScheduleSection2 from "@/components/views/sm-pay/components/ScheduleSection2";
import RuleSection2 from "@/components/views/sm-pay/components/RuleSection2";
import AdvertiserInfoSection from "@/components/views/sm-pay/components/AdvertiserInfoSection";

import { RejectDialog } from "../../../manangement/dialog";

import { useSmPayAdminOverviewApplyFormDetail } from "@/hooks/queries/sm-pay";

import type { ChargeRule } from "@/types/smpay";

interface Props {
  id: string;
}

const SmPayAdminOverviewHistoryDetailView = ({ id }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formId = searchParams.get("formId");

  const [isReject, setIsReject] = useState(false);

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

  const { data: smpayInfo, isPending: loading } =
    useSmPayAdminOverviewApplyFormDetail(Number(id), Number(formId));

  useEffect(() => {
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
  }, [smpayInfo]);

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
      <GuidSection
        viewType={
          smpayInfo?.advertiserStatus === "OPERATION_REJECT"
            ? "reject"
            : "smpay-guide"
        }
      />
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

      <RuleSection2
        type="show"
        upChargeRule={upChargeRule}
        downChargeRule={downChargeRule}
      />
      <ScheduleSection2 type="show" prePaymentSchedule={prePaymentSchedule} />
      <JudgementMemoSection type="show" text={smpayInfo?.reviewerMemo || ""} />
      <OperationMemoSection type="show" text={smpayInfo?.approvalMemo || ""} />

      <div className="flex justify-center gap-4 py-5">
        <Button
          variant="cancel"
          className="w-[150px]"
          onClick={() => {
            const url = `/sm-pay/management/apply-detail/${id}`;
            router.push(url);
          }}
        >
          뒤로
        </Button>
      </div>
    </div>
  );
};

export default SmPayAdminOverviewHistoryDetailView;
