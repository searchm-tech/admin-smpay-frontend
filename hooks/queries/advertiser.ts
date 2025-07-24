import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import {
  getSmPayAdminAdvertiserList,
  getSmPayAdminChargeRecoveryAdvertiserList,
} from "@/services/advertiser";

import type { AdvertiserDetailDto } from "@/types/dto/smpay";

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
