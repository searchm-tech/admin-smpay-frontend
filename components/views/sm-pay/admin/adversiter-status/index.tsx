"use client";

import GuidSection from "@/components/views/sm-pay/components/GuideSection";
import TableSection from "./TableSection";

import { useState } from "react";

import type { TableParams } from "@/types/table";
import type { SmPayAdvertiserStautsOrderType } from "@/types/smpay";
import { defaultTableParams } from "@/constants/table";
import { useSmPayAdminOverviewStatusList } from "@/hooks/queries/sm-pay";
import FilterSection from "./FilterSection";

const SmPayAdminAdversiterStatusView = () => {
  const [tableParams, setTableParams] =
    useState<TableParams>(defaultTableParams);
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  const [selectedAgency, setSelectedAgency] = useState<string>("");
  const [selectedAdvertiser, setSelectedAdvertiser] = useState<string>("");

  const { data: advertiserList, isLoading } = useSmPayAdminOverviewStatusList({
    page: tableParams.pagination?.current || 1,
    size: tableParams.pagination?.pageSize || 10,
    keyword: "",
    orderType: tableParams.sortField as SmPayAdvertiserStautsOrderType,
    agentId: selectedAgency,
    advertiserId: selectedAdvertiser,
  });

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setTableParams((prev) => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        current: 1,
        pageSize: 10,
        total: advertiserList?.totalCount || 0,
      },
    }));
  };

  const handleReset = () => {
    setSelectedAgency("");
    setSelectedAdvertiser("");
  };

  const handleSelectAgency = (value: string) => {
    setSelectedAgency(value);
    setSelectedAdvertiser("");
  };
  const handleSelectAdvertiser = (value: string) => {
    setSelectedAdvertiser(value);
    setSelectedAgency("");
  };

  return (
    <div>
      <GuidSection viewType="smpay-guide" />
      <FilterSection
        selectedStatus={selectedStatus}
        onStatusChange={handleStatusChange}
      />
      <TableSection
        selectedAgency={selectedAgency}
        selectedAdvertiser={selectedAdvertiser}
        handleSelectAgency={handleSelectAgency}
        handleSelectAdvertiser={handleSelectAdvertiser}
        handleReset={handleReset}
        tableParams={tableParams}
        setTableParams={setTableParams}
        total={advertiserList?.totalCount || 0}
        loadingData={isLoading}
        dataSource={advertiserList?.content || []}
      />
    </div>
  );
};

export default SmPayAdminAdversiterStatusView;
