import { useMemo, useState } from "react";

import Table from "@/components/composite/table";
import CheckboxLabel from "@/components/composite/checkbox-label";
import { columns } from "./constants";
import { SmPayChargeRecoveryDto } from "@/types/dto/smpay";
import { TableParams } from "@/types/table";
import { calcRowSpan } from "@/utils/format";
import { useSidebar } from "@/components/ui/sidebar";
import { useWindowSize } from "@/hooks/useWindowSize";
import { cn } from "@/lib/utils";

const defaultCheckedList = columns.map((item) => item.key);

type Props = {
  dataSource: SmPayChargeRecoveryDto[];
  tableParams: TableParams;
  setTableParams: (params: TableParams) => void;
};
const TableSection = ({ dataSource }: Props) => {
  const [checkedList, setCheckedList] = useState(defaultCheckedList || []);

  const { state } = useSidebar();
  const { width } = useWindowSize();

  const rowSpanArr = useMemo(
    () => calcRowSpan<SmPayChargeRecoveryDto>([], "agencyName"),
    []
  );
  const newColumns = useMemo(
    () =>
      columns.map((item) => {
        if (item.key === "userName") {
          return {
            ...item,
            hidden: !checkedList.includes(item.key as string),
            onCell: (_: SmPayChargeRecoveryDto, index?: number) => ({
              rowSpan: typeof index === "number" ? rowSpanArr[index] : 1,
            }),
          };
        }
        return {
          ...item,
          hidden: !checkedList.includes(item.key as string),
        };
      }),
    [checkedList, rowSpanArr]
  );

  const widthClass = useMemo(() => {
    // 매우 큰 모니터 (1920px 초과)

    if (width <= 1920 && width > 1440) {
      return state === "expanded" ? "max-w-[87vw]" : "max-w-[98vw]";
    }

    // 큰 모니터 (1440px 초과)
    if (width <= 1440 && width >= 1024) {
      return state === "expanded" ? "max-w-[82vw]" : "max-w-[98vw]";
    }

    // 중간 모니터 (1024px 초과)
    if (width > 1024) {
      return state === "expanded" ? "max-w-[80.5vw]" : "max-w-[97vw]";
    }

    // 작은 모니터 (1024px 이하)
    if (width <= 1024) {
      return state === "expanded" ? "max-w-[82vw]" : "max-w-[96vw]";
    }

    return "max-w-[98vw]";
  }, [width, state]);
  console.log(widthClass, width);

  return (
    <section>
      <div className="w-full flex flex-wrap gap-4  py-4 mb-2 border-b border-[#656565]">
        {columns
          .filter((col) => col.key !== "situation")
          .map((item) => (
            <CheckboxLabel
              key={item.key}
              isChecked={checkedList.includes(item.key as string)}
              onChange={(checked) => {
                setCheckedList((prev) =>
                  checked
                    ? [...prev, item.key as string]
                    : prev.filter((key) => key !== item.key)
                );
              }}
              label={item.title as string}
            />
          ))}
      </div>

      <div className={cn("w-full", widthClass)}>
        <Table<SmPayChargeRecoveryDto>
          columns={newColumns}
          dataSource={dataSource}
          total={dataSource.length}
          scroll={{ x: 2000 }}
        />
      </div>
    </section>
  );
};

export default TableSection;
