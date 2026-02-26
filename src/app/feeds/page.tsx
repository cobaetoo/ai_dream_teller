import React from "react";
import { DreamFeedCard } from "@/components/feeds/dream-feed-card";
import { Button } from "@/components/ui/button";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const FeedsPage = async () => {
  const supabase = createAdminClient();
  const { data: dreams } = await supabase
    .from("dreams")
    .select(
      "id, content, expert_type, analysis_result, image_url, created_at, profiles(nickname)",
    )
    .eq("is_public", true)
    .eq("status", "COMPLETED")
    .order("created_at", { ascending: false })
    .limit(50);

  const feedItems = dreams || [];
  return (
    <div className="min-h-screen bg-slate-100 py-12 md:py-20">
      <div className="container px-4 max-w-2xl mx-auto">
        {" "}
        {/* Max width limited for Feed Look */}
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            꿈 해몽 피드
          </h1>
          <p className="mt-4 text-slate-600">
            실시간으로 업데이트되는 꿈 이야기들을 확인하세요.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {["전체", "프로이트", "칼 융", "예지몽", "악몽"].map((tag) => (
              <Button
                key={tag}
                variant={tag === "전체" ? "default" : "outline"}
                size="sm"
                className="rounded-full bg-white hover:bg-slate-50"
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
        {/* Feed List (Single Column) */}
        <div className="flex flex-col gap-8">
          {feedItems.map((item) => {
            const analysis = item.analysis_result as any;
            return (
              <DreamFeedCard
                key={item.id}
                imageUrl={item.image_url}
                title={analysis?.title || "분석 완료된 꿈"}
                dreamContent={item.content}
                interpretationContent={
                  analysis?.analysis || "해석을 불러올 수 없습니다."
                }
                expertType={item.expert_type}
              />
            );
          })}
          {feedItems.length === 0 && (
            <div className="text-center py-20 text-slate-500">
              아직 모두에게 공유된 꿈 해석이 없습니다.
              <br />
              여러분의 꿈을 가장 먼저 공유해보세요!
            </div>
          )}
        </div>
        {/* Load More Trigger */}
        <div className="mt-16 flex justify-center">
          <Button variant="ghost" size="lg" className="text-slate-500">
            더 많은 꿈 불러오기...
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeedsPage;
