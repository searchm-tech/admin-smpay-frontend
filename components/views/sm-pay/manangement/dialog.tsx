import { useState } from "react";

import LoadingUI from "@/components/common/Loading";
import { ConfirmDialog, Modal } from "@/components/composite/modal-components";
import {
  DescriptionItem,
  Descriptions,
} from "@/components/composite/description-components";

import { formatDate } from "@/utils/format";

import { useSmPayAdvertiserAgreeNotification } from "@/hooks/queries/sm-pay";
import type { SmPayAdvertiserStatusDto } from "@/types/dto/smpay";

// reject
type PropsRejectDialog = {
  description: string;
  date: string;
  onClose: () => void;
  onConfirm: () => void;
};

const RejectDialog = ({
  onClose,
  onConfirm,
  description,
  date,
}: PropsRejectDialog) => {
  return (
    <Modal
      open
      onClose={onClose}
      onConfirm={onConfirm}
      title="심사 반려"
      confirmText="상세보기"
      cancelText="닫기"
    >
      <div className="min-w-[900px]">
        <p>다음과 같은 사유로 SM Pay 서비스 심사를 반려되었습니다.</p>
        <div className="mt-4 rounded-md bg-white">
          <Descriptions columns={1}>
            <DescriptionItem label="심사 반려 일시">
              {formatDate(date)}
            </DescriptionItem>
            <DescriptionItem label="반려 사유">
              <div>{description}</div>
            </DescriptionItem>
          </Descriptions>
        </div>
      </div>
    </Modal>
  );
};

// application_cancel
type PropsApplyCancelDialog = {
  onClose: () => void;
  onConfirm: () => void;
};
const ApplyCancelDialog = ({ onClose, onConfirm }: PropsApplyCancelDialog) => {
  return (
    <ConfirmDialog
      open
      onClose={onClose}
      onConfirm={onConfirm}
      content={
        <div className="flex flex-col items-center pb-4 font-medium">
          <span>SM Pay 신청을 취소하시겠습니까?</span>
        </div>
      }
    />
  );
};

// reapply
type PropsReapplyDialog = {
  onClose: () => void;
  onConfirm: () => void;
};

const ReapplyDialog = ({ onClose, onConfirm }: PropsReapplyDialog) => {
  const handleConfirm = () => {
    onConfirm();
  };
  return (
    <ConfirmDialog
      open
      onClose={onClose}
      onConfirm={handleConfirm}
      content={
        <div className="flex flex-col items-center pb-4 font-medium">
          <span>기존 신청내역은 수정할 수 없습니다.</span>
          <span>새로 작성하여 다시 신청하시겠습니까?</span>
        </div>
      }
    />
  );
};

type PropsAdvertiserAgreementSendDialog = {
  onClose: () => void;
  onConfirm: () => void;
  data: SmPayAdvertiserStatusDto;
};

const AdvertiserAgreementSendDialog = ({
  onClose,
  onConfirm,
  data,
}: PropsAdvertiserAgreementSendDialog) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const { mutate: sendAgreeNotification, isPending } =
    useSmPayAdvertiserAgreeNotification({
      onSuccess: () => {
        setIsSuccess(true);
      },
    });

  const handleConfirm = () => {
    sendAgreeNotification(data.advertiserId);
  };

  if (isPending) {
    return <LoadingUI />;
  }

  if (isSuccess) {
    return (
      <ConfirmDialog
        open
        onConfirm={onConfirm}
        cancelDisabled
        content={
          <div className="flex flex-col items-center pb-4 font-medium">
            <span>광고주에게 SM Pay 동의 요청을 전송하였습니다.</span>
          </div>
        }
      />
    );
  }

  return (
    <ConfirmDialog
      open
      onClose={onClose}
      onConfirm={handleConfirm}
      content={
        <div className="flex flex-col items-center pb-4 font-medium">
          <span>광고주에게 SM Pay 동의 요청을 전송하시겠습니까?</span>
        </div>
      }
    />
  );
};

// suspend
type PropsSuspendDialog = {
  onClose: () => void;
  onConfirm: () => void;
};

const SuspendDialog = ({ onClose, onConfirm }: PropsSuspendDialog) => {
  const handleConfirm = () => onConfirm();
  return (
    <ConfirmDialog
      open
      onClose={onClose}
      onConfirm={handleConfirm}
      content={
        <div className="flex flex-col items-center pb-4 font-medium">
          <span>SM Pay 서비스를 일시중지 하시겠습니까?</span>
          <span>나중에 언제든지 다시 제개할 수 있습니다.</span>
        </div>
      }
    />
  );
};

// resume
type PropsResumeDialog = {
  onClose: () => void;
  onConfirm: () => void;
  id: string;
};

