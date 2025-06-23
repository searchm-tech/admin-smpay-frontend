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

import EditModal from "./EditModal";
import CreateModal from "./RegisterModal";

import { ColumnTooltip } from "@/constants/table";
import { ADVERTISER_STATUS_MAP } from "@/constants/status";
import { useSmPayAdvertiserApplyList } from "@/hooks/queries/sm-pay";

import { cn } from "@/lib/utils";

import type { TableProps } from "antd";
import type { TableParams } from "@/types/table";
import type {
  SmPayAdvertiserStatus,
  SmPayAdvertiserApplyDto as TAdvertiser,
} from "@/types/smpay";

const defaultTable = {
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
  },
  sortField: "ADVERTISER_REGISTER_DESC",
};

const ViewList = () => {
  const router = useRouter();
  const [search, setSearch] = useState<string>("");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [tableParams, setTableParams] = useState<TableParams>(defaultTable);

  const [selected, setSelected] = useState<number | null>(null);
  const [editData, setEditData] = useState<TAdvertiser | null>(null);
  const [registData, setRegistData] = useState<TAdvertiser | null>(null);
  const [isError, setIsError] = useState(false);

  const { data: advertiserApplyRes } = useSmPayAdvertiserApplyList({
    page: tableParams.pagination?.current || 1,
    size: tableParams.pagination?.pageSize || 10,
    keyword: searchKeyword,
    orderType: tableParams.sortField as SmPayAdvertiserStatus,
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
            <Button onClick={() => setRegistData(record)}>정보 등록</Button>
          );
        }
        return (
          <Button variant="cancel" onClick={() => setEditData(record)}>
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
    },
  ];

  const handleSearch = () => {
    setSearchKeyword(search);
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
      {editData && (
        <EditModal
          onClose={() => setEditData(null)}
          advertiserId={editData.advertiserId}
        />
      )}
      {registData && (
        <CreateModal
          onClose={() => setRegistData(null)}
          onConfirm={() => {
            setRegistData(null);
            handleSearch();
          }}
          advertiserId={registData.advertiserId}
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
          total={advertiserApplyRes?.totalCount ?? 0}
          loading={false}
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
            cn(isRowDisabled(record) && "opacity-50 cursor-not-allowed")
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
