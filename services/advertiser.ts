import { ApiError, del, get, post } from "@/lib/api";
import { TAdvertiser } from "@/types/adveriser";

import type { AdvertiserDetailDto } from "@/types/dto/smpay";
import type { RequestAgentUser } from "@/types/api/common";

/**
 * 마케터와 연결된 광고주 리스트 조회(SAG038)
 * - 화면 : 충전 회수 현황 > 광고주 세부 선택 [광고주 선택 리스트 부분]
 * - 화면 : 통계 > 광고주 세부 선택 [광고주 선택 리스트 부분]
 */
export const getAdvertiserListByUserId = async (params: {
  agentId: number;
  userIds: number[];
}): Promise<TAdvertiser[]> => {
  const { agentId, userIds } = params;

  // 반복 파라미터 방식으로 변경
  const userIdParams = userIds.map((id) => `userIds=${id}`).join("&");
  const response: TAdvertiser[] = await get(
    `/service/api/v1/agents/${agentId}/users/advertisers/search?${userIdParams}`
  );

  return response;
};

/**
 * 마케터와 연결된 충전/회수 이력 있는 광고주 리스트 조회(SAG050)
 * - 화면 : [대행사] 충전 회수 현황 > 광고주 세부 선택 [광고주 선택 리스트 부분]
 */
export const getAdvertiserListByUserIdHasChargeHistory = async (
  user: RequestAgentUser,
  params: {
    agentId: number;
    userIds: number[];
  }
): Promise<TAdvertiser[]> => {
  const { agentId, userIds } = params;

  const userIdParams = userIds.map((id) => `userIds=${id}`).join("&");
  const response: TAdvertiser[] = await get(
    `/service/api/v1/agents/${agentId}/users/advertisers/charge-recovery-search?${userIdParams}`
  );

  return response;
};

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
