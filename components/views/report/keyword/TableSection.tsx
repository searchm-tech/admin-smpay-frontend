import { useMemo, useState } from "react";
import { SquareCheckBig, SquareX, TriangleAlert } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import Table from "@/components/composite/table";
import CheckboxLabel from "@/components/composite/checkbox-label";

import { useSidebar } from "@/components/ui/sidebar";
import { useWindowSize } from "@/hooks/useWindowSize";
import { cn } from "@/lib/utils";

import { calcRowSpan, type ChargeTableRow } from "./constants";
import type { ColumnsType } from "antd/es/table";

export const columns: ColumnsType<ChargeTableRow> = [
  {
    key: "userName",
    title: "담당자",
    dataIndex: "userName",
    align: "center",
  },
  {
    key: "customerId",
    title: "CUSTOMER ID",
    dataIndex: "customerId",
    align: "center",
  },
  {
    key: "advertiserName",
    title: "광고주",
    dataIndex: "advertiserName",
    align: "center",
  },
  {
    key: "campaignType",
    title: "캠페인 유형",
    dataIndex: "campaignType",
    align: "center",
  },
  {
    key: "campaignName",
    title: "캠페인",
    dataIndex: "campaignName",
    align: "center",
  },
  {
    key: "adGroupName",
    title: "광고그룹",
    dataIndex: "adGroupName",
    align: "center",
  },
  {
    key: "date",
    title: "날짜",
    dataIndex: "date",
    align: "center",
    render: (value) => (value ? format(new Date(value), "yyyy-MM-dd") : ""),
  },
  {
    key: "impCnt",
    title: "노출수",
    dataIndex: "impCnt",
    align: "center",
    render: (value) => value?.toLocaleString() ?? "",
  },
  {
    key: "clkCnt",
    title: "클릭수",
    dataIndex: "clkCnt",
    align: "center",
    render: (value) => value?.toLocaleString() ?? "",
  },
  {
    key: "ctr",
    title: "CTR",
    dataIndex: "ctr",
    align: "center",
    render: (value) =>
      value !== undefined ? `${(value * 100).toFixed(2)}%` : "",
  },
  {
    key: "cpc",
    title: "CPC",
    dataIndex: "salesAmt",
    align: "center",
    render: (value, row) => {
      // CPC = 광고비 / 클릭수
      if (row.clkCnt && row.salesAmt !== undefined) {
        return (row.salesAmt / row.clkCnt).toLocaleString(undefined, {
          maximumFractionDigits: 2,
        });
      }
      return "-";
    },
  },
  {
    key: "salesAmt",
    title: "광고비",
    dataIndex: "salesAmt",
    align: "center",
    render: (value) => value?.toLocaleString() ?? "",
  },
  {
    key: "ccnt",
    title: "전환수",
    dataIndex: "ccnt",
    align: "center",
    render: (value) => value?.toLocaleString() ?? "",
  },
  {
    key: "crto",
    title: "전환율",
    dataIndex: "crto",
    align: "center",
    render: (value) =>
      value !== undefined ? `${(value * 100).toFixed(2)}%` : "",
  },
  {
    key: "convAmt",
    title: "전환매출액",
    dataIndex: "convAmt",
    align: "center",
    render: (value) => value?.toLocaleString() ?? "",
  },
  {
    key: "roas",
    title: "ROAS",
    dataIndex: "roas",
    align: "center",
    render: (value) =>
      value !== undefined ? `${value.toLocaleString()}%` : "",
  },
];

const defaultCheckedList = columns.map((item) => item.key);

const TableSection = () => {
  const { width } = useWindowSize();
  const { state } = useSidebar();

  const [checkedList, setCheckedList] = useState(defaultCheckedList || []);

  const rowSpanArr = useMemo(
    () => calcRowSpan<ChargeTableRow>([], "userName"),
    []
  );

  const newColumns = useMemo(
    () =>
      columns.map((item) => {
        if (item.key === "userName") {
          return {
            ...item,
            hidden: !checkedList.includes(item.key as string),
            onCell: (_: ChargeTableRow, index?: number) => ({
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

  const tableWidthClass = useMemo(() => {
    // expanded 1440 -> 1160px
    if (state === "expanded" && width <= 1440) {
      return "max-w-[1200px]";
    }

    // collapsed 1440 -> 1330px
    if (state === "collapsed" && width <= 1440) {
      return "max-w-[1360px]";
    }

    return "w-full";
  }, [width, state]);

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

      <div className={cn(tableWidthClass, "overflow-x-auto ")}>
        <Table<ChargeTableRow>
          columns={newColumns}
          dataSource={[]} // TODO: 실제 데이터로 교체 필요
          total={0}
          scroll={{ x: 2000 }}
        />
      </div>
    </section>
  );
};

export default TableSection;
