import type { AdvertiserJobType, TAdvertiserSync, TCustomer } from "../license";
import type { SmPayStatus } from "../smpay";

export type TRequestLicenseCreateParams = {
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

// 마케터 API 라이선스 삭제 (SAG011) request type
export type TRequestLicenseDelete = {
  agentId: number;
  userId: number;
};

export type TRequestUpdateAdvertiserSyncStatus = {
  advertiserId: number;
  agentId: number;
  userId: number;
  status: AdvertiserJobType;
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
