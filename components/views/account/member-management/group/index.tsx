"use client";

import { useState } from "react";

import SearchSection from "../SearchSection";
import TableSection from "./TableSection";

import { defaultTableParams } from "../constant";
import { useQueryGroupUserList } from "@/hooks/queries/user";

import type { TableParams } from "@/types/table";
import type { ViewProps } from "..";
import type { AgencyUsersOrder } from "@/types/api/user";

const GroupMemberManagementView = ({ user }: ViewProps) => {
  const [search, setSearch] = useState<string>("");
  const [tableParams, setTableParams] =
    useState<TableParams>(defaultTableParams);

  const {
    data: dataSource,
    isPending,
    refetch,
  } = useQueryGroupUserList({
    page: tableParams.pagination?.current || 1,
    size: tableParams.pagination?.pageSize || 10,
    keyword: search,
    orderType: tableParams.sortField as AgencyUsersOrder,
    agentId: user.agentId,
    userId: user.userId,
  });

  const onSearch = (keyword: string) => {
    setSearch(keyword);
    setTableParams((prev) => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        current: 1,
        pageSize: 10,
        total: dataSource?.totalCount || 0,
      },
    }));
  };

  return (
    <div className="flex flex-col gap-4">
      <SearchSection onSearch={onSearch} />
      <TableSection
        user={user}
        dataSource={dataSource?.content || []}
        isLoading={isPending}
        tableParams={tableParams}
        setTableParams={setTableParams}
        refetch={refetch}
        totalCount={dataSource?.totalCount || 0}
      />
    </div>
  );
};

export default GroupMemberManagementView;
