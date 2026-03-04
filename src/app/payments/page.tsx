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

const CLIENT_KEY =
  process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY ||
  "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
const CUSTOMER_KEY = nanoid(); // Random Customer Key for Guest

const WidgetContainer = React.memo(() => (
  <div className="bg-slate-50 p-4 pt-0 border-t border-slate-100">
    <div id="payment-widget" className="w-full" />
    <div id="agreement" className="w-full mt-2" />
  </div>
));
WidgetContainer.displayName = "WidgetContainer";

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

  const isInitializing = useRef(false);
  const isCancelingPaymentRef = useRef(false);

  // 1. Initialize Widget
  useEffect(() => {
    if (isInitializing.current || paymentWidgetRef.current) return;
    isInitializing.current = true;

    const initializeWidget = async () => {
      try {
        const paymentWidget = await loadPaymentWidget(CLIENT_KEY, CUSTOMER_KEY);

        if (paymentWidgetRef.current) return; // Prevent if somehow initialized twice

        const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
          "#payment-widget",
          { value: product.price },
          { variantKey: "DEFAULT" },
        );

        paymentWidget.renderAgreement("#agreement", {
          variantKey: "AGREEMENT",
        });

        paymentWidgetRef.current = paymentWidget;
        paymentMethodsWidgetRef.current = paymentMethodsWidget;

        // Listen for the "ready" event
        paymentMethodsWidget.on("ready", () => {
          setIsWidgetLoaded(true);
        });
      } catch (err) {
        console.error("Failed to load Toss Payments widget:", err);
      } finally {
        isInitializing.current = false;
      }
    };

    initializeWidget();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cleanup stray Toss widgets on popstate (back button) or unmount
  useEffect(() => {
    const handlePopState = () => {
      // 만약 토스 모달 내장 UI (X버튼, 취소 등)를 통해서 우리가 강제로 뒤로가기 처리를 한 경우
      if (isCancelingPaymentRef.current) {
        isCancelingPaymentRef.current = false;
        return;
      }

      // 모달이 떠있는 도중 유저가 물리 브라우저/안드로이드 뒤로가기 버튼을 누른 경우
      let hasModal = false;
      const iframes = document.querySelectorAll('iframe[src*="tosspayments"]');
      iframes.forEach((iframe) => {
        let parent = iframe.parentElement;
        // 인라인 위젯 여부 확인
        while (parent && parent !== document.body) {
          if (parent.id === "payment-widget" || parent.id === "agreement") {
            return;
          }
          parent = parent.parentElement;
        }
        hasModal = true;
      });

      if (hasModal) {
        // iframe을 직접 DOM에서 삭제하면 SDK 내부의 결제 진행 상태(isPaymentInProgress)가 꼬여 다음 결제창이 열리지 않습니다!
        // 가장 안전하고 우아한 해결책은 페이지를 리로드하여 SDK를 완전 초기화 하는 것입니다 (파라미터/쿼리는 유지되므로 유저는 변화를 크게 못 느낌)
        window.location.reload();
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // 2. Sync Price Changes
  useEffect(() => {
    const paymentMethodsWidget = paymentMethodsWidgetRef.current;
    if (paymentMethodsWidget && isWidgetLoaded) {
      try {
        paymentMethodsWidget.updateAmount(product.price);
      } catch (error) {
        console.warn("Update amount failed:", error);
      }
    }
  }, [product.price, isWidgetLoaded]);

  const handlePayment = async () => {
    if (!isWidgetLoaded) return;
    const paymentWidget = paymentWidgetRef.current;
    if (!paymentWidget) return;

    // 결제 시도 전 취소 플래그 초기화
    isCancelingPaymentRef.current = false;

    // 팝업이 열릴 때 브라우저 뒤로가기를 방어하기 위한 더미 히스토리 상태 추가
    window.history.pushState({ tossModalOpen: true }, "", window.location.href);

    try {
      const orderIdParam = searchParams.get("orderId");
      if (!orderIdParam) {
        console.warn("orderId parameter is missing. Falling back to nanoid.");
      }

      await paymentWidget.requestPayment({
        orderId: orderIdParam || nanoid(),
        orderName: product.title,
        customerName: "익명 회원",
        customerEmail: "customer@example.com",
        successUrl: `${window.location.origin}/payments/success`,
        failUrl: `${window.location.origin}/payments/fail`,
      });
    } catch (error: any) {
      // 토스 결제창을 사용자가 X 버튼으로 닫았거나 필수 약관 미동의 시
      isCancelingPaymentRef.current = true;

      // 팝업이 닫히므로 더미 히스토리에서 다시 뒤로가기 처리해서 상태를 복구함
      if (window.history.state?.tossModalOpen) {
        window.history.back();
      }

      if (
        error?.code !== "USER_CANCEL" &&
        error?.code !== "NOT_AGREED" &&
        error?.code !== "INVALID_AGREEMENT"
      ) {
        console.error("Payment failed", error);
      }
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
          <div className="h-2 bg-linear-to-r from-purple-500 via-blue-500 to-pink-500" />

          <div className="p-8 pb-0">
            {/* Plan Switcher */}
            <div className="flex p-1 mb-6 bg-slate-100/80 rounded-xl">
              <button
                onClick={() => handlePlanChange("basic")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all",
                  selectedPlanId === "basic"
                    ? "bg-white text-slate-900 shadow-sm ring-1 ring-black/5"
                    : "text-slate-500 hover:text-slate-700",
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
                    : "text-slate-500 hover:text-slate-700",
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

          {/* Payment Widget Area (Stable DOM) */}
          <WidgetContainer />

          {/* Action Button */}
          <div className="p-6 bg-white border-t border-slate-100">
            <Button
              className="w-full h-14 text-lg font-bold bg-[#3282f6] hover:bg-[#2b72d7] shadow-lg shadow-blue-500/20 text-white disabled:bg-slate-300 disabled:shadow-none"
              onClick={handlePayment}
              disabled={!isWidgetLoaded}
            >
              {isWidgetLoaded
                ? `${product.price.toLocaleString()}원 결제하기`
                : "결제 모듈 로딩 중..."}
            </Button>
            <div className="mt-4 flex flex-col items-center justify-center gap-1">
              <p className="text-center text-xs text-slate-400 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                결제는 테스트 환경에서 진행됩니다.
              </p>
              <p className="text-center text-[11px] text-slate-400/80 leading-tight max-w-[90%]">
                결제 후 AI 해몽 컨텐츠 제공이 개시된 이후에는 전자상거래법
                제17조 2항에 따라 청약 철회(환불)가 불가능합니다.
              </p>
            </div>
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
