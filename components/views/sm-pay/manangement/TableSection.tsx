"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

import { Button } from "@/components/ui/button";
import Table from "@/components/composite/table";
import { LinkTextButton } from "@/components/composite/button-components";

import {
  STATUS_ACTION_BUTTONS,
  SmPayAdvertiserStatusLabel,
} from "@/constants/status";

import { ColumnTooltip } from "@/constants/table";
import {
  AdvertiserAgreementSendDialog,
  PauseModal,
  RejectDialog,
  RejectOperationModal,
} from "./dialog";

import type { TableProps, FilterValue, TableParams } from "@/types/table";
import type { ActionButton } from "@/types/smpay";

import type {
  SmPayAdvertiserStatus,
  SmPayAdvertiserStautsOrderType,
} from "@/types/smpay";
import type { SmPayAdvertiserStatusDto } from "@/types/dto/smpay";

interface TableSectionProps {
  tableParams: TableParams;
  setTableParams: (params: TableParams) => void;
  total: number;
  loadingData: boolean;
  dataSource: SmPayAdvertiserStatusDto[];
}

const TableSection = ({
  tableParams,
  setTableParams,
  total,
  loadingData,
  dataSource,
}: TableSectionProps) => {
  const router = useRouter();

  const [openDialog, setOpenDialog] = useState<ActionButton | null>(null);
  const [resumeId, setResumeId] = useState<number | null>(null);
  const [terminationRequestId, setTerminationRequestId] = useState<
    number | null
  >(null);
  const [applySubmitId, setApplySubmitId] = useState<number | null>(null);
  const [applySubmitData, setApplySubmitData] =
    useState<SmPayAdvertiserStatusDto | null>(null);
  const [rejectModal, setRejectModal] =
    useState<SmPayAdvertiserStatusDto | null>(null);
  const [rejectOperationModal, setRejectOperationModal] =
    useState<SmPayAdvertiserStatusDto | null>(null);
  const [stopModalId, setStopModalId] = useState<number | null>(null);
  const [pauseModal, setPauseModal] = useState<SmPayAdvertiserStatusDto | null>(
    null
  );

  const handleMoveDetailPage = (
    advertiserId: number,
    advertiserFormId: number
  ) => {
    router.push(
      `/sm-pay/management/apply-detail/${advertiserId}?formId=${advertiserFormId}`
    );
  };

  const handleTableChange: TableProps<SmPayAdvertiserStatusDto>["onChange"] = (
    pagination,
    filters,
    sorter
  ) => {
    let orderType: SmPayAdvertiserStautsOrderType = "ADVERTISER_REGISTER_DESC"; // 기본값

    if (sorter && !Array.isArray(sorter) && sorter.field && sorter.order) {
      const field = sorter.field as string;
      const order = sorter.order === "ascend" ? "ASC" : "DESC";

      const fieldMap: Record<string, string> = {
        no: "NO",
        advertiserName: "ADVERTISER_NAME",
        advertiserCustomerId: "ADVERTISER_CUSTOMER_ID",
        userId: "ADVERTISER_ID",
        advertiserType: "ADVERTISER_STATUS",
        descriptionRegisterDt: "ADVERTISER_REGISTER",
      };

      const mappedField = fieldMap[field];

      if (mappedField) {
        orderType = `${mappedField}_${order}` as SmPayAdvertiserStautsOrderType;
      }
    }

    setTableParams({
      ...tableParams,
      pagination: {
        current: pagination.current ?? 1,
        pageSize: pagination.pageSize ?? 10,
        total: pagination.total || 0,
      },
      filters: filters as Record<string, FilterValue>,
      orderType: orderType,
    });
  };

  const columns: TableProps<SmPayAdvertiserStatusDto>["columns"] = [
    {
      title: "No",
      dataIndex: "no",
      align: "center",
      sorter: true,
    },
    {
      title: "광고주(ID)",
      dataIndex: "advertiserName",
      align: "center",
      sorter: true,
      render: (value) => value || "-",
    },
    {
      title: "CUSTOMER ID",
      dataIndex: "advertiserCustomerId",
      align: "center",
      sorter: true,
    },
    {
      title: "광고주 로그인 ID",
      dataIndex: "advertiserLoginId",
      align: "center",
      sorter: true,
    },
    {
      title: ColumnTooltip.status,
      dataIndex: "advertiserType",
      align: "center",
      sorter: true,
      render: (
        value: SmPayAdvertiserStatus,
        record: SmPayAdvertiserStatusDto
      ) => {
        const text = SmPayAdvertiserStatusLabel[value];
        if (value === "PAUSE") {
          return (
            <LinkTextButton onClick={() => setPauseModal(record)}>
              {text}
            </LinkTextButton>
          );
        }
        if (value === "OPERATION_REJECT") {
          return (
            <LinkTextButton onClick={() => setRejectOperationModal(record)}>
              {text}
            </LinkTextButton>
          );
        }

        if (value === "REJECT") {
          return (
            <LinkTextButton onClick={() => setRejectModal(record)}>
              {text}
            </LinkTextButton>
          );
        }
        return <span>{text}</span>;
      },
    },
    {
      title: "기능",
      dataIndex: "action",
      align: "center",
      render: (_, record) => {
        const availableActions = STATUS_ACTION_BUTTONS[record.advertiserType];
        return (
          <div className="flex justify-center gap-2">
            {availableActions.includes("view") && (
              <Button
                variant="greenOutline"
                onClick={() => {
                  const { advertiserId, advertiserFormId } = record;
                  handleMoveDetailPage(advertiserId, advertiserFormId);
                }}
              >
                조회
              </Button>
            )}

            {availableActions.includes("resend") && (
              <Button
                variant="blueOutline"
                onClick={() => setOpenDialog("resend")}
              >
                재발송
              </Button>
            )}

            {availableActions.includes("suspend") && (
              <Button
                variant="redOutline"
                onClick={() => setOpenDialog("suspend")}
              >
                일시 중지
              </Button>
            )}

            {availableActions.includes("termination_request") && (
              <Button
                variant="redOutline"
                onClick={() =>
                  setTerminationRequestId(record.advertiserCustomerId)
                }
              >
                해지 신청
              </Button>
            )}

            {availableActions.includes("resume") && (
              <Button
                variant="blueOutline"
                onClick={() => setResumeId(record.advertiserCustomerId)}
              >
                재개
              </Button>
            )}

            {availableActions.includes("advertiser_agreement_send") && (
              <Button
                variant="blueOutline"
                onClick={() => setApplySubmitData(record)}
              >
                광고주 동의 전송
              </Button>
            )}

            {availableActions.includes("reapply") && (
              <Button
                variant="blueOutline"
                onClick={() => setOpenDialog("reapply")}
              >
                재신청
              </Button>
            )}

            {availableActions.includes("application_cancel") && (
              <Button
                variant="redOutline"
                onClick={() => setOpenDialog("application_cancel")}
              >
                신청 취소
              </Button>
            )}
          </div>
        );
      },
    },
    {
      title: "최종 수정일시",
      dataIndex: "registerOrUpdateDt",
      width: 200,
      align: "center",
      sorter: true,
      render: (date: string) =>
        date ? dayjs(date).format("YYYY-MM-DD HH:mm") : "-",
    },
  ];

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [tableParams.pagination?.current]);

  return (
    <section>
      {pauseModal && (
        <PauseModal
          description={pauseModal.description}
          date={pauseModal.registerOrUpdateDt}
          onClose={() => setPauseModal(null)}
          onConfirm={() => {
            const { advertiserId, advertiserFormId } = pauseModal;
            handleMoveDetailPage(advertiserId, advertiserFormId);
          }}
        />
      )}

      {rejectOperationModal && (
        <RejectOperationModal
          description={rejectOperationModal.description}
          date={rejectOperationModal.registerOrUpdateDt}
          onClose={() => setPauseModal(null)}
          onConfirm={() => {
            const { advertiserId, advertiserFormId } = rejectOperationModal;
            handleMoveDetailPage(advertiserId, advertiserFormId);
          }}
        />
      )}

      {rejectModal && (
        <RejectDialog
          description={rejectModal.description}
          date={rejectModal.registerOrUpdateDt}
          onClose={() => setRejectModal(null)}
          onConfirm={() => {
            const { advertiserId, advertiserFormId } = rejectModal;
            handleMoveDetailPage(advertiserId, advertiserFormId);
          }}
        />
      )}
      {applySubmitData && (
        <AdvertiserAgreementSendDialog
          onClose={() => setApplySubmitData(null)}
          onConfirm={() => setApplySubmitData(null)}
          data={applySubmitData}
        />
      )}
      <Table<SmPayAdvertiserStatusDto>
        columns={columns}
        rowKey="no"
        dataSource={dataSource}
        pagination={{
          ...tableParams.pagination,
          total,
          position: ["bottomCenter"],
          showSizeChanger: true,
        }}
        loading={loadingData}
        onChange={handleTableChange}
      />
    </section>
  );
};

export default TableSection;
