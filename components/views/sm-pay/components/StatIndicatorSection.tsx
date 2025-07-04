import { useState } from "react";
import { CircleCheckBig, X } from "lucide-react";

import LoadingUI from "@/components/common/Loading";

import {
  DescriptionItem,
  Descriptions,
} from "@/components/composite/description-components";
import { HelpIcon } from "@/components/composite/icon-components";
import { LabelBullet } from "@/components/composite/label-bullet";
import { TooltipHover } from "@/components/composite/tooltip-components";
import { TOOLTIP_CONTENT } from "@/constants/hover";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/composite/modal-components";
import Table from "@/components/composite/table";

import { useSmPayAdvertiserDailyStat } from "@/hooks/queries/sm-pay";

import type { SmPayStatIndicator } from "@/types/smpay";
import type { DailyStatDto } from "@/types/dto/smpay";
import type { TableProps } from "@/types/table";

type Props = {
  advertiserId: number;
  statIndicator?: SmPayStatIndicator | null;
};

const StatIndicatorSection = ({ advertiserId, statIndicator }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section>
      {isModalOpen && (
        <TableModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          advertiserId={advertiserId}
        />
      )}
      <div className="flex items-center gap-4 py-4">
        <LabelBullet labelClassName="text-base font-bold">
          광고 성과 기반 참고용 심사 지표
        </LabelBullet>
        <TooltipHover
          triggerContent={<HelpIcon />}
          content={TOOLTIP_CONTENT["advertiser_performance"]}
        />

        <Button onClick={() => setIsModalOpen(true)}>일별 성과 조회</Button>
      </div>
      <Descriptions bordered columns={2}>
        <DescriptionItem
          label={<span className="font-bold">심사 항목</span>}
          styles={descriptionStyle}
        >
          <span className="font-bold">권장 기준</span>
        </DescriptionItem>
        <DescriptionItem
          label={<span className="font-bold">광고주 데이터</span>}
          styles={descriptionStyle}
        >
          <span className="font-bold">적합 여부</span>
        </DescriptionItem>
        <DescriptionItem
          styles={descriptionStyle}
          label={
            <div className="font-normal">
              <p className="font-bold">광고 운영 기간</p>
            </div>
          }
        >
          <div className="flex items-center gap-2">
            <p>3개월 이상</p>
            <p
              className="text-xs text-gray-500 w-auto whitespace-nowrap"
              style={{ width: 5 }}
            >
              (1개월 단위로 계산되며, 일 수는 제외하고 1개월은 28일로
              간주합니다.)
            </p>
          </div>
        </DescriptionItem>
        <DescriptionItem
          // TODO :  적합 여부에 따라 색상 변경
          styles={incongruityStyle}
          label={
            <span className="font-bold">
              {statIndicator?.operationPeriod || 0}개월
            </span>
          }
        >
          {statIndicator?.operationPeriod &&
          statIndicator?.operationPeriod >= 3 ? (
            <CircleCheckBig color="#34C759" />
          ) : (
            <X color="#FF3B30" />
          )}
        </DescriptionItem>
        <DescriptionItem
          styles={descriptionStyle}
          label={<span className="font-bold">일 평균 ROAS</span>}
        >
          400% 이상
        </DescriptionItem>

        <DescriptionItem
          // TODO :  적합 여부에 따라 색상 변경
          styles={conformityStyle}
          label={
            <span className="font-bold">
              {statIndicator?.dailyAverageRoas || 0}%
            </span>
          }
        >
          {statIndicator?.dailyAverageRoas &&
          statIndicator?.dailyAverageRoas >= 400 ? (
            <CircleCheckBig color="#34C759" />
          ) : (
            <X color="#FF3B30" />
          )}
        </DescriptionItem>

        <DescriptionItem
          styles={descriptionStyle}
          label={<span className="font-bold">월 평균 전환 매출</span>}
        >
          300만원 이상
        </DescriptionItem>

        <DescriptionItem
          styles={conformityStyle}
          label={
            <span className="font-bold">
              {Number(statIndicator?.monthlyConvAmt || 0).toLocaleString()}원
            </span>
          }
        >
          {statIndicator?.monthlyConvAmt &&
          statIndicator?.monthlyConvAmt >= 3000000 ? (
            <CircleCheckBig color="#34C759" />
          ) : (
            <X color="#FF3B30" />
          )}
        </DescriptionItem>

        <DescriptionItem
          styles={descriptionStyle}
          label={<span className="font-bold">일 평균 소진 광고비</span>}
        >
          10만원 이상
        </DescriptionItem>
        <DescriptionItem
          styles={conformityStyle}
          label={
            <span className="font-bold">
              {Number(statIndicator?.dailySalesAmt || 0).toLocaleString()}원
            </span>
          }
        >
          {statIndicator?.dailySalesAmt &&
          statIndicator?.dailySalesAmt >= 100000 ? (
            <CircleCheckBig color="#34C759" />
          ) : (
            <X color="#FF3B30" />
          )}
        </DescriptionItem>
      </Descriptions>
    </section>
  );
};

