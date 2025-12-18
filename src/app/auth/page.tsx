"use client";

import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const AuthPage = () => {
  const router = useRouter();

  const handleSocialLogin = async (provider: "kakao" | "google") => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/my-page`,
        },
      });

      if (error) {
        alert("로그인 중 오류가 발생했습니다.");
      }
    } catch (error) {
      // Login error handled silently for security
    }
  };

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
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-white/50 text-center">
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              환영합니다
            </h1>
            <p className="mt-3 text-slate-600">
              AI Dream Teller와 함께
              <br />
              당신의 무의식을 탐험해보세요.
            </p>
          </div>

          <div className="space-y-4">
            {/* Kakao Login */}
            <Button
              onClick={() => handleSocialLogin("kakao")}
              className="w-full h-12 bg-[#FEE500] hover:bg-[#FDD800] text-[#000000] border-none font-medium text-base relative overflow-hidden"
            >
              <div className="absolute left-4">
                <KakaoLogo />
              </div>
              카카오로 3초 만에 시작하기
            </Button>

            {/* Google Login */}
            <Button
              variant="outline"
              onClick={() => handleSocialLogin("google")}
              className="w-full h-12 bg-white hover:bg-slate-50 text-slate-700 border-slate-200 font-medium text-base relative overflow-hidden"
            >
              <div className="absolute left-4">
                <GoogleLogo />
              </div>
              Google로 계속하기
            </Button>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100">
            <p className="text-xs text-slate-400 mb-4">
              로그인 시{" "}
              <Link href="/terms" className="underline hover:text-slate-600">
                이용약관
              </Link>{" "}
              및{" "}
              <Link href="/privacy" className="underline hover:text-slate-600">
                개인정보처리방침
              </Link>
              에 동의하게 됩니다.
            </p>
            <Link href="/guest-login">
              <Button
                variant="link"
                className="text-slate-500 hover:text-slate-800 text-sm font-normal"
              >
                비회원 주문 조회하기
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple SVG Logos components for self-containment
const KakaoLogo = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 4C7.58172 4 4 6.98528 4 10.6667C4 12.9845 5.48006 15.0272 7.74797 16.196L6.77258 19.8258C6.69614 20.1098 7.02534 20.3235 7.26251 20.1422L11.5645 17.034C11.7101 17.0423 11.8553 17.0465 12 17.0465C16.4183 17.0465 20 14.0612 20 10.3798C20 6.69837 16.4183 4 12 4Z"
      fill="currentColor"
    />
  </svg>
);

const GoogleLogo = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.905 6.574 15.963 7.5195L18.78 4.7025C17.0215 3.0655 14.6505 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
      fill="#FFC107"
    />
    <path
      d="M3.15295 7.3455L6.43845 9.755C7.32745 7.554 9.48045 6 12 6C13.5295 6 14.905 6.574 15.963 7.5195L18.78 4.7025C17.0215 3.0655 14.6505 2 12 2C8.15895 2 4.82795 4.1685 3.15295 7.3455Z"
      fill="#FF3D00"
    />
    <path
      d="M12 22C14.6605 22 17.0365 21.065 18.816 19.457L15.545 16.9625C14.5495 17.653 13.336 18 12 18C9.38845 18 7.17295 16.3285 6.34845 14H3.07295V16.5245C4.74345 19.845 8.08045 22 12 22Z"
      fill="#4CAF50"
    />
    <path
      d="M21.8055 10.0415H21V10H12V14H17.6515C17.257 15.108 16.546 16.0765 15.545 16.9625L18.816 19.457C18.3245 19.9015 22 17.1525 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
      fill="#1976D2"
    />
  </svg>
);

export default AuthPage;
