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
import AdvertiserInfoSection from "@/components/views/sm-pay/admin/overview/detail/AdvertiserInfoSection";
import { RejectDialog } from "@/components/views/sm-pay/manangement/dialog";

import { useSmPayAdminOverviewApplyFormDetail } from "@/hooks/queries/sm-pay";

import type { AdvertiserDetailDto } from "@/types/api/smpay";

interface Props {
  id: string;
}

const SmPayAdminOverviewHistoryDetailView = ({ id }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formId = searchParams.get("formId");
  const agentId = searchParams.get("agentId");
  const userId = searchParams.get("userId");

  const [isReject, setIsReject] = useState(false);

  const { data: smpayInfo, isPending: loading } =
    useSmPayAdminOverviewApplyFormDetail(
      Number(id),
      Number(formId),
      Number(agentId),
      Number(userId)
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

  const advertiserData: AdvertiserDetailDto = {
    advertiserId: smpayInfo?.advertiserId || 0,
    userId: Number(userId),
    customerId: smpayInfo?.advertiserCustomerId || 0,
    agentId: Number(agentId),
    id: smpayInfo?.advertiserId.toString() || "",
    nickName: smpayInfo?.advertiserNickname || "",
    name: smpayInfo?.advertiserName || "",
    representativeName: smpayInfo?.advertiserRepresentativeName || "",
    businessRegistrationNumber: "",
    phoneNumber: smpayInfo?.advertiserPhoneNumber || "",
    emailAddress: smpayInfo?.advertiserEmailAddress || "",
    status: smpayInfo?.advertiserStatus || "UNSYNC_ADVERTISER",
    roleId: 0,
    isLossPrivileges: false,
    advertiserFormId: smpayInfo?.advertiserFormId || 0,
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

      <AdvertiserInfoSection advertiserData={advertiserData} />

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
            const url = `/sm-pay/admin/overview/history/${id}`;
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
