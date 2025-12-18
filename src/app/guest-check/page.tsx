import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import OrderList from "./order-list";
import { getGuestOrders } from "./actions";

export const metadata = {
  title: "비회원 주문 조회 | AI Dream Teller",
  description: "AI Dream Teller 비회원 주문 내역 조회 페이지입니다.",
};

export default async function GuestCheckPage() {
  // In a real implementation, we would get the phone number from the session/cookie
  // For now, we use the mock phone number that returns data
  const orders = await getGuestOrders("01012345678");

  return (
    <div className="min-h-screen w-full flex flex-col pt-20 pb-40 bg-slate-50 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-purple-200/40 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-blue-200/40 blur-[120px] pointer-events-none" />

      {/* Back Button */}
      <div className="absolute top-8 left-8 z-10">
        <Link href="/">
          <Button
            variant="ghost"
            className="text-slate-600 hover:text-slate-900"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            메인으로
          </Button>
        </Link>
      </div>

      <div className="w-full max-w-2xl mx-auto px-6 z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 mb-2">
            비회원 주문 조회
          </h1>
          <p className="text-slate-600">
            <span className="font-semibold text-slate-800">010-1234-5678</span>{" "}
            님의 꿈 해몽 요청 내역입니다.
          </p>
        </div>

        <OrderList orders={orders} />
      </div>
    </div>
  );
}
