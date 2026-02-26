import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DreamFeedCard } from "@/components/feeds/dream-feed-card";
import { ArrowRight } from "lucide-react";

import { createAdminClient } from "@/lib/supabase/admin";

interface FeedPreviewProps {}

const FeedPreviewSection = async () => {
  const supabase = createAdminClient();
  const { data: dreams } = await supabase
    .from("dreams")
    .select("id, content, expert_type, analysis_result, image_url, created_at")
    .eq("is_public", true)
    .eq("status", "COMPLETED")
    .order("created_at", { ascending: false })
    .limit(3);

  const feedItems = dreams || [];

  return (
    <section className="container py-24 px-4">
      <div className="mb-12 flex flex-col items-center text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          다른 사람들의 꿈 이야기
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">
          이미 많은 분들이 AI 해몽을 통해 자신의 무의식을 발견하고 있습니다.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {feedItems.map((item) => {
          const analysis = item.analysis_result as any;
          return (
            <DreamFeedCard
              key={item.id}
              imageUrl={item.image_url}
              title={analysis?.title || "해부 중인 꿈"}
              dreamContent={item.content}
              interpretationContent={
                analysis?.analysis || "내용을 불러올 수 없습니다."
              }
              expertType={item.expert_type}
              className="h-full"
            />
          );
        })}
        {feedItems.length === 0 && (
          <p className="col-span-full text-center text-slate-500 py-10">
            아직 공개된 꿈 해몽 정보가 없습니다. 첫 해몽의 주인공이 되어보세요!
          </p>
        )}
      </div>

      <div className="mt-12 text-center">
        <Link href="/feeds">
          <Button
            variant="outline"
            size="lg"
            className="h-12 border-slate-300 px-8 text-lg font-medium hover:bg-slate-50"
          >
            더 많은 꿈 보러가기
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default FeedPreviewSection;
