"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import LoadingUI from "@/components/common/Loading";

import OperationMemoSection from "@/components/views/sm-pay/components/OperationMemoSection";
import JudgementMemoSection from "@/components/views/sm-pay/components/JudgementMemoSection";
import StatIndicatorSection from "@/components/views/sm-pay/components/StatIndicatorSection";
import ScheduleSection from "@/components/views/sm-pay/components/ScheduleSection";
import RuleSection from "@/components/views/sm-pay/components/RuleSection";
import AdvertiserInfoSection from "@/components/views/sm-pay/components/AdvertiserInfoSection";

import { RejectDialog } from "@/components/views/sm-pay/manangement/dialog";

import { useSmPayDetail } from "@/hooks/queries/sm-pay";

interface Props {
  id: string;
}

const SmPayApplyDetailView = ({ id }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formId = searchParams.get("formId");

  const [isReject, setIsReject] = useState(false);

  const { data: smpayInfo, isPending: loading } = useSmPayDetail(
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

  const upChargeRule = {
    standardRoasPercent: smpayInfo?.advertiserStandardRoasPercent || 0,
    rangeType: "UP",
    boundType: "FIXED_AMOUNT",
    changePercentOrValue: 0,
  };
  const downChargeRule = {
    standardRoasPercent: smpayInfo?.advertiserStandardRoasPercent || 0,
    rangeType: "DOWN",
    boundType: "FIXED_AMOUNT",
    changePercentOrValue: 0,
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

      <RuleSection
        type="show"
        upChargeRule={upChargeRule}
        downChargeRule={downChargeRule}
      />
      <ScheduleSection type="show" prePaymentSchedule={prePaymentSchedule} />
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
