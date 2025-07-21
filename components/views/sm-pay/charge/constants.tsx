import { SquareCheckBig, SquareX, TriangleAlert } from "lucide-react";
import { format } from "date-fns";
import type { SmPayChargeRecoveryDto } from "@/types/dto/smpay";
import type { ColumnsType } from "@/types/table";

export const columns: ColumnsType<SmPayChargeRecoveryDto> = [
  {
    key: "agencyName",
    title: "대행사",
    dataIndex: "agencyName",
    align: "center",
  },
  {
    key: "customerId",
    title: "CUSTOMER ID",
    dataIndex: "customerId",
    align: "center",
    width: 150,
  },
  {
    key: "advertiserCode",
    title: "광고주",
    dataIndex: "advertiserCode",
    align: "center",
  },
  {
    key: "orderDate",
    title: "거래일자",
    dataIndex: "orderDate",
    align: "center",
    width: 180,
    render: (value) => format(value, "yyyy-MM-dd HH:mm:ss"),
  },
  {
    key: "orderNumber",
    title: "거래번호",
    dataIndex: "orderNumber",
    align: "center",
    width: 150,
  },
  {
    key: "bankName",
    title: "은행",
    dataIndex: "bankName",
    align: "center",
  },
  {
    key: "accountNumber",
    title: "계좌번호",
    dataIndex: "accountNumber",
    align: "center",
    width: 180,
  },
  {
    key: "accountHolderName",
    title: "예금주",
    dataIndex: "accountHolderName",
    align: "center",
  },
  {
    key: "paymentAmount",
    title: "금액",
    dataIndex: "paymentAmount",
    align: "center",
    render: (value) => value && value.toLocaleString(),
  },
  {
    key: "previousBalance",
    title: "이전대비 변화액",
    dataIndex: "previousBalance",
    align: "center",
    render: (value) => {
      if (!value) {
        return "-";
      }

      return (
        <span className={value < 0 ? "text-red-500" : "text-blue-500"}>
          {value > 0 ? "+" : ""}
          {value && value.toLocaleString()}
        </span>
      );
    },
  },
  {
    key: "changeRate",
    title: "이전대비 변화율",
    dataIndex: "changeRate",
    align: "center",
    render: (value) => {
      if (!value) {
        return "-";
      }

      return (
        <span className={value < 0 ? "text-red-500" : "text-blue-500"}>
          {value > 0 ? "+" : ""}
          {value}%
        </span>
      );
    },
  },
  {
    key: "processedDate",
    title: "상환일",
    dataIndex: "processedDate",
    align: "center",
    render: (value) => format(value, "yyyy-MM-dd"),
  },
  {
    key: "status",
    title: "상환일",
    dataIndex: "status",
    align: "center",
    fixed: "right",
    width: 90,
    render: (value) => {
      if (value === "FAILED") {
        return <TriangleAlert className="text-red-500 mx-auto" />;
      }

      if (value === "PENDING") {
        return <SquareX className="text-red-500 mx-auto" />;
      }

      if (value === "SUCCESS") {
        return <SquareCheckBig className="text-[#34C759] mx-auto" />;
      }
    },
  },
];
