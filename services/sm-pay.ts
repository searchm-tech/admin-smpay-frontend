import { mockData } from "./mock/sm-pay";
import type {
  TableParams,
  SmPayResponse,
  SmPayStatusResponse,
  SmPayRejectReasonResponse,
  SmPayStopInfoResponse,
} from "./types";

import type { BooleanResponse, SmPayStatus } from "@/types/sm-pay";

export const fetchSmPayData = async (
  params: TableParams
): Promise<SmPayResponse> => {
  // 서버 응답을 시뮬레이션하기 위한 지연
  await new Promise((resolve) => setTimeout(resolve, 500));

  const { pagination, sort, filters } = params;
  let filteredData = [...mockData];

  // 필터링 적용
  if (filters) {
    Object.entries(filters).forEach(([key, values]) => {
      if (values && values.length > 0) {
        if (key === "search") {
          // 검색어로 3개 필드 검색
          const searchTerm = values[0].toLowerCase();
          filteredData = filteredData.filter(
            (item) =>
              item.customerId.toLowerCase().includes(searchTerm) ||
              item.loginId.toLowerCase().includes(searchTerm) ||
              item.advertiserName.toLowerCase().includes(searchTerm)
          );
        } else {
          // 기존 필터링 로직
          filteredData = filteredData.filter((item) => {
            const itemValue = String((item as any)[key]);
            return values.includes(itemValue);
          });
        }
      }
    });
  }

  // 정렬 적용
  if (sort?.field && sort.order) {
    filteredData.sort((a, b) => {
      const aValue = (a as any)[sort.field!];
      const bValue = (b as any)[sort.field!];

      if (typeof aValue === "string") {
        return sort.order === "ascend"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number") {
        return sort.order === "ascend" ? aValue - bValue : bValue - aValue;
      }

      if (aValue instanceof Date) {
        return sort.order === "ascend"
          ? new Date(aValue).getTime() - new Date(bValue).getTime()
          : new Date(bValue).getTime() - new Date(aValue).getTime();
      }

      return 0;
    });
  }

  // 페이지네이션 적용
  const { current, pageSize } = pagination;
  const startIndex = (current - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    total: filteredData.length,
    success: true,
  };
};

export const getSmPayStatus = async (): Promise<SmPayStatusResponse> => {
  // 서버 응답을 시뮬레이션하기 위한 지연
  await new Promise((resolve) => setTimeout(resolve, 500));

  // 상태별 카운트 계산
  const statusCounts = mockData.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {} as Record<SmPayStatus, number>);

  // 전체 카운트 계산
  const totalCount = mockData.length;

  return {
    data: [
      {
        id: 0,
        name: "전체",
        status: "ALL",
        count: totalCount,
      },
      {
        id: 1,
        name: "심사 대기",
        status: "REVIEW_PENDING",
        count: statusCounts["REVIEW_PENDING"] || 0,
      },
      {
        id: 2,
        name: "심사 반려",
        status: "REVIEW_REJECTED",
        count: statusCounts["REVIEW_REJECTED"] || 0,
      },
      {
        id: 3,
        name: "운영 검토 대기",
        status: "OPERATION_REVIEW_PENDING",
        count: statusCounts["OPERATION_REVIEW_PENDING"] || 0,
      },
      {
        id: 4,
        name: "운영 검토 거절",
        status: "OPERATION_REVIEW_REJECTED",
        count: statusCounts["OPERATION_REVIEW_REJECTED"] || 0,
      },
      {
        id: 5,
        name: "운영 검토 완료",
        status: "OPERATION_REVIEW_COMPLETED",
        count: statusCounts["OPERATION_REVIEW_COMPLETED"] || 0,
      },
      {
        id: 6,
        name: "광고주 동의 대기",
        status: "ADVERTISER_AGREEMENT_PENDING",
        count: statusCounts["ADVERTISER_AGREEMENT_PENDING"] || 0,
      },
      {
        id: 7,
        name: "광고주 동의 기한 만료",
        status: "ADVERTISER_AGREEMENT_EXPIRED",
        count: statusCounts["ADVERTISER_AGREEMENT_EXPIRED"] || 0,
      },
      {
        id: 8,
        name: "신청 취소",
        status: "APPLICATION_CANCELLED",
        count: statusCounts["APPLICATION_CANCELLED"] || 0,
      },
      {
        id: 9,
        name: "출금계좌 등록 실패",
        status: "WITHDRAWAL_ACCOUNT_REGISTRATION_FAILED",
        count: statusCounts["WITHDRAWAL_ACCOUNT_REGISTRATION_FAILED"] || 0,
      },
      {
        id: 10,
        name: "운영 중",
        status: "OPERATING",
        count: statusCounts["OPERATING"] || 0,
      },
      {
        id: 11,
        name: "일시중지",
        status: "SUSPENDED",
        count: statusCounts["SUSPENDED"] || 0,
      },
      {
        id: 12,
        name: "해지 대기",
        status: "TERMINATION_PENDING",
        count: statusCounts["TERMINATION_PENDING"] || 0,
      },
      {
        id: 13,
        name: "해지",
        status: "TERMINATED",
        count: statusCounts["TERMINATED"] || 0,
      },

      {
        id: 14,
        name: "심사 취소",
        status: "APPLICATION_CANCELLED",
        count: statusCounts["APPLICATION_CANCELLED"] || 0,
      },
    ],
    success: true,
  };
};

export const getSmPayRejectReason = async (
  id: string
): Promise<SmPayRejectReasonResponse> => {
  console.log("id", id);
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    data: `<div>
      <p>ROAS 평균값은 심사 기준치를 충족하지만</p>
      <p>
        ROAS의 변동폭이 너무 커서 선충전으로 결제를 해도 제대로 된 효율을 내기
        힘들 것 같습니다.
      </p>
    </div>`,
    success: true,
  };
};

export const getSmPayStopInfo = async (
  id: string
): Promise<SmPayStopInfoResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    data: {
      date: "2025-05-02",
      reason: "관리 권한 해제  / 관리자 중단",
    },
    success: true,
  };
};

export const updateSmPayStatus = async (
  id: string,
  status: string
): Promise<BooleanResponse> => {
  console.log(id, status);

  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    data: true,
    success: true,
  };
};
