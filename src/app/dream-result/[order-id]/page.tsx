import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Share2,
  Download,
  Home,
  Sparkles,
  Quote,
  Calendar,
} from "lucide-react";
import { DreamCalendar } from "@/components/dream-teller/dream-calendar";
import { createAdminClient } from "@/lib/supabase/admin";

interface PageProps {
  params: Promise<{ "order-id": string }>;
}

export default async function DreamResultPage({ params }: PageProps) {
  const resolvedParams = await params;
  const orderId = resolvedParams["order-id"];

  const supabase = createAdminClient();
  const { data: dream, error } = await supabase
    .from("dreams")
    .select("*")
    .eq("id", orderId)
    .single();

  if (error || !dream) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-20">
        <div className="text-center text-slate-500">
          존재하지 않거나 삭제된 꿈 해석입니다.
        </div>
      </div>
    );
  }

  const analysis = (dream.analysis_result as any) || {};
  const data = {
    id: dream.id,
    userDream: dream.content,
    interpretation: {
      summary: analysis.title || "AI 꿈 해석 결과",
      fullText: analysis.analysis || "분석 결과를 불러오는 중...",
      keywords: (analysis.symbols || []) as string[],
    },
    imageUrl:
      dream.image_url || `https://picsum.photos/seed/${dream.id}/1024/1024`,
    date: new Date(dream.created_at).toLocaleDateString(),
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 md:py-20">
      {/* Header / Title Section */}
      <div className="container mx-auto max-w-5xl px-4 text-center mb-10">
        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
          <Sparkles className="h-4 w-4" />
          <span>AI Dream Analysis Complete</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">
          무의식의 숲과 인도자
        </h1>
        <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
          <Calendar className="h-4 w-4" />
          {data.date}
          <span className="mx-2">•</span>
          주문번호: {orderId}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Result Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
              {/* User's Dream (Question) */}
              <div className="p-6 md:p-10 bg-slate-50/50 border-b border-slate-100">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                  Your Dream
                </h3>
                <div className="relative pl-6 md:pl-8">
                  <Quote className="absolute top-0 left-0 h-4 w-4 text-slate-300 md:h-5 md:w-5" />
                  <p className="text-slate-700 text-lg leading-relaxed font-medium font-serif italic">
                    "{data.userDream}"
                  </p>
                </div>
              </div>

              {/* Image Visualization */}
              <div className="relative w-full aspect-video md:aspect-[2/1] bg-slate-100">
                <Image
                  src={data.imageUrl}
                  alt="Dream Visualization"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs">
                  AI Generated Visualization
                </div>
              </div>

              {/* AI Analysis (Answer) */}
              <div className="p-6 md:p-10">
                <div className="prose prose-lg max-w-none text-slate-800 leading-8">
                  <h3 className="text-xl font-bold text-purple-700 mb-6 flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    {data.interpretation.summary}
                  </h3>
                  <p className="whitespace-pre-line text-slate-600">
                    {data.interpretation.fullText}
                  </p>
                </div>

                {/* Keywords */}
                <div className="mt-8 flex flex-wrap gap-2">
                  {data.interpretation.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-sm font-semibold border border-purple-100"
                    >
                      #{keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Footer */}
              <div className="bg-slate-50 px-6 py-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex gap-3 w-full md:w-auto">
                  <Button
                    variant="outline"
                    className="flex-1 md:flex-none border-slate-200 hover:bg-white text-slate-600"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    공유하기
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 md:flex-none border-slate-200 hover:bg-white text-slate-600"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    이미지 저장
                  </Button>
                </div>
                <Link href="/" className="w-full md:w-auto">
                  <Button className="w-full md:w-auto bg-slate-900 hover:bg-slate-800 text-white">
                    <Home className="mr-2 h-4 w-4" />
                    메인으로 돌아가기
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Calendar & Additional Info */}
          <div className="space-y-6">
            <DreamCalendar />

            {/* More Dreams CTA Card */}
            <div className="p-6 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl text-white shadow-lg">
              <h3 className="font-bold text-lg mb-2">더 많은 꿈을 꾸셨나요?</h3>
              <p className="text-purple-100 text-sm mb-4">
                매일의 꿈을 기록하고 무의식의 패턴을 발견해보세요.
              </p>
              <Link href="/dream-teller">
                <Button className="w-full bg-white text-purple-600 hover:bg-purple-50 border-none">
                  새로운 꿈 해몽하기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
