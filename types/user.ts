/**
 * 권한
 * - 시스템 관리자 : OPERATIONS_MANAGER(운영관리자), SYSTEM_ADMINISTRATOR(시스템 관리자)
 * - 최상위 그룹장 : AGENCY_GROUP_MASTER(대행사 최상위 그룹장)
 * - 대행사 그룹장, 그룹원 : AGENCY_GROUP_MANAGER(대행사 그룹장), AGENCY_GROUP_MEMBER(대행사 그룹원)
 * - 광고주 : ADVERTISER(광고주), ASSOCIATE_ADVERTISER(준광고주) [현재 아직 화면상 아직 ...]
 */

export type TAuthType =
  | "ASSOCIATE_ADVERTISER"
  | "ADVERTISER"
  | "AGENCY_GROUP_MEMBER"
  | "AGENCY_GROUP_MANAGER"
  | "AGENCY_GROUP_MASTER"
  | "OPERATIONS_MANAGER"
  | "SYSTEM_ADMINISTRATOR";

export type TSMPayUser = {
  id: number | string; // TODO : 다른 API 확인 후 삭제 (다른 곳에서는 email로 사용되고 있음.)
  agentId: number;
  userId: number;
  status: UserStatus;
  type: TAuthType;
  name: string;
  phoneNumber: string;
  loginId: string;
  accessToken: string;
  refreshToken: string;
};

export type UserStatus = "NORMAL" | "STOP" | "TEMP"; // NORMAL : 활성화 STOP : 비활성화 TEMP : 임시

// /admin/api/v1/agents/${agentCode}/users/${userCode} response type
export type TSignUpMailVerifyResponse = {
  url: string;
  loginId: string;
};

export type TResetPwdType = "REGISTER" | "RESET"; // REGISTER : 등록 RESET : 재설정
