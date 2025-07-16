import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

import Chart from "@/components/common/Chart";

import {
  useQueryDashboardAdvertiserOperationStatusChart as queryChart,
  useQueryDashboardAllAdvertiserOperationStatusChart as queryAllChart,
} from "@/hooks/queries/dashboard";
import { LabelBullet } from "@/components/composite/label-bullet";

const radioOptions = [
  { value: "all", label: "전체 광고주" },
  { value: "sm-pay", label: "SM Pay 광고주" },
];

const ChartAdvertiserPerformance = () => {
  const [radioValue, setRadioValue] = useState("all");
  const { data: chartData, isFetching } = queryChart();
  const { data: allChartData, isFetching: isFetchingAll } = queryAllChart();

  return (
    <Card>
      <CardHeader>
        <LabelBullet labelClassName="text-base font-bold">
          광고성과 추이
        </LabelBullet>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={radioValue}
          onValueChange={setRadioValue}
          className="flex gap-4 my-4"
        >
          {radioOptions.map((opt) => (
            <div key={opt.value} className="flex items-center gap-1">
              <RadioGroupItem value={opt.value} id={opt.value} />
              <Label htmlFor={opt.value}>{opt.label}</Label>
            </div>
          ))}
        </RadioGroup>
        <Chart data={radioValue === "all" ? allChartData : chartData} />
      </CardContent>
    </Card>
  );
};

export default ChartAdvertiserPerformance;
