"use client";

import { useState, useEffect } from "react";
import { Descriptions as AntdDescriptions } from "antd";
import { Skeleton } from "@/components/ui/skeleton";

export type DescriptionProps = {
  columns?: number;
  bordered?: boolean;
  className?: string;
  children: React.ReactNode;
  styles?: {
    label?: {
      width?: number;
      fontWeight?: string;
    };
  };
};

export type DescriptionItemProps = {
  label: string | React.ReactNode;
  children: React.ReactNode;
  span?: number;
  className?: string;
  styles?: {
    content?: React.CSSProperties;
    label?: React.CSSProperties;
  };
};

export function DescriptionItem({
  label,
  children,
  span,
  className,
  styles,
}: DescriptionItemProps) {
  return (
    <AntdDescriptions.Item
      label={label}
      span={span}
      className={className}
      styles={styles}
    >
      {children}
    </AntdDescriptions.Item>
  );
}

export function Descriptions({
  columns = 2,
  bordered = true,
  className = "",
  children,
  styles = { label: { width: 200, fontWeight: "bold" } },
}: DescriptionProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-2">
        <div className="flex gap-4">
          <Skeleton className="h-10 w-[200px]" />
          <Skeleton className="h-10 w-[200px]" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-10 w-[200px]" />
          <Skeleton className="h-10 w-[200px]" />
        </div>
      </div>
    );
  }

  return (
    <AntdDescriptions
      column={columns}
      bordered={bordered}
      className={className}
      styles={styles}
    >
      {children}
    </AntdDescriptions>
  );
}

type SubDescItemProps = {
  children: React.ReactNode;
};
export const SubDescItem = ({ children }: SubDescItemProps) => {
  return (
    <span className="w-1/2 text-sm h-[53px] bg-[#F8F8FA] flex items-center pl-2">
      {children}
    </span>
  );
};

Descriptions.Item = DescriptionItem;
Descriptions.SubDescItem = SubDescItem;
