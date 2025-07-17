import { useAuthQuery } from "../useAuthQuery";
import { getCampaignReport, postCampaignReportExcel } from "@/services/report";
import type {
  CampaignListResponse,
  RequestCampaignReport,
  RequestCampaignReportExcel,
} from "@/types/api/report";
import type { RequestAgentUser } from "@/types/api/common";
import { useAuthMutation } from "../useAuthMutation";
import { UseMutationOptions } from "@tanstack/react-query";

//  캠페인 보고서 통계 조회(SAG047)
export const useCampaignReport = (request: RequestCampaignReport) => {
  return useAuthQuery<CampaignListResponse, Error>({
    queryKey: ["campaignReport", request],
    queryFn: (user: RequestAgentUser) => getCampaignReport(user, request),
    initialData: {
      campaignData: {
        content: [],
        page: 1,
        size: 10,
        totalCount: 0,
      },
      summary: {
        totalImpCnt: 0,
        totalClkCnt: 0,
        totalCtr: 0,
        totalSalesAmt: 0,
        totalCcnt: 0,
        totalCrto: 0,
        totalConvAmt: 0,
        totalRoas: 0,
      },
    },
  });
};
