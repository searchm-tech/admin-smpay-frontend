"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import LoadingUI from "@/components/common/Loading";

import { ConfirmDialog } from "@/components/composite/modal-components";

import AdvertiserInfoSection from "@/components/views/sm-pay/components/AdvertiserInfoSection";
import RuleSection from "@/components/views/sm-pay/components/RuleSection2";
import JudgementMemoSection from "@/components/views/sm-pay/components/JudgementMemoSection";
import AdvertiserSimulationModal from "@/components/views/sm-pay/components/AdvertiserSimulationModal";
import StatIndicatorSection from "@/components/views/sm-pay/components/StatIndicatorSection";
import ScheduleSection2 from "@/components/views/sm-pay/components/ScheduleSection2";

import {
  WRITE_MODAL_CONTENT,
  type ApplyWriteModalStatus,
} from "@/constants/dialog";

import {
  useSmPayAdvertiserStatIndicator,
  useSmPayWrite,
} from "@/hooks/queries/sm-pay";

import type { ChargeRule, PrePaymentSchedule } from "@/types/smpay";
import type { SmPayWriteParams, StatIndicatorParams } from "@/types/api/smpay";

type ViewWrieProps = {
  id: number;
};

const SMPayMasterApplyWriteForm = ({ id }: ViewWrieProps) => {
  const router = useRouter();
  const { data: statIndicator } = useSmPayAdvertiserStatIndicator(id);

  const [writeModal, setWriteModal] = useState<ApplyWriteModalStatus | null>(
    null
  );

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

  const [prePaymentSchedule, setPrePaymentSchedule] =
    useState<PrePaymentSchedule>({
      initialAmount: 0,
      maxChargeLimit: 0,
      minChargeLimit: 100000,
    });

  const [reviewerMemo, setReviewerMemo] = useState("");

  const [isSimulation, setIsSimulation] = useState(false);

  const { mutate: mutateSendAdAgree, isPending: loadingSend } = useSmPayWrite({
    onSuccess: () => setWriteModal("send-success"),
  });

  const handleScheduleChange = (value: PrePaymentSchedule) => {
    setPrePaymentSchedule(value);
  };

  const handleClose = () => {
    setWriteModal(null);
    router.push("/sm-pay/management");
  };

  const handleSendAdAgree = () => {
    const chargeRules: ChargeRule[] = [
      {
        standardRoasPercent: downChargeRule.standardRoasPercent,
        rangeType: "DOWN",
        boundType: downChargeRule.boundType,
        changePercentOrValue: upChargeRule.changePercentOrValue,
      },
      {
        standardRoasPercent: upChargeRule.standardRoasPercent,
        rangeType: "UP",
        boundType: upChargeRule.boundType,
        changePercentOrValue: upChargeRule.changePercentOrValue,
      },
    ];

    const statIndicatorParams: StatIndicatorParams = {
      operationPeriod: statIndicator?.operationPeriod || 0,
      dailyAverageRoas: statIndicator?.dailyAverageRoas || 0, //1.0;
      monthlyConvAmt: statIndicator?.monthlyConvAmt || 0, //1.0;
      dailySalesAmt: statIndicator?.dailySalesAmt || 0, //1.0;
      recommendRoasPercent: statIndicator?.recommendRoas || 0, // 1.0;
    };

    const params: SmPayWriteParams = {
      statIndicator: statIndicatorParams,
      chargeRule: chargeRules,
      prePaymentSchedule,
      reviewerMemo,
    };
    mutateSendAdAgree({ advertiserId: id, params });
  };

  const handleMemo = (value: string) => setReviewerMemo(value);

  return (
    <section className="mt-4">
      {loadingSend && <LoadingUI title="... 동의 요청 중" />}

      {writeModal && (
        <ConfirmDialog
          open
          onClose={handleClose}
          onConfirm={handleClose}
          content={WRITE_MODAL_CONTENT[writeModal]}
          cancelDisabled={writeModal === "send-success"}
        />
      )}

      {isSimulation && (
        <AdvertiserSimulationModal
          open={isSimulation}
          onClose={() => setIsSimulation(false)}
        />
      )}

      <AdvertiserInfoSection advertiserId={id} />

      <StatIndicatorSection advertiserId={id} statIndicator={statIndicator} />

      <RuleSection
        type="write"
        upChargeRule={upChargeRule}
        downChargeRule={downChargeRule}
        handleUpChargeRuleChange={setUpChargeRule}
        handleDownChargeRuleChange={setDownChargeRule}
      />

      <ScheduleSection2
        type="write"
        prePaymentSchedule={prePaymentSchedule}
        handleScheduleChange={handleScheduleChange}
      />

      <JudgementMemoSection
        type="write"
        handleText={handleMemo}
        text={reviewerMemo}
      />

      <div className="flex justify-center gap-4 py-5">
        <Button
          className="minw-[150px]"
          variant="orangeOutline"
          onClick={() => setIsSimulation(true)}
        >
          광고 성과 예측 시뮬레이션
        </Button>

        <Button className="w-[150px]" onClick={handleSendAdAgree}>
          광고주 동의 요청 발송
        </Button>
        <Button variant="cancel" className="w-[150px]" onClick={() => {}}>
          취소
        </Button>
      </div>
    </section>
  );
};

export default SMPayMasterApplyWriteForm;
