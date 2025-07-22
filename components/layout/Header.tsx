"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Menu } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import UserMenu from "@/components/common/UserMenu";

import { getUserAuthTypeLabel } from "@/utils/status";

const Header = () => {
  const router = useRouter();
  const { toggleSidebar } = useSidebar();
  const { data: session } = useSession();

  const moveHome = () => {
    router.push("/sm-pay/charge");
  };

  const labelType =
    session?.user && getUserAuthTypeLabel(session?.user.type || "");

  return (
    <header className="fixed top-0 left-0 z-10 w-full flex justify-between items-center space-x-4 text-sm pr-4 h-[60px] bg-white text-[#222] border-t border-b border-[#e5e7eb]">
      <div className="flex items-center gap-2">
        <Menu
          className="w-6 h-6 mt-1.5 ml-4 cursor-pointer"
          onClick={toggleSidebar}
        />

        <Image
          className="cursor-pointer"
          onClick={moveHome}
          src="/images/SMPay_logo.png"
          alt="SMPay_logo"
          width={100}
          height={44}
        />
      </div>

      <div className="flex items-center gap-4 h-full">
        {labelType && (
          <Badge
            label={labelType}
            color="#EB680E"
            className="text-xs px-2 py-1"
          />
        )}

        {session ? (
          <UserMenu user={session.user} />
        ) : (
          <>
            <Link href="/sign-out">로그인</Link>
            <Separator
              orientation="vertical"
              className="bg-[#e5e7eb] w-[1px] h-3"
            />
            <Link href="/sign-up">회원가입</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
