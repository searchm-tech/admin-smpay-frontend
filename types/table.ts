import type {
  FilterValue as AntdFilterValue,
  SortOrder,
} from "antd/es/table/interface";
import type { TableProps as AntdTableProps } from "antd";
import { SmPayAdvertiserStautsOrderType } from "./smpay";

export interface TableParams {
  pagination?: {
    current: number;
    pageSize: number;
    total?: number;
  };
  sortField?: string;
  sortOrder?: SortOrder;
  filters?: Record<string, AntdFilterValue | null>;
  keyword?: string;
  orderType?: SmPayAdvertiserStautsOrderType;
}

export type TableProps<T> = AntdTableProps<T>;

export type FilterValue = AntdFilterValue;
