import Link from "next/link";
import React from "react";

const SiteHeader = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-14 items-center justify-between px-4">
        {/* 로고 영역 */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
              AI Dream Teller
            </span>
          </Link>
        </div>

        {/* 네비게이션 영역 */}
        <nav className="flex items-center gap-4">
          <Link
            href="/guest-login"
            className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors"
          >
            로그인
          </Link>
          <Link
            href="/guest-check"
            className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors"
          >
            비회원 주문 조회
          </Link>
          {/* 회원일 경우 보여질 마이페이지 링크 (임시 주석 처리) */}
          {/* <Link href="/my-page" className="...">마이페이지</Link> */}
        </nav>
      </div>
    </header>
  );
};

export default SiteHeader;
