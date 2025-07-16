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
  { date: "04.03", charge: 30, trend: 25 },
  { date: "04.04", charge: 45, trend: 35 },
  { date: "04.05", charge: 28, trend: 20 },
  { date: "04.06", charge: 35, trend: 32, highlight: true }, // 강조 막대
  { date: "04.07", charge: 22, trend: 18 },
  { date: "04.08", charge: 31, trend: 28 },
  { date: "04.09", charge: 36, trend: 30 },
];

export default function Chart2({
  showRightYAxis = false,
}: {
  showRightYAxis?: boolean;
}) {
  return (
    <div className="w-full h-[45vh] mt-12">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" />
          {showRightYAxis && <YAxis yAxisId="right" orientation="right" />}
          <Tooltip
            formatter={(value: number, name: string) => {
              return name === "trend"
                ? [value.toLocaleString(), "추세선"]
                : [value.toLocaleString(), "충전금액"];
            }}
            labelFormatter={(label) => `${label}`}
          />
          <Legend
            formatter={(value) => (value === "charge" ? "충전금액" : "추세선")}
          />
          <Bar
            yAxisId="left"
            dataKey="charge"
            name="충전금액"
            barSize={20}
            fill="#181C32"
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
            dataKey="trend"
            name="추세선"
            stroke="#2D5FFF"
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
