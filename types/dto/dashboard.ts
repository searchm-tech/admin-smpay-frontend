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
