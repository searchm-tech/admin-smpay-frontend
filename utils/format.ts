import dayjs from "dayjs";
import {
  startOfWeek,
  endOfWeek,
  subDays,
  startOfMonth,
  endOfMonth,
  subMonths,
  format,
} from "date-fns";
import type { DateRange } from "react-day-picker";

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

export const getYesterday = (baseDate: Date = new Date()): DateRange => {
  const yesterday = subDays(baseDate, 1);
  return { from: yesterday, to: yesterday };
};

export const getThisWeek = (baseDate: Date = new Date()): DateRange => {
  const monday = startOfWeek(baseDate, { weekStartsOn: 1 });
  return { from: monday, to: baseDate };
};

export const getLastWeek = (baseDate: Date = new Date()): DateRange => {
  const lastWeekMonday = startOfWeek(subDays(baseDate, 7), { weekStartsOn: 1 });
  const lastWeekSunday = endOfWeek(subDays(baseDate, 7), { weekStartsOn: 1 });
  return { from: lastWeekMonday, to: lastWeekSunday };
};

export const getLast7Days = (baseDate: Date = new Date()): DateRange => {
  const yesterday = subDays(baseDate, 1);
  const from = subDays(yesterday, 6);
  return { from, to: yesterday };
};

export const getThisMonth = (baseDate: Date = new Date()): DateRange => {
  const firstDay = startOfMonth(baseDate);
  return { from: firstDay, to: baseDate };
};

export const getLastMonth = (baseDate: Date = new Date()): DateRange => {
  const lastMonth = subMonths(baseDate, 1);
  const firstDay = startOfMonth(lastMonth);
  const lastDay = endOfMonth(lastMonth);
  return { from: firstDay, to: lastDay };
};

export const formatOnlyDate = (date: Date) => {
  return format(date, "yyyy-MM-dd");
};

export function calcRowSpan<T>(data: T[], key: keyof T): number[] {
  const rowSpanArr = Array(data.length).fill(1);
  let prevValue: any = null;
  let startIdx = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i][key] !== prevValue) {
      if (i - startIdx > 1) {
        rowSpanArr[startIdx] = i - startIdx;
        for (let j = startIdx + 1; j < i; j++) {
          rowSpanArr[j] = 0;
        }
      }
      prevValue = data[i][key];
      startIdx = i;
    }
  }
  if (data.length - startIdx > 1) {
    rowSpanArr[startIdx] = data.length - startIdx;
    for (let j = startIdx + 1; j < data.length; j++) {
      rowSpanArr[j] = 0;
    }
  }
  return rowSpanArr;
}
