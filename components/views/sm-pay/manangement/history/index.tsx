"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import LoadingUI from "@/components/common/Loading";

import OperationMemoSection from "@/components/views/sm-pay/components/OperationMemoSection";
import JudgementMemoSection from "@/components/views/sm-pay/components/JudgementMemoSection";
import GuidSection from "@/components/views/sm-pay/components/GuideSection";
import StatIndicatorSection from "@/components/views/sm-pay/components/StatIndicatorSection";
import { ScheduleSectionShow } from "@/components/views/sm-pay/components/ScheduleSection";
import { RuleSectionShow } from "@/components/views/sm-pay/components/RuleSection";
import AdvertiserInfoSection from "@/components/views/sm-pay/components/AdvertiserInfoSection";

import { RejectDialog } from "../../manangement/dialog";

import { useSmPayFormDetail } from "@/hooks/queries/sm-pay";

interface Props {
  id: string;
}

const SmPayApplyHistoryDetailView = ({ id }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formId = searchParams.get("formId");
  // const orignFormId = searchParams.get("orignFormId"); TODO : 보류

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
          onClick={() => {
            router.back();
          }}
        >
          뒤로
        </Button>
      </div>
    </div>
  );
};

export default SmPayApplyHistoryDetailView;
