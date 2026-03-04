"use client";

import React, { useState } from "react";
import { SelectableCard } from "@/components/dream-teller/selectable-card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  Brain,
  Sparkles,
  ScrollText,
  AlertCircle,
  ImageIcon,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { LoadingScreen } from "@/components/ui/loading-screen";

export const EXPERTS = [
  {
    id: "freud",
    title: "지그문트 프로이트",
    description: "억압된 욕망과 무의식의 상징을 분석합니다.",
    icon: <Brain className="h-5 w-5" />,
  },
  {
    id: "jung",
    title: "카를 융",
    description: "집단 무의식과 원형(Archetype)을 탐구합니다.",
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    id: "fortune",
    title: "전통 해몽가",
    description: "오랜 민속 신앙과 예지적 관점에서 풀이합니다.",
    icon: <ScrollText className="h-5 w-5" />,
  },
];

export const OPTIONS = [
  {
    id: "basic",
    title: "심층 텍스트 분석",
    description: "선택한 전문가 페르소나의 상세한 분석 리포트를 제공합니다.",
    price: 3900,
    badge: undefined,
  },
  {
    id: "premium",
    title: "분석 + AI 시각화",
    description: "상세 분석과 함께 꿈의 장면을 고화질 이미지로 생성합니다.",
    price: 5900,
    badge: "BEST",
  },
];

export const DreamTellerForm = () => {
  const router = useRouter();
  const [selectedExpert, setSelectedExpert] = useState<string>(EXPERTS[0].id);
  const [selectedOption, setSelectedOption] = useState<string>(OPTIONS[1].id); // Default to Premium
  const [dreamContent, setDreamContent] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  React.useEffect(() => {
    fetch("/api/users/me")
      .then((res) => {
        if (res.ok) {
          res.json().then((data) => {
            setIsLoggedIn(data.type === "user");
            setIsAuthChecking(false);
          });
        } else {
          setIsLoggedIn(false);
          setIsAuthChecking(false);
        }
      })
      .catch(() => {
        setIsLoggedIn(false);
        setIsAuthChecking(false);
      });
  }, []);

  const handleExpertSelect = (id: string) => setSelectedExpert(id);
  const handleOptionSelect = (id: string) => setSelectedOption(id);

  const handleSubmit = async () => {
    if (isLoading) return;
    if (!dreamContent.trim()) {
      alert("꿈 내용을 입력해주세요!");
      return;
    }

    if (!isLoggedIn) {
      if (!phone.trim() || !password.trim()) {
        alert("비회원 결제를 위해 전화번호와 비밀번호를 입력해주세요.");
        return;
      }
    }

    setIsLoading(true);

    try {
      const selectedPrice =
        OPTIONS.find((o) => o.id === selectedOption)?.price || 5900;

      const payload: any = {
        content: dreamContent,
        expert_type: selectedExpert.toUpperCase(),
        amount: selectedPrice,
        has_image_gen: selectedOption === "premium",
      };

      if (!isLoggedIn) {
        payload.phone = phone.trim();
        payload.password = password.trim();
      }

      const response = await fetch("/api/dreams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // 주문 생성 성공 -> 결제 페이지로 이동
        router.push(
          `/payments?plan=${selectedOption}&orderId=${result.orderId}`,
        );
      } else {
        alert(
          "요청 처리 중 문제가 발생했습니다: " +
            (result.error || "알 수 없는 오류"),
        );
      }
    } catch (err) {
      console.error("Dream submission error:", err);
      alert("요청 처리 중 문제가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {isLoading && (
        <LoadingScreen
          fullScreen={true}
          message="꿈 분석 모델을 준비하고 있습니다..."
        />
      )}
      {/* 1. Expert Selection */}
      <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 text-sm">
            1
          </span>
          해석 전문가 선택
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {EXPERTS.map((expert) => (
            <SelectableCard
              key={expert.id}
              title={expert.title}
              description={expert.description}
              icon={expert.icon}
              selected={selectedExpert === expert.id}
              onClick={() => handleExpertSelect(expert.id)}
            />
          ))}
        </div>
      </section>

      {/* 2. Dream Input */}
      <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 text-sm">
            2
          </span>
          꿈 내용 입력
        </h2>
        <div className="relative">
          <Textarea
            placeholder="꿈에서 본 장면, 느꼈던 감정, 등장인물 등을 최대한 자세히 적어주세요. (최소 20자 이상)"
            className="min-h-[200px] resize-none text-base p-4 border-slate-200 focus:border-purple-500 focus:ring-purple-500 rounded-xl"
            value={dreamContent}
            onChange={(e) => setDreamContent(e.target.value)}
          />
          <div className="absolute bottom-4 right-4 text-xs text-slate-400">
            {dreamContent.length}자 / 2000자
          </div>
        </div>
      </section>

      {/* 3. Option Selection */}
      <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 text-sm">
            3
          </span>
          분석 옵션 선택
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {OPTIONS.map((option) => (
            <SelectableCard
              key={option.id}
              title={option.title}
              description={option.description}
              icon={
                option.id === "premium" ? (
                  <ImageIcon className="h-5 w-5" />
                ) : (
                  <ScrollText className="h-5 w-5" />
                )
              }
              selected={selectedOption === option.id}
              onClick={() => handleOptionSelect(option.id)}
              badge={option.badge}
            />
          ))}
        </div>
      </section>

      {/* 4. Guest Info (If not logged in) */}
      {!isAuthChecking && !isLoggedIn && (
        <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 text-sm">
              4
            </span>
            비회원 결제 정보
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                전화번호
              </label>
              <Input
                type="tel"
                placeholder="010-1234-5678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-12 border-slate-200 focus:border-purple-500 focus:ring-purple-500 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                비밀번호
              </label>
              <Input
                type="password"
                placeholder="결제 확인용 비밀번호 (4자리 이상) 입력"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 border-slate-200 focus:border-purple-500 focus:ring-purple-500 rounded-xl"
              />
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            * 입력하신 정보는 결제 및 해몽 결과 조회 용도로만 사용되며, 30일 후
            안전하게 파기됩니다.
          </p>
        </section>
      )}

      {/* Caveats & Submit */}
      <div className="space-y-6">
        <div className="flex items-start gap-3 rounded-lg bg-orange-50 p-4 text-sm text-orange-800">
          <AlertCircle className="h-5 w-5 shrink-0 text-orange-600" />
          <div>
            <span className="font-semibold block mb-1">주의사항</span>
            본 서비스는 AI 심리 분석을 기반으로 하며, 의학적 진단을 대신할 수
            없습니다. <br />
            분석에는 평균 3~5분이 소요되며, 결과 생성 실패 시 100% 환불됩니다.
          </div>
        </div>

        <Button
          size="lg"
          className="w-full h-14 text-lg bg-linear-to-r from-purple-600 to-blue-600 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all font-bold disabled:opacity-70"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              주문 생성 중...
            </>
          ) : (
            <>
              분석 요청 및 결제하기
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