const ResumeDialog = ({ onClose, onConfirm, id }: PropsResumeDialog) => {
  const handleConfirm = () => {
    console.log("resume");
    onConfirm();
  };

  if (Number(id) % 2 === 0) {
    return (
      <ConfirmDialog
        open
        onConfirm={onClose}
        cancelDisabled
        content={
          <div className="flex flex-col items-center pb-4 font-medium">
            <p className="mb-2">미수금이 있어 재개할 수 없습니다.</p>
            <p>해당 광고주는 미수금이 남아 있어 서비스재개가 불가능합니다.</p>
            <p>미수금 회수 후 다시 시도해주세요.</p>
          </div>
        }
      />
    );
  }

  return (
    <ConfirmDialog
      open
      onClose={onClose}
      onConfirm={handleConfirm}
      content={
        <div className="flex flex-col items-center pb-4 font-medium">
          <span>SM Pay 서비스를 다시 시작하겠습니까?</span>
        </div>
      }
    />
  );
};

// termination_request
type PropsTerminationRequestDialog = {
  onClose: () => void;
  onConfirm: () => void;
  id: string;
};

const TerminationRequestDialog = ({
  onClose,
  onConfirm,
  id,
}: PropsTerminationRequestDialog) => {
  const handleConfirm = () => {
    console.log("termination request");
    onConfirm();
  };

  if (Number(id) % 2 === 0) {
    return (
      <ConfirmDialog
        open
        onConfirm={handleConfirm}
        onClose={onClose}
        content={
          <div className="flex flex-col items-center pb-4 font-medium">
            <p className="mb-2">SM Pay 서비스를 해지 신청하시겠습니까?</p>
            <p>해당 광고주는 미수금이 남아 있어</p>
            <p>미수금 회수 완료 후 해지 처리됩니다.</p>
          </div>
        }
      />
    );
  }

  return (
    <ConfirmDialog
      open
      onClose={onClose}
      onConfirm={handleConfirm}
      content={
        <div className="flex flex-col items-center pb-4 font-medium">
          <span>SM Pay 서비스를 해지하시겠습니까?</span>
        </div>
      }
    />
  );
};

// resend
type PropsResendDialog = {
  onClose: () => void;
  onConfirm: () => void;
};

const ResendDialog = ({ onClose, onConfirm }: PropsResendDialog) => {
  const handleConfirm = () => {
    console.log("resend");
    onConfirm();
  };
  return (
    <ConfirmDialog
      open
      onClose={onClose}
      onConfirm={handleConfirm}
      content={
        <div className="flex flex-col items-center pb-4 font-medium">
          <span>광고주 동의 요청을 재발송 하시겠습니까?</span>
        </div>
      }
    />
  );
};

type PropsPauseModal = {
  onClose: () => void;
  onConfirm: () => void;
  description: string;
  date: string;
};

const PauseModal = ({
  onClose,
  onConfirm,
  description,
  date,
}: PropsPauseModal) => {
  return (
    <Modal
      open
      title="광고주 상태 일시 중지"
      onClose={onClose}
      onConfirm={onConfirm}
      confirmText="상세보기"
      cancelText="닫기"
    >
      <div className="w-[60vw]">
        <p>다음과 같은 사유로 일시중지되었습니다.</p>
        <div className="mt-4 rounded-md bg-white">
          <Descriptions columns={1}>
            <DescriptionItem label="일시중지 일시">
              {formatDate(date)}
            </DescriptionItem>
            <DescriptionItem label="일시중지 사유">
              <div>{description}</div>
            </DescriptionItem>
          </Descriptions>
        </div>
      </div>
    </Modal>
  );
};

type PropsRejectOperationModal = {
  onClose: () => void;
  onConfirm: () => void;
  description: string;
  date: string;
};

const RejectOperationModal = ({
  onClose,
  onConfirm,
  description,
  date,
}: PropsRejectOperationModal) => {
  return (
    <Modal
      open
      title="광고주 상태 운영 검토 거절"
      onClose={onClose}
      onConfirm={onConfirm}
      confirmText="상세보기"
      cancelText="닫기"
    >
      <div className="w-[60vw]">
        <p>다음과 같은 사유로 운영 검토를 거절하였습니다.</p>
        <div className="mt-4 rounded-md bg-white">
          <Descriptions columns={1}>
            <DescriptionItem label="운영 검토 거절 일시">
              {formatDate(date)}
            </DescriptionItem>
            <DescriptionItem label="거절 사유">
              <div>{description}</div>
            </DescriptionItem>
          </Descriptions>
        </div>
      </div>
    </Modal>
  );
};

export {
  RejectDialog,
  ApplyCancelDialog,
  ReapplyDialog,
  AdvertiserAgreementSendDialog,
  SuspendDialog,
  ResumeDialog,
  TerminationRequestDialog,
  ResendDialog,
  PauseModal,
  RejectOperationModal,
};
