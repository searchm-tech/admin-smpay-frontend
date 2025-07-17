import type {
  AdGroupData,
  CampaignData,
  KeywordData,
  Summary,
} from "../dto/report";
import type { RequestWithPagination } from "./common";

export interface CampaignListResponse {
  campaignData: CampaignData;
  summary: Summary;
}

export type RequestReport = RequestWithPagination & {
  advertiserIds: number[];
  startDate: string;
  endDate: string;
};

export type RequestReportExcel = {
  userIds: number[];
  startDate: string;
  endDate: string;
};

export type AdGroupListResponse = {
  adGroupData: AdGroupData;
  summary: Summary;
};

export type KeywordListResponse = {
  keywordData: KeywordData;
  summary: Summary;
};
