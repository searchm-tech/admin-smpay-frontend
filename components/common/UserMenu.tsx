"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronDown,
  User,
  Lock,
  Flag,
  HelpCircle,
  Info,
  LogOut,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

import { getIsAdmin } from "@/lib/utils";

import type { TSMPayUser } from "@/types/user";
import DocumentComponent from "./Document";

export function UserMenu({ user }: { user: TSMPayUser }) {
  const [open, setOpen] = useState(false);

  const [documentType, setDocumentType] = useState<
    "personalInfo" | "termsOfService" | null
  >(null);

  const isAdmin = getIsAdmin(user.type);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      {documentType && (
        <DocumentComponent
          type={documentType}
          onClose={() => setDocumentType(null)}
        />
      )}

      <DropdownMenuTrigger asChild>
        <div className="flex items-center space-x-2 cursor-pointer">
          <span>{user.name} 님 환영합니다.</span>
          <ChevronDown size={16} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[250px] px-6 py-4">
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer">
            <Link
              href="/profile"
              className="flex items-center space-x-2 w-full"
            >
              <User size={16} />
              <span>기본 정보 변경</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Link
              href="/password-reset"
              className="flex items-center space-x-2 w-full"
            >
              <Lock size={16} />
              <span>비밀번호 변경</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-gray-300" />

        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer">
            <div className="flex items-center space-x-2 w-full">
              <Flag size={16} />
              <span className="text-gray-500">공지사항</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <div className="flex items-center space-x-2 w-full">
              <HelpCircle size={16} />
              <span className="text-gray-500">FAQ</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <div className="flex items-center space-x-2 w-full">
              <Info size={16} />
              <span>고객센터</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <div className="flex justify-center mt-3">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/sign-out" className="flex items-center space-x-2">
              <LogOut size={16} />
              <span>로그아웃</span>
            </Link>
          </Button>
        </div>

        <div className="flex justify-center space-x-2 mt-3 text-xs text-gray-500">
          <Link
            href="#"
            className="hover:underline"
            onClick={() => setDocumentType("termsOfService")}
          >
            이용약관
          </Link>
          <span>|</span>
          <Link
            href="#"
            className="hover:underline"
            onClick={() => setDocumentType("personalInfo")}
          >
            개인정보처리방침
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserMenu;
