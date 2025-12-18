"use server";

export type GuestOrder = {
  id: string;
  dreamId: string;
  content: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  createdAt: string;
  expertType: string;
};

// Mock data for guest orders
export async function getGuestOrders(phone: string): Promise<GuestOrder[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // In a real app, we would validate the session/cookie here and fetch from Supabase
  // const { data } = await supabase.from('orders').select('...')...

  if (phone === "01012345678") {
    return [
      {
        id: "ord_1234567890",
        dreamId: "dream_001",
        content:
          "하늘을 나는 꿈을 꾸었는데, 날개가 돋아나서 구름 위를 자유롭게 날아다녔어요. 아래를 보니 사람들이 조그맣게 보였고 기분이 너무 상쾌했습니다.",
        status: "COMPLETED",
        createdAt: "2023-12-18T09:00:00Z",
        expertType: "FREUD",
      },
      {
        id: "ord_0987654321",
        dreamId: "dream_002",
        content:
          "이빨이 우수수 빠지는 꿈을 꿨어요. 피는 안 났는데 너무 당황스럽고 무서웠습니다. 거울을 보니 잇몸만 남아있었어요.",
        status: "PENDING",
        createdAt: "2023-12-17T22:30:00Z",
        expertType: "JUNG",
      },
      {
        id: "ord_1122334455",
        dreamId: "dream_003",
        content:
          "모르는 사람이 저를 계속 쫓아오는 꿈이었어요. 도망치다가 막다른 골목에 다다랐을 때 잠에서 깼습니다.",
        status: "FAILED",
        createdAt: "2023-12-10T14:15:00Z",
        expertType: "NEURO",
      },
    ];
  }

  return [];
}
