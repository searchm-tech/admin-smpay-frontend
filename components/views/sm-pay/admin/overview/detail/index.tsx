"use client";

import { useState } from "react";

import LoadingUI from "@/components/common/Loading";
import { Button } from "@/components/ui/button";

import RuleSection from "@/components/views/sm-pay/components/RuleSection";
import OperationMemoSection from "@/components/views/sm-pay/components/OperationMemoSection";
import JudgementMemoSection from "@/components/views/sm-pay/components/JudgementMemoSection";
import ScheduleSection from "@/components/views/sm-pay/components/ScheduleSection";
import AdvertiserSection from "@/components/views/sm-pay/components/AdvertiserSection";
import AdvertiseStatusSection from "@/components/views/sm-pay/components/AdvertiseStatusSection";
import AgencyInfoSection from "@/components/views/sm-pay/components/AgencyInfoSection";
import OperationAccountStatusSection from "@/components/views/sm-pay/components/OperationAccountStatusSection";

import RejectSendModal from "./RejectSendModal";
import CompleteModal from "./CompleteModal";

import { STATUS_LABELS } from "@/constants/status";

import type { AdvertiserData } from "@/types/adveriser";

type Props = {
  id: string;
};

const SmPayAdminOverviewDetailView = ({ id }: Props) => {
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);

  const advertiserData: AdvertiserData | null = null;
  return (
    <div>
      {/* {isPending && <LoadingUI title="SM Pay 정보 조회 중..." />} */}
      {rejectModalOpen && (
        <RejectSendModal
          open={rejectModalOpen}
          onClose={() => setRejectModalOpen(false)}
          onConfirm={() => setRejectModalOpen(false)}
        />
      )}
      {completeModalOpen && (
        <CompleteModal
          open={completeModalOpen}
          onClose={() => setCompleteModalOpen(false)}
          onConfirm={() => setCompleteModalOpen(false)}
        />
      )}

      <AdvertiseStatusSection
        isHistory
        status="AVAILABLE"
        // status={response.data ? STATUS_LABELS[response.data.status] : ""}
      />

      <div className="flex justify-center gap-1 w-full">
        <AgencyInfoSection />
        <AdvertiserSection advertiserDetail={null} />
      </div>

      <RuleSection type="show" />
      <ScheduleSection type="show" />
      <OperationAccountStatusSection />

      <JudgementMemoSection type="show" />
      <OperationMemoSection type="show" />

      <div className="flex justify-center gap-4 py-5">
        <Button
          className="w-[150px]"
          onClick={() => setCompleteModalOpen(true)}
        >
          운영 검토 완료
        </Button>
        <Button
          variant="cancel"
          className="w-[150px]"
          onClick={() => setRejectModalOpen(true)}
        >
          운영 검토 거절
        </Button>
      </div>
    </div>
  );
};

export default SmPayAdminOverviewDetailView;
