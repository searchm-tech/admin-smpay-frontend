import { Card } from "@/components/ui/card";
import { CardLoading } from "./CardLoading";

const data = {
  title: "전일 충전 금액",
  value: "543,210",
  unit: "원",
  icon: "👜",
  iconBg: "bg-orange-100",
};

type Props = {
  isLoading: boolean;
  chargeAmount: number;
};
const CardChargeAmount = ({ isLoading, chargeAmount = 0 }: Props) => {
  return (
    <Card
      key={data.title}
      className="relative rounded-xl shadow bg-white p-6 flex flex-col justify-between min-h-[180px]"
    >
      {isLoading && <CardLoading />}
      <div
        className={isLoading ? "blur-sm pointer-events-none select-none" : ""}
      >
        <div className="flex justify-between items-center w-full">
          <span className="text-lg font-bold">전일 충전 금액</span>
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-orange-100">
            <span className="text-2xl">👜</span>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start">
          <div className="flex items-end space-x-2">
            <span className="text-3xl font-extrabold">
              {chargeAmount.toLocaleString()}
            </span>
            <span className="text-lg font-semibold mb-1">원</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CardChargeAmount;
