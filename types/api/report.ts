import type { CampaignData } from "../dto/report";
import type { RequestWithPagination } from "./common";

export interface CampaignSummary {
  totalImpCnt: number;
  totalClkCnt: number;
  totalCtr: number;
  totalSalesAmt: number;
  totalCcnt: number;
  totalCrto: number;
  totalConvAmt: number;
  totalRoas: number;
}

export interface CampaignListResponse {
  campaignData: CampaignData;
  summary: CampaignSummary;
}

export type RequestCampaignReport = RequestWithPagination & {
  advertiserIds: number[];
  startDate: string;
  endDate: string;
};

export type RequestCampaignReportExcel = {
  userIds: number[];
  startDate: string;
  endDate: string;
};
