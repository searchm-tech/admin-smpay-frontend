import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import {
  DescriptionItem,
  Descriptions,
} from "@/components/composite/description-components";
import { LabelBullet } from "@/components/composite/label-bullet";
import { Modal } from "@/components/composite/modal-components";
import Table from "@/components/composite/table";
import { LinkTextButton } from "@/components/composite/button-components";

import LoadingUI from "@/components/common/Loading";

import {
  formatBusinessNumber,
  formatDate,
  formatPhoneNumber,
} from "@/utils/format";
import { SmPayAdvertiserStatusLabel } from "@/constants/status";
import {
  useSmPayAdvertiserDetail,
  useSmPayApplyList,
} from "@/hooks/queries/sm-pay";

import type { TableProps } from "@/types/table";
import { SmPayAdvertiserStatus, SmPayDetailDto } from "@/types/smpay";
import GuidSection from "./GuideSection";

type Props = {
  advertiserId: number;
  isHistory?: boolean;
};

const AdvertiserInfoSection = ({ advertiserId, isHistory = false }: Props) => {
  const { data: detailInfo, isPending: isLoading } =
    useSmPayAdvertiserDetail(advertiserId);

  const [isHistoryModal, setIsHistoryModal] = useState(false);

  const { data: dataSource } = useSmPayApplyList(advertiserId || 0);

  return (
    <div>
      {isLoading && <LoadingUI title="광고주 정보 조회 중..." />}

      <GuidSection
        viewType={
          detailInfo?.status === "OPERATION_REJECT"
            ? "reject"
            : "master-judgement"
        }
      />

      <section>
        {isHistoryModal && (
          <HistoryModal
            onClose={() => setIsHistoryModal(false)}
            advertiserId={advertiserId}
          />
        )}

        <div className="flex items-center gap-4 py-4">
          <LabelBullet labelClassName="text-base font-bold">
            광고주 상태
          </LabelBullet>
          {isHistory && dataSource && dataSource.length > 0 && (
            <Button onClick={() => setIsHistoryModal(true)}>
              SM Pay 지난 이력 보기
            </Button>
          )}
        </div>

        <Descriptions columns={1}>
          <DescriptionItem label="광고주 상태">
            <Label>
              {detailInfo && SmPayAdvertiserStatusLabel[detailInfo.status]}
            </Label>
          </DescriptionItem>
        </Descriptions>
      </section>

      <section className="w-full">
        <div className="flex items-center gap-4 py-4">
          <LabelBullet labelClassName="text-base font-bold">
            광고주 기본 정보
          </LabelBullet>
        </div>
        <Descriptions columns={1}>
          <DescriptionItem label="광고주명">
            <Label>{detailInfo?.name}</Label>
          </DescriptionItem>
          <DescriptionItem label="대표자명">
            <Label>{detailInfo?.representativeName}</Label>
          </DescriptionItem>
          <DescriptionItem label="사업자 등록번호">
            <Label>
              {formatBusinessNumber(
                detailInfo?.businessRegistrationNumber || ""
              )}
            </Label>
          </DescriptionItem>
          <DescriptionItem label="광고주 휴대폰 번호">
            <Label>{formatPhoneNumber(detailInfo?.phoneNumber || "")}</Label>
          </DescriptionItem>
          <DescriptionItem label="광고주 이메일 주소">
            <Label>{detailInfo?.emailAddress}</Label>
          </DescriptionItem>
        </Descriptions>
      </section>
    </div>
  );
};

export default AdvertiserInfoSection;

type HistoryModalProps = {
  onClose: () => void;
  advertiserId?: number;
};
const HistoryModal = ({ onClose, advertiserId }: HistoryModalProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const originFormId = searchParams.get("formId");

  const { data: dataSource } = useSmPayApplyList(advertiserId || 0);

  console.log("dataSource", dataSource);
  const columns: TableProps<SmPayDetailDto>["columns"] = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      align: "center",
    },
    {
      title: "CUSTOMER ID",
      dataIndex: "advertiserCustomerId",
      key: "advertiserCustomerId",
      align: "center",
    },
    {
      title: "광고주 로그인 ID",
      dataIndex: "advertiserLoginId",
      key: "advertiserLoginId",
      align: "center",
    },
    {
      title: "광고주 닉네임",
      dataIndex: "advertiserNickname",
      key: "advertiserNickname",
      align: "center",
    },
    {
      title: "광고주명",
      dataIndex: "advertiserName",
      key: "advertiserName",
      align: "center",
      render: (text: string, record) => (
        <LinkTextButton
          onClick={() => {
            const url = `/sm-pay/management/history/${advertiserId}?formId=${record.advertiserFormId}&orignFormId=${originFormId}`;
            router.push(url);
          }}
        >
          {text}
        </LinkTextButton>
      ),
    },
    {
      title: "최종 상태",
      dataIndex: "advertiserStatus",
      key: "advertiserStatus",
      align: "center",
      render: (value: string, record) =>
        SmPayAdvertiserStatusLabel[
          record.advertiserStatus as SmPayAdvertiserStatus
        ],
    },
    {
      title: "최종 수정 일시",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (value: string, record) => formatDate(value || record.registerDt),
    },
  ];
  return (
    <Modal
      open
      title="SM Pay 지난 이력 보기"
      onClose={onClose}
      onConfirm={onClose}
      cancelDisabled
    >
      <div className="w-[85vw] overflow-y-auto">
        <Table<SmPayDetailDto>
          dataSource={dataSource}
          columns={columns}
          pagination={false}
        />
      </div>
    </Modal>
  );
};
