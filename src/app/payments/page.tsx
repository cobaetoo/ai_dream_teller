"use client";

import React, { useEffect, useRef, useState, Suspense } from "react";
import {
  loadPaymentWidget,
  PaymentWidgetInstance,
} from "@tosspayments/payment-widget-sdk";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  AlertCircle,
  Check,
  Loader2,
  ImageIcon,
  ScrollText,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { nanoid } from "nanoid";
import { cn } from "@/lib/utils";

const CLIENT_KEY = "test_ck_D5GePWvyJnrKwdP7Vzn8gLzN97Eq"; // Public Test Key
const CUSTOMER_KEY = nanoid(); // Random Customer Key for Guest

const PaymentPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null);
  const paymentMethodsWidgetRef = useRef<ReturnType<
    PaymentWidgetInstance["renderPaymentMethods"]
  > | null>(null);

  const [selectedPlanId, setSelectedPlanId] = useState("premium"); // Default plan ID
  const [product, setProduct] = useState({
    title: "AI 꿈 해몽 + 시각화",
    price: 5900,
    isPremium: true,
  });
  const [isWidgetLoaded, setIsWidgetLoaded] = useState(false);

  // Sync state when URL param changes
  useEffect(() => {
    const plan = searchParams.get("plan");
    if (plan === "basic") {
      setSelectedPlanId("basic");
      setProduct({
        title: "AI 꿈 해몽 Basic",
        price: 3900,
        isPremium: false,
      });
    } else {
      setSelectedPlanId("premium");
      setProduct({
        title: "AI 꿈 해몽 + 시각화",
        price: 5900,
        isPremium: true,
      });
    }
  }, [searchParams]);

  // Handle manual plan change
  const handlePlanChange = (planId: string) => {
    // Update URL without refreshing to keep history clean/consistent
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("plan", planId);
    router.replace(`/payments?${newParams.toString()}`, { scroll: false });
    // State will ideally update via the useEffect above, but for instant UI response:
    setSelectedPlanId(planId);
    if (planId === "basic") {
      setProduct({
        title: "AI 꿈 해몽 Basic",
        price: 3900,
        isPremium: false,
      });
    } else {
      setProduct({
        title: "AI 꿈 해몽 + 시각화",
        price: 5900,
        isPremium: true,
      });
    }
  };

  useEffect(() => {
    (async () => {
      // Load widget only once if possible or re-render methods
      const paymentWidget = await loadPaymentWidget(CLIENT_KEY, CUSTOMER_KEY);

      // 1. Payment Methods Widget
      const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
        "#payment-widget",
        { value: product.price },
        { variantKey: "DEFAULT" } // Widget Variant
      );

      // 2. Terms of Service Widget
      paymentWidget.renderAgreement("#agreement", { variantKey: "AGREEMENT" });

      paymentWidgetRef.current = paymentWidget;
      paymentMethodsWidgetRef.current = paymentMethodsWidget;
      setIsWidgetLoaded(true);
    })();
  }, [product.price]);

  const handlePayment = async () => {
    const paymentWidget = paymentWidgetRef.current;
    if (!paymentWidget) return;

    try {
      // Using a dummy success URL for now. In real app, this should be /payments/success
      // For now, let's redirect to a local success simulation page.
      await paymentWidget.requestPayment({
        orderId: nanoid(),
        orderName: product.title,
        customerName: "익명 회원",
        customerEmail: "customer@example.com",
        successUrl: `${window.location.origin}/dream-result/ORDER_12345?paymentKey=TEST`,
        failUrl: `${window.location.origin}/payments/fail`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 md:py-24">
      <div className="container px-4 max-w-lg mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900">결제하기</h1>
          <p className="mt-2 text-slate-600">
            주문 내용을 확인하고 결제를 진행해주세요.
          </p>
        </div>

        {/* Checkout Summary (Receipt Style) */}
        <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden relative">
          {/* Receipt Decor Top */}
          <div className="h-2 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500" />

          <div className="p-8 pb-0">
            {/* Plan Switcher */}
            <div className="flex p-1 mb-6 bg-slate-100/80 rounded-xl">
              <button
                onClick={() => handlePlanChange("basic")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all",
                  selectedPlanId === "basic"
                    ? "bg-white text-slate-900 shadow-sm ring-1 ring-black/5"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                <ScrollText className="w-4 h-4" />
                기본 분석
              </button>
              <button
                onClick={() => handlePlanChange("premium")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all",
                  selectedPlanId === "premium"
                    ? "bg-white text-purple-700 shadow-sm ring-1 ring-black/5"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                <ImageIcon className="w-4 h-4" />
                분석 + 시각화
              </button>
            </div>

            <div className="flex justify-between items-center pb-6 border-b border-dashed border-slate-200">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-purple-600 tracking-wider uppercase">
                  Product
                </span>
                <h3 className="text-xl font-bold text-slate-800">
                  {product.title}
                </h3>
              </div>
              <div className="text-2xl font-bold text-slate-900">
                ₩{product.price.toLocaleString()}
              </div>
            </div>

            <ul className="py-6 space-y-3">
              <li className="flex items-center gap-3 text-sm text-slate-600">
                <div className="rounded-full bg-green-100 p-1 text-green-600">
                  <Check className="h-3 w-3" />
                </div>
                전문 페르소나 심층 분석
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-600">
                <div className="rounded-full bg-green-100 p-1 text-green-600">
                  <Check className="h-3 w-3" />
                </div>
                해몽 리포트 영구 소장
              </li>
              {product.isPremium && (
                <li className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="rounded-full bg-green-100 p-1 text-green-600">
                    <Check className="h-3 w-3" />
                  </div>
                  <span className="font-semibold text-purple-600">
                    고화질 꿈 이미지 생성
                  </span>
                </li>
              )}
            </ul>
          </div>

          {/* Payment Widget Area */}
          <div className="bg-slate-50 p-4 pt-0 border-t border-slate-100">
            <div id="payment-widget" className="w-full" />
            <div id="agreement" className="w-full mt-2" />
          </div>

          {/* Action Button */}
          <div className="p-6 bg-white border-t border-slate-100">
            <Button
              className="w-full h-14 text-lg font-bold bg-[#3282f6] hover:bg-[#2b72d7] shadow-lg shadow-blue-500/20 text-white"
              onClick={handlePayment}
              disabled={!isWidgetLoaded}
            >
              {!isWidgetLoaded ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  로딩 중...
                </>
              ) : (
                `${product.price.toLocaleString()}원 결제하기`
              )}
            </Button>
            <p className="mt-4 text-center text-xs text-slate-400 flex items-center justify-center gap-1">
              <AlertCircle className="h-3 w-3" />
              결제는 테스트 환경에서 진행됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      }
    >
      <PaymentPageContent />
    </Suspense>
  );
};

export default PaymentPage;
