import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { TAuthType } from "@/types/user";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 객체를 URL 쿼리 파라미터 문자열로 변환
 * @param params - 쿼리 파라미터 객체
 * @returns 쿼리 파라미터 문자열 (예: "page=1&size=10")
 */
export function buildQueryParams(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (Array.isArray(value)) {
        // 배열인 경우 첫 번째 값만 사용 (또는 join 사용 가능)
        if (value.length > 0) {
          searchParams.append(key, value[0].toString());
        }
      } else {
        searchParams.append(key, value.toString());
      }
    }
  });

  return searchParams.toString();
}

/**
 * API Table Response 변환 함수
 * @param response - API 응답 객체 (content 배열 포함)
 * @param transform - 각 아이템에 적용할 커스텀 변환 함수 (선택사항)
 * @returns 변환된 응답 객체
 */
export function transformTableResponse<
  T,
  R = T & { id: number },
  ResponseType = any
>(
  response: ResponseType & { content: T[] },
  queryParams: { page: number; size: number },
  transform?: (item: T, index: number) => R
): ResponseType & { content: R[] } {
  const { page, size } = queryParams;

  let content = response.content.map((item, index) => {
    const baseItem = {
      ...item,
      id: (page - 1) * size + index + 1,
    } as R;

    // 커스텀 변환 함수가 있으면 적용
    return transform ? transform(item, index) : baseItem;
  });

  return {
    ...response,
    content,
  };
}

// 관리자 확인
export function getIsAdmin(type?: TAuthType | null) {
  if (!type) return false;
  return ["SYSTEM_ADMINISTRATOR", "OPERATIONS_MANAGER"].includes(type || "");
}

// 최상위 그룹장 확인
export function getIsGroupMaster(type?: TAuthType | null) {
  if (!type) return false;
  return type === "AGENCY_GROUP_MASTER";
}

// 그룹장, 그룹원 확인
export function getIsAgency(type?: TAuthType | null) {
  if (!type) return false;
  return ["AGENCY_GROUP_MANAGER", "AGENCY_GROUP_MEMBER"].includes(type || "");
}

/**
 * 권한
 * - 시스템 관리자 : OPERATIONS_MANAGER(운영관리자), SYSTEM_ADMINISTRATOR(시스템 관리자)
 * - 최상위 그룹장 : AGENCY_GROUP_MASTER(대행사 최상위 그룹장)
 * - 대행사 그룹장, 그룹원 : AGENCY_GROUP_MANAGER(대행사 그룹장), AGENCY_GROUP_MEMBER(대행사 그룹원)
 * - 광고주 : ADVERTISER(광고주), ASSOCIATE_ADVERTISER(준광고주) [현재 아직 화면상 아직 ...]
 */

// 권한 가져오기
export function getAuthType(type?: TAuthType | null) {
  if (!type) return "agency";

  if (getIsAdmin(type)) {
    return "admin";
  }
  if (getIsGroupMaster(type)) {
    return "master";
  }
  if (getIsAgency(type)) {
    return "agency";
  }

  return "agency";
}

// 사용자 권한에 따른 리다이렉트 경로 반환
export function getRedirectPath(userType?: TAuthType | null): string {
  if (!userType) return "/dashboard";

  // 관리자는 관리자 페이지로
  if (getIsAdmin(userType)) {
    return "/sm-pay/charge";
  }

  // 기본적으로 sm-pay 메인 페이지로
  return "/dashboard";
}

/**
 * NO 관련 정렬(orderType)이 있을 때 번호 부여 및 reverse 처리 유틸
 * @param content - 원본 배열
 * @param page - 현재 페이지
 * @param size - 페이지 크기
 * @param orderType - 정렬 타입
 * @param noField - 번호 필드명 (기본값: 'no')
 * @returns 번호가 부여된(및 필요시 reverse된) 배열
 */
export function applyNoOrder<T>(
  content: T[],
  page: number,
  size: number,
  orderType: string,
  noField: string = "no"
): T[] {
  let numbered = content.map((item, idx) => ({
    ...item,
    [noField]: (page - 1) * size + idx + 1,
  }));

  if (orderType === "NO_ASC") {
    numbered = numbered.reverse();
  }
  return numbered;
}
