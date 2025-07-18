import { useAuthQuery } from "@/hooks/useAuthQuery";
import {
  getDashboardAdvertiserOperationStatus,
  getDashboardAdvertiserOperationStatusChart,
  getDashboardAdvertiserStatus,
  getDashboardAllAdvertiserOperationStatusChart,
  getDashboardChargeRecoveryAmount,
  getDashboardRecommendedAdvertiserList,
} from "@/services/dashboard";

import type {
  ResponseDashboardAdvertiserStatus,
  ResponseDashboardChargeRecoveryAmount,
} from "@/types/api/dashboard";
import type { RequestAgentUser } from "@/types/api/common";
import type {
  AdvertiserRecommendDto,
  ChartAdvertiserDto,
} from "@/types/dto/dashboard";

// 대시보드 전체 광고주 현황 조회(SAG042) query
export const useQueryDashboardAdvertiserStatus = () => {
  return useAuthQuery<ResponseDashboardAdvertiserStatus, Error>({
    queryKey: ["dashboardAdvertiserStatus"],
    queryFn: (user: RequestAgentUser) => getDashboardAdvertiserStatus(user),
    initialData: { advertiserCount: 0, avgRoasPercent: 0 },
  });
};

// 대시보드 전체 운영중 광고주 현황 조회(SAG043) query
export const useQueryDashboardAdvertiserOperationStatus = () => {
  return useAuthQuery<ResponseDashboardAdvertiserStatus, Error>({
    queryKey: ["dashboardAdvertiserOperationStatus"],
    queryFn: (user: RequestAgentUser) =>
      getDashboardAdvertiserOperationStatus(user),
    initialData: { advertiserCount: 0, avgRoasPercent: 0 },
  });
};

// 대시보드 운영중 광고주 광고비 추이 및 광고성과 추이 조회(SAG045)
export const useQueryDashboardAdvertiserOperationStatusChart = () => {
  return useAuthQuery<ChartAdvertiserDto[], Error>({
    queryKey: ["dashboardAdvertiserOperationStatusChart"],
    queryFn: (user: RequestAgentUser) =>
      getDashboardAdvertiserOperationStatusChart(user),
  });
};

// 대시보드 전체 광고주 광고비 추이 및 광고성과 추이 조회(SAG044)
export const useQueryDashboardAllAdvertiserOperationStatusChart = () => {
  return useAuthQuery<ChartAdvertiserDto[], Error>({
    queryKey: ["dashboardAdvertiserStatusChart"],
    queryFn: (user: RequestAgentUser) =>
      getDashboardAllAdvertiserOperationStatusChart(user),
  });
};

// 대시보드 추천 광고주 리스트 조회(SAG046)
export const useQueryDashboardRecommendedAdvertiserList = () => {
  return useAuthQuery<AdvertiserRecommendDto[], Error>({
    queryKey: ["dashboardRecommendedAdvertiserList"],
    queryFn: (user: RequestAgentUser) =>
      getDashboardRecommendedAdvertiserList(user),
    initialData: [],
  });
};

// 대시보드 전 날 충전/회수 금액 조회(SAG052)
export const useQueryDashboardChargeRecoveryAmount = () => {
  return useAuthQuery<ResponseDashboardChargeRecoveryAmount, Error>({
    queryKey: ["dashboardChargeRecoveryAmount"],
    queryFn: (user: RequestAgentUser) => getDashboardChargeRecoveryAmount(user),
  });
};
