import { ApiError, get } from "@/lib/api";

import type { AdvertiserDetailDto } from "@/types/dto/smpay";

/**
 * 신청 이력 있는 광고주 리스트 조회(AAG030)
 * - 화면 : [시스템 관리자] 광고주 운영 현황 > 광고주 Select
 */
export const getSmPayAdminAdvertiserList = async (): Promise<
  AdvertiserDetailDto[]
> => {
  try {
    const response = await get<AdvertiserDetailDto[]>(
      "/admin/api/v1/agents/users/advertisers/review-requested"
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
 * 충전/회수 이력 있는 광고주 리스트 조회(AAG033)
 * - 화면 : [시스템 관리자] 충전 회수 관리 > 광고주 Select
 */
export const getSmPayAdminChargeRecoveryAdvertiserList = async (): Promise<
  AdvertiserDetailDto[]
> => {
  try {
    const response = await get<AdvertiserDetailDto[]>(
      "/admin/api/v1/agents/users/advertisers/has-charge-history"
    );
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }
};
