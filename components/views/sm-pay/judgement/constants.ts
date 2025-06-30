export const defaultParams = {
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
  },
  filters: {},
  sortField: "ADVERTISER_CUSTOMER_ID_DESC",
};

// URL 생성 헬퍼 함수
export const buildUrl = (
  advertiserId: number,
  advertiserFormId: number,
  isApprovalRead: boolean
): string => {
  const baseUrl = `/sm-pay/judgement/${advertiserId}?formId=${advertiserFormId}`;
  return isApprovalRead ? baseUrl : `${baseUrl}&read=unread`;
};
