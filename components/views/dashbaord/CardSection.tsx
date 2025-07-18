import CardTotalStatus from "./card/CardTotalStatus";
import CardSmPay from "./card/CardSmPay";
import CardChargeAmount from "./card/CardChargeAmount";
import CardCollectAmount from "./card/CardCollectAmount";
import { useQueryDashboardChargeRecoveryAmount } from "@/hooks/queries/dashboard";

const CardSection = () => {
  const {
    data: chargeRecoveryAmount,
    isFetching,
    isFetched,
  } = useQueryDashboardChargeRecoveryAmount();

  const isLoading = isFetching || !isFetched;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <CardTotalStatus />
      <CardSmPay />
      <CardChargeAmount
        isLoading={isLoading}
        chargeAmount={chargeRecoveryAmount?.chargeAmount || 0}
      />
      <CardCollectAmount
        isLoading={isLoading}
        recoveryAmount={chargeRecoveryAmount?.recoveryAmount || 0}
      />
    </section>
  );
};

export default CardSection;
