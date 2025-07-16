"use client";

import { useRouter } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import LoadingUI from "@/components/common/Loading";
import { Modal } from "@/components/composite/modal-components";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

import { useQueryDepartmentsByAgentId } from "@/hooks/queries/departments";
import { useQueryAdvertiserListByUserId } from "@/hooks/queries/advertiser";

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
  onClose: () => void;
  onConfirm: () => void;
};
const ManagementModal: React.FC<Props> = ({ onClose, onConfirm }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { agentId } = session?.user || {};

  const [treeData, setTreeData] = useState<OrganizationTreeNode[]>([]);
  const [nodeIds, setNodeIds] = useState<Set<string>>(new Set());
  const [advertiserIds, setAdvertiserIds] = useState<string[]>([]);

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
    allIds.length > 0 && allIds.every((id) => advertiserIds.includes(id));
  const isIndeterminate =
    advertiserIds.length > 0 && advertiserIds.length < allIds.length;

  // 전체 체크박스 핸들러
  const handleSelectAll = (checked: boolean) => {
    if (checked) setAdvertiserIds(allIds);
    else setAdvertiserIds([]);
  };

  // 개별 체크박스 핸들러 (토글)
  const handleSelectAdvertiser = (advertiserId: string) => {
    setAdvertiserIds((prev) =>
      prev.includes(advertiserId)
        ? prev.filter((id) => id !== advertiserId)
        : [...prev, advertiserId]
    );
  };

  useEffect(() => {
    if (departments.length > 0) {
      setTreeData(departments.map(convertToTreeNode));
    }
  }, [departments]);

  const loadingDepartments = loadingDepartmentsQuery;

  return (
    <Modal
      open
      title="광고주 세부 선택"
      onClose={handleClose}
      onConfirm={onConfirm}
      confirmDisabled={
        treeData.length === 0 && agentId !== session?.user.agentId
      }
    >
      {loadingDepartments && <LoadingUI />}

      <div className="flex gap-4 h-[80vh] w-[80vw]">
        <div className="flex flex-col w-1/2 ">
          <div className="flex-1 w-full mx-auto p-4 border rounded-lg bg-white overflow-y-auto">
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
                        checked={advertiserIds.includes(
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
