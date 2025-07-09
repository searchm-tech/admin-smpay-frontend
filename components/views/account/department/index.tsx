"use client";

import { getIsAdmin } from "@/lib/utils";
import { useSession } from "next-auth/react";
import DepartmentMemberView from "./member";
import DepartmentAdminView from "./admin";

// 폴더 이동 가능
// 인원은 이동 만
const DepartmentView = () => {
  const { data: session } = useSession();
  const isAdmin = getIsAdmin(session?.user?.type);

  return isAdmin ? <DepartmentAdminView /> : <DepartmentMemberView />;
};

export default DepartmentView;
