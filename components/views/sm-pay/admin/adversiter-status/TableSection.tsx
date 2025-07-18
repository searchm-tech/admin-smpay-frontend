import { useState } from "react";
import { useRouter } from "next/navigation";

import dayjs from "dayjs";

import { SelectSearch } from "@/components/composite/select-search";
import { Button } from "@/components/ui/button";
import Table from "@/components/composite/table";

import {
  SmPayAdvertiserStatusLabel,
  STATUS_ACTION_BUTTONS,
} from "@/constants/status";
import { ColumnTooltip } from "@/constants/table";
import { advertiser, optionAgency } from "./constants";

import type { TableParams } from "@/types/table";
import type {
  ActionButton,
  SmPayAdvertiserStatus,
  SmPayAdvertiserStautsOrderType,
} from "@/types/smpay";
import type { TableProps } from "antd";
import type { FilterValue } from "antd/es/table/interface";
import { SmPayAdvertiserStatusDto } from "@/types/dto/smpay";
import { AdvertiserAgreementSendDialog } from "../../manangement/dialog";
import { useQuerySmPayAdminAgencyList } from "@/hooks/queries/agency";
import { useQuerySmPayAdminAdvertiserList } from "@/hooks/queries/advertiser";

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
  const [rejectModalId, setRejectModalId] = useState<number | null>(null);
  const [rejectOperationModalId, setRejectOperationModalId] = useState<
    number | null
  >(null);
  const [stopModalId, setStopModalId] = useState<number | null>(null);

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
  const handleMoveDetailPage = (
    advertiserId: number,
    advertiserFormId: number,
    advertiserCustomerId: number,
    agentId: number,
    userId: number
  ) => {
    router.push(
      `/sm-pay/admin/adversiter-status/${advertiserId}?formId=${advertiserFormId}&advertiserCustomerId=${advertiserCustomerId}&agentId=${agentId}&userId=${userId}`
    );
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
      render: (value: SmPayAdvertiserStatus) => (
        <span>{SmPayAdvertiserStatusLabel[value]}</span>
      ),
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
                  const {
                    advertiserId,
                    advertiserFormId,
                    advertiserCustomerId,
                    agentId,
                    userId,
                  } = record;
                  handleMoveDetailPage(
                    advertiserId,
                    advertiserFormId,
                    advertiserCustomerId,
                    agentId,
                    userId
                  );
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

  return (
    <section className="pt-4">
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
      </div>
    </section>
  );
};

export default TableSection;
