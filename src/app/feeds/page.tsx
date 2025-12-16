import React from "react";
import { FeedCard } from "@/components/feed/feed-card";
import { Sparkles } from "lucide-react";

// Dummy Data for Feeds
const DUMMY_FEEDS = [
  {
    id: "feed-1",
    user: {
      name: "꿈꾸는 다람쥐",
      image: "",
      initial: "다",
    },
    dream: {
      category: "길몽",
      keywords: ["황금돼지", "복권", "빛"],
      content:
        "엄청나게 큰 황금 돼지가 제 품으로 달려들어서 안기는 꿈을 꿨어요! 너무 생생해서 깼을 때도 온기가 느껴지는 것 같았는데, 이거 혹시 복권을 사야 할 징조일까요? 돼지 눈이 반짝반짝 빛나고 있었어요.",
      analysis:
        "축하합니다! 황금 돼지는 재물과 행운의 가장 강력한 상징입니다. 품에 안겼다는 것은 행운이 당신에게 직접적으로 찾아올 것임을 암시합니다. 예상치 못한 큰 수익이나 승진, 사업 번창 등 긍정적인 변화가 기대됩니다.",
      imageUrl:
        "https://images.unsplash.com/photo-1614730341194-75c60740a2d3?q=80&w=2074&auto=format&fit=crop",
      createdAt: "방금 전",
      likes: 124,
      comments: 15,
    },
  },
  {
    id: "feed-2",
    user: {
      name: "StarGazer",
      image: "",
      initial: "S",
    },
    dream: {
      category: "심리몽",
      keywords: ["비행", "하늘", "자유"],
      content:
        "아무런 장비 없이 하늘을 자유롭게 날아다니는 꿈이었습니다. 아래를 내려다보니 도시가 장난감처럼 작게 보였고, 바람이 시원했어요. 날다가 구름 위에 누웠는데 정말 폭신했습니다.",
      analysis:
        "하늘을 나는 꿈은 현재의 억압된 상황에서 벗어나고 싶은 자유에 대한 갈망, 또는 자신의 능력을 널리 펼치고 싶은 욕구를 반영합니다. 현재 진행 중인 프로젝트나 일에서 좋은 성과를 거두어 지위가 상승할 수 있음을 나타내기도 합니다.",
      imageUrl:
        "https://images.unsplash.com/photo-1559863345-02eaa420f220?q=80&w=2600&auto=format&fit=crop",
      createdAt: "1시간 전",
      likes: 89,
      comments: 8,
    },
  },
  {
    id: "feed-3",
    user: {
      name: "익명의 몽상가",
      image: "",
      initial: "익",
    },
    dream: {
      category: "악몽",
      keywords: ["추격", "어둠", "미로"],
      content:
        "끝이 보이지 않는 어두운 미로를 계속해서 뛰었습니다. 무언가 알 수 없는 존재가 뒤에서 쫒아오는 느낌이 들어서 숨이 턱 끝까지 찼는데, 다리가 점점 무거워져서 움직이지 않았어요. 너무 무서워서 식은땀을 흘리며 깨어났습니다.",
      analysis:
        "무언가에 쫓기는 꿈은 심리적인 불안감과 스트레스를 상징합니다. 현재 해결해야 하는 압박감이나 도피하고 싶은 책임감이 있을 수 있습니다. 미로는 해결책을 찾지 못해 답답한 무의식의 반영입니다. 휴식을 취하고 문제를 차근차근 정리해보는 것이 좋겠습니다.",
      imageUrl:
        "https://images.unsplash.com/photo-1635607907963-f11116c96937?q=80&w=2070&auto=format&fit=crop",
      createdAt: "3시간 전",
      likes: 45,
      comments: 22,
    },
  },
  {
    id: "feed-4",
    user: {
      name: "HappyMom",
      image: "",
      initial: "H",
    },
    dream: {
      category: "태몽",
      keywords: ["복숭아", "과일", "바구니"],
      content:
        "탐스럽고 빨간 복숭아가 바구니 가득 담겨있는 걸 할머님이 주시는 꿈이었어요. 향기가 너무 달콤해서 하나를 베어 물었는데 과즙이 팡 터지더라고요. 이게 혹시 태몽일까요?",
      analysis:
        "매우 긍정적인 태몽으로 해석될 수 있습니다. 복숭아는 건강하고 예쁜 아이를 상징하며, 과즙이 풍부한 것은 아이의 복과 인생의 풍요로움을 의미합니다. 딸일 확률이 높다는 속설이 있지만, 무엇보다 사랑스러운 생명의 잉태를 축복하는 꿈입니다.",
      imageUrl:
        "https://images.unsplash.com/photo-1644330668694-82559e843b0d?q=80&w=2070&auto=format&fit=crop",
      createdAt: "5시간 전",
      likes: 210,
      comments: 45,
    },
  },
  {
    id: "feed-5",
    user: {
      name: "바다여행자",
      image: "",
      initial: "바",
    },
    dream: {
      category: "경고몽",
      keywords: ["이빨", "발치", "거울"],
      content:
        "거울을 보고 있는데 갑자기 앞니가 툭 하고 빠져버렸습니다. 피는 나지 않았는데 잇몸이 허전해서 계속 혀로 만져보는 꿈이었어요. 기분이 찜찜하네요.",
      analysis:
        "이빨이 빠지는 꿈은 전통적으로 가족이나 가까운 지인에게 변화가 생길 수 있음을 암시합니다. 혹은 본인의 사회적 지위나 자신감이 흔들리는 경험을 할 수도 있습니다. 피가 나지 않았다면 큰 불행보다는 사소한 변화나 걱정거리를 의미할 가능성이 높으니 매사에 조금 더 주의를 기울이시면 좋겠습니다.",
      imageUrl: null, // 이미지가 없는 케이스 테스트
      createdAt: "어제",
      likes: 12,
      comments: 3,
    },
  },
];

export default function FeedPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-slate-50/50 dark:bg-black py-8 md:py-12">
      <div className="container max-w-xl px-4 flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center space-y-2 mb-4">
          <div className="flex items-center gap-2 rounded-full bg-purple-100 dark:bg-purple-900/30 px-3 py-1 text-sm font-medium text-purple-600 dark:text-purple-400">
            <Sparkles className="h-4 w-4" />
            <span>실시간 꿈 해몽 피드</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-400">
            다른 사람들은 어떤 꿈을 꿀까요?
          </h1>
          <p className="text-muted-foreground text-sm max-w-md">
            익명으로 공유된 다양한 꿈 이야기와 AI 전문가의 심층 분석을
            확인해보세요. 당신의 꿈도 누군가에게 영감이 될 수 있습니다.
          </p>
        </div>

        {/* Feed List */}
        <div className="flex flex-col gap-6 w-full items-center">
          {DUMMY_FEEDS.map((feed) => (
            <FeedCard key={feed.id} data={feed} />
          ))}
        </div>

        {/* Loading / Infinity Scroll Trigger (Visual) */}
        <div className="py-8 text-center">
          <p className="text-sm text-muted-foreground animate-pulse">
            더 많은 꿈을 불러오는 중...
          </p>
        </div>
      </div>
    </div>
  );
}
