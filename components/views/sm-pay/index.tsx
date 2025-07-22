"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import LoadingUI from "@/components/common/Loading";

const SmPayView = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session && session.user) {
      router.push("/sm-pay/charge");
    }
  }, [session]);
  return <LoadingUI />;
};

export default SmPayView;
