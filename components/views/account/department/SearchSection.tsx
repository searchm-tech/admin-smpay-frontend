import { SearchBox } from "@/components/common/Box";
import Select from "@/components/composite/select-components";
import { useQueryAgencyAll } from "@/hooks/queries/agency";

type Props = {
  handleSelectAgent: (agentId: number, agentName: string) => void;
  selectedAgentId: number | null;
};
const SearchSection = ({ handleSelectAgent, selectedAgentId }: Props) => {
  const { data: agencyAllDto = [] } = useQueryAgencyAll({
    enabled: true,
  });

  const agentList = agencyAllDto.map((agentDto) => ({
    label: `${agentDto.agent.name} | ${agentDto.agent.representativeName}`,
    value: agentDto.agent.agentId.toString(),
  }));

  return (
    <SearchBox className="my-2">
      <Select
        className="bg-white w-[450px]"
        placeholder="대행사를 선택해주세요."
        options={agentList}
        value={selectedAgentId?.toString()}
        onChange={(value) => {
          const agent = agencyAllDto.find(
            (agent) => agent.agent.agentId.toString() === value
          );
          handleSelectAgent(Number(value), agent?.agent.name || "");
        }}
      />
    </SearchBox>
  );
};

export default SearchSection;
