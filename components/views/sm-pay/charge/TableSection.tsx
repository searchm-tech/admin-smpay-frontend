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
    if (width < 1920 && width > 1440) {
      return state === "expanded" ? "max-w-[87vw]" : "max-w-[98vw]";
    }

    if (width <= 1440 && width >= 1024) {
      return state === "expanded" ? "max-w-[83vw]" : "max-w-[98vw]";
    }

    return state === "expanded" ? "max-w-[92vw]" : "max-w-[98vw]";
  }, [width, state]);

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
