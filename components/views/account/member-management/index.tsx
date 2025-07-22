"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

import SearchSection from "./SearchSection";
import TableSection from "./TableSection";

import { useQueryAdminAgencyUsersList } from "@/hooks/queries/user";

import { defaultTableParams, type TableParamsMember } from "./constant";

import type { AgencyUsersOrder } from "@/types/api/user";

const AdminMemberManagementView = () => {
  const { data: session } = useSession();
  const [search, setSearch] = useState<string>("");
  const [tableParams, setTableParams] =
    useState<TableParamsMember>(defaultTableParams);

  const {
    data: dataSource,
    isPending,
    refetch,
  } = useQueryAdminAgencyUsersList({
    page: tableParams.pagination?.current || 1,
    size: tableParams.pagination?.pageSize || 10,
    keyword: search,
    orderType: tableParams.sortField as AgencyUsersOrder,
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

  if (!session?.user) return null;

  return (
    <div className="flex flex-col gap-4">
      <SearchSection onSearch={onSearch} />
      <TableSection
        user={session.user}
        dataSource={dataSource?.content || []}
        isLoading={isPending}
        setTableParams={setTableParams}
        refetch={refetch}
        totalCount={dataSource?.totalCount || 0}
      />
    </div>
  );
};

export default AdminMemberManagementView;
