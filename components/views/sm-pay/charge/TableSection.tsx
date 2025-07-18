import { useMemo, useState } from "react";

import Table from "@/components/composite/table";
import CheckboxLabel from "@/components/composite/checkbox-label";

import { columns } from "./constants";
import { calcRowSpan } from "@/utils/format";
import type { SmPayChargeRecoveryDto } from "@/types/dto/smpay";
import type { TableParams } from "@/types/table";

const defaultCheckedList = columns.map((item) => item.key);

type Props = {
  dataSource: SmPayChargeRecoveryDto[];
  total: number;
  tableParams: TableParams;
  setTableParams: (params: TableParams) => void;
  isLoading: boolean;
};
const TableSection = ({
  dataSource,
  total,
  tableParams,
  setTableParams,
  isLoading,
}: Props) => {
  const [checkedList, setCheckedList] = useState(defaultCheckedList || []);

  const rowSpanArr = useMemo(
    () =>
      dataSource.length > 0
        ? calcRowSpan<SmPayChargeRecoveryDto>(dataSource, "agencyName")
        : [],
    [dataSource]
  );

  const newColumns = useMemo(
    () =>
      columns.map((item) => {
        if (item.key === "agencyName") {
          return {
            ...item,
            hidden: !checkedList.includes(item.key as string),
            onCell: (_: SmPayChargeRecoveryDto, index?: number) => ({
              rowSpan: typeof index === "number" ? rowSpanArr[index] : 1,
            }),
          };
        }
        return {
          ...item,
          hidden: !checkedList.includes(item.key as string),
        };
      }),
    [checkedList, rowSpanArr]
  );

  return (
    <section>
      <div className="w-full flex flex-wrap gap-4  py-4 mb-2 border-b border-[#656565]">
        {columns
          .filter((col) => col.key !== "situation")
          .map((item) => (
            <CheckboxLabel
              key={item.key}
              isChecked={checkedList.includes(item.key as string)}
              onChange={(checked) => {
                setCheckedList((prev) =>
                  checked
                    ? [...prev, item.key as string]
                    : prev.filter((key) => key !== item.key)
                );
              }}
              label={item.title as string}
            />
          ))}
      </div>

      <div className="overflow-x-auto">
        <Table<SmPayChargeRecoveryDto>
          columns={newColumns}
          dataSource={dataSource}
          total={total}
          pagination={{
            ...tableParams.pagination,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            onChange: (page: number, pageSize?: number) => {
              setTableParams({
                ...tableParams,
                pagination: {
                  ...tableParams.pagination,
                  current: page,
                  pageSize: pageSize ?? tableParams.pagination?.pageSize ?? 10,
                },
              });
            },
          }}
          scroll={{ x: 2000 }}
          loading={isLoading}
        />
      </div>
    </section>
  );
};

export default TableSection;
