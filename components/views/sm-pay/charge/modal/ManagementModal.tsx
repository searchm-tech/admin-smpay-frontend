"use client";

import { useRouter } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { isEqual } from "lodash";

import LoadingUI from "@/components/common/Loading";
import { Modal } from "@/components/composite/modal-components";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

import { useQueryDepartmentsByAgentId } from "@/hooks/queries/departments";
import { useQueryAdvertiserListByUserIdHasChargeHistory } from "@/hooks/queries/advertiser";
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
  advertiserId: number;
  onConfirm: (advertiserId: number) => void;
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
  advertiserId,
  onConfirm,
}) => {
  const router = useRouter();

  const { data: session } = useSession();
  const { agentId } = session?.user || {};

  const { setUserList, userList } = useUserListStore();

  const [treeData, setTreeData] = useState<OrganizationTreeNode[]>([]);
  const [nodeIds, setNodeIds] = useState<Set<string>>(new Set());
  const [selectedAdvertiserId, setSelectedAdvertiserId] = useState<string>(
    advertiserId.toString()
  );

  const { data: departments = [], isFetching: loadingDepartmentsQuery } =
    useQueryDepartmentsByAgentId(agentId || 0, {
      enabled: !!agentId,
    });

  const allLeafOriginIds = treeData.flatMap((node) =>
    getAllSelectedLeafOriginIds(node, nodeIds)
  );

  const { data: advertisers = [] } =
    useQueryAdvertiserListByUserIdHasChargeHistory({
      agentId: agentId || 0,
      userIds: allLeafOriginIds.map((id) => Number(id)),
    });

  const handleClose = () => onClose();

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
      onConfirm={() => onConfirm(Number(selectedAdvertiserId))}
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
              <RadioGroup
                value={selectedAdvertiserId}
                onValueChange={setSelectedAdvertiserId}
              >
                {advertisers.map((adv: TAdvertiser, idx: number) => (
                  <div
                    key={adv.advertiserId || idx}
                    className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50"
                  >
                    <RadioGroupItem
                      value={adv.advertiserId.toString()}
                      id={`advertiser-${adv.advertiserId}`}
                    />
                    <label
                      htmlFor={`advertiser-${adv.advertiserId}`}
                      className="text-sm text-gray-800 cursor-pointer flex-1"
                    >
                      <span className="font-medium">{adv.customerId}</span>
                      <span className="mx-2">|</span>
                      <span>{adv.name || "-"}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        ({adv.nickname || "광고주명 없음"})
                      </span>
                    </label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ManagementModal;
