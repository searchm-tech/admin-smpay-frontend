"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function ChannelTalkBoot() {
  const { data: session } = useSession();
  const user = session?.user;

  useEffect(() => {
    if (typeof window === "undefined" || !window.ChannelIO) return;

    window.ChannelIO("boot", {
      pluginKey: "f7046eb3-532c-4ae2-898b-966ed2558859",
      memberId: user?.id || "비회원",
      profile: {
        name: user?.name || "비회원",
        mobileNumber: user?.phoneNumber || "010-0000-0000",
        landlineNumber: user?.phoneNumber || "02-0000-0000",
        CUSTOM_VALUE_1: user?.loginId || "비회원",
        CUSTOM_VALUE_2: user?.agentId || "비회원",
      },
    });
  }, [user]);

  return null;
}
