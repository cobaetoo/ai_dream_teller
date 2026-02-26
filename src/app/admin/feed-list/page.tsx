"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { EyeOff, Eye, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Mock public feeds
export default function AdminFeedListPage() {
  const [feeds, setFeeds] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dreams/public")
      .then((res) => res.json())
      .then((data) => {
        setFeeds(data.feeds || []);
        setLoading(false);
      });
  }, []);

  const toggleVisibility = async (id: string, currentVisibility: boolean) => {
    const action = currentVisibility ? "비공개(숨김)" : "공개";
    const confirmToggle = confirm(`해당 콘텐츠를 ${action} 처리하시겠습니까?`);
    if (!confirmToggle) return;

    try {
      const res = await fetch(`/api/admin/dreams/${id}/visibility`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_public: !currentVisibility }),
      });
      const data = await res.json();

      if (res.ok) {
        setFeeds((prev) =>
          prev.map((feed) =>
            feed.id === id ? { ...feed, is_public: !currentVisibility } : feed,
          ),
        );
      } else {
        alert(data.error || "상태 변경 실패");
      }
    } catch (err: any) {
      alert("API 오류 발생: " + err.message);
    }
  };

  const filteredFeeds = feeds.filter((feed) =>
    feed.content.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          공개 피드 관리
        </h1>
        <div className="relative w-full sm:w-72">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-500" />
          </div>
          <Input
            type="text"
            className="pl-10"
            placeholder="꿈 내용 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {feeds.length === 0 && loading && (
          <div className="col-span-full py-12 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
          </div>
        )}
        {filteredFeeds.map((feed) => {
          const author = feed.profiles ||
            feed.guests || { nickname: "알수없음" };
          return (
            <div
              key={feed.id}
              className={`relative flex flex-col justify-between rounded-xl border p-5 shadow-sm transition-all ${
                feed.is_public
                  ? "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
                  : "border-red-200 bg-red-50 opacity-80 dark:border-red-900/50 dark:bg-gray-800"
              }`}
            >
              <div>
                <div className="mb-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span className="font-semibold text-purple-600 dark:text-purple-400">
                    {feed.expert_type}
                  </span>
                  <span>
                    {feed.created_at
                      ? format(new Date(feed.created_at), "yyyy-MM-dd HH:mm")
                      : "-"}
                  </span>
                </div>
                <p className="mb-4 line-clamp-4 text-sm text-gray-800 dark:text-gray-200">
                  "{feed.content}"
                </p>
                <div className="text-xs font-medium text-gray-500">
                  작성자: {author.nickname || "익명"}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t pt-4 dark:border-gray-700">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    feed.is_public
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {feed.is_public ? "공개 상태" : "숨김 처리됨"}
                </span>

                <Button
                  variant={feed.is_public ? "outline" : "default"}
                  size="sm"
                  className={
                    feed.is_public
                      ? "text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }
                  onClick={() => toggleVisibility(feed.id, feed.is_public)}
                >
                  {feed.is_public ? (
                    <>
                      <EyeOff className="mr-1.5 h-3.5 w-3.5" /> 강제 숨김
                    </>
                  ) : (
                    <>
                      <Eye className="mr-1.5 h-3.5 w-3.5" /> 공개 복원
                    </>
                  )}
                </Button>
              </div>
            </div>
          );
        })}
        {filteredFeeds.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500">
            조건에 맞는 피드 게시물이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
