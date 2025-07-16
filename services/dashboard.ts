import { get } from "@/lib/api";
import type { RequestAgentUser } from "@/types/api/common";
import type {
  ResponseAdvertiserOperationStatusChart,
  ResponseAdvertiserRecommandList,
  ResponseDashboardAdvertiserStatus,
} from "@/types/api/dashboard";
import type {
  AdvertiserRecommendDto,
  ChartAdvertiserDto,
  AdvertiserRecommendListDto,
} from "@/types/dto/dashboard";

/**
 * 대시보드 전체 광고주 현황 조회(SAG042)
 * - 화면 : 대시보드 > 전체 광고주 현황
 */
export const getDashboardAdvertiserStatus = async (
  params: RequestAgentUser
): Promise<ResponseDashboardAdvertiserStatus> => {
  const { agentId, userId } = params;

  const response: ResponseDashboardAdvertiserStatus = await get(
    `/service/api/v1/agents/${agentId}/users/${userId}/advertisers-status-calculate`
  );
  return response;
};

/**
 * 대시보드 전체 운영중 광고주 현황 조회(SAG043)
 * - 화면 : 대시보드 > SM Pay 광고주
 */
export const getDashboardAdvertiserOperationStatus = async (
  params: RequestAgentUser
): Promise<ResponseDashboardAdvertiserStatus> => {
  const { agentId, userId } = params;

  const response: ResponseDashboardAdvertiserStatus = await get(
    `/service/api/v1/agents/${agentId}/users/${userId}/advertisers-operation-status-calculate`
  );
  return response;
};

/**
 * 대시보드 운영중 광고주 광고비 추이 및 광고성과 추이 조회(SAG045)
 * - 화면 : 대시보드 > 차트 : SM Pay 광고주 [광고비 추이, 광고성과 추이]
 * - 라디오 박스를 기준으로 탭에 따라 다르게 호출
 */
export const getDashboardAdvertiserOperationStatusChart = async (
  params: RequestAgentUser
): Promise<ChartAdvertiserDto[]> => {
  const { agentId, userId } = params;

  const response: ResponseAdvertiserOperationStatusChart = await get(
    `/service/api/v1/agents/${agentId}/users/${userId}/operation-advertiser-trend`
  );
  return response?.list || [];
};

/**
 * 대시보드 전체 광고주 광고비 추이 및 광고성과 추이 조회(SAG044)
 * - 화면 : 대시보드 > 차트 : 전체 광고주 [광고비 추이, 광고성과 추이]
 * - 라디오 박스를 기준으로 탭에 따라 다르게 호출
 */
export const getDashboardAllAdvertiserOperationStatusChart = async (
  params: RequestAgentUser
): Promise<ChartAdvertiserDto[]> => {
  const { agentId, userId } = params;

  const response: ResponseAdvertiserOperationStatusChart = await get(
    `/service/api/v1/agents/${agentId}/users/${userId}/all-advertiser-trend`
  );
  return response?.list || [];
};

/**
 * 대시보드 추천 광고주 리스트 조회(SAG046)
 * - 화면 : 대시보드 > 추천 광고주 리스트
 */
export const getDashboardRecommendedAdvertiserList = async (
  params: RequestAgentUser
): Promise<AdvertiserRecommendDto[]> => {
  const { agentId, userId } = params;

  const response: ResponseAdvertiserRecommandList = await get(
    `/service/api/v1/agents/${agentId}/users/${userId}/advertisers-recommend-list`
  );

  const result = response.list.map((item, idx) => ({
    ...item,
    key: idx + 1,
    userName: response.userName,
    dailyAvgRoas: item.dailyAvgRoas,
    monthlyAvgConvAmt: item.monthlyAvgConvAmt,
    dailyAvgSalesAmt: item.dailyAvgSalesAmt,
    customerId: item.customerId,
  }));
  return result;
};
