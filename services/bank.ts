// api/v1/accounts/all

import { ApiError, get, post } from "@/lib/api";

import type {
  RequestAccountCertification,
  Bank,
  RequestARS,
} from "@/types/api/bank";

/**
 * 은행 리스트 전체 조회(AC001)
 * - 화면 : 광고주 동의 > 은행 리스트 조회
 */
export const getBankList = async (): Promise<Bank[]> => {
  try {
    const response = await get<Bank[]>("/api/v1/accounts/all");
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }
};

/**
 * 은행 실명 인증 요청(AC002)
 * - 화면 : 광고주 동의 > 은행 리스트 조회 > 충전 계좌 인증
 */
export const postBankCertification = async (
  params: RequestAccountCertification
): Promise<boolean> => {
  try {
    const response = await post<boolean>(
      `/api/v1/accounts/certification`,
      params
    );
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }
};

/**
 * 광고주 메일 인증 여부 조회(AD001)
 * - 화면 : 광고주 동의 > 은행 리스트 조회 > 충전 계좌 인증
 */
export const getAdvertiserMailVerification = async (
  advertiserId: number,
  code: string
): Promise<boolean> => {
  try {
    const response = await get<boolean>(
      `/api/v1/advertisers/${advertiserId}/mail-verifications?advertiserCode=${code}`
    );
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }
};

/**
 * ARS 인증 및 출금계좌 등록 (AS001)
 * - 화면 : 광고주 동의 > 은행 리스트 조회 > 충전 계좌 인증 > ARS 인증
 */
export const postARS = async (params: RequestARS): Promise<boolean> => {
  try {
    const response = await post<boolean>(`/api/v1/ars/certification`, params);
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }
};
