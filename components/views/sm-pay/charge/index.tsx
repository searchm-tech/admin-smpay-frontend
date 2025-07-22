"use client";

import { useState } from "react";

import { format } from "date-fns";

import { useSmPayAdminChargeRecoveryList } from "@/hooks/queries/sm-pay";

import FilterSection from "./FilterSection";
import TableSection from "./TableSection";
import type { TableParams } from "@/types/table";
import type { DateRange } from "react-day-picker";

const defaultTableParams = {
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
  },
};

const SMPayChargeView = () => {
  const [tableParams, setTableParams] =
    useState<TableParams>(defaultTableParams);

  const [selectedAgency, setSelectedAgency] = useState<string>("");
  const [selectedAdvertiser, setSelectedAdvertiser] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [isNotRecovery, setIsNotRecovery] = useState<boolean>(false);

  const { data } = useSmPayAdminChargeRecoveryList({
    page: tableParams.pagination?.current || 1,
    size: tableParams.pagination?.pageSize || 10,
    agentUniqueCode: selectedAgency,
    advertiserCustomerId: Number(selectedAdvertiser),
    startDate: startDate ? format(startDate, "yyyy-MM-dd") : "",
    endDate: endDate ? format(endDate, "yyyy-MM-dd") : "",
    isNotRecoveryAdvertiser: isNotRecovery,
  });

  const handleSelectAgency = (value: string) => {
    setSelectedAgency(value);
    setSelectedAdvertiser("");
  };

  const handleSelectAdvertiser = (value: string) => {
    setSelectedAdvertiser(value);
    setSelectedAgency("");
  };

  const handleDate = (date: DateRange | undefined) => {
    setStartDate(date?.from);
    setEndDate(date?.to);
  };

  const handleReset = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setSelectedAgency("");
    setSelectedAdvertiser("");
    setIsNotRecovery(false);
  };

  return (
    <div>
      <FilterSection
        startDate={startDate}
        endDate={endDate}
        handleDate={handleDate}
        selectedAgency={selectedAgency}
        selectedAdvertiser={selectedAdvertiser}
        handleSelectAgency={handleSelectAgency}
        handleSelectAdvertiser={handleSelectAdvertiser}
        handleReset={handleReset}
        isNotRecovery={isNotRecovery}
        handleRecovery={() => setIsNotRecovery(!isNotRecovery)}
      />
      <TableSection
        dataSource={data?.content || []}
        tableParams={tableParams}
        setTableParams={setTableParams}
      />
    </div>
  );
};

export default SMPayChargeView;
