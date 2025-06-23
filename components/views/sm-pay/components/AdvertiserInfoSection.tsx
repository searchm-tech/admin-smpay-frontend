import { useRouter } from "next/navigation";
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

import { formatBusinessNumber, formatPhoneNumber } from "@/utils/format";
import { SmPayAdvertiserStatusLabel } from "@/constants/status";
import {
  useSmPayAdvertiserDetail,
  useSmPayApplyList,
} from "@/hooks/queries/sm-pay";

import type { ResponseSmPayApplyInfo } from "@/types/api/smpay";
import type { TableProps } from "@/types/table";

type Props = {
  advertiserId: number;
  isHistory?: boolean;
};

const AdvertiserInfoSection = ({ advertiserId, isHistory = false }: Props) => {
  const { data: detailInfo, isPending: isLoading } =
    useSmPayAdvertiserDetail(advertiserId);

  const [isHistoryModal, setIsHistoryModal] = useState(false);

  return (
    <div>
      {isLoading && <LoadingUI title="광고주 정보 조회 중..." />}
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
          {isHistory && (
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

  const { data: dataSource } = useSmPayApplyList(advertiserId || 0);
  const columns: TableProps<ResponseSmPayApplyInfo>["columns"] = [
    {
      title: "광고주 신청서 ID",
      dataIndex: "advertiserFormId",
      key: "advertiserFormId",
    },

    {
      title: "광고주 대표자명",
      dataIndex: "advertiserRepresentativeName",
      key: "advertiserRepresentativeName",
    },
    {
      title: "advertiserNickname",
      dataIndex: "advertiserNickname",
      key: "광고주 닉네임",
    },
    {
      title: "광고주명",
      dataIndex: "advertiserName",
      key: "advertiserName",
      render: (text: string, record: any) => (
        <LinkTextButton
          onClick={() => router.push(`/sm-pay/management/history/${1}`)}
        >
          {text}
        </LinkTextButton>
      ),
    },
    {
      title: "최종 상태",
      dataIndex: "advertiserStatus",
      key: "advertiserStatus",
    },
    {
      title: "최종 수정 일시",
      dataIndex: "updatedAt",
      key: "updatedAt",
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
        <Table<ResponseSmPayApplyInfo>
          dataSource={dataSource}
          columns={columns}
        />
      </div>
    </Modal>
  );
};
