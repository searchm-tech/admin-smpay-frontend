export interface TransactionData {
  id: string;
  key: string;
  agency: string;
  group: string;
  advertiser: string;
  date: string;
  txId: string;
  txType: string;
  bank: string;
  account: string;
  depositor: string;
  amount: number;
  diffAmount: number;
  diffRate: number;
  repaymentStatus: "success" | "failed";
  repaymentDate: string | null;
}

export const MOCK_DATA: TransactionData[] = Array.from(
  { length: 30 },
  (_, i) => ({
    id: (i + 1).toString(), // Add this line
    key: (i + 1).toString(),
    agency: "대행사명",
    group: "그룹원명",
    advertiser: `광고주명${Math.floor(i / 5) + 1}`,
    date: "2025-03-19 00:35:02",
    txId: "12345678",
    txType: i % 2 === 0 ? "충전" : "회수",
    bank: "우리은행",
    account: "1002-02-123456",
    depositor: "주식회사 써치엠",
    amount: 100000,
    diffAmount: i % 2 === 0 ? 10000 : -5000,
    diffRate: i % 2 === 0 ? 10 : -5,
    diffDate: "2025-03-19 00:35:02",
    repaymentStatus: i % 2 === 0 ? "success" : "failed",
    repaymentDate: i % 2 === 0 ? "2025-03-19 00:35:02" : null,
  })
);

export interface ChargeData {
  manager: string;
  customer: string;
  advertiser: string;
  date: string;
  dealNo: string;
  dealType: string;
  bank: string;
  accountNumber: string;
}

// 테이블 컬럼 타입
export interface ChargeTableRow {
  agentId: number;
  agentName: string;
  userId: number;
  userName: string;
  departmentId: number;
  departmentName: string;
  customerId: number;
  advertiserNickName: string;
  advertiserName: string;
  campaignType: string;
  campaignName: string;
  adGroupName: string;
  date: string;
  impCnt: number;
  clkCnt: number;
  ctr: number;
  salesAmt: number;
  ccnt: number;
  crto: number;
  convAmt: number;
  roas: number;
}

const test = {
  result: {
    adGroupData: {
      content: [
        {
          agentId: 1,
          agentName: "대행사 이름",
          userId: 1,
          userName: "유저 이름",
          departmentId: 1,
          departmentName: "부서 이름",
          customerId: 1,
          advertiserNickName: "광고주 닉네임",
          advertiserName: "광고주명",
          campaignType: "BRAND_SEARCH",
          campaignName: "캠페인명",
          adGroupName: "광고그룹 명",
          date: "2025-07-16",
          impCnt: 1,
          clkCnt: 1,
          ctr: 1.0,
          salesAmt: 1,
          ccnt: 1,
          crto: 1.0,
          convAmt: 1,
          roas: 1.0,
        },
      ],
      page: 1,
      size: 10,
      totalCount: 1,
    },
    summary: {
      totalImpCnt: 1,
      totalClkCnt: 1,
      totalCtr: 1.0,
      totalSalesAmt: 1,
      totalCcnt: 1,
      totalCrto: 1.0,
      totalConvAmt: 1,
      totalRoas: 1.0,
    },
  },
  code: "0",
  message: "요청이 성공적으로 완료되었습니다.",
};

export function calcRowSpan<T>(data: T[], key: keyof T): number[] {
  const rowSpanArr = Array(data.length).fill(1);
  let prevValue: any = null;
  let startIdx = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i][key] !== prevValue) {
      if (i - startIdx > 1) {
        rowSpanArr[startIdx] = i - startIdx;
        for (let j = startIdx + 1; j < i; j++) {
          rowSpanArr[j] = 0;
        }
      }
      prevValue = data[i][key];
      startIdx = i;
    }
  }
  if (data.length - startIdx > 1) {
    rowSpanArr[startIdx] = data.length - startIdx;
    for (let j = startIdx + 1; j < data.length; j++) {
      rowSpanArr[j] = 0;
    }
  }
  return rowSpanArr;
}
