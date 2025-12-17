"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChevronRight,
  Sparkles,
  LogOut,
  User,
  Settings,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DreamCalendar } from "@/components/dream-teller/dream-calendar";

// Mock User Data
const USER = {
  name: "비시용",
  email: "beseeyong@example.com",
  joinedDate: "2024.12.01",
  totalDreams: 12,
};

// Mock Recent History
const RECENT_DREAMS = [
  {
    id: "ORDER_12345",
    title: "무의식의 숲과 인도자",
    date: "2025.12.17",
    type: "Jung",
  },
  {
    id: "ORDER_12111",
    title: "하늘을 나는 고래",
    date: "2025.12.15",
    type: "Shaman",
  },
  {
    id: "ORDER_11999",
    title: "이가 빠지는 꿈",
    date: "2025.12.12",
    type: "Freud",
  },
];

const MyPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 md:py-20">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile & Navigation */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card className="border-slate-100 shadow-sm">
              <CardHeader className="text-center pb-2">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {USER.name[0]}
                </div>
                <CardTitle className="text-xl">{USER.name}님</CardTitle>
                <CardDescription>{USER.email}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Badge
                  variant="secondary"
                  className="bg-purple-50 text-purple-700 hover:bg-purple-100 mb-6"
                >
                  꿈 기록 {USER.totalDreams}개
                </Badge>

                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-slate-600"
                  >
                    <User className="mr-2 h-4 w-4" /> 내 정보 수정
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-slate-600"
                  >
                    <Settings className="mr-2 h-4 w-4" /> 환경설정
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> 로그아웃
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Calendar & History */}
          <div className="lg:col-span-2 space-y-6">
            {/* Calendar Section */}
            <DreamCalendar />

            {/* Recent History List */}
            <Card className="border-slate-100 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  최근 해몽 기록
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {RECENT_DREAMS.map((item) => (
                    <div
                      key={item.id}
                      className="group flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white hover:border-purple-200 hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-2xl group-hover:bg-purple-50 transition-colors">
                          🔮
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-sm text-slate-500">
                            {item.date} • {item.type} 분석
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-purple-400" />
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Button variant="outline" className="w-full">
                    전체 기록 보기
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
