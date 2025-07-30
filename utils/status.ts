import type { TAuthType } from "@/types/user";

// 회원 권한 유형 레이블 맵핑
export const userAuthTypeMap: Record<TAuthType, string> = {
  ASSOCIATE_ADVERTISER: "준광고주",
  ADVERTISER: "광고주",
  AGENCY_GROUP_MEMBER: "그룹원",
  AGENCY_GROUP_MANAGER: "그룹장",
  AGENCY_GROUP_MASTER: "최상위 그룹장",
  OPERATIONS_MANAGER: "운영관리자",
  SYSTEM_ADMINISTRATOR: "시스템 관리자",
} as const;

export const getUserAuthTypeLabel = (status: TAuthType): string => {
  return userAuthTypeMap[status] || status;
};
