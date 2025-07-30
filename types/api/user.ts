// 대행사 회원 메일 인증 코드 확인 API

import type { TAgency } from "../agency";
import type { AccountDto } from "../dto/user";
import type { TAuthType, TResetPwdType, TSMPayUser, UserStatus } from "../user";
import type { ResponseWithPagination, RequestWithPagination } from "./common";

// agents/users/mail-verifications request type
export type RequestMailVerify = {
  agentCode: string;
  userCode: string;
};

// agents/users/mail-verifications response type
export type ResponseMailVerify = {
  isVerified: boolean;
  department?: DepartmentResponseDto;
  agent: TAgency;
  user: TSMPayUser;
};

export type DepartmentResponseDto = {
  departmentId: number;
  name: string;
};

export type UserResponseDto = {
  userId: number;
  agentId: number;
  id: string;
  status: UserStatus;
  type: TAuthType;
  name: string;
  phoneNumber: string;
};

// 대행사 비밀번호 설정 또는 비밀번호 재설정 request type
export type RequestUserPwd = {
  agentId: number;
  userId: number;
  password: string;
  phone: string;
  type: TResetPwdType;
};

// 기본 정보 변경 (U004) request type
export type RequestPatchUserInfo = {
  userId: number;
  name: string;
  emailAddress: string;
  phoneNumber: string;
};

// [관리자] 대행사 최상위 그룹장 회원 초대 메일 발송 (AAG013) request type
export type RequestGroupMasterInvite = {
  agentId: number;
  userType: TAuthType;
  name: string;
  emailAddress: string;
};

// [관리자] 대행사 최상위 그룹장 회원 가입 (직접 등록) (AAG005) request type
export type RequestAgencyGroupMasterDirect = {
  userType: TAuthType;
  name: string;
  emailAddress: string;
  password: string;
  phoneNumber: string;
  agentId: number;
};

// 대행사 회원 페이지네이션 조회 (AAG006) response type
export interface ResponseAgencyUsers extends ResponseWithPagination {
  content: AgencyUserDto[];
}

// TODO : 실제 모델이랑 비교 필요
export type AgencyUserDto = {
  agentId: number;
  userId: number;
  agentName: string;
  type: TAuthType;
  userName: string;
  loginId: string;
  status: UserStatus;
  registerDt: string;
  id: string;
};

// 확장된 응답 타입 (no 속성이 포함된 content)
export interface ResponseAgencyUsersWithNo extends ResponseWithPagination {
  content: (AgencyUserDto & { id: string })[];
}

// 대행사 회원 페이지네이션 조회 (AAG006) params type
export type RequestAgencyUsers = RequestWithPagination & {
  orderType: AgencyUsersOrder;
};

// 시스템 관리자 - 대행사 회원 목록 조회 API 정렬 타입
export type AgencyUsersOrder =
  | "NO_ASC" // 불필요 - 그냥 프론트에서 필요함
  | "NO_DESC" // 불필요 - 그냥 프론트에서 필요함
  | "AGENT_ASC"
  | "AGE`NT_DESC"
  | "USER_TYPE_ASC"
  | "USER_TYPE_DESC"
  | "NAME_ASC"
  | "NAME_DESC"
  | "LOGIN_ID_ASC"
  | "LOGIN_ID_DESC"
  | "STATUS_ASC"
  | "STATUS_DESC"
  | "REGISTER_DT_ASC"
  | "REGISTER_DT_DESC";

// 회원 상태 변경 params type
export type RequestAgencyUserStatus = {
  userId: number;
  agentId: number;
  status: UserStatus;
};

// 대행사 회원 삭제 API params type
export type RequestAgencyUserDelete = {
  userId: number;
  agentId: number;
};
