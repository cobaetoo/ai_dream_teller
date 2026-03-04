"use client";

import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function AdminUserListPage() {
  const [filterType, setFilterType] = useState<"ALL" | "USER" | "GUEST">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = () => {
    setLoading(true);
    let url = `/api/admin/users?type=${filterType.toLowerCase()}`;
    if (startDate) url += `&startDate=${startDate}`;
    if (endDate) url += `&endDate=${endDate}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load users", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, [filterType, startDate, endDate]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = String(user.identifier)
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          유저 관리 (회원/비회원 통계)
        </h1>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-lg border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Button
            variant={filterType === "ALL" ? "default" : "outline"}
            onClick={() => setFilterType("ALL")}
            className={
              filterType === "ALL" ? "bg-purple-600 focus:ring-purple-500" : ""
            }
          >
            전체 사용자
          </Button>
          <Button
            variant={filterType === "USER" ? "default" : "outline"}
            onClick={() => setFilterType("USER")}
            className={
              filterType === "USER" ? "bg-purple-600 focus:ring-purple-500" : ""
            }
          >
            정식 회원
          </Button>
          <Button
            variant={filterType === "GUEST" ? "default" : "outline"}
            onClick={() => setFilterType("GUEST")}
            className={
              filterType === "GUEST"
                ? "bg-purple-600 focus:ring-purple-500"
                : ""
            }
          >
            비회원(게스트)
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">조회 기간:</span>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-36 h-9"
            />
            <span className="text-gray-400">~</span>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-36 h-9"
            />
          </div>
          <div className="relative w-full sm:w-60">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              type="text"
              className="h-9 pl-9"
              placeholder="식별자(닉네임, 번호) 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                유저 정보
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                가입(최초이용)일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                결제 이용 횟수
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                누적 결제액
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        user.type === "User"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.type === "User" ? "회원" : "비회원"}
                    </span>
                    {user.identifier}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                  {user.created_at
                    ? format(new Date(user.created_at), "yyyy-MM-dd HH:mm")
                    : "-"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                  {user.paymentCount}회
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  ₩{user.totalAmount?.toLocaleString() || 0}
                </td>
              </tr>
            ))}
            {loading && filteredUsers.length === 0 && (
              <tr>
                <td colSpan={4} className="py-10 text-center">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
                </td>
              </tr>
            )}
            {!loading && filteredUsers.length === 0 && (
              <tr>
                <td colSpan={4} className="py-10 text-center text-gray-500">
                  조회된 유저 데이터가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
