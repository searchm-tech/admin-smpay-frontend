"use client";
import { useMemo } from "react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { LinkTextButton } from "@/components/composite/button-components";
import Table from "@/components/composite/table";

import { formatDate } from "@/utils/format";

import { useWindowSize } from "@/hooks/useWindowSize";
import { useSidebar } from "@/components/ui/sidebar";

import { SmPayAdvertiserStatusLabel } from "@/constants/status";

import type {
  SmPayAdminAuditDto,
  SmPayAdvertiserStatus,
  SmPayAdvertiserStautsOrderType,
} from "@/types/smpay";
import type {
  ColumnsType,
  FilterValue,
  TableParams,
  TableProps,
} from "@/types/table";
import { cn } from "@/lib/utils";

type PropsTableSection = {
  tableParams: TableParams;
  setTableParams: (params: TableParams) => void;
  total: number;
  loadingData: boolean;
  dataSource: SmPayAdminAuditDto[];
};

const TableSection = ({
  tableParams,
  setTableParams,
  total,
  loadingData,
  dataSource,
}: PropsTableSection) => {
  const router = useRouter();
  const { width } = useWindowSize();
  const { state } = useSidebar();

  const handleTableChange: TableProps<SmPayAdminAuditDto>["onChange"] = (
    pagination,
    filters,
    sorter
  ) => {
    console.log(sorter);
    let sortField: SmPayAdvertiserStautsOrderType = "ADVERTISER_REGISTER_DESC"; // 기본값

    if (sorter && !Array.isArray(sorter) && sorter.field && sorter.order) {
      const field = sorter.field as string;
      const order = sorter.order === "ascend" ? "ASC" : "DESC";

      // field 이름을 API에서 요구하는 형식으로 변환
      const fieldMap: Record<string, string> = {
        id: "NO", // NO_ 정렬 조건으로 전달
        agentName: "AGENT_NAME",
        userName: "USER_NAME",
        advertiserCustomerId: "ADVERTISER_CUSTOMER_ID",
        advertiserLoginId: "ADVERTISER_ID",
        advertiserNickname: "ADVERTISER_NICK_NAME",
        advertiserName: "ADVERTISER_NAME",
        advertiserType: "ADVERTISER_STATUS",
        registerOrUpdateDt: "ADVERTISER_REGISTER",
      };

      const mappedField = fieldMap[field];

      if (mappedField) {
        sortField = `${mappedField}_${order}` as SmPayAdvertiserStautsOrderType;
      }
    }

    setTableParams({
      pagination: {
        current: pagination.current ?? 1,
        pageSize: pagination.pageSize ?? 10,
      },
      filters: filters as Record<string, FilterValue>,
      keyword: tableParams.keyword, // 기존 keyword 유지
      sortOrder: undefined, // TAgencyOrder를 사용하므로 불필요
      sortField: sortField,
    });
  };

  const columns: ColumnsType<SmPayAdminAuditDto> = [
    {
      title: "No",
      dataIndex: "id",
      key: "id",
      sorter: true,
      align: "center",
    },
    {
      title: "대행사명",
      dataIndex: "agentName",
      key: "agentName",
      sorter: true,
      align: "center",
    },
    {
      title: "담당자명",
      dataIndex: "userName",
      key: "userName",
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
      render: (text, record) => {
        const linkList = [
          "OPERATION_REVIEW_SUCCESS",
          "OPERATION_REJECT",
          "OPERATION_REVIEW",
        ];
        const isLink = linkList.includes(record.advertiserType);

        if (isLink) {
          const query = !record.isOperatorRead ? "&isOperatorRead=false" : "";
          const url = `/sm-pay/admin/overview/${record.advertiserId}?agentId=${record.agentId}&userId=${record.userId}${query}`;

          return (
            <div className="flex items-center justify-center gap-2">
              {!record.isOperatorRead && <Badge label="new" />}

              <LinkTextButton onClick={() => router.push(url)}>
                {text}
              </LinkTextButton>
            </div>
          );
        }
        return <span>{text}</span>;
      },
    },

    {
      title: "상태",
      dataIndex: "advertiserType",
      key: "advertiserType",
      align: "center",
      sorter: true,
      render: (status: string) => {
        return (
          <span>
            {SmPayAdvertiserStatusLabel[status as SmPayAdvertiserStatus]}
          </span>
        );
      },
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

  const tableWidthClass = useMemo(() => {
    // expanded 1440 -> 1070px
    if (state === "expanded" && width <= 1440) {
      return "max-w-[1070px]"; // 이걸로 고정
    }

    // collapsed 1440 -> 1220px
    if (state === "collapsed" && width <= 1440) {
      return "max-w-[1220px]";
    }

    return "w-full";
  }, [width, state]);

  return (
    <div className={cn(tableWidthClass, "overflow-x-auto ")}>
      <Table<SmPayAdminAuditDto>
        columns={columns}
        rowKey="id"
        dataSource={dataSource}
        loading={loadingData}
        pagination={{
          ...tableParams.pagination,
          total,
          position: ["bottomCenter"],
          showSizeChanger: true,
        }}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default TableSection;
