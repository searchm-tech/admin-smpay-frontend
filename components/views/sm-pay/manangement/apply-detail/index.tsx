"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import LoadingUI from "@/components/common/Loading";

import RuleSection from "@/components/views/sm-pay/components/RuleSection";
import OperationMemoSection from "@/components/views/sm-pay/components/OperationMemoSection";
import JudgementMemoSection from "@/components/views/sm-pay/components/JudgementMemoSection";
import AdvertiseStatusSection from "@/components/views/sm-pay/components/AdvertiseStatusSection";
import ScheduleSection from "@/components/views/sm-pay/components/ScheduleSection";
import AdvertiserSection from "@/components/views/sm-pay/components/AdvertiserSection";
import AccountSection from "@/components/views/sm-pay/components/AccountSection";
import IndicatorsJudementSection from "@/components/views/sm-pay/components/IndicatorsJudementSection";
import GuidSection from "@/components/views/sm-pay/components/GuideSection";

import { RejectDialog } from "../../manangement/dialog";

import { SmPayAdvertiserStatusLabel, STATUS_LABELS } from "@/constants/status";

import {
  useSmPayAdvertiserDetail,
  useSmPayDetail,
  useSmPaySubmitDetail,
} from "@/hooks/queries/sm-pay";

import type { AdvertiserData } from "@/types/adveriser";
import { ChargeRule } from "@/types/smpay";
import { RuleInfo, ScheduleInfo } from "@/types/sm-pay";

interface SmPayApplyDetailViewProps {
  id: string;
}

const SmPayApplyDetailView = ({ id }: SmPayApplyDetailViewProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formId = searchParams.get("formId");
  console.log("formId", formId);

  const [isReject, setIsReject] = useState(false);
  const [ruleInfo, setRuleInfo] = useState<RuleInfo | null>(null);
  const [scheduleInfo, setScheduleInfo] = useState<ScheduleInfo | null>(null);
  const [judgementMemo, setJudmentMemo] = useState("");
  const [operationMemo, setOperationMemo] = useState("");

  const { data: response, isPending } = useSmPaySubmitDetail(id);

  const { data: smpayInfo, isPending: loading } = useSmPayDetail(
    Number(id),
    Number(formId)
  );
  const { data: advertiserDetail, isPending: isLoadingAdvertiserDetail } =
    useSmPayAdvertiserDetail(Number(id));

  console.log("advertiserDetail", advertiserDetail);

  useEffect(() => {
    if (smpayInfo) {
      const { advertiserFormId, advertiserStandardRoasPercent, chargeRules } =
        smpayInfo;

      if (chargeRules) {
        const newRuleInfo: RuleInfo = {
          id: advertiserFormId,
          roas: advertiserStandardRoasPercent,
          increase: 0,
          increaseType: "",
          decrease: 0,
          decreaseType: "",
        };

        chargeRules.forEach((rule: ChargeRule) => {
          const type = rule.boundType === "FIXED_AMOUNT" ? "flat" : "rate";
          if (rule.rangeType === "UP") {
            newRuleInfo.increase = rule.changePercentOrValue;
            newRuleInfo.increaseType = type;
          } else if (rule.rangeType === "DOWN") {
            newRuleInfo.decrease = rule.changePercentOrValue;
            newRuleInfo.decreaseType = type;
          }
        });
        const scheduleData: ScheduleInfo = {
          id: smpayInfo?.advertiserFormId || 0,
          firstCharge: smpayInfo?.initialAmount || 0,
          maxCharge: smpayInfo?.maxChargeLimit,
        };

        setRuleInfo(newRuleInfo);
        setScheduleInfo(scheduleData);
        setJudmentMemo(smpayInfo?.reviewerMemo || "");
        setOperationMemo(smpayInfo?.approvalMemo || "");
      }
    }
  }, [smpayInfo]);

  return (
    <div>
      {loading && <LoadingUI title="SM Pay 정보 조회 중..." />}
      {isLoadingAdvertiserDetail && (
        <LoadingUI title="광고주 정보 조회 중..." />
      )}
      {isReject && (
        <RejectDialog
          id={id}
          onClose={() => setIsReject(false)}
          onConfirm={() => setIsReject(false)}
        />
      )}
      <GuidSection viewType="reject" onClick={() => setIsReject(true)} />
      <AdvertiseStatusSection
        isHistory
        
        status={response.data ? STATUS_LABELS[response.data.status] : ""}
      />
      <AdvertiseStatusSection
        status={
          advertiserDetail?.status
            ? SmPayAdvertiserStatusLabel[advertiserDetail?.status]
            : ""
        }
      />
      <AdvertiserSection advertiserDetail={advertiserDetail || null} />

      <IndicatorsJudementSection advertiserId={Number(id)} />

      <RuleSection id={"1"} type="show" ruleInfo={ruleInfo} />

      <ScheduleSection type="show" scheduleInfo={scheduleInfo} />

      <JudgementMemoSection type="show" text={judgementMemo} />

      <OperationMemoSection type="show" text={operationMemo} />

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
