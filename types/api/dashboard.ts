import {
  AdvertiserRecommendListDto,
  ChargeRecoveryResultDto,
  ChartAdvertiserDto,
} from "../dto/dashboard";

// 대시보드 전체 광고주 현황 조회(SAG042), 전체 운영중 광고주 현황 조회(SAG043) response
export type ResponseDashboardAdvertiserStatus = {
  advertiserCount: number;
  avgRoasPercent: number;
};

// 대시보드 운영중 광고주 광고비 추이 및 광고성과 추이 조회(SAG045)
export type ResponseAdvertiserOperationStatusChart = {
  list: ChartAdvertiserDto[];
};

//
export type ResponseAdvertiserRecommandList = {
  list: AdvertiserRecommendListDto[];
  userName: string;
};

export type ResponseDashboardChargeRecoveryAmount = {
  chargeAmount: number;
  recoveryAmount: number;
};
