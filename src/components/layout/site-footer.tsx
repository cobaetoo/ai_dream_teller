import Link from "next/link";
import React from "react";

const SiteFooter = () => {
  return (
    <footer className="border-t bg-gray-50/50">
      <div className="container flex flex-col items-center gap-4 py-8 md:flex-row md:justify-between px-4">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-gray-500">
            © 2024 AI Dream Teller. All rights reserved.
          </p>
          <p className="text-xs text-gray-400">
            사업자 정보: 123-45-67890 | 대표: 김대표
          </p>
        </div>

        <nav className="flex gap-4">
          <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">
            이용약관
          </Link>
          <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">
            개인정보처리 방침
          </Link>
          <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">
            문의하기
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default SiteFooter;
