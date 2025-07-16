import ChartAdvertiser from "./chart/ChartAdvertiser";
import ChartAllAdvertiser from "./chart/ChartAllAdvertiser";
// import ChartPerfomerce from "./chart/ChartPerfomerce";

const ChartSection = () => {
  return (
    <section className="grid grid-cols-2 gap-4">
      <ChartAdvertiser />
      <ChartAllAdvertiser />
      {/* <ChartPerfomerce /> */}
    </section>
  );
};

export default ChartSection;
