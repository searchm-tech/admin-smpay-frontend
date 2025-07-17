import { post, postBlob } from "@/lib/api/index";
import { buildQueryParams } from "@/lib/utils";
import { RequestAgentUser } from "@/types/api/common";
import type { RequestReport, RequestReportExcel } from "@/types/api/report";

// [service] 캠페인 보고서 통계 조회(SAG047)
export const getCampaignReport = async (
  user: RequestAgentUser,
  request: RequestReport
) => {
  const { advertiserIds, startDate, endDate } = request;
  const { agentId, userId } = user;

  const queryParams = buildQueryParams({
    page: request.page,
    size: request.size,
  });

  const params = {
    advertiserIds,
    startDate,
    endDate,
  };

  const response = await post(
    `/service/api/v1/agents/${agentId}/users/${userId}/advertisers/campaign-report?${queryParams}`,
    params
  );

  return response;
};

/**
 * 캠페인 보고서 액셀 다운로드(SAG039)
 */
export const postCampaignReportExcel = async (
  user: RequestAgentUser,
  request: RequestReportExcel
) => {
  const { agentId, userId } = user;

  const blob = await postBlob(
    `/service/api/v1/agents/${agentId}/users/${userId}/advertisers/campaign-report/excel`,
    request
  );
  return blob;
};

// 광고그룹 보고서 통계 조회(SAG048)
export const getAdGroupReport = async (
  user: RequestAgentUser,
  request: RequestReport
) => {
  const { advertiserIds, startDate, endDate } = request;
  const { agentId, userId } = user;

  const queryParams = buildQueryParams({
    page: request.page,
    size: request.size,
  });

  const params = {
    advertiserIds,
    startDate,
    endDate,
  };

  const response = await post(
    `/service/api/v1/agents/${agentId}/users/${userId}/advertisers/ad-group-report?${queryParams}`,
    params
  );

  return response;
};

// 광고그룹 보고서 액셀 다운로드(SAG040)
export const postAdGroupReportExcel = async (
  user: RequestAgentUser,
  request: RequestReportExcel
) => {
  const { agentId, userId } = user;

  const blob = await postBlob(
    `/service/api/v1/agents/${agentId}/users/${userId}/advertisers/ad-group-report/excel`,
    request
  );
  return blob;
};

// 키워드 보고서 통계 조회(SAG049)
export const getKeywordReport = async (
  user: RequestAgentUser,
  request: RequestReport
) => {
  const { advertiserIds, startDate, endDate } = request;
  const { agentId, userId } = user;

  const queryParams = buildQueryParams({
    page: request.page,
    size: request.size,
  });

  const params = {
    advertiserIds,
    startDate,
    endDate,
  };

  const response = await post(
    `/service/api/v1/agents/${agentId}/users/${userId}/advertisers/keyword-report?${queryParams}`,
    params
  );

  return response;
};

// 키워드 보고서 액셀 다운로드(SAG041)
export const postKeywordReportExcel = async (
  user: RequestAgentUser,
  request: RequestReportExcel
) => {
  const { agentId, userId } = user;

  const blob = await postBlob(
    `/service/api/v1/agents/${agentId}/users/${userId}/advertisers/keyword-report/excel`,
    request
  );
  return blob;
};
