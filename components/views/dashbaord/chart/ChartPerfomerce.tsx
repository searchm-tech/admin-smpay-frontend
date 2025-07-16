import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Chart2 from "@/components/common/Chart2";

// TODO : 추후 작업
const ChartPerfomerce = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="h-12 flex items-center">
          <span className="text-base font-bold">광고 성과 추이</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Chart2 />
      </CardContent>
    </Card>
  );
};

export default ChartPerfomerce;
