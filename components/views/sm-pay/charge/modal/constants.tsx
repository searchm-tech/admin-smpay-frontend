import { useState } from "react";
import { Folder, FolderOpen, User } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

import type { TDepartmentFolder } from "@/types/department";
import type { OrganizationTreeNode } from "@/types/tree";

// BE 부서 조회 데이터 -> 트리 노드
export const convertToTreeNode = (
  node: TDepartmentFolder
): OrganizationTreeNode => {
  const treeNode: OrganizationTreeNode = {
    id: `dept-${node.departmentId}`,
    name: node.name,
    type: "folder",
    originId: node.departmentId,
    children: [
      ...node.users.map((user) => ({
        id: `user-${user.userId}`,
        name: user.name,
        type: "user" as const,
        originId: user.userId,
        userData: user,
      })),
      ...node.children.map((child) => convertToTreeNode(child)),
    ],
  };
  return treeNode;
};

// 폴더 내의 전체 user 수를 계산하는 함수
export const countUsersInNode = (node: OrganizationTreeNode): number => {
  if (node.type === "user") return 1;
  if (!node.children) return 0;

  return node.children.reduce((sum, child) => sum + countUsersInNode(child), 0);
};

// 모든 하위 노드 id를 재귀적으로 수집
const getAllChildIds = (node: OrganizationTreeNode): string[] => {
  if (!node.children || node.children.length === 0) return [node.id];
  return [node.id, ...node.children.flatMap(getAllChildIds)];
};

// 하위 노드 id만 재귀적으로 수집 (자기 자신 제외)
const getAllDescendantIds = (node: OrganizationTreeNode): string[] => {
  if (!node.children || node.children.length === 0) return [];
  return node.children.flatMap((child) => [
    child.id,
    ...getAllDescendantIds(child),
  ]);
};

// 체크 여부 계산
const isChecked = (
  node: OrganizationTreeNode,
  selectedIds: Set<string>
): boolean => {
  if (!node.children || node.children.length === 0) {
    return selectedIds.has(node.id);
  }
  // 폴더: 자신과 모든 하위가 선택됐으면 true
  const allIds = getAllDescendantIds(node).concat(node.id);
  return allIds.every((id) => selectedIds.has(id));
};

// indeterminate 여부 계산
const isIndeterminate = (
  node: OrganizationTreeNode,
  selectedIds: Set<string>
): boolean => {
  if (!node.children || node.children.length === 0) return false;
  const allIds = getAllDescendantIds(node);
  const checkedCount = allIds.filter((id) => selectedIds.has(id)).length;
  return checkedCount > 0 && checkedCount < allIds.length;
};

// 트리 노드 컴포넌트
export const TreeNodeComponent: React.FC<{
  node: OrganizationTreeNode;
  level: number;
  selectedIds: Set<string>;
  setSelectedIds: React.Dispatch<React.SetStateAction<Set<string>>>;
}> = ({ node, level, selectedIds, setSelectedIds }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleToggle = () => {
    if (node.type === "folder") {
      setIsOpen(!isOpen);
    }
  };

  // 체크박스 클릭 핸들러
  const handleCheck = (checked: boolean | "indeterminate") => {
    const allIds = getAllChildIds(node);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked === true) {
        allIds.forEach((id) => next.add(id));
      } else {
        allIds.forEach((id) => next.delete(id));
      }
      return next;
    });
  };

  let checked: boolean | "indeterminate" = isChecked(node, selectedIds);
  if (!checked && isIndeterminate(node, selectedIds)) checked = "indeterminate";

  const content = (
    <div
      className={`flex items-center gap-2 py-2 px-2 rounded-md ${
        node.type === "folder" ? "hover:bg-gray-50" : "cursor-default"
      }`}
      style={{
        paddingLeft: `${level * 24}px`,
      }}
    >
      <Checkbox checked={checked} onCheckedChange={handleCheck} />
      {node.type === "folder" ? (
        isOpen ? (
          <FolderOpen className={classNameLeft} onClick={handleToggle} />
        ) : (
          <Folder className={classNameLeft} onClick={handleToggle} />
        )
      ) : (
        <User className={classNameLeft} />
      )}
      <div className="flex-1 flex items-center gap-2 cursor-default">
        <span>{node.name}</span>
        {node.type === "user" &&
          node.userData?.type === "AGENCY_GROUP_MASTER" && (
            <span className="text-xs text-red-500 ml-1">(최상위 그룹장)</span>
          )}
        {node.type === "folder" && (
          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full flex items-center gap-1">
            <User className="w-3 h-3" />
            {countUsersInNode(node)}명
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {node.type === "folder" ? (
        <div>
          {content}
          {isOpen && node.children && (
            <div className="w-full">
              {node.children.map((child) => (
                <TreeNodeComponent
                  key={child.id}
                  node={child}
                  level={level + 1}
                  selectedIds={selectedIds}
                  setSelectedIds={setSelectedIds}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>{content}</div>
      )}
    </div>
  );
};

export const getAllSelectedLeafOriginIds = (
  node: OrganizationTreeNode,
  selectedIds: Set<string>
): number[] => {
  if (node.type === "user") {
    return selectedIds.has(node.id) ? [node.originId || 0] : [];
  }
  if (!node.children) return [];
  return node.children.flatMap((child) =>
    getAllSelectedLeafOriginIds(child, selectedIds)
  );
};

const classNameLeft = "w-5 h-5 text-gray-400 cursor-pointer";
