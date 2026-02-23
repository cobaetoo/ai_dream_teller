"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const FailPageContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const code = searchParams.get("code");
  const message = searchParams.get("message");

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-slate-50 gap-6 p-4 text-center">
      <XCircle className="h-16 w-16 text-red-500" />
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          결제를 실패했습니다
        </h2>
        <p className="text-slate-600">
          {message || "알 수 없는 오류가 발생했습니다."}
        </p>
        {code && (
          <p className="text-sm text-slate-400 mt-2">에러 코드: {code}</p>
        )}
      </div>
      <Button onClick={() => router.push("/payments")}>
        결제 다시 시도하기
      </Button>
    </div>
  );
};

export default function FailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      }
    >
      <FailPageContent />
    </Suspense>
  );
}
