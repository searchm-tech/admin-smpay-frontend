"use client";

import { useState } from "react";

import SearchSection from "./SearchSection";

import TableSection from "./TableSection";
import GuidSection from "../components/GuideSection";

import {
  useSmPayAuditList,
  useSmPayJudgementData,
} from "@/hooks/queries/sm-pay";
import type { TableProps } from "antd";
import type { SmPayJudgementData } from "@/types/sm-pay";
import { TableParams } from "@/types/table";
import { SmPayAdvertiserStautsOrderType } from "@/types/smpay";

const defaultTableParams = {
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
  },
  filters: {},
  sortField: "ADVERTISER_CUSTOMER_ID_DESC",
};

// TODO : 다른 동일하게 tableParam으로 변경 필요
const SmPayJudgementView = () => {
  const [search, setSearch] = useState<string>("");

  const [tableParams, setTableParams] =
    useState<TableParams>(defaultTableParams);

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [sortField, setSortField] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"ascend" | "descend" | undefined>(
    undefined
  );

  const { data: smpayAduitRes, isPending: loadingData } = useSmPayAuditList({
    page: tableParams.pagination?.current || 1,
    size: tableParams.pagination?.pageSize || 10,
    keyword: search,
    orderType: tableParams.sortField as SmPayAdvertiserStautsOrderType,
  });

  const handleSearch = (text: string) => {
    setSearch(text);
    setPage(1);
    setPageSize(10);
    setSortField("");
    setSortOrder(undefined);
  };

  const handleStatusChange = (status: string) => {
    setTableParams((prev) => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        current: 1,
        pageSize: 10,
        total: smpayAduitRes?.totalCount || 0,
      },
    }));
  };

  const { data: judgementData, isPending: loadingTable } =
    useSmPayJudgementData({
      pagination: { current: page, pageSize },
      sort:
        sortField && sortOrder
          ? { field: sortField, order: sortOrder }
          : undefined,
      filters: {
        search: search ? [search] : [""],
      },
    });

  return (
    <div className="flex flex-col gap-4">
      <GuidSection viewType="smpay-guide" />
      <SearchSection onSearch={handleSearch} />

      <TableSection
        tableParams={tableParams}
        setTableParams={setTableParams}
        total={smpayAduitRes?.totalCount || 0}
        loadingData={loadingData}
        dataSource={smpayAduitRes?.content || []}
      />
    </div>
  );
};

export default SmPayJudgementView;
