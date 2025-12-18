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
  Sparkles,
  LogOut,
  Edit2, // Added Edit2
  Calendar,
  ChevronRight, // Restored
} from "lucide-react";
import { Input } from "@/components/ui/input"; // Added Input
import { Badge } from "@/components/ui/badge";
import { DreamCalendar } from "@/components/dream-teller/dream-calendar";

// type definition for local state
interface UserData {
  id: string;
  email?: string;
  nickname: string;
  role: string;
  created_at?: string;
}

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
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState("");

  // Fetch User Data
  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/users/me");
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUserData(data.user);
            setNickname(data.user.nickname); // Init input value
          }
        }
      } catch (error) {
        // Handle error silently
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSaveNickname = async () => {
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname }),
      });

      if (!res.ok) {
        throw new Error("Failed to update nickname");
      }

      // Update local state
      setUserData((prev) => (prev ? { ...prev, nickname } : null));
      setIsEditing(false);
    } catch (error) {
      alert("닉네임 변경에 실패했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // Fallback if no user
  if (!userData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        로그인이 필요합니다.
      </div>
    );
  }

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
                  {userData.nickname[0]}
                </div>
                <div className="flex items-center justify-center gap-2">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <Input
                        autoFocus
                        value={nickname}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setNickname(e.target.value)
                        }
                        className="h-8 w-32 text-center"
                      />
                      <Button
                        size="sm"
                        onClick={handleSaveNickname}
                        className="h-8 px-2"
                      >
                        저장
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-xl">
                        {userData.nickname}님
                      </CardTitle>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
                <CardDescription>{userData.email}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Badge
                  variant="secondary"
                  className="bg-purple-50 text-purple-700 hover:bg-purple-100 mb-6"
                >
                  가입일:{" "}
                  {userData.created_at
                    ? new Date(userData.created_at).toLocaleDateString()
                    : "-"}
                </Badge>

                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      fetch("/api/auth/logout", { method: "POST" }).then(() => {
                        window.location.href = "/";
                      });
                    }}
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
