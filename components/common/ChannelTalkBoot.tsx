"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function ChannelTalkBoot() {
  const { data: session } = useSession();
  const user = session?.user;

  useEffect(() => {
    if (!user || typeof window === "undefined" || !window.ChannelIO) return;

    window.ChannelIO("boot", {
      pluginKey: "e78f8144-7d50-428a-817e-b197f4667be0",
      memberId: user.id,
      profile: {
        name: user.name,
        mobileNumber: user.phoneNumber,
        landlineNumber: "02-0000-0000",
        CUSTOM_VALUE_1: user.loginId,
        CUSTOM_VALUE_2: user.agentId,
      },
    });
  }, [user]);

  return null;
}
