import TableRecommend from "./table/TableRecommend";
import TableUnclaimed from "./table/TableUnclaimed";

const TableSection = () => {
  return (
    <section className="grid grid-cols-2 gap-4">
      <TableRecommend />
      <TableUnclaimed />
    </section>
  );
};

export default TableSection;
