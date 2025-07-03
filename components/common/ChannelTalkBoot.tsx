"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function ChannelTalkBoot() {
  const { data: session } = useSession();
  const user = session?.user;

  useEffect(() => {
    if (!user || typeof window === "undefined" || !window.ChannelIO) return;

    window.ChannelIO("boot", {
      pluginKey: "2a4364b2-28f4-4b87-b1fd-866a6783212a",
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
