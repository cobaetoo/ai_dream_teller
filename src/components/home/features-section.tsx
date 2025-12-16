import React from "react";
import {
  Brain,
  Fingerprint,
  Image as ImageIcon,
  Sparkles,
  Shield,
  Zap,
} from "lucide-react";

const FeaturesSection = () => {
  return (
    <section className="container py-24 px-4 bg-slate-50/50">
      <div className="mb-16 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          왜 <span className="text-purple-600">AI Dream Teller</span>인가요?
        </h2>
        <p className="mt-4 text-lg text-slate-600">
          꿈은 당신의 무의식이 보내는 가장 솔직한 편지입니다.
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-2 lg:gap-8 h-full">
        {/* Feature 1: Large Card (Specialists -> Prediction) */}
        <div className="group relative col-span-1 md:col-span-2 row-span-1 overflow-hidden rounded-3xl border bg-white p-8 shadow-sm transition-all hover:shadow-md">
          <div className="relative z-10">
            <div className="mb-4 inline-flex rounded-full bg-purple-100 p-3 text-purple-600">
              <Brain className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-900">
              심층 심리 분석 전문
            </h3>
            <p className="text-slate-600 max-w-md">
              단순한 해몽 사전이 아닙니다. 프로이트의 정신분석학, 융의
              분석심리학 등 검증된 이론을 바탕으로 당신의 꿈을 다각도로 분석하여
              내면의 심리 상태를 진단합니다.
            </p>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] h-32 w-32 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 opacity-10 blur-2xl transition-all group-hover:scale-150 group-hover:opacity-20" />
        </div>

        {/* Feature 2: Visual Card (Image Generation) */}
        <div className="group relative col-span-1 row-span-2 overflow-hidden rounded-3xl border bg-slate-900 p-8 shadow-sm transition-all hover:shadow-xl text-white">
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <div className="mb-4 inline-flex rounded-full bg-slate-800 p-3 text-blue-400">
                <ImageIcon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold">꿈의 시각적 기록</h3>
              <p className="text-slate-300">
                꿈에서 느낀 몽환적인 감정, 잊혀지기 전에 AI가 고화질 이미지로
                남겨드립니다. 당신의 무의식 세계를 갤러리에 소장하세요.
              </p>
            </div>
            <div className="mt-8 h-40 w-full rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-80 blur-sm transition-all group-hover:blur-none group-hover:scale-105" />
          </div>
        </div>

        {/* Feature 3: Small Card (Speed) */}
        <div className="group relative col-span-1 overflow-hidden rounded-3xl border bg-white p-8 shadow-sm transition-all hover:shadow-md">
          <div className="mb-4 inline-flex rounded-full bg-green-100 p-3 text-green-600">
            <Zap className="h-6 w-6" />
          </div>
          <h3 className="mb-2 text-lg font-bold text-slate-900">
            나를 위한 조언
          </h3>
          <p className="text-sm text-slate-600">
            현재 겪고 있는 스트레스나 고민에 대해 무의식이 제시하는 해결책을
            발견해보세요.
          </p>
        </div>

        {/* Feature 4: Small Card (Privacy) */}
        <div className="group relative col-span-1 overflow-hidden rounded-3xl border bg-white p-8 shadow-sm transition-all hover:shadow-md">
          <div className="mb-4 inline-flex rounded-full bg-orange-100 p-3 text-orange-600">
            <Shield className="h-6 w-6" />
          </div>
          <h3 className="mb-2 text-lg font-bold text-slate-900">
            비밀 보장 상담소
          </h3>
          <p className="text-sm text-slate-600">
            누구에게도 말하기 힘든 내밀한 꿈, 100% 익명으로 안전하게 털어놓고
            해소하세요.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
