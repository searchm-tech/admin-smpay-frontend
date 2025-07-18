"use client";

import { useState } from "react";
import { format } from "date-fns";

import FilterSection from "./FilterSection";
import TableSection from "./TableSection";
import type { TableParams } from "@/types/table";
import type { DateRange } from "react-day-picker";
import { useSmPayChargeRecoveryListAgency } from "@/hooks/queries/sm-pay";
import { useUserListStore } from "@/store/useUserListStore";
import { useSession } from "next-auth/react";

const defaultTableParams = {
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
  },
};

const SMPayChargeAgencyView = () => {
  const { data: session } = useSession();
  const [tableParams, setTableParams] =
    useState<TableParams>(defaultTableParams);

  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [isNotRecovery, setIsNotRecovery] = useState<boolean>(false);
  const [advertiserId, setAdvertiserId] = useState<number>(0);

  const { data, isFetching } = useSmPayChargeRecoveryListAgency({
    page: tableParams.pagination?.current || 1,
    size: tableParams.pagination?.pageSize || 10,
    startDate: startDate ? format(startDate, "yyyy-MM-dd") : "",
    endDate: endDate ? format(endDate, "yyyy-MM-dd") : "",
    isNotRecoveryAdvertiser: isNotRecovery,
    agentUniqueCode: session?.user.uniqueCode || "",
    advertiserCustomerId: advertiserId,
  });

  const handleDate = (date: DateRange | undefined) => {
    setStartDate(date?.from);
    setEndDate(date?.to);
  };

  const handleReset = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setIsNotRecovery(false);
    setAdvertiserId(0);
  };
  const handleAdvertiserId = (advertiserIdValue: number) => {
    setAdvertiserId(advertiserIdValue);
  };

  return (
    <div>
      <FilterSection
        advertiserId={advertiserId}
        handleAdvertiserId={handleAdvertiserId}
        startDate={startDate}
        endDate={endDate}
        handleDate={handleDate}
        handleReset={handleReset}
        isNotRecovery={isNotRecovery}
        handleRecovery={() => setIsNotRecovery(!isNotRecovery)}
      />
      <TableSection
        dataSource={data?.content || []}
        tableParams={tableParams}
        total={data?.totalCount || 0}
        setTableParams={setTableParams}
        isLoading={isFetching}
      />
    </div>
  );
};

export default SMPayChargeAgencyView;
