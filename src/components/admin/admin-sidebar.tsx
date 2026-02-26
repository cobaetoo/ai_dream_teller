"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  FileText,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ROUTES = [
  {
    path: "/admin",
    name: "대시보드",
    icon: <LayoutDashboard size={20} />,
  },
  {
    path: "/admin/order-list",
    name: "주문/결제 관리",
    icon: <ShoppingCart size={20} />,
  },
  {
    path: "/admin/user-list",
    name: "회원 관리",
    icon: <Users size={20} />,
  },
  {
    path: "/admin/feed-list",
    name: "콘텐츠 관리",
    icon: <FileText size={20} />,
  },
];

const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-white transition-transform">
      <div className="flex h-full flex-col overflow-y-auto px-3 py-4">
        <Link href="/admin" className="mb-8 flex items-center pl-2.5">
          <span className="self-center whitespace-nowrap text-xl font-semibold text-purple-600 dark:text-white">
            Admin Panel
          </span>
        </Link>
        <ul className="mb-auto space-y-2 font-medium">
          {ROUTES.map((route) => {
            const isActive =
              route.path === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(route.path);
            return (
              <li key={route.path}>
                <Link
                  href={route.path}
                  className={cn(
                    "group flex items-center rounded-lg p-2 text-gray-900 hover:bg-purple-100 dark:text-white dark:hover:bg-gray-700",
                    isActive &&
                      "bg-purple-100 text-purple-700 dark:bg-gray-700",
                  )}
                >
                  <span
                    className={cn(
                      "text-gray-500 transition duration-75 group-hover:text-purple-600",
                      isActive && "text-purple-600",
                    )}
                  >
                    {route.icon}
                  </span>
                  <span className="ml-3 font-semibold">{route.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* 하단 유틸 (설정 등 필요시 추가) */}
        <div className="mt-8 border-t pt-4">
          <ul className="space-y-2 font-medium">
            <li>
              <Link
                href="/"
                className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              >
                <span className="text-gray-500 transition duration-75 group-hover:text-gray-900">
                  <Settings size={20} />
                </span>
                <span className="ml-3 font-semibold">서비스 홈으로</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
