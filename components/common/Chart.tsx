"use client";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const data = [
  { date: "04.03", cost: 30, ctr: 0.03 },
  { date: "04.04", cost: 45, ctr: 0.04 },
  { date: "04.05", cost: 28, ctr: 0.032 },
  { date: "04.06", cost: 35, ctr: 0.029, highlight: true }, // 강조 막대
  { date: "04.07", cost: 22, ctr: 0.031 },
  { date: "04.08", cost: 31, ctr: 0.035 },
  { date: "04.09", cost: 36, ctr: 0.033 },
];

export default function Chart({
  showRightYAxis = false,
}: {
  showRightYAxis?: boolean;
}) {
  return (
    <div className="w-full h-[45vh]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" />
          {showRightYAxis && <YAxis yAxisId="right" orientation="right" />}
          <Tooltip
            formatter={(value: number, name: string) => {
              return name === "ctr"
                ? [`${(value * 100).toFixed(1)}%`, "CTR"]
                : [value.toLocaleString(), "광고비"];
            }}
            labelFormatter={(label) => `${label}`}
          />
          <Legend />
          <Bar
            yAxisId="left"
            dataKey="cost"
            name="광고비"
            barSize={20}
            fill="#2D5FFF"
            // 강조된 날짜만 색상 변경
            shape={(props: any) => {
              const { x, y, width, height, fill, payload } = props;
              const color = payload.highlight ? "#FFC700" : fill;
              return (
                <rect x={x} y={y} width={width} height={height} fill={color} />
              );
            }}
          />
          <Line
            yAxisId={showRightYAxis ? "right" : "left"}
            type="monotone"
            dataKey="ctr"
            name="CTR"
            stroke="#2D5FFF"
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
