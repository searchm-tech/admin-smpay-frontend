"use client";

import { useRouter } from "next/navigation";
import { useState, type KeyboardEvent } from "react";

import { SearchBox } from "@/components/common/Box";
import { Button } from "@/components/ui/button";
import { Radio } from "@/components/composite/radio-component";
import Table from "@/components/composite/table";
import { SearchInput } from "@/components/composite/input-components";
import { LabelBullet } from "@/components/composite/label-bullet";
import { ConfirmDialog } from "@/components/composite/modal-components";

import ModalEdit from "./ModalEdit";
import ModalCreate from "./ModalCreate";

import { ColumnTooltip } from "@/constants/table";
import { ADVERTISER_STATUS_MAP } from "@/constants/status";
import { useSmPayAdvertiserApplyList } from "@/hooks/queries/sm-pay";

import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/format";

import type { TableParams, TableProps, FilterValue } from "@/types/table";
import type { SmPayAdvertiserStatus } from "@/types/smpay";
import type { AdvertiserOrderType } from "@/types/adveriser";
import type { SmPayAdvertiserApplyDto as TAdvertiser } from "@/types/dto/smpay";
import { type ModalInfo, defaultTable } from "./constants";

const ViewList = () => {
  const router = useRouter();
  const [search, setSearch] = useState<string>("");
  const [keyword, setKeyword] = useState<string>("");
  const [tableParams, setTableParams] = useState<TableParams>(defaultTable);

  const [selected, setSelected] = useState<number | null>(null);
  const [modalInfo, setModalInfo] = useState<ModalInfo | null>(null);

  const [isError, setIsError] = useState(false);

  const {
    data: advertiserApplyRes,
    isPending,
    refetch,
  } = useSmPayAdvertiserApplyList({
    page: tableParams.pagination?.current || 1,
    size: tableParams.pagination?.pageSize || 10,
    orderType: tableParams.sortField as SmPayAdvertiserStatus,
    keyword,
  });

  const columns: TableProps<TAdvertiser>["columns"] = [
    {
      title: "CUSTOMER ID",
      dataIndex: "advertiserCustomerId",
      align: "center",
      sorter: true,
    },
    {
      title: "로그인 ID",
      dataIndex: "advertiserLoginId",
      align: "center",
      sorter: true,
    },
    {
      title: "광고주 닉네임",
      dataIndex: "advertiserNickName",
      align: "center",
      sorter: true,
    },
    {
      title: "광고주명",
      dataIndex: "advertiserName",
      align: "center",
      sorter: true,
      render: (value) => value || "-",
    },
    {
      title: ColumnTooltip.info_change,
      dataIndex: "info_change",
      align: "center",
      sorter: true,
      render: (_, record) => {
        if (!record.advertiserName) {
          return (
            <Button
              onClick={() => {
                setModalInfo({
                  type: "create",
                  advertiserId: record.advertiserId,
                });
              }}
            >
              정보 등록
            </Button>
          );
        }
        return (
          <Button
            variant="cancel"
            onClick={() => {
              setModalInfo({ type: "edit", advertiserId: record.advertiserId });
            }}
          >
            정보 변경
          </Button>
        );
      },
    },
    {
      title: ColumnTooltip.status,
      dataIndex: "advertiserType",
      align: "center",
      render: (type: SmPayAdvertiserStatus) => {
        return ADVERTISER_STATUS_MAP[type as SmPayAdvertiserStatus];
      },
      sorter: true,
    },
    {
      title: "최종 수정 일시",
      dataIndex: "registerOrUpdateDt",
      align: "center",
      sorter: true,
      render: (value) => formatDate(value),
    },
  ];

  const handleSearch = () => {
    setKeyword(search);
    setSelected(null);
    setTableParams((prev) => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        current: 1,
        pageSize: 10,
        total: 0,
      },
    }));
  };

  const handleTableChange: TableProps<TAdvertiser>["onChange"] = (
    pagination,
    filters,
    sorter
  ) => {
    let sortField: AdvertiserOrderType = "ADVERTISER_REGISTER_DESC"; // 기본값

    if (sorter && !Array.isArray(sorter) && sorter.field && sorter.order) {
      const field = sorter.field as string;
      const order = sorter.order === "ascend" ? "ASC" : "DESC";

      // field 이름을 API에서 요구하는 형식으로 변환
      const fieldMap: Record<string, string> = {
        advertiserId: "ADVERTISER_ID",
        advertiserLoginId: "ADVERTISER_LOGIN_ID",
        advertiserNickName: "ADVERTISER_NICKNAME",
        advertiserName: "ADVERTISER_NAME",
        advertiserType: "ADVERTISER_TYPE",
        registerOrUpdateDt: "ADVERTISER_REGISTER_TIME",
      };

      const mappedField = fieldMap[field];

      if (mappedField) {
        sortField = `${mappedField}_${order}` as AdvertiserOrderType;
      }
    }

    setTableParams({
      pagination: {
        current: pagination.current ?? 1,
        pageSize: pagination.pageSize ?? 10,
      },
      filters: filters as Record<string, FilterValue>,
      keyword: tableParams.keyword, // 기존 keyword 유지
      sortOrder: undefined, // TAgencyOrder를 사용하므로 불필요
      sortField: sortField,
    });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleWrite = () => {
    if (!selected) {
      return;
    }

    const findAdvertiser = advertiserApplyRes?.content.find(
      (item) => item.advertiserId === selected
    );

    if (findAdvertiser && !findAdvertiser.advertiserName) {
      setIsError(true);
      return;
    }
    router.push(
      `/sm-pay/management/apply-write/${findAdvertiser?.advertiserId}`
    );
  };

  const handleConfrimModal = async () => {
    setModalInfo(null);
    await refetch();
  };

  return (
    <section>
      {isError && (
        <ConfirmDialog
          open
          content="광고주 정보를 등록해주세요."
          onClose={() => setIsError(false)}
          onConfirm={() => setIsError(false)}
        />
      )}
      {modalInfo?.type === "edit" && (
        <ModalEdit
          refetch={refetch}
          onConfirm={handleConfrimModal}
          onClose={() => setModalInfo(null)}
          advertiserId={modalInfo.advertiserId}
        />
      )}
      {modalInfo?.type === "create" && (
        <ModalCreate
          refetch={refetch}
          onConfirm={handleConfrimModal}
          onClose={() => setModalInfo(null)}
          advertiserId={modalInfo.advertiserId}
        />
      )}
      <div>
        <LabelBullet labelClassName="text-base font-bold">
          광고주 검색
        </LabelBullet>
        <SearchBox className="gap-2">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="광고주명, CUSTOMER ID, 로그인 ID로 검색"
            className="w-[425px]"
          />
          <Button onClick={handleSearch}>검색</Button>
        </SearchBox>
      </div>

      <div className="mt-4">
        <LabelBullet labelClassName="text-base font-bold">
          광고주 등록
        </LabelBullet>
        <Table<TAdvertiser>
          rowKey={(record) => record.advertiserId}
          columns={columns}
          dataSource={advertiserApplyRes?.content ?? []}
          pagination={{
            current: tableParams.pagination?.current || 1,
            pageSize: tableParams.pagination?.pageSize || 10,
            total: advertiserApplyRes?.totalCount ?? 0,
          }}
          loading={isPending}
          onChange={handleTableChange}
          onRow={(record) => ({
            onClick: () => {
              if (!isRowDisabled(record)) {
                setSelected(record.advertiserId);
              }
            },
          })}
          rowSelection={{
            type: "radio",
            columnWidth: 50,
            columnTitle: "No",
            onChange: (selected) => setSelected(selected[0] as number),
            getCheckboxProps: (record) => ({
              disabled: isRowDisabled(record),
            }),

            renderCell: (_, record) => {
              return (
                <Radio
                  checked={selected === record.advertiserId}
                  disabled={isRowDisabled(record)}
                  onClick={() => setSelected(record.advertiserId)}
                />
              );
            },
          }}
          rowClassName={(record) =>
            cn(
              isRowDisabled(record)
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            )
          }
        />
      </div>

      <div className="flex justify-center gap-4 py-5">
        <Button
          className="w-[150px]"
          disabled={!selected}
          onClick={handleWrite}
        >
          신청
        </Button>
        <Button
          variant="cancel"
          className="w-[150px]"
          onClick={() => router.push("/sm-pay/management")}
        >
          취소
        </Button>
      </div>
    </section>
  );
};

export default ViewList;

const isRowDisabled = (record: TAdvertiser) => {
  return record.advertiserType !== "APPLICABLE";
};
