import Image from "next/image";
import { useState } from "react";

import LoadingUI from "@/components/common/Loading";
import { ConfirmDialog, Modal } from "@/components/composite/modal-components";
import { Descriptions } from "@/components/composite/description-components";

import {
  useMuateLicense,
  useMuateDeleteLicense,
} from "@/hooks/queries/license";

import { formatDate } from "@/utils/format";

import { dialogContent } from "./constants";

import type { TLicenseInfo } from ".";

type Props = {
  onConfirm: () => void;
};
export const SuccessCreateLicenseDialog = ({ onConfirm }: Props) => {
  return (
    <ConfirmDialog
      open
      confirmText="광고주 등록"
      cancelDisabled
      content={dialogContent["success-create"]}
      onConfirm={onConfirm}
    />
  );
};

type PropsWithInfo = {
  licenseInfo: TLicenseInfo;
  onClose: () => void;
  refetch: () => void;
};

export const CheckUpdateLicenseDialog = ({
  onClose,
  licenseInfo,
  refetch,
}: PropsWithInfo) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [errMessage, setErrMessage] = useState("");

  // 라이선스 등록 + 수정
  const { mutate: mutateLicense, isPending } = useMuateLicense({
    onSuccess: () => setIsSuccess(true),
    onError: () => setErrMessage("라이선스 중복 혹은 비정상적인 요청입니다."),
  });

  if (isPending) {
    return <LoadingUI />;
  }

  if (errMessage) {
    return (
      <ConfirmDialog
        open
        cancelDisabled
        content={<p className="text-center">{errMessage}</p>}
        onConfirm={() => {
          setErrMessage("");
          onClose();
        }}
      />
    );
  }

  if (isSuccess) {
    return (
      <ConfirmDialog
        open
        cancelDisabled
        content={
          <p className="text-center">수정이 성공적으로 완료되었습니다.</p>
        }
        onConfirm={() => {
          refetch();
          onClose();
        }}
      />
    );
  }

  return (
    <ConfirmDialog
      open
      content={dialogContent["check-update"]}
      onConfirm={() => mutateLicense(licenseInfo)}
      onClose={onClose}
    />
  );
};

export const DeleteLicenseDialog = ({
  onClose,
  licenseInfo,
  refetch,
}: PropsWithInfo) => {
  const {
    mutate: deleteLicense,
    isPending,
    isSuccess,
  } = useMuateDeleteLicense();

  const handleConfirmSuccess = () => {
    onClose();
    refetch();
  };

  if (isPending) {
    return <LoadingUI />;
  }

  if (isSuccess) {
    return (
      <ConfirmDialog
        open
        confirmText="삭제"
        cancelDisabled
        onConfirm={handleConfirmSuccess}
        content={dialogContent["success-delete"]}
      />
    );
  }

  return (
    <ConfirmDialog
      open
      confirmText="삭제"
      onConfirm={() => deleteLicense(licenseInfo)}
      onClose={onClose}
      content={dialogContent["check-delete"]}
    />
  );
};

type CreateLicTipDialogProps = {
  onClose: () => void;
};
export const CreateLicTipDialog = ({ onClose }: CreateLicTipDialogProps) => {
  return (
    <Modal open title="등록 TIP!" onClose={onClose} footerDisabled>
      <div className="w-[600px] h-[400px]">
        <div>
          <p className="mb-1">
            API 라이선스는
            <span className="ml-2 font-bold text-blue-600 border-b border-blue-600">
              네이버 광고 {">"} 도구 {">"} API 사용 관리 페이지
            </span>
            에서 확인하실 수 있습니다.
          </p>
        </div>

        <div className="flex justify-center">
          <Image
            style={{
              border: "1px solid black",
            }}
            className="mt-4"
            src="/images/naver-service/guide.png"
            alt="guide"
            width={600}
            height={320}
          />
        </div>
      </div>
    </Modal>
  );
};

export const NaverLinkDialog = ({ onClose }: { onClose: () => void }) => {
  return (
    <Modal open title="등록 TIP!" onClose={onClose} footerDisabled>
      <div className="w-[600px] h-[400px]">
        <div>
          <p className="mb-1">
            CUSTOMER ID는
            <span className="ml-2 font-bold text-blue-600 border-b border-blue-600">
              네이버 검색광고 홈페이지 {">"} 내 정보 {">"} 기본정보 {">"}{" "}
              권한설정
            </span>
            에서 확인하실 수 있습니다.
          </p>
        </div>

        <div className="flex justify-center">
          <Image
            style={{
              border: "1px solid black",
            }}
            className="mt-4"
            src="/images/naver-service/guide.png"
            alt="guide"
            width={600}
            height={320}
          />
        </div>
      </div>
    </Modal>
  );
};

export type SyncFail = {
  date: string;
  reason: string;
};

type SyncFailDialogProps = {
  onClose: () => void;
  data: SyncFail;
};
export const SyncFailDialog = ({ data, onClose }: SyncFailDialogProps) => {
  return (
    <Modal
      open
      title="광고 데이터 동기화 실패"
      cancelDisabled
      onClose={onClose}
      onConfirm={onClose}
    >
      <div className="w-[500px]">
        <Descriptions columns={1}>
          <Descriptions.Item label="동기화 실패 일시">
            {formatDate(data.date)}
          </Descriptions.Item>
          <Descriptions.Item label="실패 사유">{data.reason}</Descriptions.Item>
        </Descriptions>
      </div>
    </Modal>
  );
};
