"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MoveLeft, RotateCcw, XCircle } from "lucide-react";

export default function AdminOrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();

  // Mock data for display purposes
  const mockOrder = {
    id: params.id,
    userType: "회원",
    expertType: "JUNG",
    amount: 4900,
    status: "COMPLETED",
    createdAt: "2024-05-18 14:30",
    dreamInput:
      "어젯밤 숲속에서 길을 잃었는데 황금빛 사슴이 나타나 나를 안내해주었어...",
    aiOutput:
      "숲속에서 길을 잃은 것은 현재 삶의 방향성에 대한 일시적인 혼란을 상징합니다. 하지만 황금빛 사슴은 융의 분석심리학적 관점에서 볼 때 내면의 직관이자 '자기(Self)'의 원형적 안내자입니다. 이 꿈은 당신이 곧 올바른 해답을 내면에서 찾게 될 것임을 강하게 시사합니다.",
  };

  const handleRetry = () => {
    alert(`[모의] ${params.id}번 주문에 대한 AI 해몽 재시도 API 호출!`);
  };

  const handleCancel = () => {
    const confirmCancel = confirm(
      "정말로 이 결제를 취소하시겠습니까? 토스 페이먼츠 환불 API가 호출됩니다.",
    );
    if (confirmCancel) {
      alert(`[모의] ${params.id}번 주문 환불 완료!`);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <MoveLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          주문 상세: {params.id}
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 주문 기본 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>결제 기본 정보</CardTitle>
            <CardDescription>유저 및 결제 상태 확인</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid grid-cols-3 border-b pb-2">
              <span className="font-medium text-gray-500">회원 여부</span>
              <span className="col-span-2 font-semibold">
                {mockOrder.userType}
              </span>
            </div>
            <div className="grid grid-cols-3 border-b pb-2">
              <span className="font-medium text-gray-500">전문가 배정</span>
              <span className="col-span-2 font-semibold">
                {mockOrder.expertType} 스타일
              </span>
            </div>
            <div className="grid grid-cols-3 border-b pb-2">
              <span className="font-medium text-gray-500">결제 금액</span>
              <span className="col-span-2 font-semibold">
                ₩{mockOrder.amount.toLocaleString()}
              </span>
            </div>
            <div className="grid grid-cols-3 border-b pb-2">
              <span className="font-medium text-gray-500">결제 상태</span>
              <span className="col-span-2">
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                  {mockOrder.status}
                </span>
              </span>
            </div>
            <div className="grid grid-cols-3 pb-2">
              <span className="font-medium text-gray-500">접수 일시</span>
              <span className="col-span-2">{mockOrder.createdAt}</span>
            </div>
          </CardContent>
        </Card>

        {/* CS 관리용 액션 */}
        <Card className="border-red-100 dark:border-red-900/30">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400">
              고객 서비스 (CS) 조치
            </CardTitle>
            <CardDescription>환불 및 장애 대응용 액션</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            <Button
              variant="outline"
              className="w-full justify-start text-blue-600 hover:bg-blue-50 dark:text-blue-400"
              onClick={handleRetry}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              AI 해몽 결과 다시 생성하기
            </Button>
            <p className="text-xs text-gray-500">
              * AI 결과 품질에 이의가 있거나 결과 생성 시 오류가 발생한 경우
              수동 재시도를 호출합니다.
            </p>

            <Button
              variant="destructive"
              className="mt-4 w-full justify-start"
              onClick={handleCancel}
            >
              <XCircle className="mr-2 h-4 w-4" />
              결제 강제 취소 (환불)
            </Button>
            <p className="text-xs text-gray-500">
              * 즉시 토스 페이먼츠 환불 API가 호출되어 PG사 취소 처리가
              진행됩니다. 신중하게 클릭하세요.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 꿈 상세 데이터 */}
      <Card>
        <CardHeader>
          <CardTitle>꿈 상세 데이터</CardTitle>
          <CardDescription>입력한 꿈 내용과 AI 해석 결과</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              사용자 입력 내용 (Prompt)
            </h3>
            <div className="rounded-md bg-gray-50 p-4 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300">
              {mockOrder.dreamInput}
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              AI 해몽 출력 텍스트 (Output)
            </h3>
            <div className="rounded-md bg-purple-50 p-4 text-sm text-purple-900 dark:bg-purple-900/20 dark:text-purple-100">
              {mockOrder.aiOutput}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
