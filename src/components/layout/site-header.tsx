"use client";

import Link from "next/link";
import React from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { User } from "@supabase/supabase-js";

interface SiteHeaderProps {
  user: User | null;
}

const SiteHeader = ({ user }: SiteHeaderProps) => {
  const isLoggedIn = !!user;
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60">
      <div className="container flex h-14 items-center justify-between px-4">
        {/* 1. 로고 영역 */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
              AI Dream Teller
            </span>
          </Link>
        </div>

        {/* 2. 데스크탑 네비게이션 (md 이상에서만 노출) */}
        <nav className="hidden md:flex items-center gap-6">
          {!isLoggedIn && (
            <>
              <Link
                href="/auth"
                className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors"
              >
                로그인
              </Link>
              <Link
                href="/guest-login"
                className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors"
              >
                비회원 주문 조회
              </Link>
            </>
          )}
          {isLoggedIn && (
            <Link
              href="/my-page"
              className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors"
            >
              마이페이지
            </Link>
          )}
        </nav>

        {/* 3. 모바일 네비게이션 (md 미만에서만 노출) */}
        <div className="flex md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="-mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="text-left bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
                  AI Dream Teller
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-4 mt-8">
                <Link
                  href="/"
                  className="text-sm font-medium hover:text-purple-600"
                  onClick={() => setIsOpen(false)}
                >
                  홈
                </Link>
                {!isLoggedIn && (
                  <>
                    <Link
                      href="/auth"
                      className="text-sm font-medium hover:text-purple-600"
                      onClick={() => setIsOpen(false)}
                    >
                      로그인
                    </Link>
                    <Link
                      href="/guest-login"
                      className="text-sm font-medium hover:text-purple-600"
                      onClick={() => setIsOpen(false)}
                    >
                      비회원 주문 조회
                    </Link>
                  </>
                )}
                {isLoggedIn && (
                  <Link
                    href="/my-page"
                    className="text-sm font-medium hover:text-purple-600"
                    onClick={() => setIsOpen(false)}
                  >
                    마이페이지
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
