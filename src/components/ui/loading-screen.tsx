import React from "react";
import { Sparkles, Moon } from "lucide-react";

interface LoadingScreenProps {
  fullScreen?: boolean;
  message?: string;
}

export function LoadingScreen({
  fullScreen = true,
  message = "로딩 중...",
}: LoadingScreenProps) {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-8">
      {/* Lottie-like Animated Graphic */}
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Outer glowing ring */}
        <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-purple-400 animate-[spin_3s_linear_infinite]" />
        <div className="absolute inset-2 rounded-full border-b-2 border-l-2 border-indigo-400 animate-[spin_2s_linear_infinite_reverse]" />
        <div className="absolute inset-4 rounded-full border-t-4 border-fuchsia-300 animate-[spin_4s_linear_infinite] opacity-60" />

        {/* Pulsing center blob */}
        <div className="absolute inset-6 rounded-full bg-linear-to-tr from-purple-200 to-indigo-100 animate-pulse blur-sm" />

        {/* Center Icons */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Moon className="w-10 h-10 text-purple-600 animate-[bounce_2s_ease-in-out_infinite]" />
        </div>

        {/* Floating Sparkles with keyframes mapping to Tailwind arbitrary values */}
        <Sparkles className="absolute top-2 right-2 w-6 h-6 text-amber-400 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]" />
        <Sparkles className="absolute bottom-4 left-2 w-5 h-5 text-pink-400 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite_0.5s]" />
      </div>

      {/* Animated Text */}
      <div className="flex flex-col items-center space-y-2">
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-purple-600 to-indigo-600 animate-pulse">
          {message}
        </h2>
        <div className="flex space-x-1.5">
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-[bounce_1s_infinite_0s]" />
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-[bounce_1s_infinite_0.2s]" />
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-[bounce_1s_infinite_0.4s]" />
        </div>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-100 flex items-center justify-center bg-white/60 backdrop-blur-md">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[400px] w-full">
      {content}
    </div>
  );
}
