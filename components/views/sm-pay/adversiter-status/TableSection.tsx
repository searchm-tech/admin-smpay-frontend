import { useState } from "react";
import { useRouter } from "next/navigation";

import { SelectSearch } from "@/components/composite/select-search";
import { Button } from "@/components/ui/button";
import Table from "@/components/composite/table";
import { LinkTextButton } from "@/components/composite/button-components";

import { PauseModal, RejectDialog, RejectOperationModal } from "../dialog";

import {
  SmPayAdvertiserStatusLabel,
  STATUS_ACTION_BUTTONS,
} from "@/constants/status";
import { ColumnTooltip } from "@/constants/table";
import { formatDate } from "@/utils/format";

import { useQuerySmPayAdminAgencyList } from "@/hooks/queries/agency";
import { useQuerySmPayAdminAdvertiserList } from "@/hooks/queries/advertiser";

import type { FilterValue, TableParams, TableProps } from "@/types/table";
import type {
  ActionButton,
  SmPayAdvertiserStatus,
  SmPayAdvertiserStautsOrderType,
} from "@/types/smpay";
import type { SmPayAdvertiserStatusDto } from "@/types/dto/smpay";

interface TableSectionProps {
  selectedAgency: string;
  selectedAdvertiser: string;
  tableParams: TableParams;
  setTableParams: (params: TableParams) => void;
  total: number;
  loadingData: boolean;
  dataSource: SmPayAdvertiserStatusDto[];
  handleSelectAgency: (value: string) => void;
  handleSelectAdvertiser: (value: string) => void;
  handleReset: () => void;
}
const TableSection = ({
  selectedAgency,
  selectedAdvertiser,
  handleSelectAgency,
  handleSelectAdvertiser,
  handleReset,
  tableParams,
  setTableParams,
  total,
  loadingData,
  dataSource,
}: TableSectionProps) => {
  const router = useRouter();

  const { data: agencyList = [] } = useQuerySmPayAdminAgencyList();

  const { data: advertiserList = [] } = useQuerySmPayAdminAdvertiserList();

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
  const [pauseModal, setPauseModal] = useState<SmPayAdvertiserStatusDto | null>(
    null
  );

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
  const handleMoveDetailPage = (record: SmPayAdvertiserStatusDto) => {
    const {
      advertiserId,
      advertiserFormId,
      advertiserCustomerId,
      agentId,
      userId,
    } = record;
    const url = `/sm-pay/adversiter-status/${advertiserId}?formId=${advertiserFormId}&advertiserCustomerId=${advertiserCustomerId}&agentId=${agentId}&userId=${userId}`;
    router.push(url);
  };

  const columns: TableProps<SmPayAdvertiserStatusDto>["columns"] = [
    {
      title: "No",
      dataIndex: "no",
      align: "center",
      sorter: true,
    },
    {
      title: "대행사",
      dataIndex: "agentName",
      align: "center",
      sorter: true,
      render: (value) => value || "-",
    },
    {
      title: "담당자",
      dataIndex: "userName",
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
    // {
    //   title: "광고주 닉네임",  TODO : 확인 필요
    //   dataIndex: "advertiserNickname",
    //   align: "center",
    //   sorter: true,
    // },
    {
      title: ColumnTooltip.advertiserName,
      dataIndex: "advertiserName",
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
        if (value === "REJECT") {
          return (
            <LinkTextButton onClick={() => setRejectModal(record)}>
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
        if (value === "PAUSE") {
          return (
            <LinkTextButton onClick={() => setPauseModal(record)}>
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
                  handleMoveDetailPage(record);
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
      render: (date: string) => (date ? formatDate(date) : "-"),
    },
  ];

  return (
    <section className="pt-4">
      {rejectModal && (
        <RejectDialog
          onClose={() => setRejectModal(null)}
          description={rejectModal.description}
          date={rejectModal.descriptionRegisterDt}
          onConfirm={() => handleMoveDetailPage(rejectModal)}
        />
      )}
      {rejectOperationModal && (
        <RejectOperationModal
          onClose={() => setRejectOperationModal(null)}
          onConfirm={() => handleMoveDetailPage(rejectOperationModal)}
          description={rejectOperationModal.description}
          date={rejectOperationModal.descriptionRegisterDt}
        />
      )}
      {pauseModal && (
        <PauseModal
          onClose={() => setPauseModal(null)}
          onConfirm={() => handleMoveDetailPage(pauseModal)}
          description={pauseModal.description}
          date={pauseModal.descriptionRegisterDt}
        />
      )}
      <div className="flex gap-2 border-1 border-b border-dashed border-gray-300 pb-4">
        <SelectSearch
          options={agencyList?.map((agency) => ({
            label: `${agency.name} | ${agency.representativeName}`,
            value: agency.agentId.toString(),
          }))}
          value={selectedAgency}
          onValueChange={handleSelectAgency}
          placeholder="대행사를 선택하세요."
        />

        <SelectSearch
          options={advertiserList?.map((advertiser) => ({
            label: `${advertiser.id} | ${advertiser.name}`,
            value: advertiser.advertiserId.toString(),
          }))}
          value={selectedAdvertiser}
          onValueChange={handleSelectAdvertiser}
          placeholder="광고주를 선택하세요."
        />

        <Button variant="outline" onClick={handleReset}>
          초기화
        </Button>
      </div>

      <div className="overflow-x-auto">
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
      </div>
    </section>
  );
};

export default TableSection;
