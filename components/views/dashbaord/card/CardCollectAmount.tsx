import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { CardLoading } from "./CardLoading";

const data = {
  title: "전일 회수 금액",
  value: "543,210",
  unit: "원",
  icon: "💼",
  iconBg: "bg-indigo-100",
};
const CardCollectAmount = () => {
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Card
      key={data.title}
      className="relative rounded-xl shadow bg-white p-6 flex flex-col justify-between min-h-[180px]"
    >
      {showLoading && <CardLoading />}
      <div
        className={showLoading ? "blur-sm pointer-events-none select-none" : ""}
      >
        <div className="flex justify-between items-center w-full">
          <span className="text-lg font-bold">전일 회수 금액</span>
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-100">
            <span className="text-2xl">💼</span>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start">
          <div className="flex items-end space-x-2">
            <span className="text-3xl font-extrabold">{data.value}</span>
            <span className="text-lg font-semibold mb-1">{data.unit}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CardCollectAmount;
