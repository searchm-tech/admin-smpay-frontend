"use client";

import { useState } from "react";

import TableSection from "./TableSection";
import SearchSection from "./SearchSection";
import GuidSection from "@/components/views/sm-pay/components/GuideSection";

import { defaultTableParams } from "./constants";

import type { TableParams } from "@/types/table";

import { useSmPayAdminAuditList } from "@/hooks/queries/sm-pay";
import type { SmPayAdvertiserStautsOrderType } from "@/types/smpay";

const SmPayAdminOverviewView = () => {
  const [search, setSearch] = useState<string>("");
  const [tableParams, setTableParams] =
    useState<TableParams>(defaultTableParams);

  const { data: response, isFetching: loadingData } = useSmPayAdminAuditList({
    page: tableParams.pagination?.current || 1,
    size: tableParams.pagination?.pageSize || 10,
    keyword: search,
    orderType: tableParams.sortField as SmPayAdvertiserStautsOrderType,
  });

  const handleSearch = (keyword: string) => {
    setSearch(keyword);
    setTableParams((prev) => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        current: 1,
        pageSize: 10,
        total: response?.totalCount || 0,
      },
    }));
  };

  return (
    <div>
      <GuidSection viewType="smpay-guide" />
      <SearchSection onSearch={handleSearch} />

      <div className="w-full">
        <TableSection
          tableParams={tableParams}
          setTableParams={setTableParams}
          total={response?.totalCount || 0}
          loadingData={loadingData}
          dataSource={response?.content || []}
        />
      </div>
    </div>
  );
};

export default SmPayAdminOverviewView;
