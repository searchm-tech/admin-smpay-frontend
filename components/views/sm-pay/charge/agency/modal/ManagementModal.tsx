"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import LoadingUI from "@/components/common/Loading";
import { Modal } from "@/components/composite/modal-components";
import { Button } from "@/components/ui/button";

import { useQueryDepartmentsByAgentId } from "@/hooks/queries/departments";

import { convertToTreeNode, TreeNodeComponent } from "./constants";

import type { OrganizationTreeNode } from "@/types/tree";
import { useRouter } from "next/navigation";

export interface TreeNodeProps {
  node: OrganizationTreeNode;
  level: number;
  onAddFolder: (parentId: string) => void;
  onUpdateName: (nodeId: string, newName: string) => Promise<boolean>;
  onDeleteFolder: (nodeId: string) => void;
}

type Props = {
  onClose: () => void;
  onConfirm: () => void;
};
const ManagementModal: React.FC<Props> = ({ onClose, onConfirm }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { agentId } = session?.user || {};

  const { data: departments = [], isFetching: loadingDepartmentsQuery } =
    useQueryDepartmentsByAgentId(agentId || 0, {
      enabled: !!agentId,
    });

  const [treeData, setTreeData] = useState<OrganizationTreeNode[]>([]);

  const handleClose = () => {
    if (treeData.length === 0 && agentId !== session?.user.agentId) {
      onClose();
      return;
    }
  };

  useEffect(() => {
    if (departments.length > 0) {
      setTreeData(departments.map(convertToTreeNode));
    }
  }, [departments]);

  const loadingDepartments = loadingDepartmentsQuery;

  if (treeData.length === 0) {
    return (
      <Modal open title="부서 수정" onClose={handleClose} onConfirm={() => {}}>
        <div className="flex flex-col h-[80vh] w-[80vw]">
          <div className="flex-1 w-full mx-auto p-4 border rounded-lg bg-white overflow-y-auto">
            <Button onClick={() => router.push("/sm-pay/charge/agency")}>
              부서 관리 페이지 이동
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      open
      title="부서 수정"
      onClose={handleClose}
      onConfirm={() => {}}
      confirmDisabled={
        treeData.length === 0 && agentId !== session?.user.agentId
      }
    >
      {loadingDepartments && <LoadingUI />}

      <div className="flex gap-4 h-[80vh] w-[80vw]">
        <div className="flex flex-col w-1/2 ">
          <div className="flex-1 w-full mx-auto p-4 border rounded-lg bg-white overflow-y-auto">
            {treeData.map((node) => (
              <TreeNodeComponent key={node.id} node={node} level={0} />
            ))}
          </div>
        </div>

        <div className="flex flex-col h-[80vh] w-1/2 ">
          <div className="flex-1 w-full mx-auto p-4 border rounded-lg bg-white overflow-y-auto">
            {treeData.map((node) => (
              <TreeNodeComponent key={node.id} node={node} level={0} />
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ManagementModal;
