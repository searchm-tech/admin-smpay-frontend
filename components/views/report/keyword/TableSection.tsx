import { useMemo, useState } from "react";

import Table from "@/components/composite/table";
import CheckboxLabel from "@/components/composite/checkbox-label";

import { calcRowSpan } from "../constants";
import { columns } from "./constants";

import type { KeywordReportDto } from "@/types/dto/report";
import type { KeywordListResponse as TResult } from "@/types/api/report";
import type { TableParams } from "@/types/table";

const defaultCheckedList = columns.map((item) => item.key);

type Props = {
  isLoading: boolean;
  result?: TResult;
  tableParams: TableParams;
  setTableParams: (params: TableParams) => void;
};
const TableSection = ({
  isLoading,
  result,
  tableParams,
  setTableParams,
}: Props) => {
  const [checkedList, setCheckedList] = useState(defaultCheckedList || []);

  const rowSpanArr = useMemo(
    () => calcRowSpan<KeywordReportDto>([], "userName"),
    []
  );
  const newColumns = useMemo(
    () =>
      columns.map((item) => {
        if (item.key === "userName") {
          return {
            ...item,
            hidden: !checkedList.includes(item.key as string),
            onCell: (_: KeywordReportDto, index?: number) => ({
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

  const { summary } = result || {};

  // summary를 KeywordReportDto 형태로 변환
  const summaryRow: KeywordReportDto | undefined = summary
    ? {
        agentId: 0,
        agentName: "",
        userId: 0,
        userName: "",
        departmentId: 0,
        departmentName: "합계",
        customerId: 0,
        advertiserNickName: "",
        advertiserName: "",
        campaignType: "",
        campaignName: "",
        date: "",
        impCnt: summary.totalImpCnt ?? 0,
        clkCnt: summary.totalClkCnt ?? 0,
        ctr: summary.totalCtr ?? 0,
        salesAmt: summary.totalSalesAmt ?? 0,
        ccnt: summary.totalCcnt ?? 0,
        crto: summary.totalCrto ?? 0,
        convAmt: summary.totalConvAmt ?? 0,
        roas: summary.totalRoas ?? 0,
        cpc: summary.totalCpc ?? 0,
        adGroupName: "",
        keywordName: "",
      }
    : undefined;

  // dataSource에 summaryRow를 맨 앞에 추가
  const dataSource = summaryRow
    ? [summaryRow, ...(result?.keywordData.content || [])]
    : result?.keywordData.content || [];

  return (
    <section>
      <div className="w-full flex flex-wrap gap-4  py-4 mb-2 border-b border-[#656565]">
        {columns
          .filter((col) => col.key !== "departmentName")
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
        <Table<KeywordReportDto>
          columns={newColumns}
          dataSource={dataSource}
          pagination={{
            ...tableParams.pagination,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            total: result?.keywordData.totalCount,
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
          rowClassName={(record) =>
            record.departmentName === "합계" ? "summary-row" : ""
          }
        />
      </div>
    </section>
  );
};

export default TableSection;
