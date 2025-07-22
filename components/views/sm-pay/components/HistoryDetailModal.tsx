"use client";

import { useEffect, useState } from "react";

import { Modal } from "@/components/composite/modal-components";
import LoadingUI from "@/components/common/Loading";

import AdvertiserInfoSection from "./AdvertiserInfoSection";
import StatIndicatorSection from "./StatIndicatorSection";
import { RuleSectionShow } from "./RuleSection";
import { ScheduleSectionShow } from "./ScheduleSection";
import JudgementMemoSection from "./JudgementMemoSection";
import OperationMemoSection from "./OperationMemoSection";

import { RejectDialog } from "../dialog";

import { useSmPayFormDetail } from "@/hooks/queries/sm-pay";
import { ChargeRule } from "@/types/smpay";

type Props = {
  onClose: () => void;
  advertiserId: number;
  formId: number;
};

const HistoryDetailModal = ({ onClose, advertiserId, formId }: Props) => {
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

  const { data: formInfo, isPending: loading } = useSmPayFormDetail(
    Number(advertiserId),
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
    <Modal
      open
      onClose={onClose}
      onConfirm={onClose}
      title="SM Pay 지난 이력 상세"
      cancelDisabled
      confirmText="뒤로"
    >
      <div className="w-[85vw] h-[80vh] overflow-y-auto">
        {loading && <LoadingUI />}

        {/* {isReject && (
          <RejectDialog
            description={formInfo?. || ""}
            date={formInfo?.description.registerOrUpdateDt || ""}
          />
        )} */}

        <AdvertiserInfoSection
          advertiserId={advertiserId}
          isShowHistory={false}
        />

        <StatIndicatorSection
          advertiserId={advertiserId}
          statIndicator={statIndicator}
        />

        <RuleSectionShow
          upChargeRule={upChargeRule}
          downChargeRule={downChargeRule}
        />
        <ScheduleSectionShow prePaymentSchedule={prePaymentSchedule} />
        <JudgementMemoSection type="show" text={formInfo?.reviewerMemo || ""} />
        <OperationMemoSection type="show" text={formInfo?.approvalMemo || ""} />
      </div>
    </Modal>
  );
};

export default HistoryDetailModal;
