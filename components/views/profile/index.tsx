"use client";

import { useSession } from "next-auth/react";
import MemberEditView from "../account/member-edit";

const ProfileView = () => {
  const { data: session } = useSession();

  return <MemberEditView userIdData={session?.user.userId} />;
};

export default ProfileView;
