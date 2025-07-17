"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  DndContext,
  DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
  MeasuringStrategy,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";

import LoadingUI from "@/components/common/Loading";
import { ConfirmDialog, Modal } from "@/components/composite/modal-components";

import {
  useMutationDepartments,
  useQueryDepartmentsByAgentId,
} from "@/hooks/queries/departments";

import {
  convertTreeToParams,
  convertToTreeNode,
  getNodeDepth,
  findNode,
  removeNode,
  TreeNodeComponent,
} from "./constants";

import type { OrganizationTreeNode } from "@/types/tree";
import type { TDepartmentsPutParams } from "@/services/departments";
import { Button } from "@/components/ui/button";

export interface TreeNodeProps {
  node: OrganizationTreeNode;
  level: number;
  onAddFolder: (parentId: string) => void;
  onUpdateName: (nodeId: string, newName: string) => Promise<boolean>;
  onDeleteFolder: (nodeId: string) => void;
}

// Helper function to collect all folder names from the tree
const getAllFolderNames = (nodes: OrganizationTreeNode[]): string[] => {
  const names: string[] = [];
  const traverse = (nodeList: OrganizationTreeNode[]) => {
    nodeList.forEach((node) => {
      if (node.type === "folder") {
        names.push(node.name);
        if (node.children) {
          traverse(node.children);
        }
      }
    });
  };
  traverse(nodes);
  return names;
};

