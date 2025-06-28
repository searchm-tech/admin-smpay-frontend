// api/v1/accounts/all

import { ApiError, get } from "@/lib/api";

import { Account } from "@/types/account";
import { RequestAccountCertification } from "@/types/api/account";
import { BooleanResponse } from "@/types/sm-pay";

/**
 * 은행 리스트 전체 조회(AC001)
 * - 화면 :
 */
export const getAccountList = async (): Promise<Account[]> => {
  try {
    const response = await get<Account[]>("/api/v1/accounts/all");
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
 * - 화면 :
 */
export const getAccountCertification = async (
  params: RequestAccountCertification
): Promise<BooleanResponse> => {
  try {
    const { advertiserId, bankCode, accountNumber, accountName } = params;
    const queryString = new URLSearchParams({
      advertiserId: advertiserId.toString(),
      bankCode,
      accountNumber,
      accountName,
    });
    const response = await get<BooleanResponse>(
      `/api/v1/accounts/certification?${queryString.toString()}`
    );
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }
};
