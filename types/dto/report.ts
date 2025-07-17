export interface ReportDto {
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
  cpc: number; // CPC (ex: 1000)
}

export interface Summary {
  totalImpCnt: number;
  totalClkCnt: number;
  totalCtr: number;
  totalSalesAmt: number;
  totalCcnt: number;
  totalCrto: number;
  totalConvAmt: number;
  totalRoas: number;
  totalCpc: number;
}

export type CampaignData = {
  content: ReportDto[];
  page: number;
  size: number;
  totalCount: number;
};

export interface AdGroupData {
  content: AdGroupReportDto[];
  page: number;
  size: number;
  totalCount: number;
}

export interface AdGroupReportDto extends ReportDto {
  adGroupName: string;
}

export interface KeywordData {
  content: KeywordReportDto[];
  page: number;
  size: number;
  totalCount: number;
}

export interface KeywordReportDto extends ReportDto {
  adGroupName: string;
  keywordName: string;
}
