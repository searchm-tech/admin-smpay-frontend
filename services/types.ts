import type { SmPayData, SmPayJudgementStatus } from "@/types/sm-pay";

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

export interface FetchAdvertiserParams {
  pagination: PaginationParams;
  sort?: SortParams;
  filters?: FilterParams;
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
