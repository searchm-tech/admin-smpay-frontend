"use client";

import { useState } from "react";

import { Modal } from "@/components/composite/modal-components";
import LoadingUI from "@/components/common/Loading";

import AdvertiserInfoSection from "./AdvertiserInfoSection";
import StatIndicatorSection from "./StatIndicatorSection";
import { RuleSectionShow } from "./RuleSection";
import { ScheduleSectionShow } from "./ScheduleSection";
import JudgementMemoSection from "./JudgementMemoSection";
import OperationMemoSection from "./OperationMemoSection";

import { RejectDialog } from "../manangement/dialog";

import { useSmPayFormDetail } from "@/hooks/queries/sm-pay";

type Props = {
  onClose: () => void;
  advertiserId: number;
  formId: number;
};

const HistoryDetailModal = ({ onClose, advertiserId, formId }: Props) => {
  const [isReject, setIsReject] = useState(false);

  const { data: smpayInfo, isPending: loading } = useSmPayFormDetail(
    Number(advertiserId),
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
    <Modal
      open
      onClose={onClose}
      onConfirm={onClose}
      title="SM Pay 지난 이력 상세"
      cancelDisabled
      confirmText="뒤로"
    >
      <div className="w-[85vw] h-[80vh] overflow-y-auto">
        {loading && <LoadingUI title="SM Pay 정보 조회 중..." />}

        {isReject && (
          <RejectDialog
            id={advertiserId.toString()}
            onClose={() => setIsReject(false)}
            onConfirm={() => setIsReject(false)}
          />
        )}

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
        <JudgementMemoSection
          type="show"
          text={smpayInfo?.reviewerMemo || ""}
        />
        <OperationMemoSection
          type="show"
          text={smpayInfo?.approvalMemo || ""}
        />
      </div>
    </Modal>
  );
};

export default HistoryDetailModal;
