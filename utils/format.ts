import { DailyStat } from "@/types/smpay";
import dayjs from "dayjs";

export const formatBusinessNumber = (value: string) => {
  // 숫자만 추출
  const numbers = value.replace(/\D/g, "");

  // 길이에 따라 하이픈 추가
  if (numbers.length <= 3) {
    return numbers;
  } else if (numbers.length <= 5) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  } else {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(
      5,
      10
    )}`;
  }
};

export const formatPhoneNumber = (value: string) => {
  if (!value) {
    return "";
  }
  const numbers = value.replace(/\D/g, "");
  const { length } = numbers;

  if (length < 4) {
    return numbers;
  }

  if (numbers.startsWith("02")) {
    if (length < 6) {
      return `${numbers.slice(0, 2)}-${numbers.slice(2)}`;
    } else if (length < 10) {
      return `${numbers.slice(0, 2)}-${numbers.slice(2, 5)}-${numbers.slice(
        5
      )}`;
    }
    return `${numbers.slice(0, 2)}-${numbers.slice(2, 6)}-${numbers.slice(
      6,
      10
    )}`;
  }

  if (length < 8) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  } else if (length < 11) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`;
  }
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(
    7,
    11
  )}`;
};

export function formatDate(date: string) {
  return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
}

// 합계 계산 함수
export const calculateDailyTotal = (data: DailyStat[] | undefined) => {
  if (!data || data.length === 0) return null;

  // 기본 합계 계산
  const sums = data.reduce(
    (acc, item) => ({
      impCnt: acc.impCnt + item.impCnt,
      clkCnt: acc.clkCnt + item.clkCnt,
      salesAmt: acc.salesAmt + item.salesAmt,
      ccnt: acc.ccnt + item.ccnt,
      convAmt: acc.convAmt + item.convAmt,
    }),
    { impCnt: 0, clkCnt: 0, salesAmt: 0, ccnt: 0, convAmt: 0 }
  );

  // 계산된 지표들
  return {
    ...sums,
    cpc: sums.clkCnt > 0 ? sums.salesAmt / sums.clkCnt : 0,
    crto: sums.clkCnt > 0 ? sums.ccnt / sums.clkCnt : 0,
    cpConv: sums.ccnt > 0 ? sums.salesAmt / sums.ccnt : 0,
    ror: sums.salesAmt > 0 ? sums.convAmt / sums.salesAmt : 0,
    avgRnk: data.reduce((sum, item) => sum + item.avgRnk, 0) / data.length,
  };
};

/**
 * 1,000원 단위 절상 계산
 * @param amount 원본 금액
 * @returns 절상된 금액
 */
export const roundUpToThousand = (amount: number): number => {
  if (!amount || amount <= 0) {
    return 0; // 최소 충전 금액
  }

  return Math.floor((amount + 999) / 1000) * 1000;
};
