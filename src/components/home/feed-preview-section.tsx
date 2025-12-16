import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DreamFeedCard } from "@/components/feeds/dream-feed-card";
import { ArrowRight } from "lucide-react";

const STATIC_FEED_ITEMS = [
  {
    orderId: "preview-1",
    imageUrl: "https://picsum.photos/seed/ocean/800/450",
    title: "깊은 바다속을 헤엄치는 꿈",
    dreamContent:
      "아주 깊고 푸른 바다속이었는데, 숨을 쉬는 게 전혀 힘들지 않았어요. 오히려 물고기처럼 자유롭게 유영하며 고대 유적 같은 곳을 발견했습니다.",
    interpretationContent:
      "물은 무의식을 상징합니다. 깊은 바다를 편안하게 헤엄치는 것은 당신이 자신의 무의식 세계를 탐구할 준비가 되었음을 의미하며, 평소 억눌러왔던 잠재력을 발견할 기회입니다.",
    expertType: "Jung",
  },
  {
    orderId: "preview-2",
    imageUrl: null,
    title: "이빨이 우수수 빠지는 꿈",
    dreamContent:
      "거울을 보고 있었는데, 갑자기 앞니 하나가 흔들리더니 입안의 모든 치아가 우수수 쏟아져 내렸습니다. 너무 놀라 소리를 지르다 깼어요.",
    interpretationContent:
      "치아가 빠지는 꿈은 주로 신변의 변화나 상실에 대한 불안을 나타냅니다. 현재 겪고 있는 스트레스 상황이나, 자신감의 저하를 겪고 있지 않은지 돌아볼 필요가 있습니다.",
    expertType: "Freud",
  },
  {
    orderId: "preview-3",
    imageUrl: "https://picsum.photos/seed/skywhale/800/450",
    title: "도시 위를 나는 거대한 고래",
    dreamContent:
      "해질 무렵의 보랏빛 하늘 위로, 빌딩보다 더 큰 고래가 천천히 날아가고 있었습니다. 저는 옥상에서 그 모습을 경이롭게 바라보았습니다.",
    interpretationContent:
      "거대한 고래는 압도적인 힘이나 운명을 상징하지만, 하늘을 나는 비현실적인 상황은 자유에 대한 강한 갈망을 나타냅니다. 답답한 현실에서 벗어나고 싶은 소망이 투영되었습니다.",
    expertType: "Shaman",
  },
];

const FeedPreviewSection = () => {
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
        {STATIC_FEED_ITEMS.map((item) => (
          <DreamFeedCard
            key={item.orderId}
            imageUrl={item.imageUrl}
            title={item.title}
            dreamContent={item.dreamContent}
            interpretationContent={item.interpretationContent}
            expertType={item.expertType}
            className="h-full" // Ensure cards are same height if possible, though expanding content makes it vary
          />
        ))}
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
