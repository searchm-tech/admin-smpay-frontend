import { useState } from "react";
import LoadingUI from "@/components/common/Loading";
import { Modal } from "@/components/composite/modal-components";

import { useSmPayApproval } from "@/hooks/queries/sm-pay";

import type { ParamsSmPayApproval } from "@/types/api/smpay";
import type { JudgementModalProps } from ".";

type ApproveModalProps = {
  advertiserId: number;
  onClose: () => void;
  onConfirm: () => void;
  params: JudgementModalProps;
};

const ApproveModal = ({
  onClose,
  onConfirm,
  params,
  advertiserId,
}: ApproveModalProps) => {
  const [isConfirm, setIsConfirm] = useState(false);

  const { mutate: postSmPayApproval, isPending: isApproving } =
    useSmPayApproval({
      onSuccess: () => {
        setIsConfirm(true);
      },
    });

  const handleConfirm = () => {
    const defaultParams: ParamsSmPayApproval = {
      statIndicator: params.statIndicator,
      chargeRule: params.chargeRule,
      prePaymentSchedule: params.prePaymentSchedule,
      reviewerMemo: params?.reviewerMemo || "",
      approvalMemo: params?.approvalMemo || "",
      rejectStatusMemo: "",
      decisionType: "APPROVE",
    };
    postSmPayApproval({
      advertiserId: advertiserId,
      params: {
        ...defaultParams,
        decisionType: "APPROVE",
      },
    });
  };

  if (isApproving) {
    return <LoadingUI />;
  }

  if (!isConfirm) {
    return (
      <Modal
        open
        onClose={onClose}
        onConfirm={handleConfirm}
        title="광고주 심사 승인"
      >
        <div>
          <p className="mb-2">광고주의 SM Pay 신청을 승인처리하겠습니까?</p>
          <p>심사 결과는 대행사 담당자에게 이메일로 발송됩니다.</p>
          <p>
            승인된 심사 결과는 SM Pay에서 최종 검토되며, 검토 완료 후 광고주가
            인증하면 <br />
            SM Pay운영이 시작됩니다.
          </p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      open
      onConfirm={onConfirm}
      title="광고주 심사 승인"
      confirmText="승인 처리"
      cancelDisabled
    >
      <div>광고주의 SM Pay 신청이 승인되었습니다.</div>
    </Modal>
  );
};

export default ApproveModal;
