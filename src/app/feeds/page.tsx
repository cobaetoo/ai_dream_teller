import React from "react";
import { DreamFeedCard } from "@/components/feeds/dream-feed-card";
import { Button } from "@/components/ui/button";
import { faker } from "@faker-js/faker";

// Generate Mock Data using Faker JS
const generateFeedItem = (id: string, index: number) => {
  // 홀수번째 아이템마다 이미지를 넣습니다 (1, 3, 5...) - 0-indexed이므로 i % 2 !== 0
  const hasImage = index % 2 !== 0; // 홀수 인덱스(두번째, 네번째..)가 아니라 '홀수 아이템'을 뜻한다면 0, 2, 4 (1번째, 3번째..)가 되어야 함.
  // 1. "홀수 아이템마다" -> 1st(i=0), 3rd(i=2), 5th(i=4) ... has Image
  // 2. "짝수 아이템" -> 2nd(i=1), 4th(i=3) ... No Image

  // Requirement: "홀수 아이템마다 ... 이미지를 넣어줘"
  // If we count starting from 1: 1, 3, 5... have images. (Indices 0, 2, 4...)
  const showImage = index % 2 === 0;

  return {
    orderId: id,
    imageUrl: showImage ? `https://picsum.photos/seed/${id}/800/450` : null,
    title: faker.lorem.sentence(4), // Random sentence
    dreamContent: faker.lorem.paragraph(3), // User's dream
    interpretationContent: faker.lorem.paragraphs(2), // AI Interpretation
    expertType: faker.helpers.arrayElement([
      "Freud",
      "Jung",
      "Shaman",
      "Neuroscience",
    ]),
  };
};

const FEED_ITEMS = Array.from({ length: 10 }).map((_, i) =>
  generateFeedItem(i.toString(), i)
);

const FeedsPage = () => {
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
          {FEED_ITEMS.map((item) => (
            <DreamFeedCard
              key={item.orderId}
              imageUrl={item.imageUrl}
              title={item.title}
              dreamContent={item.dreamContent}
              interpretationContent={item.interpretationContent}
              expertType={item.expertType}
            />
          ))}
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
