import type { TableParams } from "@/types/table";
import type { AgencyUsersOrder } from "@/types/api/user";

export const dialogContent = {
  "update-status": "회원 상태가 변경되었습니다.",
  "response-delete": "회원이 삭제되었습니다.",
};

export type DialogTypes = keyof typeof dialogContent;

export const statusDialogContent = {
  NORMAL: (
    <>
      <p>회원을 활성화하면 다시 서비스 이용이 가능해집니다.</p>
      <p>진행하시겠습니까?</p>
    </>
  ),
  STOP: (
    <>
      <p>회원을 비활성화하면 로그인 및 서비스 이용이 제한됩니다.</p>
      <p>진행하시겠습니까?</p>
    </>
  ),
  TEMP: null,
};

export const defaultTableParams: TableParamsMember = {
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
  },
  filters: {},
  sortField: "REGISTER_DT_DESC",
  sortOrder: "ascend",
  keyword: "",
};

export interface TableParamsMember extends TableParams {
  keyword: string;
  sortField?: AgencyUsersOrder;
}
