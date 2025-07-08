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
