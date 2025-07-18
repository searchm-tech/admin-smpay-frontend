export type ChartAdvertiserDto = {
  salesAmt: number;
  ctr: number;
  convAmt: number;
  roas: number;
  date: string;
};

export interface AdvertiserRecommendDto extends AdvertiserRecommendListDto {
  key: number;
  userName: string;
}

export type AdvertiserRecommendListDto = {
  dailyAvgRoas: number;
  monthlyAvgConvAmt: number;
  dailyAvgSalesAmt: number;
  customerId: number;
};

export type ChargeRecoveryHistoryDto = {
  chargeRecoveryHistoryId: number;
  agencyCode: string;
  agencyName: string;
  customerId: number;
  advertiserId: number;
  advertiserCode: string;
  advertiserName: string;
  orderDate: string;
  orderNumber: string;
  orderType: string;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  paymentAmount: number;
  recoveryAmount: number;
  previousBalance: number;
  changeRate: number;
  isIncreased: boolean;
  transactionType: string;
  parentChargeId: number;
  status: string;
  processedDate: string;
  isRepaid: boolean;
  failureReason: string;
  failureCategory: string;
  failureCode: string;
};

export type ChargeRecoveryUserDto = {
  userId: number;
  agentId: number;
  loginId: string;
  status: string;
  isDelete: boolean;
  type: string;
  name: string;
  phoneNumber: string;
};

export type ChargeRecoveryResultDto = {
  user: ChargeRecoveryUserDto;
  chargeRecoveryHistory: ChargeRecoveryHistoryDto;
};
