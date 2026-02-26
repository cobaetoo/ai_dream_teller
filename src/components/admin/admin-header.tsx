"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Menu } from "lucide-react";

const getBreadcrumbItems = (pathname: string) => {
  const paths = pathname.split("/").filter(Boolean);
  // 예: ['admin', 'order-list', '123']
  const items = paths.map((path, index) => {
    let name = path;
    switch (path) {
      case "admin":
        name = "대시보드";
        break;
      case "order-list":
        name = "주문/결제 관리";
        break;
      case "user-list":
        name = "회원 관리";
        break;
      case "feed-list":
        name: "콘텐츠 관리";
        break;
      default:
        // UUID 같은 경우 줄임 처리
        name = path.length > 8 ? `${path.substring(0, 8)}...` : path;
    }
    const href = `/${paths.slice(0, index + 1).join("/")}`;
    return { name, href, isLast: index === paths.length - 1 };
  });

  return items;
};

const AdminHeader = () => {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbItems(pathname);

  return (
    <header className="sticky top-0 z-30 flex w-full items-center justify-between border-b bg-white px-4 py-3 shadow-sm dark:bg-gray-800 dark:border-gray-700 sm:px-6">
      <div className="flex items-center">
        {/* 모바일 메뉴 버튼 (미구현 시 placeholder) */}
        <button
          type="button"
          className="mr-3 inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 sm:hidden"
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>

        {/* 빵판(Breadcrumb) 네비게이션 */}
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 sm:space-x-2">
            {breadcrumbs.map((item, index) => (
              <li key={item.href} className="inline-flex items-center">
                {index > 0 && (
                  <ChevronRight className="mx-1 h-4 w-4 text-gray-400 sm:mx-2" />
                )}
                <Link
                  href={item.href}
                  className={`inline-flex items-center text-sm font-medium ${
                    item.isLast
                      ? "text-gray-700 dark:text-gray-200"
                      : "text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-white"
                  }`}
                  aria-current={item.isLast ? "page" : undefined}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        {/* 우측 유저/프로필 메뉴 위치 */}
        <div className="flex items-center space-x-3 text-sm font-medium text-gray-700">
          <span>관리자님, 환영합니다.</span>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
