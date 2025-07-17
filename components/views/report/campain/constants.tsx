import { DateRange } from "react-day-picker";
import {
  startOfWeek,
  endOfWeek,
  subDays,
  startOfMonth,
  endOfMonth,
  subMonths,
} from "date-fns";

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
