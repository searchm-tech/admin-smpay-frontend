import { useAuthQuery } from "@/hooks/useAuthQuery";
import { getAccountCertification, getAccountList } from "@/services/account";

import type { Account } from "@/types/account";
import type { RequestAccountCertification } from "@/types/api/account";
import { BooleanResponse } from "@/types/sm-pay";
import { useQuery } from "@tanstack/react-query";

// 은행 리스트 전체 조회(AC001)
export const useAccountList = () => {
  return useAuthQuery<Account[]>({
    queryKey: ["/account/list"],
    queryFn: () => getAccountList(),
  });
};

// 은행 실명 인증 요청(AC002)
export const useAccountCertification = (
  params: RequestAccountCertification,
  options?: { enabled?: boolean }
) => {
  return useQuery<BooleanResponse>({
    queryKey: ["/account/certification", params],
    queryFn: () => getAccountCertification(params),
    enabled: options?.enabled ?? true,
  });
};
