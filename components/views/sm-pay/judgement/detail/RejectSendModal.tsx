import { useState } from "react";

import { Textarea } from "@/components/ui/textarea";
import { ConfirmDialog, Modal } from "@/components/composite/modal-components";
import {
  Descriptions,
  DescriptionItem,
} from "@/components/composite/description-components";
import LoadingUI from "@/components/common/Loading";

import { useSmPayApproval } from "@/hooks/queries/sm-pay";

import type { ParamsSmPayApproval } from "@/types/api/smpay";
import type { JudgementModalProps } from ".";

type RejectSendModalProps = {
  onClose: () => void;
  onConfirm: () => void;
  advertiserId: number;
  params: JudgementModalProps;
};

const RejectSendModal = ({
  onClose,
  onConfirm,
  advertiserId,
  params,
}: RejectSendModalProps) => {
  const [rejectReason, setRejectReason] = useState("");
  const [isConfirm, setIsConfirm] = useState(false);
  const [isError, setIsError] = useState(false);

  const { mutate: postSmPayApproval, isPending: isRejecting } =
    useSmPayApproval({
      onSuccess: () => setIsConfirm(true),
    });

  const handleConfirm = () => {
    if (!rejectReason) {
      setIsError(true);
      return;
    }

    const defaultParams: ParamsSmPayApproval = {
      statIndicator: params.statIndicator,
      chargeRule: params.chargeRule,
      prePaymentSchedule: params.prePaymentSchedule,
      reviewerMemo: params.reviewerMemo,
      approvalMemo: params.approvalMemo,
      rejectStatusMemo: rejectReason,
      decisionType: "REJECT",
    };

    postSmPayApproval({
      advertiserId: advertiserId,
      params: {
        ...defaultParams,
        rejectStatusMemo: rejectReason,
        decisionType: "REJECT",
      },
    });
  };

  if (isRejecting) {
    return <LoadingUI title="광고주 심사 반려중" />;
  }

  if (isError) {
    return (
      <ConfirmDialog
        open
        onConfirm={() => setIsError(false)}
        title="광고주 심사 반려"
        content="반려 사유를 입력해주세요."
        confirmText="확인"
      />
    );
  }

  if (isConfirm) {
    return (
      <Modal
        open
        onClose={onClose}
        onConfirm={onConfirm}
        title="광고주 심사 취소"
      >
        <div>광고주의 SM Pay 신청이 반려되었습니다.</div>
      </Modal>
    );
  }

  return (
    <Modal
      open
      title="광고주 심사 반려"
      onClose={onClose}
      onConfirm={handleConfirm}
      confirmText="반려 처리"
    >
      <div className="w-[800px]">
        <div className="mb-4">
          <p className="pb-4">광고주의 SM Pay 신청이 반려되었습니다.</p>
          <p>반려 사유를 입력해주세요.</p>
          <p>
            입력한 내용은 담당자가 확인할 수 있으며, 참고 자료로 활용됩니다.
          </p>
        </div>

        <Descriptions columns={1}>
          <DescriptionItem label="반려 사유 입력">
            <div className="p-2">
              <Textarea
                rows={4}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
          </DescriptionItem>
        </Descriptions>
      </div>
    </Modal>
  );
};

export default RejectSendModal;
