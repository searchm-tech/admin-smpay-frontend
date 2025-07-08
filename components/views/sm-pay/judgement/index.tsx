"use client";

import { useState } from "react";

import SearchSection from "./SearchSection";
import TableSection from "./TableSection";
import GuidSection from "@/components/views/sm-pay/components/GuideSection";

import { useSmPayAuditList } from "@/hooks/queries/sm-pay";
import { defaultParams } from "./constants";

import type { SmPayAdvertiserStautsOrderType } from "@/types/smpay";
import type { TableParams } from "@/types/table";

const SmPayJudgementView = () => {
  const [search, setSearch] = useState<string>("");

  const [tableParams, setTableParams] = useState<TableParams>(defaultParams);
  console.log("tableParams", tableParams);

  const { data: smpayAduitRes, isPending: loadingData } = useSmPayAuditList({
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
        total: smpayAduitRes?.totalCount || 0,
      },
    }));
  };
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
