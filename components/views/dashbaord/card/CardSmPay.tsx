import { Card } from "@/components/ui/card";
import { CardLoading } from "./CardLoading";
import { useQueryDashboardAdvertiserOperationStatus as queryAdvertiserStatus } from "@/hooks/queries/dashboard";

const CardSmPay = () => {
  const {
    data: advertiserStatus,
    isFetching,
    isFetched,
  } = queryAdvertiserStatus();

  const isLoading = isFetching || !isFetched;
  return (
    <Card
      key="SM Pay 광고주"
      className="relative rounded-xl shadow bg-white p-6 flex flex-col justify-between min-h-[180px]"
    >
      {isLoading && <CardLoading />}
      <div
        className={isLoading ? "blur-sm pointer-events-none select-none" : ""}
      >
        <div className="flex justify-between items-center w-full">
          <span className="text-lg font-bold">SM Pay 광고주</span>
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-yellow-100">
            <span className="text-2xl">🟡</span>
          </div>
        </div>
        <div className="mt-8 flex justify-between items-end w-full">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-extrabold">
              {advertiserStatus?.advertiserCount || 0}
            </span>
            <span className="text-lg font-semibold">명</span>
          </div>

          <span className="mx-4 text-2xl  font-bold">/</span>

          <div className="flex flex-col items-end gap-1">
            <span className="text-xs text-gray-400">7일 평균 ROAS</span>
            <span className="font-bold text-3xl">
              {advertiserStatus?.avgRoasPercent || 0}%
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CardSmPay;
