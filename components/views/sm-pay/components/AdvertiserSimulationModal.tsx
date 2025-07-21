import { Volume2 } from "lucide-react";
import { GuideBox } from "@/components/common/Box";
import { Modal } from "@/components/composite/modal-components";
import Table from "@/components/composite/table";

import type { TableProps } from "antd";
import type {
  ChargeRule,
  PrePaymentSchedule,
  SmPayStatIndicator,
} from "@/types/smpay";

type Props = {
  open: boolean;
  onClose: () => void;
  upChargeRule?: ChargeRule;
  downChargeRule?: ChargeRule;
  prePaymentSchedule?: PrePaymentSchedule;
  statIndicator?: SmPayStatIndicator;
};

/**
 * 시뮬레이션 데이터 생성
 */
const generateSimulationData = (
  upChargeRule?: ChargeRule,
  prePaymentSchedule?: PrePaymentSchedule,
  statIndicator?: SmPayStatIndicator
) => {
  const currentRoas = statIndicator?.dailyAverageRoas || 0;
  const monthlyConvAmt = statIndicator?.monthlyConvAmt || 0;
  const dailyConvAmt = monthlyConvAmt / 28; // 28일 평균

  // 적용 전 기본값 설정
  const PRE_BASE_CHARGE = prePaymentSchedule?.initialAmount || 0;

  const DAYS = 28;

  // SM Pay 적용 전 데이터 (고정)
  const beforeData: SimulationTableRow[] = [];
  let beforeTotalAdCost = 0;
  let beforeTotalRevenue = 0;

  for (let i = 1; i <= DAYS; i++) {
    const adCost = PRE_BASE_CHARGE; // 매일 동일한 금액
    const revenue = Math.ceil(adCost * (currentRoas / 100)); // 광고비 * ROAS, 소수점 올림

    beforeTotalAdCost += adCost;
    beforeTotalRevenue += revenue;

    beforeData.push({
      id: i,
      date: `${i}일차`,
      adCost,
      conversionRevenue: revenue,
      roas: currentRoas,
    });
  }

  // 합계 행 추가
  beforeData.unshift({
    id: 0,
    date: "합계",
    adCost: beforeTotalAdCost,
    conversionRevenue: beforeTotalRevenue,
    roas: currentRoas,
  });

  // 적용 후 기본값 설정
  const TARGET_ROAS = upChargeRule?.standardRoasPercent || 0;
  const BASE_CHARGE = prePaymentSchedule?.initialAmount || 0;
  const INCREASE_AMOUNT = upChargeRule?.changePercentOrValue || 0;
  const IS_FIXED_AMOUNT = upChargeRule?.boundType === "FIXED_AMOUNT";

  // SM Pay 적용 후 데이터 (점진적 증가)
  const afterData: SimulationTableRow[] = [];
  let afterTotalAdCost = 0;
  let afterTotalRevenue = 0;

  for (let i = 1; i <= DAYS; i++) {
    let adCost: number;

    if (IS_FIXED_AMOUNT) {
      // 정액 방식: 매일 고정 금액씩 증가
      if (i === 1) {
        adCost = BASE_CHARGE; // 1일차는 기본 금액
      } else {
        adCost = BASE_CHARGE + INCREASE_AMOUNT * (i - 1); // 2일차부터 증가
      }
    } else {
      // 정률 방식: 등비수열로 증가 (ROAS 무시)
      if (i === 1) {
        adCost = BASE_CHARGE; // 1일차는 기본 금액
      } else {
        adCost = BASE_CHARGE * Math.pow(1 + INCREASE_AMOUNT / 100, i - 1);
      }
    }

    // 최대 한도 적용
    const maxLimit = prePaymentSchedule?.maxChargeLimit;
    if (maxLimit && adCost > maxLimit) {
      adCost = maxLimit;
    }

    // 소수점 없이 원 단위로 반올림
    adCost = Math.round(adCost);

    let revenue = adCost * (TARGET_ROAS / 100);
    revenue = Math.round(revenue);

    afterTotalAdCost += adCost;
    afterTotalRevenue += revenue;

    afterData.push({
      id: i,
      date: `${i}일차`,
      adCost,
      conversionRevenue: revenue,
      roas: TARGET_ROAS,
    });
  }

  // 합계 행 추가
  afterData.unshift({
    id: 0,
    date: "합계",
    adCost: afterTotalAdCost,
    conversionRevenue: afterTotalRevenue,
    roas: TARGET_ROAS,
  });

  return { beforeData, afterData };
};

