"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import UserMenu from "@/components/common/UserMenu";
import ShortcutButton from "@/components/common/DownloadShortCut";

import { getUserAuthTypeLabel } from "@/utils/status";

import { getRedirectPath } from "@/lib/utils";

const Header = () => {
  const router = useRouter();
  const { toggleSidebar } = useSidebar();
  const { data: session } = useSession();

  const moveHome = () => {
    const redirectPath = getRedirectPath(session?.user.type);
    router.push(redirectPath);
  };

  const labelType =
    session?.user && getUserAuthTypeLabel(session?.user.type || "");

  return (
    <header className="fixed top-0 left-0 z-10 w-full flex justify-between items-center space-x-4 text-sm pr-4 h-[60px] bg-white text-[#222] border-t border-b border-[#e5e7eb]">
      <div className="flex items-center">
        <div className="cursor-pointer mt-1" onClick={toggleSidebar}>
          <Image
            src="/images/icon_menu.png"
            alt="icon_menu"
            width={20}
            height={20}
          />
        </div>

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
        {session?.user.uniqueCode && (
          <ShortcutButton code={session.user.uniqueCode} />
        )}
        {labelType && (
          <Badge
            label={labelType}
            color="#EB680E"
            className="text-xs px-2 py-1"
          />
        )}
        <Link href="/support">고객센터</Link>
        <Separator
          orientation="vertical"
          className="bg-[#e5e7eb] w-[1px] h-3"
        />
        <Link href="/notice">공지사항</Link>
        <Separator
          orientation="vertical"
          className="bg-[#e5e7eb] w-[1px] h-3"
        />

        {session ? (
          <UserMenu user={session.user} />
        ) : (
          <>
            <Link href="/sign-in">로그인</Link>
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
