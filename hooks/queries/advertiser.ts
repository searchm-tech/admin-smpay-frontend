import {
  useMutation,
  useQuery,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";

import {
  getAdvertiserListByUserId,
  getSmPayAdminAdvertiserList,
  getSmPayAdminChargeRecoveryAdvertiserList,
  getAdvertiserListByUserIdHasChargeHistory,
} from "@/services/advertiser";

import type { TAdvertiser } from "@/types/adveriser";
import type { AdvertiserDetailDto } from "@/types/dto/smpay";
import { useAuthQuery } from "@/hooks/useAuthQuery";
import { RequestAgentUser } from "@/types/api/common";

// 마케터와 연결된 광고주 리스트 조회(SAG038)
export const useQueryAdvertiserListByUserId = (
  params: { agentId: number; userIds: number[] },
  options?: UseQueryOptions<TAdvertiser[], Error>
) => {
  return useQuery<TAdvertiser[], Error>({
    queryKey: ["advertiserListByUserId", params],
    queryFn: () => getAdvertiserListByUserId(params),
    enabled: params.userIds.length > 0 && !!params.agentId,
    ...options,
  });
};

// 마케터와 연결된 충전/회수 이력 있는 광고주 리스트 조회(SAG050)
export const useQueryAdvertiserListByUserIdHasChargeHistory = (params: {
  agentId: number;
  userIds: number[];
}) => {
  return useAuthQuery<TAdvertiser[]>({
    queryKey: ["advertiserListByUserIdHasChargeHistory", params],
    queryFn: (user: RequestAgentUser) =>
      getAdvertiserListByUserIdHasChargeHistory(user, params),
    enabled: params.userIds.length > 0 && !!params.agentId,
  });
};

// 신청 이력 있는 광고주 리스트 조회(AAG030) query
export const useQuerySmPayAdminAdvertiserList = (
  options?: UseQueryOptions<AdvertiserDetailDto[], Error>
) => {
  return useQuery<AdvertiserDetailDto[], Error>({
    queryKey: ["smPayAdminAdvertiserList"],
    queryFn: () => getSmPayAdminAdvertiserList(),
    ...options,
  });
};

// 충전/회수 이력 있는 광고주 리스트 조회(AAG033) query
export const useQuerySmPayAdminChargeRecoveryAdvertiserList = (
  options?: UseQueryOptions<AdvertiserDetailDto[], Error>
) => {
  return useQuery<AdvertiserDetailDto[], Error>({
    queryKey: ["smPayAdminChargeRecoveryAdvertiserList"],
    queryFn: () => getSmPayAdminChargeRecoveryAdvertiserList(),
    ...options,
  });
};
