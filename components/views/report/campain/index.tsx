"use client";

import { useEffect, useState } from "react";
import FilterSection from "./FilterSection";
import TableSection from "./TableSection";
import { TableParams } from "@/types/table";
import { useCampaignReport } from "@/hooks/queries/report";
import { DateRange } from "react-day-picker";
import { formatDate } from "../ad-group/constants";
import { useUserListStore } from "@/store/useUserListStore";

const defaultTableParams: TableParams = {
  pagination: {
    current: 1,
    pageSize: 10,
  },
  keyword: "",
};

const ReportCampaignView = () => {
  const { clear } = useUserListStore();

  const [tableParams, setTableParams] =
    useState<TableParams>(defaultTableParams);

  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [advertiserIds, setAdvertiserIds] = useState<number[]>([]);

  const {
    data: response,
    isFetching: isLoading,
    isFetched,
  } = useCampaignReport({
    page: tableParams.pagination?.current || 1,
    size: tableParams.pagination?.pageSize || 10,
    keyword: tableParams.keyword || "",
    advertiserIds: advertiserIds,
    startDate: startDate ? formatDate(startDate) : "",
    endDate: endDate ? formatDate(endDate) : "",
  });

  const handleDate = (date: DateRange | undefined) => {
    setStartDate(date?.from);
    setEndDate(date?.to);
  };

  const handleReset = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setAdvertiserIds([]);
  };

  const handleAdvertiserIds = (advertiserIds: number[]) => {
    setAdvertiserIds(advertiserIds);
  };

  useEffect(() => {
    return () => {
      clear();
    };
  }, [clear]);

  const loading = isLoading || !isFetched;
  return (
    <div>
      <FilterSection
        startDate={startDate as Date}
        endDate={endDate as Date}
        handleDate={handleDate}
        handleReset={handleReset}
        handleAdvertiserIds={handleAdvertiserIds}
        advertiserIds={advertiserIds}
      />
      <TableSection result={response} isLoading={loading} />
    </div>
  );
};

export default ReportCampaignView;
