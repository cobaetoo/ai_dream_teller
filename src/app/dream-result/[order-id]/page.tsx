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

// Mock Data Helper
const getMockResult = (id: string) => {
  return {
    id,
    userDream:
      "어제 밤에 아주 깊은 숲속을 걷는 꿈을 꾸었습니다. 안개가 자욱했고, 나무들이 마치 살아서 움직이는 것 같았어요. 갑자기 늑대 한 마리가 나타나 저를 빤히 쳐다보다가 길을 안내하듯 앞장섰습니다. 그 늑대를 따라가다 보니 오래된 사원이 나왔고, 그 안에서 빛나는 보석을 발견했습니다.",
    interpretation: {
      summary: "무의식의 인도와 내면의 지혜 발견",
      fullText:
        "숲은 당신의 무의식 세계를 상징합니다. 짙은 안개는 현재 당신이 미래에 대해 느끼는 불확실성을 나타내지만, 늑대라는 '인도자(Guide)'의 등장은 당신의 직관이 깨어나고 있음을 의미합니다.\n\n늑대가 안내한 오래된 사원은 당신의 내면에 잠들어 있는 깊은 지혜나 영적인 공간을 상징합니다. 그리고 그곳에서 발견한 '빛나는 보석'은 당신이 곧 발견하게 될 새로운 재능이나 깨달음, 혹은 해결책을 암시합니다. \n\n이 꿈은 두려워하지 말고 자신의 직관을 믿고 나아가라는 긍정적인 메시지를 담고 있습니다.",
      keywords: ["무의식", "직관", "지혜", "발견"],
    },
    imageUrl: `https://picsum.photos/seed/${id}/1024/1024`,
    date: new Date().toLocaleDateString(),
  };
};

interface PageProps {
  params: Promise<{ "order-id": string }>;
}

export default async function DreamResultPage({ params }: PageProps) {
  const resolvedParams = await params;
  const orderId = resolvedParams["order-id"];
  const data = getMockResult(orderId);

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
