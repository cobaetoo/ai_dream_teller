"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { EyeOff, Eye, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Mock public feeds
const MOCK_FEEDS = Array.from({ length: 12 }).map((_, i) => ({
  id: `feed-${i + 1}`,
  expertType: i % 2 === 0 ? "JUNG" : "FREUD",
  content: "어제 하늘을 나는 꿈을 꾸었는데 아주 생생했어요...",
  createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 7),
  isPublic: i !== 3, // 하나 정도는 비공개 처리로 테스트
  userNickname: `Dreamer_${i + 1}`,
}));

export default function AdminFeedListPage() {
  const [feeds, setFeeds] = useState(MOCK_FEEDS);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleVisibility = (id: string, currentVisibility: boolean) => {
    // 백엔드 연동 전 상태 변경 테스트
    const action = currentVisibility ? "비공개(숨김)" : "공개";
    const confirmToggle = confirm(`해당 콘텐츠를 ${action} 처리하시겠습니까?`);
    if (confirmToggle) {
      setFeeds((prev) =>
        prev.map((feed) =>
          feed.id === id ? { ...feed, isPublic: !currentVisibility } : feed,
        ),
      );
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
        {filteredFeeds.map((feed) => (
          <div
            key={feed.id}
            className={`relative flex flex-col justify-between rounded-xl border p-5 shadow-sm transition-all ${
              feed.isPublic
                ? "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
                : "border-red-200 bg-red-50 opacity-80 dark:border-red-900/50 dark:bg-gray-800"
            }`}
          >
            <div>
              <div className="mb-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span className="font-semibold text-purple-600 dark:text-purple-400">
                  {feed.expertType}
                </span>
                <span>{format(feed.createdAt, "yyyy-MM-dd HH:mm")}</span>
              </div>
              <p className="mb-4 line-clamp-4 text-sm text-gray-800 dark:text-gray-200">
                "{feed.content}"
              </p>
              <div className="text-xs font-medium text-gray-500">
                작성자: {feed.userNickname}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t pt-4 dark:border-gray-700">
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  feed.isPublic
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {feed.isPublic ? "공개 상태" : "숨김 처리됨"}
              </span>

              <Button
                variant={feed.isPublic ? "outline" : "default"}
                size="sm"
                className={
                  feed.isPublic
                    ? "text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400"
                    : "bg-green-600 text-white hover:bg-green-700"
                }
                onClick={() => toggleVisibility(feed.id, feed.isPublic)}
              >
                {feed.isPublic ? (
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
        ))}
        {filteredFeeds.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500">
            조건에 맞는 피드 게시물이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
