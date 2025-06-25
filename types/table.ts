import type {
  FilterValue as AntdFilterValue,
  SortOrder,
} from "antd/es/table/interface";
import type { TableProps as AntdTableProps } from "antd";
import type { ColumnsType as AntdColumnsType } from "antd/es/table";

export interface TableParams<T = any> {
  pagination?: {
    current: number;
    pageSize: number;
    total?: number;
  };
  sortField?: string;
  sortOrder?: SortOrder;
  filters?: Record<string, AntdFilterValue | null>;
  keyword?: string;
  orderType?: T;
}

export type ColumnsType<T> = AntdColumnsType<T>;

export type TableProps<T> = AntdTableProps<T>;

export type FilterValue = AntdFilterValue;
