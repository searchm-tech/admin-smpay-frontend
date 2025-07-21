import { Fragment, useState } from "react";

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

import HistoryDetailModal from "../../../components/HistoryDetailModal";
import GuidSection, {
  RejectDescription,
  RejectOperationDescription,
} from "../../../components/GuideSection";

import {
  formatBusinessNumber,
  formatDate,
  formatPhoneNumber,
} from "@/utils/format";
import { SmPayAdvertiserStatusLabel } from "@/constants/status";
import { useSmPayAdminOverviewApplyFormList } from "@/hooks/queries/sm-pay";

import type { TableProps } from "@/types/table";
import type { SmPayAdvertiserStatus } from "@/types/smpay";
import type { SMPayFormHistory, AdvertiserDetailDto } from "@/types/dto/smpay";

type Props = {
  advertiserData?: AdvertiserDetailDto;
  isShowHistory?: boolean;
};

const AdvertiserInfoSection = ({
  advertiserData,
  isShowHistory = true,
}: Props) => {
  const [isHistoryModal, setIsHistoryModal] = useState(false);

  const { data: dataSource } = useSmPayAdminOverviewApplyFormList(
    advertiserData?.advertiserId || 0,
    advertiserData?.agentId || 0,
    advertiserData?.userId || 0
  );

  return (
    <div>
      {!["REJECT", "OPERATION_REJECT"].includes(
        advertiserData?.status || ""
      ) && <GuidSection viewType="master-judgement" />}

      {advertiserData?.status === "REJECT" && (
        <RejectDescription
          description={advertiserData?.description.description || ""}
          date={""}
        />
      )}

      {advertiserData?.status === "OPERATION_REJECT" && (
        <RejectOperationDescription
          description={advertiserData?.description.description || ""}
          date={""}
        />
      )}

      <section>
        {isHistoryModal && dataSource && advertiserData && (
          <HistoryModal
            onClose={() => setIsHistoryModal(false)}
            dataSource={dataSource}
            advertiserData={advertiserData}
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
              {advertiserData &&
                SmPayAdvertiserStatusLabel[advertiserData.status]}
            </Label>
          </DescriptionItem>
        </Descriptions>
      </section>

      <section className="w-full flex gap-4">
        <div className="flex-1">
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
        </div>
      </section>
    </div>
  );
};

export default AdvertiserInfoSection;

type HistoryModalProps = {
  onClose: () => void;
  advertiserData?: AdvertiserDetailDto;
  dataSource: SMPayFormHistory[];
};

const HistoryModal = ({
  onClose,
  advertiserData,
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
      render: (value: string, record) =>
        SmPayAdvertiserStatusLabel[
          record.advertiserStatus as SmPayAdvertiserStatus
        ],
    },
    {
      title: "최종 수정 일시",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (value: string, record) =>
        formatDate(value || record.registerOrUpdateDt),
    },
  ];
  return (
    <Fragment>
      {formId && (
        <HistoryDetailModal
          onClose={() => setFormId(null)}
          advertiserId={advertiserData?.advertiserId || 0}
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
