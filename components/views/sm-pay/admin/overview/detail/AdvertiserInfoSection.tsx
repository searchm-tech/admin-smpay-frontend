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
import { useSmPayAdminOverviewApplyFormList } from "@/hooks/queries/sm-pay";

import type { TableProps } from "@/types/table";
import { OverviewApplyListDto, SmPayAdvertiserStatus } from "@/types/smpay";
import type { AdvertiserDetailDto } from "@/types/api/smpay";

type Props = {
  advertiserData?: AdvertiserDetailDto;
  isHistory?: boolean;
};

const AdvertiserInfoSection = ({
  isHistory = false,
  advertiserData,
}: Props) => {
  const [isHistoryModal, setIsHistoryModal] = useState(false);

  return (
    <div>
      <section>
        {isHistoryModal && advertiserData && (
          <HistoryModal
            onClose={() => setIsHistoryModal(false)}
            advertiserId={advertiserData.advertiserId}
          />
        )}
        <div className="flex items-center gap-4 py-4">
          <LabelBullet labelClassName="text-base font-bold">
            광고주 상태
          </LabelBullet>
          {isHistory && (
            <Button onClick={() => setIsHistoryModal(true)}>
              SM Pay 지난 이력 보기
            </Button>
          )}
        </div>

        <Descriptions columns={1}>
          <DescriptionItem label="광고주 상태">
            <Label>
              {advertiserData &&
                SmPayAdvertiserStatusLabel[advertiserData.status]}
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
            <Label>{advertiserData?.name}</Label>
          </DescriptionItem>
          <DescriptionItem label="대표자명">
            <Label>{advertiserData?.representativeName}</Label>
          </DescriptionItem>
          <DescriptionItem label="사업자 등록번호">
            <Label>
              {formatBusinessNumber(
                advertiserData?.businessRegistrationNumber || ""
              )}
            </Label>
          </DescriptionItem>
          <DescriptionItem label="광고주 휴대폰 번호">
            <Label>
              {formatPhoneNumber(advertiserData?.phoneNumber || "")}
            </Label>
          </DescriptionItem>
          <DescriptionItem label="광고주 이메일 주소">
            <Label>{advertiserData?.emailAddress}</Label>
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

  const { data: dataSource } = useSmPayAdminOverviewApplyFormList(
    Number(advertiserId)
  );

  const columns: TableProps<OverviewApplyListDto>["columns"] = [
    {
      title: "No",
      dataIndex: "id",
      key: "id",
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
            const url = `/sm-pay/management/history/${advertiserId}?formId=${record.advertiserFormId}&orignFormId=${record.advertiserFormId}`;
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
        <Table<OverviewApplyListDto>
          dataSource={dataSource}
          columns={columns}
          pagination={false}
        />
      </div>
    </Modal>
  );
};