export default StatIndicatorSection;

const incongruityStyle = {
  content: { backgroundColor: "#FCECEC" },
  label: { backgroundColor: "#FCECEC" },
};

const conformityStyle = {
  content: { backgroundColor: "#EFF9F3" },
  label: { backgroundColor: "#EFF9F3" },
};

const descriptionStyle = {
  content: { backgroundColor: "rgba(0, 0, 0, 0.02)" },
};

type TableModalProps = {
  open: boolean;
  onClose: () => void;
  advertiserId: number;
};

const TableModal = ({ open, onClose, advertiserId }: TableModalProps) => {
  const { data: dataSource, isPending } =
    useSmPayAdvertiserDailyStat(advertiserId);
  return (
    <Modal
      open={open}
      onConfirm={onClose}
      cancelDisabled
      title="일별 성과 조회"
      width="95vw"
    >
      {isPending && <LoadingUI />}
      <div className="w-full max-h-[70vh] overflow-y-auto">
        <Table<DailyStatDto>
          dataSource={dataSource}
          columns={columns}
          rowKey={(record) => record.no}
          pagination={false}
        />
      </div>
    </Modal>
  );
};

const columns: TableProps<DailyStatDto>["columns"] = [
  {
    title: "NO",
    dataIndex: "no",
    key: "no",
    width: 50,
  },
  {
    title: "날짜",
    dataIndex: "date",
    key: "date",
    width: 120,
  },
  {
    title: "노출수",
    dataIndex: "impCnt",
    key: "impCnt",
    align: "right",
    render: (value: number) => value.toLocaleString(),
    sorter: (a, b) => a.impCnt - b.impCnt,
    width: 100,
  },
  {
    title: "클릭수",
    dataIndex: "clkCnt",
    key: "clkCnt",
    align: "right",
    render: (value: number) => value.toLocaleString(),
    sorter: (a, b) => a.clkCnt - b.clkCnt,
    width: 100,
  },
  {
    title: "클릭단가",
    dataIndex: "cpc",
    key: "cpc",
    align: "right",
    render: (value: number) => value.toLocaleString(),
    sorter: (a, b) => a.cpc - b.cpc,
    width: 100,
  },
  {
    title: "광고비",
    dataIndex: "salesAmt",
    key: "salesAmt",
    align: "right",
    render: (value: number) => value.toLocaleString() + "원",
    sorter: (a, b) => a.salesAmt - b.salesAmt,
    width: 120,
  },
  {
    title: "전환수",
    dataIndex: "ccnt",
    key: "ccnt",
    align: "right",
    render: (value: number) => value.toLocaleString(),
    sorter: (a, b) => a.ccnt - b.ccnt,
    width: 100,
  },
  {
    title: "전환율",
    dataIndex: "crto",
    key: "crto",
    align: "right",
    render: (value: number) => (value * 100).toFixed(2) + "%",
    sorter: (a, b) => a.crto - b.crto,
    width: 100,
  },
  {
    title: "전환단가",
    dataIndex: "cpConv",
    key: "cpConv",
    align: "right",
    render: (value: number) => value.toLocaleString(),
    sorter: (a, b) => a.cpConv - b.cpConv,
    width: 100,
  },
  {
    title: "전환매출액",
    dataIndex: "convAmt",
    key: "convAmt",
    align: "right",
    render: (value: number) => value.toLocaleString() + "원",
    sorter: (a, b) => a.convAmt - b.convAmt,
    width: 120,
  },
  {
    title: "ROAS",
    dataIndex: "ror",
    key: "ror",
    align: "right",
    render: (value: number) => (value * 100).toFixed(0) + "%",
    sorter: (a, b) => a.ror - b.ror,
    width: 80,
  },
];
