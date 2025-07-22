"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, User, Lock, LogOut } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DocumentComponent from "./Document";

import { Button } from "@/components/ui/button";

import type { TSMPayUser } from "@/types/user";

export function UserMenu({ user }: { user: TSMPayUser }) {
  const [open, setOpen] = useState(false);

  const [documentType, setDocumentType] = useState<
    "personalInfo" | "termsOfService" | null
  >(null);

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

        <div className="flex justify-center mt-3">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/sign-out" className="flex items-center space-x-2">
              <LogOut size={16} />
              <span>로그아웃</span>
            </Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserMenu;
