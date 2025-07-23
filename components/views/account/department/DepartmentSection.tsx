"use client";

import React, { useEffect, useState } from "react";

import LoadingUI from "@/components/common/Loading";
import { Button } from "@/components/ui/button";

import ManagementModal from "./ManagementModal";

import { useQueryDepartmentsByAgentId } from "@/hooks/queries/departments";

import { convertToTreeNode, EditTreeNodeComponent } from "./constants";

import type { OrganizationTreeNode } from "@/types/tree";

export interface TreeNodeProps {
  node: OrganizationTreeNode;
  level: number;
}

type Props = {
  agentId: number | null;
  agentName: string | null;
};
const DepartmentSection: React.FC<Props> = ({ agentId, agentName }) => {
  const {
    data: departments = [],
    isFetching: loadingDepartmentsQuery,
    refetch,
  } = useQueryDepartmentsByAgentId(agentId || 0, { enabled: !!agentId });

  const [isOpen, setIsOpen] = useState(false);

  const [treeData, setTreeData] = useState<OrganizationTreeNode[]>([]);

  const handleSaveAfter = () => {
    refetch();
    setIsOpen(false);
  };

  const loadingDepartments = loadingDepartmentsQuery;

  // departments가 변경될 때마다 treeData 업데이트
  useEffect(() => {
    if (departments.length > 0) {
      setTreeData(departments.map(convertToTreeNode));
    } else if (treeData.length > 0) {
      setTreeData([]);
    }
  }, [departments]);

  return (
    <div className="w-full">
      {isOpen && (
        <ManagementModal
          agentName={agentName}
          agentId={agentId}
          onClose={() => setIsOpen(false)}
          onConfirm={handleSaveAfter}
        />
      )}
      {loadingDepartments && <LoadingUI />}

      <div className="flex flex-col h-[calc(100vh-20rem)]">
        <div className="flex-1 w-full mx-auto p-4 border rounded-lg bg-white overflow-y-auto">
          {treeData.length > 0 ? (
            treeData.map((node) => (
              <EditTreeNodeComponent key={node.id} node={node} level={0} />
            ))
          ) : (
            <div className="flex flex-col justify-center items-center h-full gap-4">
              <p>부서 정보가 없습니다.</p>
              {!agentId && <p>대행사를 선택해주세요.</p>}
              {agentId && <p>부서를 추가해주세요.</p>}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center w-full">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-[150px] h-10 my-4"
          disabled={!agentId}
        >
          부서 관리 수정
        </Button>
      </div>
    </div>
  );
};

export default DepartmentSection;
