"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const SuccessPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [errorMessage, setErrorMessage] = useState("");

  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");

  useEffect(() => {
    let isMounted = true;

    const confirmPayment = async () => {
      if (!paymentKey || !orderId || !amount) {
        if (isMounted) {
          setStatus("error");
          setErrorMessage(
            "잘못된 접근입니다. 필요한 파라미터가 누락되었습니다.",
          );
        }
        return;
      }

      try {
        const response = await fetch("/api/payments/confirm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: Number(amount),
          }),
        });

        if (!isMounted) return;

        if (response.ok) {
          setStatus("success");
          // 결제 승인 완료 후 결과 페이지로 이동
          setTimeout(() => {
            router.push(`/dream-result/${orderId}?paymentKey=${paymentKey}`);
          }, 2000);
        } else {
          const errorData = await response.json();
          setStatus("error");
          setErrorMessage(
            errorData.error?.message ||
              "결제 승인 과정에서 오류가 발생했습니다.",
          );
        }
      } catch (error) {
        if (!isMounted) return;
        setStatus("error");
        setErrorMessage(
          "결제 결과를 서버에서 확인하는 중 문제가 발생했습니다.",
        );
      }
    };

    confirmPayment();

    return () => {
      isMounted = false;
    };
  }, [paymentKey, orderId, amount, router]);

  if (status === "loading") {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
        <h2 className="text-xl font-semibold text-slate-800">
          결제 승인 중입니다...
        </h2>
        <p className="text-slate-500">창을 닫지 말고 잠시만 기다려주세요.</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50 gap-6 p-4 text-center">
        <XCircle className="h-16 w-16 text-red-500" />
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            결제 승인 실패
          </h2>
          <p className="text-slate-600">{errorMessage}</p>
        </div>
        <Button onClick={() => router.push("/payments")}>
          결제 다시 시도하기
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-slate-50 gap-6 p-4 text-center">
      <CheckCircle className="h-16 w-16 text-green-500" />
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          결제가 성공적으로 완료되었습니다!
        </h2>
        <p className="text-slate-600">잠시 후 해몽 결과 페이지로 이동합니다.</p>
      </div>
    </div>
  );
};

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      }
    >
      <SuccessPageContent />
    </Suspense>
  );
}
