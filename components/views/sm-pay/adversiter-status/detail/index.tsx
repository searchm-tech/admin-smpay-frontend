"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import LoadingUI from "@/components/common/Loading";
import { Button } from "@/components/ui/button";

import { ScheduleSectionShow } from "@/components/views/sm-pay/components/ScheduleSection";
import { RuleSectionShow } from "@/components/views/sm-pay/components/RuleSection";
import JudgementMemoSection from "@/components/views/sm-pay/components/JudgementMemoSection";
import OperationMemoSection from "@/components/views/sm-pay/components/OperationMemoSection";
import AdvertiserInfoSection from "@/components/views/sm-pay/components/AdvertiserInfoSection";
import AccountSection from "@/components/views/sm-pay/components/AccountSection";

import {
  useSmPayAdminOverviewApplyFormDetail,
  useSmPayAdminOverviewApprovalMemo,
  useSmPayAdminOverviewPrePaymentSchedule,
  useSmPayAdminOverviewReviewerMemo,
} from "@/hooks/queries/sm-pay";

import type { ChargeRuleDto } from "@/types/dto/smpay";

type Props = {
  id: string;
};

const SmPayAdminAdversiterStatusDetailView = ({ id }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const agentId = searchParams.get("agentId");
  const userId = searchParams.get("userId");
  const formId = searchParams.get("formId");

  const [upChargeRule, setUpChargeRule] = useState<ChargeRuleDto>({
    standardRoasPercent: 0,
    rangeType: "UP",
    boundType: "FIXED_AMOUNT",
    changePercentOrValue: 0,
  });
  const [downChargeRule, setDownChargeRule] = useState<ChargeRuleDto>({
    standardRoasPercent: 0,
    rangeType: "DOWN",
    boundType: "FIXED_AMOUNT",
    changePercentOrValue: 0,
  });

  const { data: formInfo } = useSmPayAdminOverviewApplyFormDetail(
    Number(id),
    Number(formId),
    Number(agentId),
    Number(userId)
  );

  const { data: prePaymentScheduleData, isPending: loadingPrePaymentSchedule } =
    useSmPayAdminOverviewPrePaymentSchedule(Number(id));

  const { data: reviewerMemo, isPending: loadingReviewerMemo } =
    useSmPayAdminOverviewReviewerMemo(Number(id));

  const { data: approvalMemo, isPending: loadingApprovalMemo } =
    useSmPayAdminOverviewApprovalMemo(Number(id));

  const prePaymentSchedule = {
    initialAmount: prePaymentScheduleData?.initialAmount || 0,
    maxChargeLimit: prePaymentScheduleData?.maxChargeLimit || 0,
    minChargeLimit: prePaymentScheduleData?.minChargeLimit || 0,
  };

  const isLoading =
    loadingApprovalMemo || loadingPrePaymentSchedule || loadingReviewerMemo;

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
    <div className="flex flex-col gap-4">
      {isLoading && <LoadingUI />}

      <AdvertiserInfoSection
        advertiserData={formInfo}
        agentId={Number(agentId)}
        userId={Number(userId)}
      />

      <AccountSection accounList={formInfo?.accounts || []} />

      <RuleSectionShow
        upChargeRule={upChargeRule}
        downChargeRule={downChargeRule}
      />
      <ScheduleSectionShow prePaymentSchedule={prePaymentSchedule} />
      <JudgementMemoSection text={reviewerMemo?.description || ""} />
      <OperationMemoSection text={approvalMemo?.description || ""} />
      <div className="flex justify-center gap-4 py-5">
        <Button
          className="w-[150px]"
          onClick={() => router.push("/sm-pay/adversiter-status")}
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
