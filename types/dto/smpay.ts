import type { ResponseDailyStat } from "../api/smpay";
import type { SmPayAdvertiserStatus } from "../smpay";

// SM Pay > 이력 리스트 모달
export type SMPayFormHistory = {
  no: number;
  advertiserCustomerId: string;
  advertiserLoginId: string;
  advertiserNickname: string;
  advertiserName: string;
  advertiserStatus: SmPayAdvertiserStatus;
  registerOrUpdateDt: string;
  advertiserFormId: number;
  advertiserId: number;
};

export interface DailyStatDto extends ResponseDailyStat {
  no: number;
}

export type ChargeRuleDto = {
  standardRoasPercent: number;
  changePercentOrValue: number;
  rangeType: "UP" | "DOWN";
  boundType: "FIXED_AMOUNT" | "PERCENT";
};
