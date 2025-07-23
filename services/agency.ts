import { get, ApiError, post, put } from "@/lib/api";
import { buildQueryParams } from "@/lib/utils";

import type { TAgency } from "@/types/agency";
import type {
  RequestAgencys,
  ResponseAgencys,
  ResponseDuplicate,
  RequestAgencyRegister,
  ResponseAgencyRegister,
  RequestAgencyStatus,
  ResponseAgencyDetail,
  RequestPutAgencyBill,
  ResponseAgencyAll,
} from "@/types/api/agency";

// 대행사 전체 리스트 조회 API (AAG012)
export async function getAgencyAllApi(): Promise<ResponseAgencyAll[]> {
  try {
    const response: ResponseAgencyAll[] = await get("/admin/api/v1/agents/all");
    return response; // result만 반환!
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }
}

// 대행사 페이지네이션 리스트 조회 (AAG003)
export async function getAgencyApi(
  params: RequestAgencys
): Promise<ResponseAgencys> {
  try {
    const isNoSort =
      params.orderType === "NO_DESC" || params.orderType === "NO_ASC";
    const apiOrderType = isNoSort ? "REGISTER_DT_DESC" : params.orderType;

    const queryParams = buildQueryParams({
      page: params.page,
      size: params.size,
      keyword: params.keyword,
      orderType: apiOrderType,
    });

    const response: ResponseAgencys = await get(
      `/admin/api/v1/agents?${queryParams}`
    );

    let content = response.content.map((item, index) => ({
      ...item,
      id: item.agentId, // 원본 agentId 유지 (타입 호환성)
      rowNumber: (params.page - 1) * params.size + index + 1, // 페이지네이션을 고려한 행 번호
    }));

    // NO_ASC인 경우 배열을 reverse하여 번호 순서 변경
    if (params.orderType === "NO_ASC") {
      content = content.reverse();
    }

    return {
      ...response,
      content,
    }; // result만 반환!
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }
}

// 대행사 고유 코드 중복 체크 (AAG009)
export async function duplicateUniqueCode(
  code: string
): Promise<ResponseDuplicate> {
  try {
    const response: ResponseDuplicate = await get(
      `/admin/api/v1/agents/uniquecode/duplicate?uniqueCode=${code}`
    );
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }
}

// 대행사 도메인 이름 중복 체크 (AAG011)
export async function checkAgencyDomainName(
  domain: string
): Promise<ResponseDuplicate> {
  try {
    const response: ResponseDuplicate = await get(
      `/admin/api/v1/agents/domain-name/duplicate?domainName=${domain}`
    );
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }
}

// 대행사 회원가입 (AAG001) - 대행사 등록
export async function postAgencyRegister(
  data: RequestAgencyRegister
): Promise<ResponseAgencyRegister> {
  try {
    const response: ResponseAgencyRegister = await post(
      "/admin/api/v1/agents",
      data
    );
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }
}

// 대행사 상태 변경 (AAG004)
export async function patchAgencyStatus(
  params: RequestAgencyStatus
): Promise<null> {
  try {
    const { agentId, status } = params;
    const response: null = await put(
      `/admin/api/v1/agents/${agentId}/status?status=${status}`
    );
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }
}

// 대행사 단일 정보 조회 (AAG017)
export async function getAgencyDetail(
  agentId: number
): Promise<ResponseAgencyDetail | null> {
  try {
    const response: ResponseAgencyDetail = await get(
      `/admin/api/v1/agents/${agentId}`
    );
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }
}

// 대행사 정보 수정 (AAG002)
export const putAgencyDetail = async (
  data: RequestPutAgencyBill
): Promise<null> => {
  try {
    const response: null = await put(
      `/admin/api/v1/agents/${data.agentId}`,
      data.bills
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
 * 신청 이력 있는 대행사 리스트 조회(AAG029)
 * - 화면 : [시스템 관리자] 충전 회수 관리 > 대행사 세부 선택 [대행사 선택 리스트 부분]
 */
export const getSmPayAdminAgencyList = async (): Promise<TAgency[]> => {
  try {
    const response: TAgency[] = await get(
      "/admin/api/v1/agents/review-requested"
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
 * 충전/회수 이력 있는 대행사 리스트 조회(AAG032)
 * - 화면 : [시스템 관리자] 충전 회수 관리 > 대행사 세부 선택 [대행사 선택 리스트 부분]
 */
export const getSmPayAdminChargeRecoveryAgencyList = async (): Promise<
  TAgency[]
> => {
  try {
    const response: TAgency[] = await get(
      "/admin/api/v1/agents/has-charge-history"
    );
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }
};
