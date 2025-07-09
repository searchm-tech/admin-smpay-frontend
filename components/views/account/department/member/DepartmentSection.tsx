"use client";

import React, { Fragment, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import LoadingUI from "@/components/common/Loading";
import { Button } from "@/components/ui/button";
import ManagementModal from "../ManagementModal";

import { useQueryDepartments } from "@/hooks/queries/departments";

import { convertToTreeNode, EditTreeNodeComponent } from "../constants";
import { useQueryAgencyDomainName } from "@/hooks/queries/agency";

import type { OrganizationTreeNode } from "@/types/tree";

export interface TreeNodeProps {
  node: OrganizationTreeNode;
  level: number;
}

const DepartmentSection: React.FC = () => {
  const { data: session } = useSession();
  const enabled = !!session?.user.agentId;
  const { data: agencyInfo } = useQueryAgencyDomainName(
    session?.user.uniqueCode || ""
  );

  const {
    data: departments = [],
    refetch,
    isFetching: loadingDepartmentsQuery,
  } = useQueryDepartments(session?.user.agentId || 0, { enabled });

  const [isOpen, setIsOpen] = useState(false);

  const [treeData, setTreeData] = useState<OrganizationTreeNode[]>([]);

  const handleSaveAfter = () => {
    refetch();
    setIsOpen(false);
  };

  const loadingDepartments = loadingDepartmentsQuery;

  useEffect(() => {
    if (departments.length > 0) {
      setTreeData(departments.map(convertToTreeNode));
    } else if (treeData.length > 0) {
      setTreeData([]);
    }
  }, [departments]);

  return (
    <Fragment>
      {isOpen && session?.user.agentId && (
        <ManagementModal
          agentId={session.user.agentId}
          agentName={agencyInfo?.name || null}
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
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center w-full">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-[150px] h-10 my-4"
          disabled={!session?.user.agentId}
        >
          부서 관리 수정
        </Button>
      </div>
    </Fragment>
  );
};

export default DepartmentSection;
