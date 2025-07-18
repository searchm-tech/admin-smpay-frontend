import { DateRange } from "react-day-picker";
import {
  startOfWeek,
  endOfWeek,
  subDays,
  startOfMonth,
  endOfMonth,
  subMonths,
  format,
} from "date-fns";

/**
 * TODO : 날짜 관련 모두 format 파일로 옮김
 */

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
