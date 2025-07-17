import { post, postBlob } from "@/lib/api/index";
import { buildQueryParams } from "@/lib/utils";
import { RequestAgentUser } from "@/types/api/common";
import type {
  RequestCampaignReport,
  RequestCampaignReportExcel,
} from "@/types/api/report";

// [service] 캠페인 보고서 통계 조회(SAG047)
export const getCampaignReport = async (
  user: RequestAgentUser,
  request: RequestCampaignReport
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
  console.log(response);
  return response;
};

// /service/api/v1/agents/1/users/1/advertisers/campaign-report/excel

/**
 * 캠페인 보고서 액셀 다운로드(SAG039)
 */
export const postCampaignReportExcel = async (
  user: RequestAgentUser,
  request: RequestCampaignReportExcel
) => {
  const { agentId, userId } = user;

  const blob = await postBlob(
    `/service/api/v1/agents/${agentId}/users/${userId}/advertisers/campaign-report/excel`,
    request
  );
  return blob;
};
