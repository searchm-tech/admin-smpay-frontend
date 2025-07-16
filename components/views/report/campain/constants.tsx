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
  agentId: number; // 대행사 ID
  agentName: string; // 대행사 이름
  userId: number; // 유저 ID
  userName: string; // 유저 이름
  departmentId: number; // 부서 ID
  departmentName: string; // 부서 이름
  customerId: number; // 광고주(고객) ID
  advertiserNickName: string; // 광고주 닉네임
  advertiserName: string; // 광고주명
  campaignType: string; // 캠페인 유형 (예: 'BRAND_SEARCH')
  campaignName: string; // 캠페인명
  date: string; // 날짜 (예: '2025-07-16')
  impCnt: number; // 노출수
  clkCnt: number; // 클릭수
  ctr: number; // CTR (ex: 0.034)
  salesAmt: number; // 광고비
  ccnt: number; // 전환수
  crto: number; // 전환율 (ex: 0.12)
  convAmt: number; // 전환매출액
  roas: number; // ROAS (ex: 400)
}
