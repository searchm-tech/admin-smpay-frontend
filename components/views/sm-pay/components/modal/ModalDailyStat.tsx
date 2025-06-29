import LoadingUI from "@/components/common/Loading";
import { Modal } from "@/components/composite/modal-components";
import Table from "@/components/composite/table";
import { useSmPayAdvertiserDailyStat } from "@/hooks/queries/sm-pay";
import { calculateDailyTotal } from "@/utils/format";
import type { DailyStat } from "@/types/smpay";
import type { TableProps } from "@/types/table";

type TableModalProps = {
  open: boolean;
  onClose: () => void;
  advertiserId: number;
};

// TODO : 추후 삭제
const ModalDailyStat = ({ open, onClose, advertiserId }: TableModalProps) => {
  const { data, isPending } = useSmPayAdvertiserDailyStat(advertiserId);

  const totals = calculateDailyTotal(data);

  // 테이블 데이터 구성
  const tableData = [
    // 합계 행
    ...(totals
      ? [
          {
            id: 0,
            date: "-",
            advertiserId: 0,
            ...totals,
          },
        ]
      : []),
    // 실제 데이터
    ...(data || []),
  ];

  return (
    <Modal open={open} onClose={onClose} title="일별 성과 조회" width="95vw">
      {isPending && <LoadingUI />}
      <div className="w-full max-h-[70vh] overflow-y-auto">
        <Table<DailyStat>
          dataSource={tableData}
          columns={columns}
          rowKey={(record) => record.id}
          pagination={false}
          rowClassName={(record) =>
            record.id === 0 ? "bg-gray-50 font-semibold" : ""
          }
        />
      </div>
    </Modal>
  );
};

export default ModalDailyStat;

const columns: TableProps<DailyStat>["columns"] = [
  {
    title: "NO",
    dataIndex: "advertiserId",
    key: "advertiserId",
    width: 80,
    align: "center",
    render: (value: string, record) => {
      if (record.id === 0) {
        return <span className="font-bold text-gray-800">합계</span>;
      }
      return value;
    },
  },
  {
    title: "날짜",
    dataIndex: "date",
    key: "date",
    width: 180,
    align: "center",
    render: (value: string, record) => {
      if (record.id === 0) {
        return <span className="font-bold text-gray-800">{value}</span>;
      }
      return value;
    },
  },
  {
    title: "노출수",
    dataIndex: "impCnt",
    key: "impCnt",
    align: "right",
    render: (value: number, record) => {
      const formatted = value.toLocaleString();
      return record.id === 0 ? (
        <span className="font-bold text-gray-800">{formatted}</span>
      ) : (
        formatted
      );
    },
    sorter: (a, b) => a.impCnt - b.impCnt,
    width: 100,
  },
  {
    title: "클릭수",
    dataIndex: "clkCnt",
    key: "clkCnt",
    align: "right",
    render: (value: number, record) => {
      const formatted = value.toLocaleString();
      return record.id === 0 ? (
        <span className="font-bold text-gray-800">{formatted}</span>
      ) : (
        formatted
      );
    },
    sorter: (a, b) => a.clkCnt - b.clkCnt,
    width: 100,
  },
  {
    title: "클릭단가",
    dataIndex: "cpc",
    key: "cpc",
    align: "right",
    render: (value: number, record) => {
      const formatted = Math.round(value).toLocaleString();
      return record.id === 0 ? (
        <span className="font-bold text-gray-800">{formatted}</span>
      ) : (
        formatted
      );
    },
    sorter: (a, b) => a.cpc - b.cpc,
    width: 120,
  },
  {
    title: "광고비",
    dataIndex: "salesAmt",
    key: "salesAmt",
    align: "right",
    render: (value: number, record) => {
      const formatted = value.toLocaleString() + "원";
      return record.id === 0 ? (
        <span className="font-bold text-gray-800">{formatted}</span>
      ) : (
        formatted
      );
    },
    sorter: (a, b) => a.salesAmt - b.salesAmt,
    width: 120,
  },
  {
    title: "전환수",
    dataIndex: "ccnt",
    key: "ccnt",
    align: "right",
    render: (value: number, record) => {
      const formatted = value.toLocaleString();
      return record.id === 0 ? (
        <span className="font-bold text-gray-800">{formatted}</span>
      ) : (
        formatted
      );
    },
    sorter: (a, b) => a.ccnt - b.ccnt,
    width: 100,
  },
  {
    title: "전환율",
    dataIndex: "crto",
    key: "crto",
    align: "right",
    render: (value: number, record) => {
      const formatted = (value * 100).toFixed(2) + "%";
      return record.id === 0 ? (
        <span className="font-bold text-gray-800">{formatted}</span>
      ) : (
        formatted
      );
    },
    sorter: (a, b) => a.crto - b.crto,
    width: 100,
  },
  {
    title: "전환단가",
    dataIndex: "cpConv",
    key: "cpConv",
    align: "right",
    render: (value: number, record) => {
      const formatted = Math.round(value).toLocaleString();
      return record.id === 0 ? (
        <span className="font-bold text-gray-800">{formatted}</span>
      ) : (
        formatted
      );
    },
    sorter: (a, b) => a.cpConv - b.cpConv,
    width: 150,
  },
  {
    title: "매출액",
    dataIndex: "convAmt",
    key: "convAmt",
    align: "right",
    render: (value: number, record) => {
      const formatted = value.toLocaleString() + "원";
      return record.id === 0 ? (
        <span className="font-bold text-gray-800">{formatted}</span>
      ) : (
        formatted
      );
    },
    sorter: (a, b) => a.convAmt - b.convAmt,
    width: 120,
  },
  {
    title: "ROAS",
    dataIndex: "ror",
    key: "ror",
    align: "right",
    render: (value: number, record) => {
      const formatted = (value * 100).toFixed(0) + "%";
      return record.id === 0 ? (
        <span className="font-bold text-gray-800">{formatted}</span>
      ) : (
        formatted
      );
    },
    sorter: (a, b) => a.ror - b.ror,
    width: 80,
  },
];
