import type { ColumnsType } from "@/types/table";
import type { AdGroupReportDto } from "@/types/dto/report";
import { formatOnlyDate } from "../constants";

export const columns: ColumnsType<AdGroupReportDto> = [
  // {
  //   key: "agentName",
  //   title: "대행사",
  //   dataIndex: "agentName",
  //   align: "center",
  //   hidden: true,
  // },
  {
    key: "departmentName",
    title: "부서",
    dataIndex: "departmentName",
    align: "center",
  },
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
    render: (value) => (value ? value : ""),
  },
  // {
  //   key: "advertiserNickName",
  //   title: "광고주 닉네임",
  //   dataIndex: "advertiserNickName",
  //   align: "center",
  // },
  {
    key: "advertiserName",
    title: "광고주",
    dataIndex: "advertiserName",
    align: "center",
  },
  {
    key: "campaignType",
    title: "캠페인유형",
    dataIndex: "campaignType",
    align: "center",
    render: (value: string) => {
      if (value === "WEB_SITE") return "웹사이트";
      if (value === "SHOPPING") return "쇼핑";
      if (value === "POWER_CONTENTS") return "파워컨텐츠";
      if (value === "BRAND_SEARCH") return "브랜드검색";
      if (value === "PLACE") return "장소";
      return value;
    },
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
    render: (value) => (value ? formatOnlyDate(value) : ""),
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
    render: (value) => {
      if (!value) return "0원";
      return value.toLocaleString() + "원";
    },
  },
  {
    key: "cpc",
    title: "CPC",
    dataIndex: "cpc",
    align: "center",
    render: (value) => {
      if (!value) return "0원";
      return value.toLocaleString() + "원";
    },
  },
  {
    key: "salesAmt",
    title: "광고비",
    dataIndex: "salesAmt",
    align: "center",
    render: (value) => {
      if (!value) return "0원";
      return value.toLocaleString() + "원";
    },
  },
  {
    key: "ccnt",
    title: "전환수",
    dataIndex: "ccnt",
    align: "center",
    render: (value) => value?.toLocaleString() ?? "0",
  },
  {
    key: "crto",
    title: "전환율",
    dataIndex: "crto",
    align: "center",
    render: (value) => {
      if (!value) return "0원";
      return value.toLocaleString() + "원";
    },
  },
  {
    key: "convAmt",
    title: "전환매출액",
    dataIndex: "convAmt",
    align: "center",
    render: (value) => {
      if (!value) return "0원";
      return value.toLocaleString() + "원";
    },
  },
  {
    key: "roas",
    title: "ROAS",
    dataIndex: "roas",
    align: "center",
    render: (value) => (value ? `${value.toLocaleString()}%` : "0%"),
  },
];
