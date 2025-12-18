import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import GuestLoginForm from "./guest-login-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "비회원 로그인 | AI Dream Teller",
  description: "비회원 주문 내역을 조회하기 위한 로그인 페이지입니다.",
};

export default function GuestLoginPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center pb-40 bg-slate-50 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-purple-200/40 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-blue-200/40 blur-[120px]" />

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

      <div className="w-full max-w-md px-6 z-10">
        <GuestLoginForm />
      </div>
    </div>
  );
}
