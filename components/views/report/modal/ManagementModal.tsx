"use client";

import { useRouter } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { isEqual } from "lodash";

import LoadingUI from "@/components/common/Loading";
import { Modal } from "@/components/composite/modal-components";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

import { useQueryDepartmentsByAgentId } from "@/hooks/queries/departments";
import { useQueryAdvertiserListByUserId } from "@/hooks/queries/advertiser";
import { useUserListStore } from "@/store/useUserListStore";

import {
  convertToTreeNode,
  getAllSelectedLeafOriginIds,
  TreeNodeComponent,
} from "./constants";

import type { OrganizationTreeNode } from "@/types/tree";
import type { TAdvertiser } from "@/types/adveriser";

export interface TreeNodeProps {
  node: OrganizationTreeNode;
  level: number;
}

type Props = {
  open: boolean;
  onClose: () => void;
  advertiserIds: number[];
  onConfirm: (advertiserIds: number[]) => void;
};

// 트리 전체 노드 id 구하는 함수 (컴포넌트 밖으로 이동)
const getAllTreeNodeIds = (treeData: OrganizationTreeNode[]): string[] => {
  const ids: string[] = [];
  const traverse = (nodes: OrganizationTreeNode[]) => {
    nodes.forEach((node) => {
      ids.push(node.id);
      if (node.children) traverse(node.children);
    });
  };
  traverse(treeData);
  return ids;
};

const ManagementModal: React.FC<Props> = ({
  open,
  onClose,
  advertiserIds,
  onConfirm,
}) => {
  const router = useRouter();

  const { data: session } = useSession();
  const { agentId } = session?.user || {};

  const { setUserList, userList } = useUserListStore();

  const [treeData, setTreeData] = useState<OrganizationTreeNode[]>([]);
  const [nodeIds, setNodeIds] = useState<Set<string>>(new Set());
  const [selectedAdvertiserIds, setSelectedAdvertiserIds] = useState<string[]>(
    advertiserIds.map((id) => id.toString())
  );

  const { data: departments = [], isFetching: loadingDepartmentsQuery } =
    useQueryDepartmentsByAgentId(agentId || 0, {
      enabled: !!agentId,
    });

  const allLeafOriginIds = treeData.flatMap((node) =>
    getAllSelectedLeafOriginIds(node, nodeIds)
  );

  const { data: advertisers = [] } = useQueryAdvertiserListByUserId({
    agentId: agentId || 0,
    userIds: allLeafOriginIds.map((id) => Number(id)),
  });

  const handleClose = () => onClose();

  // 광고주 전체 체크박스 상태 계산
  const allIds = (advertisers as TAdvertiser[]).map((a) =>
    a.advertiserId.toString()
  );
  const allChecked =
    allIds.length > 0 &&
    allIds.every((id) => selectedAdvertiserIds.includes(id));
  const isIndeterminate =
    selectedAdvertiserIds.length > 0 &&
    selectedAdvertiserIds.length < allIds.length;

  // 전체 체크박스 핸들러
  const handleSelectAll = (checked: boolean) => {
    if (checked) setSelectedAdvertiserIds(allIds);
    else setSelectedAdvertiserIds([]);
  };

  // 개별 체크박스 핸들러 (토글)
  const handleSelectAdvertiser = (advertiserId: string) => {
    setSelectedAdvertiserIds((prev) =>
      prev.includes(advertiserId)
        ? prev.filter((id) => id !== advertiserId)
        : [...prev, advertiserId]
    );
  };

  // 모달이 열릴 때 트리 전체 선택 → 광고주 전체 선택
  useEffect(() => {
    if (treeData.length === 0) return;
    // 1. 트리 전체 노드 선택
    const allNodeIds = getAllTreeNodeIds(treeData);
    setNodeIds(new Set(allNodeIds));
  }, [treeData]);

  useEffect(() => {
    if (departments.length > 0) {
      setTreeData(departments.map(convertToTreeNode));
    }
  }, [departments]);

  useEffect(() => {
    const next = allLeafOriginIds.map(Number);
    if (!isEqual(userList, next)) {
      setUserList(next);
    }
  }, [allLeafOriginIds, setUserList, userList]);

  const loadingDepartments = loadingDepartmentsQuery;

  return (
    <Modal
      open={open}
      title="광고주 세부 선택"
      onClose={handleClose}
      onConfirm={() => onConfirm(selectedAdvertiserIds.map((id) => Number(id)))}
      confirmDisabled={
        treeData.length === 0 && agentId !== session?.user.agentId
      }
    >
      {loadingDepartments && <LoadingUI />}

      <div className="flex gap-4 h-[80vh] w-[80vw]">
        <div className="flex flex-col w-1/2 ">
          <div className="flex-1 w-full mx-auto p-4 border rounded-lg bg-white overflow-y-auto">
            <div className="mb-2 font-bold">부서 및 마케터 선택</div>
            {treeData.map((node) => (
              <TreeNodeComponent
                key={node.id}
                node={node}
                level={0}
                selectedIds={nodeIds}
                setSelectedIds={setNodeIds}
              />
            ))}

            {treeData.length === 0 && (
              <div className="flex flex-col justify-center items-center h-full">
                <div className="w-full h-full text-gray-400 text-sm flex items-center justify-center">
                  부서가 없습니다.
                </div>
                <Button onClick={() => router.push("/account/department")}>
                  부서 관리 페이지 이동
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col h-[80vh] w-1/2 ">
          <div className="flex-1 w-full mx-auto p-4 border rounded-lg bg-white overflow-y-auto">
            <div className="mb-2 font-bold">광고주 선택</div>

            {!advertisers.length && (
              <div className="w-full h-full text-gray-400 text-sm flex items-center justify-center">
                광고주가 없습니다.
              </div>
            )}

            {advertisers.length > 0 && (
              <Fragment>
                <div className="flex items-center gap-2 mb-2">
                  <Checkbox
                    checked={
                      allChecked
                        ? true
                        : isIndeterminate
                          ? "indeterminate"
                          : false
                    }
                    onCheckedChange={handleSelectAll}
                  />
                  <span className="text-sm text-gray-800 mr-2">
                    광고주 전체
                  </span>
                </div>

                {advertisers.map((adv: TAdvertiser, idx: number) => (
                  <Fragment key={adv.advertiserId || idx}>
                    <div
                      key={adv.advertiserId || idx}
                      className="flex items-center gap-2 mb-2"
                    >
                      <Checkbox
                        checked={selectedAdvertiserIds.includes(
                          adv.advertiserId.toString()
                        )}
                        onCheckedChange={() =>
                          handleSelectAdvertiser(adv.advertiserId.toString())
                        }
                      />
                      <span className="text-sm text-gray-800">
                        {adv.customerId}
                      </span>
                      <span className="text-sm text-gray-800">|</span>
                      <span className="text-sm text-gray-800">
                        {adv.name || "-"}
                      </span>

                      <span className="text-xs text-gray-500">
                        ({adv.nickname || "광고주명 없음"})
                      </span>
                    </div>
                  </Fragment>
                ))}
              </Fragment>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ManagementModal;
