import type { AdvertiserData } from "@/types/adveriser";
import type {
  RuleHistory,
  RuleInfo,
  ScheduleInfo,
  SmPayData,
  SmPayJudgementStatus,
} from "@/types/sm-pay";

export interface PaginationParams {
  current: number;
  pageSize: number;
}

export interface SortParams {
  field?: string;
  order?: "ascend" | "descend";
}

export interface FilterParams {
  [key: string]: string[];
}

export interface TableParams {
  pagination: PaginationParams;
  sort?: SortParams;
  filters?: FilterParams;
}

export interface SmPayResponse {
  data: SmPayData[];
  total: number;
  success: boolean;
}

export interface SmPayStatusData {
  id: number;
  name: string;
  status: string;
  count: number;
}

export interface SmPayStatusResponse {
  data: SmPayStatusData[];
  success: boolean;
}

export interface FetchAdvertiserParams {
  pagination: PaginationParams;
  sort?: SortParams;
  filters?: FilterParams;
}

export interface AdvertiserListResponse {
  data: AdvertiserData[];
  success: boolean;
  hasNextPage: boolean;
}

export interface SmPayRejectReasonResponse {
  data: string;
  success: boolean;
}

export interface SmPayStopInfoResponse {
  data: {
    date: string;
    reason: string;
  };
  success: boolean;
}

/**
 * api Response Type
 */

export interface ApiResponse<T> {
  data: ApiResponseData<T>;
  success: boolean;
}

export interface ApiResponseData<T> {
  result: T;
  code: number;
  message: string;
}
