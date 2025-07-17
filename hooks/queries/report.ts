import { useAuthQuery } from "../useAuthQuery";
import {
  getAdGroupReport,
  getCampaignReport,
  getKeywordReport,
} from "@/services/report";
import type {
  AdGroupListResponse,
  CampaignListResponse,
  KeywordListResponse,
  RequestReport,
} from "@/types/api/report";
import type { RequestAgentUser } from "@/types/api/common";
import type { Summary } from "@/types/dto/report";

const defaultSummary: Summary = {
  totalImpCnt: 0,
  totalClkCnt: 0,
  totalCtr: 0,
  totalSalesAmt: 0,
  totalCcnt: 0,
  totalCrto: 0,
  totalConvAmt: 0,
  totalRoas: 0,
  totalCpc: 0,
};

//  캠페인 보고서 통계 조회(SAG047)
export const useCampaignReport = (request: RequestReport) => {
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
      summary: defaultSummary,
    },
  });
};

// 광고그룹 보고서 통계 조회(SAG048) query
export const useAdGroupReport = (request: RequestReport) => {
  return useAuthQuery<AdGroupListResponse, Error>({
    queryKey: ["adGroupReport", request],
    queryFn: (user: RequestAgentUser) => getAdGroupReport(user, request),
    initialData: {
      adGroupData: {
        content: [],
        page: 1,
        size: 10,
        totalCount: 0,
      },
      summary: defaultSummary,
    },
  });
};

// 키워드 보고서 통계 조회(SAG049) query
export const useKeywordReport = (request: RequestReport) => {
  return useAuthQuery<KeywordListResponse, Error>({
    queryKey: ["keywordReport", request],
    queryFn: (user: RequestAgentUser) => getKeywordReport(user, request),
    initialData: {
      keywordData: {
        content: [],
        page: 1,
        size: 10,
        totalCount: 0,
      },
      summary: defaultSummary,
    },
  });
};
