"use client";

import React, { useEffect, useState } from "react";
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
import { format } from "date-fns";

export default function AdminOrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Next.js 15: params가 프로미스일 수 있지만, React 컴포넌트 내에서는 비동기로 풀어주기보단 React.use(params)나
  // params 자체를 useEffect dependency로 쓰며 데이터를 가져옵니다.
  // (임시방편으로 params.id 사용 - 만약 에러 시 string type 강제 변환)

  useEffect(() => {
    fetch(`/api/admin/orders/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setOrder(data);
        setLoading(false);
      });
  }, [params.id]);

  const handleRetry = async () => {
    const ok = confirm(
      `정말 ${params.id}번 주문에 대한 AI 해몽을 다시 생성하시겠습니까?`,
    );
    if (!ok) return;

    try {
      const res = await fetch(`/api/admin/orders/${params.id}/retry`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        alert("재시도 요청이 접수되었습니다. 곧 상태가 변경됩니다.");
        router.refresh();
      } else {
        alert(`API 에러: ${data.error}`);
      }
    } catch (err: any) {
      alert(`요청 실패: ${err.message}`);
    }
  };

  const handleCancel = async () => {
    const confirmCancel = confirm(
      "정말로 이 결제를 취소하시겠습니까? 토스 페이먼츠 환불 API가 호출됩니다.",
    );
    if (!confirmCancel) return;

    try {
      const res = await fetch(`/api/admin/orders/${params.id}/cancel`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        alert("환불이 성공적으로 처리되었습니다.");
        // 상태 갱신을 위해 데이터 재호출
        const refetch = await fetch(`/api/admin/orders/${params.id}`);
        const refetchData = await refetch.json();
        setOrder(refetchData);
      } else {
        alert(`환불 실패: ${data.error}`);
      }
    } catch (err: any) {
      alert(`요청 실패: ${err.message}`);
    }
  };

  if (loading || !order) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
      </div>
    );
  }

  const isGuest = !!order.guests;
  const userType = isGuest ? "비회원" : "회원";
  const expertType = order.dreams?.expert || "선택안됨";
  const dreamInput = order.dreams?.content || "내용 없음";
  const aiOutput = order.dreams?.analysis_result
    ? JSON.stringify(order.dreams.analysis_result, null, 2)
    : "결과 없음 (또는 상태 대기중)";

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
              <span className="col-span-2 font-semibold">{userType}</span>
            </div>
            <div className="grid grid-cols-3 border-b pb-2">
              <span className="font-medium text-gray-500">전문가 배정</span>
              <span className="col-span-2 font-semibold">
                {expertType} 스타일
              </span>
            </div>
            <div className="grid grid-cols-3 border-b pb-2">
              <span className="font-medium text-gray-500">결제 금액</span>
              <span className="col-span-2 font-semibold">
                ₩{order.amount?.toLocaleString()}
              </span>
            </div>
            <div className="grid grid-cols-3 border-b pb-2">
              <span className="font-medium text-gray-500">결제 상태</span>
              <span className="col-span-2">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    order.status === "DONE" || order.status === "PAID"
                      ? "bg-green-100 text-green-800"
                      : order.status === "CANCELED"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {order.status}
                </span>
              </span>
            </div>
            <div className="grid grid-cols-3 pb-2">
              <span className="font-medium text-gray-500">접수 일시</span>
              <span className="col-span-2">
                {order.created_at
                  ? format(new Date(order.created_at), "yyyy-MM-dd HH:mm")
                  : "-"}
              </span>
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
              {dreamInput}
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              AI 해몽 출력 텍스트 (Output)
            </h3>
            <div className="rounded-md bg-purple-50 p-4 text-sm text-purple-900 dark:bg-purple-900/20 dark:text-purple-100">
              {order.dreams?.status === "PENDING" ? (
                <span className="text-gray-500 italic">
                  결과를 기다리는 중 (PENDING)...
                </span>
              ) : (
                <pre className="whitespace-pre-wrap font-sans">{aiOutput}</pre>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
