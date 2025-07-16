"use client";

import {
  ComposedChart,
  Bar,
  // Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

// 커스텀 activeBar 컴포넌트 (hover 시 노란색)
const HighlightBar = (props: any) => {
  const { x, y, width, height } = props;
  return <rect x={x} y={y} width={width} height={height} fill="#FFC700" />;
};

// 만/억 단위 축약 함수 (세부 단위까지)
function formatKoreanUnit(value: number) {
  if (value >= 100000000) {
    // 억 단위, 소수점 한 자리
    return (value / 100000000).toFixed(value % 100000000 === 0 ? 0 : 1) + "억";
  }
  if (value >= 10000) {
    // 만 단위, 소수점 한 자리
    return (value / 10000).toFixed(value % 10000 === 0 ? 0 : 1) + "만";
  }
  if (value >= 1000) {
    // 천 단위 콤마
    return value.toLocaleString();
  }
  return value.toString();
}

export default function Chart({
  showRightYAxis = false,
  data,
}: {
  showRightYAxis?: boolean;
  data: any;
}) {
  return (
    <div className="w-full h-[45vh]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(date: string) => {
              if (!date) return "";
              const parts = date.split("-");
              if (parts.length === 3) return `${parts[1]}.${parts[2]}`;
              return date;
            }}
          />
          <YAxis yAxisId="left" tickFormatter={formatKoreanUnit} />
          {showRightYAxis && <YAxis yAxisId="right" orientation="right" />}
          <Tooltip
            formatter={(value: number, name: string) => {
              return name === "ctr"
                ? [`${(value * 100).toFixed(1)}%`, "CTR"]
                : [formatKoreanUnit(value), "광고비"];
            }}
            labelFormatter={(label) => `${label}`}
          />
          <Legend />
          <Bar
            yAxisId="left"
            dataKey="salesAmt"
            name="광고비"
            barSize={20}
            fill="#2D5FFF"
            activeBar={<HighlightBar />}
          />
          {/* <Line
            yAxisId={showRightYAxis ? "right" : "left"}
            type="monotone"
            dataKey="ctr"
            name="CTR"
            stroke="#2D5FFF"
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          /> */}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
