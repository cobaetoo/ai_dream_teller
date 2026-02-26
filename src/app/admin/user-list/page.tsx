"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

const MOCK_USERS = Array.from({ length: 15 }).map((_, i) => ({
  id: `user-${i + 1}`,
  identifier: i % 3 === 0 ? "guest_phone_end_1234" : `testuser${i}@email.com`,
  type: i % 3 === 0 ? "비회원" : "회원",
  createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30),
  paymentCount: Math.floor(Math.random() * 5),
  totalSpent: Math.floor(Math.random() * 5) * 4900,
}));

export default function AdminUserListPage() {
  const [filterType, setFilterType] = useState<"ALL" | "USER" | "GUEST">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = MOCK_USERS.filter((user) => {
    const matchesFilterType =
      filterType === "ALL" ||
      (filterType === "USER" && user.type === "회원") ||
      (filterType === "GUEST" && user.type === "비회원");

    const matchesSearch = user.identifier
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesFilterType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          회원 목록
        </h1>
      </div>

      <div className="flex flex-col items-center justify-between space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
        <div className="flex flex-1 space-x-2">
          <button
            onClick={() => setFilterType("ALL")}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              filterType === "ALL"
                ? "bg-purple-600 text-white hover:bg-purple-700"
                : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
            }`}
          >
            전체 사용자
          </button>
          <button
            onClick={() => setFilterType("USER")}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              filterType === "USER"
                ? "bg-purple-600 text-white hover:bg-purple-700"
                : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
            }`}
          >
            가입 회원
          </button>
          <button
            onClick={() => setFilterType("GUEST")}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              filterType === "GUEST"
                ? "bg-purple-600 text-white hover:bg-purple-700"
                : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
            }`}
          >
            비회원(결제)
          </button>
        </div>
        <div className="relative w-full sm:w-64">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-500" />
          </div>
          <Input
            type="text"
            className="pl-10"
            placeholder="이메일 또는 연락처 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                식별자(ID)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                가입 구분
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                생성/최초 사용일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                이용 건수
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                누적 결제금액
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {user.identifier}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        user.type === "회원"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.type}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    {format(user.createdAt, "yyyy-MM-dd")}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    {user.paymentCount} 건
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    ₩{user.totalSpent.toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">
                  표시할 사용자 데이터가 없습니다. 검색 조건이나 필터를
                  확인해주세요.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
