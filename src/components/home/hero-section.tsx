import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden py-20 text-center md:py-32">
      {/* Background Effects */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/20 blur-[100px]" />
      <div className="absolute top-0 right-0 -z-10 h-[300px] w-[300px] bg-blue-500/20 blur-[100px]" />
      <div className="absolute bottom-0 left-0 -z-10 h-[300px] w-[300px] bg-pink-500/20 blur-[100px]" />

      <div className="container relative z-10 flex flex-col items-center gap-6 px-4">
        <div className="inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-sm font-medium text-purple-800 backdrop-blur-sm">
          <Sparkles className="mr-2 h-3.5 w-3.5" />
          <span>AI 심리 분석 기반 해몽</span>
        </div>

        <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl">
          당신의 꿈은 <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-purple-600 via-blue-500 to-pink-500 bg-clip-text text-transparent">
            무의식이 보내는 신호
          </span>
          입니다.
        </h1>

        <p className="max-w-2xl text-lg text-slate-600 md:text-xl">
          기억에 남는 그 꿈, 단순한 우연이 아닙니다.
          <br className="hidden sm:block" />
          <span className="font-bold text-slate-800">
            프로이트와 융의 심리학적 이론
          </span>
          을 통해 내면의 진짜 목소리를 해석해보세요.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link href="/dream-teller">
            <Button
              size="lg"
              className="h-12 bg-gradient-to-r from-purple-600 to-blue-600 px-8 text-lg font-semibold hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all"
            >
              내 무의식 분석하기
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/feeds">
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-8 text-lg border-slate-300 hover:bg-slate-50"
            >
              남들은 무슨 꿈을 꿀까?
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
