"use client";

import GuidSection from "@/components/views/sm-pay/components/GuideSection";
import TableSection from "./TableSection";

import { useState } from "react";

import type { TableParams } from "@/types/table";
import { defaultTableParams } from "@/constants/table";

const SmPayAdminAdversiterStatusView = () => {
  const [tableParams, setTableParams] =
    useState<TableParams>(defaultTableParams);
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
  };

  return (
    <div>
      <GuidSection viewType="smpay-guide" />
      {/* <TableSection
        tableParams={tableParams}
        setTableParams={setTableParams}
        total={response?.total || 0}
        loadingData={loadingData}
        smpayList={response?.data || []}
        handleStatusChange={handleStatusChange}
        selectedStatus={selectedStatus}
      /> */}
    </div>
  );
};

export default SmPayAdminAdversiterStatusView;
