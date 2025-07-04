import type { TAdvertiserSync, TCustomer } from "../license";
import type { SmPayStatus } from "../smpay";
import type { RequestWithPagination, ResponseWithPagination } from "./common";

// 마케터 API 라이선스 등록 + 수정 (SAG008) request type
export type TRequestLicenseCreate = {
  agentId: number;
  userId: number;
  customerId: number;
  apiKey: string;
  secretKey: string;
};

// 마케터 API 라이선스 조회 (SAG009) response type
export type TResponseLicense = {
  userId: number;
  customerId: number;
  accessLicense: string;
  secretKey: string;
};

// 마케터 API 라이선스 조회 (SAG009) request type
export type TRequestLicense = {
  agentId: number;
  userId: number;
};

// 마케터 API 라이선스 삭제 (SAG011) request type
export type TRequestLicenseDelete = {
  agentId: number;
  userId: number;
};

// 광고주 리스트 조회 (SAG012) response type
export type TResponseCustomersList = ResponseWithPagination & {
  content: TCustomer[];
};

// 광고주 리스트 조회 (SAG013) request type
export type TRequestCustomersList = RequestWithPagination & {
  orderType: CustomerOrderType;
};

export type CustomerOrderType =
  | "ADVERTISER_REGISTER_ASC"
  | "ADVERTISER_REGISTER_DESC" // 등록 여부
  | "ADVERTISER_SYNC_ASC"
  | "ADVERTISER_SYNC_DESC" // 동기화 여부
  | "ADVERTISER_REGISTER_TIME_ASC"
  | "ADVERTISER_REGISTER_TIME_DESC"; // 최종 광고 데이터 동기화 시간

export type TRequestUpdateAdvertiserSyncStatus = {
  advertiserId: number;
  agentId: number;
  userId: number;
  status: AdvertiserJobType;
  // status: "BEFORE_PROGRESS" | "IN_PROGRESS" | "DONE"; // 작업 실행 전, 작업 중, 작업 완료
};

// 광고주 데이터 동기화 작업 타입
export type AdvertiserJobType = "BEFORE_PROGRESS" | "IN_PROGRESS" | "DONE";

export type TRequestAdvertiserSyncJobList = {
  agentId: number;
  userId: number;
  type: AdvertiserJobType;
};

export type TResponseAdvertiserSyncJob = {
  advertiserId: number;
  userId: number;
  customerId: number;
  id: string;
  nickName: string;
  representativeName: string;
  businessRegistrationNumber: string;
  phoneNumber: string;
  emailAddress: string;
  status: SmPayStatus; // TODO : 다시 확인 "WAIT_REVIEW";
  name: string;
  roleId: number;
  sync: TAdvertiserSync;
};
