"use client";

import React, { useState } from "react";
import { SelectableCard } from "@/components/dream-teller/selectable-card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  Brain,
  Sparkles,
  ScrollText,
  AlertCircle,
  ImageIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Mock Data
const EXPERTS = [
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

const OPTIONS = [
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

const DreamTellerPage = () => {
  const router = useRouter();
  const [selectedExpert, setSelectedExpert] = useState<string>(EXPERTS[0].id);
  const [selectedOption, setSelectedOption] = useState<string>(OPTIONS[1].id); // Default to Premium
  const [dreamContent, setDreamContent] = useState("");

  const handleExpertSelect = (id: string) => setSelectedExpert(id);
  const handleOptionSelect = (id: string) => setSelectedOption(id);

  const handleSubmit = () => {
    if (!dreamContent.trim()) {
      alert("꿈 내용을 입력해주세요!");
      return;
    }
    // TODO: 백엔드 API 연동 -> 주문 생성 -> 결제 페이지 이동
    console.log({
      expert: selectedExpert,
      option: selectedOption,
      content: dreamContent,
    });

    // 임시 이동
    router.push("/payments");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 md:py-20">
      <div className="container px-4 max-w-4xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            꿈 해몽 신청하기
          </h1>
          <p className="mt-4 text-slate-600">
            당신의 꿈을 분석할 전문가를 선택하고, 내용을 들려주세요.
          </p>
        </div>

        <div className="space-y-8">
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

          {/* Caveats & Submit */}
          <div className="space-y-6">
            <div className="flex items-start gap-3 rounded-lg bg-orange-50 p-4 text-sm text-orange-800">
              <AlertCircle className="h-5 w-5 shrink-0 text-orange-600" />
              <div>
                <span className="font-semibold block mb-1">주의사항</span>
                본 서비스는 AI 심리 분석을 기반으로 하며, 의학적 진단을 대신할
                수 없습니다. <br />
                분석에는 평균 3~5분이 소요되며, 결과 생성 실패 시 100%
                환불됩니다.
              </div>
            </div>

            <Button
              size="lg"
              className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all"
              onClick={handleSubmit}
            >
              분석 요청 및 결제하기
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DreamTellerPage;
