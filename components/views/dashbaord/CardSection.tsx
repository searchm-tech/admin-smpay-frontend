import CardTotalStatus from "./card/CardTotalStatus";
import CardSmPay from "./card/CardSmPay";
import CardChargeAmount from "./card/CardChargeAmount";
import CardCollectAmount from "./card/CardCollectAmount";

const CardSection = () => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <CardTotalStatus />
      <CardSmPay />
      <CardChargeAmount />
      <CardCollectAmount />
    </section>
  );
};

export default CardSection;
