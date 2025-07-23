"use client";

import { useState } from "react";

import DepartmentSection from "./DepartmentSection";
import SearchSection from "./SearchSection";

import { LabelBullet } from "@/components/composite/label-bullet";

const DepartmentView = () => {
  const [selectedAgentId, setSelectedAgentId] = useState<number | null>(null);
  const [agentName, setAgentName] = useState<string | null>(null);

  const handleSelectAgent = (agentId: number, agentName: string) => {
    setSelectedAgentId(agentId);
    setAgentName(agentName);
  };

  return (
    <div>
      <LabelBullet labelClassName="text-lg font-bold">
        부서 및 회원 관리
      </LabelBullet>

      <SearchSection
        handleSelectAgent={handleSelectAgent}
        selectedAgentId={selectedAgentId}
      />
      <DepartmentSection agentId={selectedAgentId} agentName={agentName} />
    </div>
  );
};

export default DepartmentView;