type Props = {
  agentId: number | null;
  agentName: string | null;
  onClose: () => void;
  onConfirm: () => void;
};
const ManagementModal: React.FC<Props> = ({
  agentId,
  agentName,
  onClose,
  onConfirm,
}) => {
  const { data: session } = useSession();

  const { data: departments = [], isFetching: loadingDepartmentsQuery } =
    useQueryDepartmentsByAgentId(agentId || 0, { enabled: !!agentId });

  const { mutate: mutateDepartments, isPending: loadingDepartmentsMutation } =
    useMutationDepartments({
      onSuccess: () => {
        setSuccessSave(true);
        onConfirm();
      },
      onError: (error) => {
        console.error("Error saving tree data:", error);
      },
    });

  const [treeData, setTreeData] = useState<OrganizationTreeNode[]>([]);

  const [errorNewFolder, setErrorNewFolder] = useState(false);
  const [errorDuplicateFolder, setErrorDuplicateFolder] = useState(false);
  const [errorMaxDepth, setErrorMaxDepth] = useState("");
  const [errorLength, setErrorLength] = useState(false);

  const [successSave, setSuccessSave] = useState(false);
  const [isCancel, setIsCancel] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 0,
        tolerance: 0,
      },
    })
  );

  const handleDragStart = (event: any) => {
    const { active } = event;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const draggedId = active.id as string;
    const overId = over.id as string;

    if (draggedId === overId) return;

    setTreeData((prevData) => {
      const newData = JSON.parse(JSON.stringify(prevData));
      const [draggedNode, draggedParent] = findNode(newData, draggedId);
      const [overNode] = findNode(newData, overId);

      if (!draggedNode || !overNode || !draggedParent) return prevData;

      // 드래그된 노드가 사용자일 때
      if (draggedNode.type === "user" && overNode.type === "folder") {
        removeNode(newData, draggedId);
        if (!overNode.children) {
          overNode.children = [];
        }
        overNode.children.unshift(draggedNode);
        return newData;
      }

      // 드래그된 노드가 폴더일 때
      if (draggedNode.type === "folder" && overNode.type === "folder") {
        // 자기 자신을 자신의 하위로 이동하는 것을 방지
        const hasCircularDependency = (
          parent: OrganizationTreeNode,
          child: OrganizationTreeNode
        ): boolean => {
          if (parent.id === child.id) return true;
          if (!parent.children) return false;
          return parent.children.some((node) =>
            hasCircularDependency(node, child)
          );
        };

        if (hasCircularDependency(draggedNode, overNode)) {
          return prevData;
        }

        removeNode(newData, draggedId);
        if (!overNode.children) {
          overNode.children = [];
        }
        overNode.children.unshift(draggedNode);
        return newData;
      }

      return prevData;
    });
  };

  const handleAddFolder = async (parentId: string) => {
    setTreeData((prevData) => {
      const newData = JSON.parse(JSON.stringify(prevData));
      const [parentNode] = findNode(newData, parentId);

      if (parentNode) {
        // 현재 부모 노드의 depth 확인
        const parentDepth = getNodeDepth(newData, parentId);
        if (parentDepth >= 8) {
          setErrorMaxDepth("최대 7 depth까지만 폴더를 생성할 수 있습니다.");
          return prevData;
        }

        if (!parentNode.children) {
          parentNode.children = [];
        }

        // 전체 트리에서 모든 폴더 이름 수집
        const allFolderNames = getAllFolderNames(newData);

        // "새 부서"로 시작하는 폴더들의 번호 추출
        const baseName = "새 부서";
        const existingNumbers: number[] = [];

        allFolderNames.forEach((name) => {
          if (name === baseName) {
            existingNumbers.push(1); // "새 부서"는 1번으로 취급
          } else if (name.startsWith(baseName + " (")) {
            const match = name.match(/새 부서 \((\d+)\)$/);
            if (match) {
              existingNumbers.push(parseInt(match[1]));
            }
          }
        });

        // 가장 큰 번호 찾기
        const maxNumber =
          existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;

        // 새 부서 이름 결정
        const newFolderName =
          maxNumber === 0 ? baseName : `${baseName} (${maxNumber + 1})`;

        const newFolder: OrganizationTreeNode = {
          id: `folder-${Date.now()}`,
          name: newFolderName,
          type: "folder",
          children: [],
        };

        parentNode.children.push(newFolder);
      }

      return newData;
    });
  };

  const handleUpdateName = async (
    nodeId: string,
    newName: string
  ): Promise<boolean> => {
    let isSuccess = false;
    setTreeData((prevData) => {
      const newData = JSON.parse(JSON.stringify(prevData));
      const [node] = findNode(newData, nodeId);
      if (node) {
        // 전체 트리에서 모든 폴더 이름 수집 (현재 노드 제외)
        const allFolderNames = getAllFolderNames(newData);
        const otherFolderNames = allFolderNames.filter((name, index, arr) => {
          // 현재 노드의 이름은 제외하고 중복 체크
          return name !== node.name || arr.indexOf(name) !== index;
        });

        const isDuplicate = otherFolderNames.includes(newName);

        if (!newName) {
          setErrorNewFolder(true);
          isSuccess = false;
          return prevData;
        }

        if (newName.length > 20) {
          setErrorLength(true);
          isSuccess = false;
          return prevData;
        }

        if (isDuplicate) {
          setErrorDuplicateFolder(true);
          isSuccess = false;
          return prevData;
        }
        node.name = newName;
        isSuccess = true;
      }
      return newData;
    });
    return isSuccess;
  };

  const handleDeleteFolder = async (nodeId: string) => {
    setTreeData((prevData) => {
      const newData = JSON.parse(JSON.stringify(prevData));
      removeNode(newData, nodeId);
      return newData;
    });
  };

  const handleSave = async () => {
    if (!agentId) return;

    const params: TDepartmentsPutParams = {
      agentId: agentId.toString(),
      departments: convertTreeToParams(treeData),
    };
    mutateDepartments(params);
  };

  const handleInitAddTopFolder = () => {
    if (!agentId) return;
    const params: TDepartmentsPutParams = {
      agentId: agentId.toString(),
      departments: [
        {
          departmentName: `${agentName} 대행사` || "최상위 부서",
          displayOrder: 1,
          userIds: [session?.user.userId || 0],
          children: [
            {
              departmentName: "새 부서",
              displayOrder: 1,
              userIds: [],
              children: [],
            },
          ],
        },
      ],
    };
    mutateDepartments(params);
  };

  const handleClose = () => {
    if (treeData.length === 0 && agentId !== session?.user.agentId) {
      onClose();
      return;
    } else {
      setIsCancel(true);
    }
  };

  const loadingDepartments =
    loadingDepartmentsQuery || loadingDepartmentsMutation;

  // departments가 변경될 때마다 treeData 업데이트
  useEffect(() => {
    if (departments.length > 0) {
      setTreeData(departments.map(convertToTreeNode));
    }
  }, [departments]);

  if (isCancel) {
    return (
      <ConfirmDialog
        open
        confirmText="취소"
        cancelText="계속 수정하기"
        content={
          <>
            <p>취소하시겠습니까?</p>
            <p>취소하면 저장되지 않은 내용이 사라집니다.</p>
          </>
        }
        onConfirm={onClose}
        onClose={() => setIsCancel(false)}
      />
    );
  }

  return (
    <Modal
      open
      title="부서 수정"
      onClose={handleClose}
      onConfirm={() => handleSave()}
      confirmDisabled={
        treeData.length === 0 && agentId !== session?.user.agentId
      }
    >
      {loadingDepartments && <LoadingUI />}
      {errorNewFolder && (
        <Dialog
          content="부서 이름을 입력해주세요"
          onConfirm={() => setErrorNewFolder(false)}
        />
      )}
      {errorLength && (
        <Dialog
          content="부서 이름은 최대 20자까지 입력할 수 있습니다."
          onConfirm={() => setErrorLength(false)}
        />
      )}
      {errorDuplicateFolder && (
        <Dialog
          content="이미 존재하는 부서명입니다. 다른 부서명을 입력해주세요"
          onConfirm={() => setErrorDuplicateFolder(false)}
        />
      )}
      {errorMaxDepth && (
        <Dialog
          content={errorMaxDepth}
          onConfirm={() => setErrorMaxDepth("")}
        />
      )}

      {successSave && (
        <Dialog
          content="부서 정보가 저장되었습니다."
          onConfirm={() => {
            setSuccessSave(false);
          }}
        />
      )}
      <DndContext
        sensors={sensors}
        measuring={{
          droppable: {
            strategy: MeasuringStrategy.Always,
          },
        }}
        modifiers={[restrictToWindowEdges]}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col h-[80vh] w-[80vw] ">
          <div className="flex-1 w-full mx-auto p-4 border rounded-lg bg-white overflow-y-auto">
            {treeData.map((node) => (
              <TreeNodeComponent
                key={node.id}
                node={node}
                level={0}
                onAddFolder={handleAddFolder}
                onUpdateName={handleUpdateName}
                onDeleteFolder={handleDeleteFolder}
              />
            ))}

            {treeData.length === 0 && (
              <div className="flex justify-center items-center w-full h-full">
                {agentId === session?.user.agentId && (
                  <Button onClick={handleInitAddTopFolder}>
                    대행사 부서 추가
                  </Button>
                )}

                {agentId !== session?.user.agentId && (
                  <p className="text-lg text-gray-500">
                    {agentName} 대행사의 최상위 그룹장이 부서를 추가할 수
                    있습니다.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </DndContext>
    </Modal>
  );
};

export default ManagementModal;

type DialogProps = {
  content: string;
  onConfirm: () => void;
};

const Dialog = ({ content, onConfirm }: DialogProps) => {
  return (
    <ConfirmDialog
      open
      content={content}
      onConfirm={onConfirm}
      cancelDisabled
    />
  );
};
