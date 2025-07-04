import { useState } from "react";
import { useRouter } from "next/navigation";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Descriptions,
  DescriptionItem,
} from "@/components/composite/description-components";
import { LabelBullet } from "@/components/composite/label-bullet";
import { Modal } from "@/components/composite/modal-components";
import Table from "@/components/composite/table";
import { LinkTextButton } from "@/components/composite/button-components";

import { useSmPayApplyList } from "@/hooks/queries/sm-pay";

import type { TableProps } from "@/types/table";
import type { SMPayFormHistory } from "@/types/dto/smpay";

type Props = {
  status: string;
  isHistory?: boolean;
  advertiserId?: number;
};

// TODO : 제거 예정
const AdvertiseStatusSection = ({
  status,
  isHistory = false,
  advertiserId,
}: Props) => {
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  return (
    <section>
      {isHistoryModalOpen && (
        <HistoryModal
          onClose={() => setIsHistoryModalOpen(false)}
          advertiserId={advertiserId}
        />
      )}
      <div className="flex items-center gap-4 py-4">
        <LabelBullet labelClassName="text-base font-bold">
          광고주 상태
        </LabelBullet>
        {isHistory && (
          <Button onClick={() => setIsHistoryModalOpen(true)}>
            SM Pay 지난 이력 보기
          </Button>
        )}
      </div>

      <Descriptions columns={1}>
        <DescriptionItem label="광고주 상태">
          <Label>{status}</Label>
        </DescriptionItem>
      </Descriptions>
    </section>
  );
};

export default AdvertiseStatusSection;

type HistoryModalProps = {
  onClose: () => void;
  advertiserId?: number;
};
const HistoryModal = ({ onClose, advertiserId }: HistoryModalProps) => {
  const router = useRouter();

  const { data: dataSource } = useSmPayApplyList(advertiserId || 0);
  const columns: TableProps<SMPayFormHistory>["columns"] = [
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
        <Table<SMPayFormHistory> dataSource={dataSource} columns={columns} />
      </div>
    </Modal>
  );
};