const AdvertiserSimulationModal = ({
  open,
  onClose,
  upChargeRule,
  downChargeRule,
  prePaymentSchedule,
  statIndicator,
}: Props) => {
  // 필수 값들이 입력되었는지 확인
  const hasValidInput =
    upChargeRule?.standardRoasPercent &&
    upChargeRule?.changePercentOrValue &&
    prePaymentSchedule?.initialAmount &&
    prePaymentSchedule?.maxChargeLimit &&
    prePaymentSchedule?.maxChargeLimit >= prePaymentSchedule?.initialAmount &&
    prePaymentSchedule?.initialAmount >= 10000;

  const { beforeData, afterData } = hasValidInput
    ? generateSimulationData(upChargeRule, prePaymentSchedule, statIndicator)
    : { beforeData: [], afterData: [] };

  // 전환매출액 합계 비교로 개선률 계산
  let improvementRate = "0";

  if (hasValidInput && beforeData.length > 0 && afterData.length > 0) {
    // 합계 데이터 찾기 (id가 0인 행)
    const beforeTotal = beforeData.find((item) => item.id === 0);
    const afterTotal = afterData.find((item) => item.id === 0);

    if (beforeTotal && afterTotal && beforeTotal.conversionRevenue > 0) {
      const rate = afterTotal.conversionRevenue / beforeTotal.conversionRevenue;
      improvementRate = isFinite(rate) ? rate.toFixed(2) : "0";
    }
  }

  // 설정된 규칙 정보
  const targetRoas = upChargeRule?.standardRoasPercent || 0;
  const increaseAmount = upChargeRule?.changePercentOrValue || 0;
  const decreaseAmount = downChargeRule?.changePercentOrValue || 0;
  const increaseType =
    upChargeRule?.boundType === "FIXED_AMOUNT" ? "원씩" : "%씩";
  const decreaseType =
    downChargeRule?.boundType === "FIXED_AMOUNT" ? "원씩" : "%씩";

  return (
    <Modal
      contentClassName="py-0"
      title="광고 성과 예측 시뮬레이션"
      open={open}
      onClose={onClose}
      onConfirm={onClose}
      cancelDisabled
    >
      <div className="w-[85vw] h-[70vh] overflow-y-auto">
        {!hasValidInput ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <p className="text-lg mb-2">
                시뮬레이션을 실행하려면 다음 값들을 입력해주세요:
              </p>
              <ul className="text-sm space-y-1">
                <li>• 기준 ROAS</li>
                <li>• 충전 증감 정액/정률</li>
                <li>• 최초 충전 금액 : 10,000원 이상</li>
                <li>• 일 최대 충전 한도 : 최초 충전 금액보다 이상 </li>
              </ul>
            </div>
          </div>
        ) : (
          <>
            <GuideBox className="mb-2 !flex !flex-col !items-start !justify-start text-left !font-normal !text-sm">
              <div className="flex items-center gap-2">
                <Volume2 />
                <p className="text-lg font-bold">주요 인사이트</p>
              </div>

              <p>
                이 전략으로 28일간 운용 시 전환매출액이{" "}
                <strong className="text-lg">
                  {improvementRate}%{" "}
                  {parseFloat(improvementRate) > 1 ? "상승" : "하락"}할 것으로
                  예상
                </strong>
                됩니다.
              </p>
              <p className="mb-3">
                설정 기준 : 기준 ROAS {targetRoas}% 이상이면 충전 금액을{" "}
                {upChargeRule?.boundType === "FIXED_AMOUNT"
                  ? "정액으로"
                  : "정률로"}{" "}
                {increaseAmount}
                {increaseType}
                증가하고 {targetRoas}%의 미만이면 충전 금액을{" "}
                {downChargeRule?.boundType === "FIXED_AMOUNT"
                  ? "정액으로"
                  : "정률로"}{" "}
                {decreaseAmount}
                {decreaseType} 감액
              </p>

              <p>
                예상 성과는 입력된 기준 ROAS와 증액 조건을 기반으로 28일간
                매일의 광고비와 전환매출액을 예측합니다.
              </p>
              <p>
                자동 증액은 최대 한도 도달 시 중단되며, ROAS는 고정값으로
                계산됩니다.
              </p>
            </GuideBox>

            <div className="flex justify-around gap-8">
              <div className="w-[50%]">
                <p className="flex flex-col text-center sm:text-left px-4 py-2 bg-[#EB680E] text-white mb-2 text-sm ">
                  SM Pay 적용 전
                </p>
                <Table<SimulationTableRow>
                  dataSource={beforeData}
                  columns={columns}
                  pagination={false}
                  rowClassName={(record) =>
                    record.id === 0 ? "font-bold bg-gray-50" : ""
                  }
                />
              </div>
              <div className="w-[50%]">
                <p className="flex flex-col text-center sm:text-left px-4 py-2 bg-[#0066FF] text-white mb-2 text-sm">
                  SM Pay 적용 후
                </p>
                <Table<SimulationTableRow>
                  dataSource={afterData}
                  columns={afterColumns}
                  pagination={false}
                  rowClassName={(record) =>
                    record.id === 0 ? "font-bold bg-blue-50" : ""
                  }
                />
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default AdvertiserSimulationModal;

type SimulationTableRow = {
  id: number;
  date: string;
  adCost: number;
  conversionRevenue: number;
  roas: number;
};

const columns: TableProps<SimulationTableRow>["columns"] = [
  {
    title: "날짜",
    dataIndex: "date",
    key: "date",
    align: "center",
    width: 100,
  },
  {
    title: "광고비",
    dataIndex: "adCost",
    key: "adCost",
    align: "right",
    render: (value: number) => value.toLocaleString() + "원",
    width: 120,
  },
  {
    title: "전환매출액",
    dataIndex: "conversionRevenue",
    key: "conversionRevenue",
    align: "right",
    render: (value: number) => value.toLocaleString() + "원",
    width: 140,
  },
  {
    title: "ROAS",
    dataIndex: "roas",
    key: "roas",
    align: "right",
    render: (value: number) => value.toFixed(0) + "%",
    width: 80,
  },
];

const afterColumns: TableProps<SimulationTableRow>["columns"] = [
  {
    title: "날짜",
    dataIndex: "date",
    key: "date",
    align: "center",
    width: 100,
  },
  {
    title: "광고비",
    dataIndex: "adCost",
    key: "adCost",
    align: "right",
    render: (value: number, record) => (
      <span
        className={
          record.id === 0 ? "text-blue-600 font-bold" : "text-blue-600"
        }
      >
        {value.toLocaleString()}원
      </span>
    ),
    width: 120,
  },
  {
    title: "전환매출액",
    dataIndex: "conversionRevenue",
    key: "conversionRevenue",
    align: "right",
    render: (value: number, record) => (
      <span
        className={
          record.id === 0 ? "text-blue-600 font-bold" : "text-blue-600"
        }
      >
        {value.toLocaleString()}원
      </span>
    ),
    width: 140,
  },
  {
    title: "ROAS",
    dataIndex: "roas",
    key: "roas",
    align: "right",
    render: (value: number, record) => (
      <span
        className={
          record.id === 0 ? "text-blue-600 font-bold" : "text-blue-600"
        }
      >
        {value.toFixed(0)}%
      </span>
    ),
    width: 80,
  },
];
