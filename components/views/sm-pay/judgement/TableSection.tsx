"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { StopInfoModal } from "@/components/views/sm-pay/manangement/dialog";

import { Badge } from "@/components/ui/badge";
import { LinkTextButton } from "@/components/composite/button-components";
import Table from "@/components/composite/table";

import { formatDate } from "@/utils/format";

import type {
  ColumnsType,
  FilterValue,
  TableParams,
  TableProps,
} from "@/types/table";
import type {
  SmPayAdvertiserStautsOrderType,
  SmPayAdvertiserStatus,
  SmPayAuditDto,
} from "@/types/smpay";

import { SmPayAdvertiserStatusLabel } from "@/constants/status";
import { buildUrl } from "./constants";

type PropsTableSection = {
  tableParams: TableParams;
  setTableParams: (params: TableParams) => void;
  total: number;
  loadingData: boolean;
  dataSource: SmPayAuditDto[];
};

const TableSection = ({
  tableParams,
  setTableParams,
  total,
  loadingData,
  dataSource,
}: PropsTableSection) => {
  const router = useRouter();

  const [stopModalId, setStopModalId] = useState<string>("");

  const columns: ColumnsType<SmPayAuditDto> = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      width: 70,
      sorter: true,
      align: "center",
    },
    {
      title: "CUSTOMER ID",
      dataIndex: "advertiserCustomerId",
      key: "advertiserCustomerId",
      sorter: true,
      align: "center",
    },
    {
      title: "광고주 로그인 ID",
      dataIndex: "advertiserLoginId",
      key: "advertiserLoginId",
      align: "center",
      sorter: true,
    },
    {
      title: "광고주 닉네임",
      dataIndex: "advertiserNickname",
      key: "advertiserNickname",
      align: "center",
      sorter: true,
    },
    {
      title: "광고주명",
      dataIndex: "advertiserName",
      key: "advertiserName",
      align: "center",
      sorter: true,
      render: (text, record) => (
        <div className="flex items-center justify-center gap-2">
          {!record.isApprovalRead && <Badge label="new" />}

          <LinkTextButton
            onClick={() => {
              const { advertiserId, advertiserFormId, isApprovalRead } = record;
              const url = buildUrl(
                advertiserId,
                advertiserFormId,
                isApprovalRead
              );
              router.push(url);
            }}
          >
            {text}
          </LinkTextButton>
        </div>
      ),
    },
    {
      title: "상태",
      dataIndex: "advertiserType",
      key: "advertiserType",
      align: "center",
      sorter: true,
      render: (value) =>
        SmPayAdvertiserStatusLabel[value as SmPayAdvertiserStatus],
    },
    {
      title: "최종 수정 일시",
      dataIndex: "registerOrUpdateDt",
      key: "registerOrUpdateDt",
      align: "center",
      sorter: true,
      render: (date) => formatDate(date),
    },
  ];

  const handleTableChange: TableProps<SmPayAuditDto>["onChange"] = (
    pagination,
    filters,
    sorter
  ) => {
    let orderType: SmPayAdvertiserStautsOrderType = "ADVERTISER_REGISTER_DESC"; // 기본값

    if (sorter && !Array.isArray(sorter) && sorter.field && sorter.order) {
      const field = sorter.field as string;
      const order = sorter.order === "ascend" ? "ASC" : "DESC";

      const fieldMap: Record<string, string> = {
        no: "ADVERTISER_REGISTER",
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
      },
      filters: filters as Record<string, FilterValue>,
      orderType: orderType,
    });
  };

  console.log(dataSource);

  return (
    <section>
      {stopModalId && (
        <StopInfoModal
          open
          id={stopModalId}
          onClose={() => setStopModalId("")}
          onConfirm={() => router.push(`/sm-pay/judgement/${stopModalId}`)}
        />
      )}
      <Table<SmPayAuditDto>
        columns={columns}
        dataSource={dataSource}
        loading={loadingData}
        rowKey="advertiserFormId"
        pagination={{
          ...tableParams.pagination,
          total,
          position: ["bottomCenter"],
          showSizeChanger: true,
        }}
        onChange={handleTableChange}
      />
    </section>
  );
};

export default TableSection;
