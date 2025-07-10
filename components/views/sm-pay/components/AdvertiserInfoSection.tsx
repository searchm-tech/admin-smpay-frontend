import { useState, Fragment } from "react";

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
import GuidSection, {
  RejectDescription,
  RejectOperationDescription,
} from "./GuideSection";
import HistoryDetailModal from "./HistoryDetailModal";

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
import type { SmPayAdvertiserStatus } from "@/types/smpay";
import type { SMPayFormHistory } from "@/types/dto/smpay";

type Props = {
  advertiserId: number;
  isShowHistory?: boolean;
  description?: string;
  date?: string;
};

const AdvertiserInfoSection = ({
  advertiserId,
  isShowHistory = true,
  description,
  date,
}: Props) => {
  const { data: detailInfo, isPending: isLoading } =
    useSmPayAdvertiserDetail(advertiserId);

  const [isHistoryModal, setIsHistoryModal] = useState(false);

  const { data: dataSource } = useSmPayApplyList(advertiserId || 0);

  return (
    <div>
      {isLoading && <LoadingUI title="광고주 정보 조회 중..." />}

      {!["REJECT", "OPERATION_REJECT"].includes(detailInfo?.status || "") && (
        <GuidSection viewType="master-judgement" />
      )}

      {detailInfo?.status === "REJECT" && (
        <RejectDescription description={description || ""} date={date || ""} />
      )}

      {detailInfo?.status === "OPERATION_REJECT" && (
        <RejectOperationDescription
          description={description || ""}
          date={date || ""}
        />
      )}

      <section>
        {isHistoryModal && (
          <HistoryModal
            onClose={() => setIsHistoryModal(false)}
            advertiserId={advertiserId}
            dataSource={dataSource}
          />
        )}

        <div className="flex items-center gap-4 py-4">
          <LabelBullet labelClassName="text-base font-bold">
            광고주 상태
          </LabelBullet>

          {isShowHistory && (
            <Button
              onClick={() => setIsHistoryModal(true)}
              disabled={dataSource && dataSource.length === 0}
            >
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
  dataSource?: SMPayFormHistory[];
};
const HistoryModal = ({
  onClose,
  advertiserId,
  dataSource,
}: HistoryModalProps) => {
  const [formId, setFormId] = useState<number | null>(null);

  const columns: TableProps<SMPayFormHistory>["columns"] = [
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
        <LinkTextButton onClick={() => setFormId(record.advertiserFormId)}>
          {text}
        </LinkTextButton>
      ),
    },
    {
      title: "최종 상태",
      dataIndex: "advertiserStatus",
      key: "advertiserStatus",
      align: "center",
      render: (_: string, record) =>
        SmPayAdvertiserStatusLabel[
          record.advertiserStatus as SmPayAdvertiserStatus
        ],
    },
    {
      title: "최종 수정 일시",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (value: string, record) => {
        return formatDate(value || record.registerOrUpdateDt || "");
      },
    },
  ];

  return (
    <Fragment>
      {formId && (
        <HistoryDetailModal
          onClose={() => setFormId(null)}
          advertiserId={advertiserId || 0}
          formId={formId}
        />
      )}

      <Modal
        open
        title="SM Pay 지난 이력 보기"
        onClose={onClose}
        onConfirm={onClose}
        cancelDisabled
      >
        <div className="w-[85vw] overflow-y-auto">
          <Table<SMPayFormHistory>
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            scroll={{ y: 300 }}
          />
        </div>
      </Modal>
    </Fragment>
  );
};
