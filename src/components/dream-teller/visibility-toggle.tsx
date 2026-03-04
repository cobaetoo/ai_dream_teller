"use client";

import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2, Globe, Lock } from "lucide-react";

interface VisibilityToggleProps {
  dreamId: string;
  initialIsPublic: boolean;
}

export const VisibilityToggle = ({
  dreamId,
  initialIsPublic,
}: VisibilityToggleProps) => {
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async (checked: boolean) => {
    setIsUpdating(true);
    // Optimistic UI update
    setIsPublic(checked);

    try {
      const response = await fetch(`/api/dreams/${dreamId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_public: checked }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to update visibility");
      }
    } catch (error) {
      console.error("Visibility toggle error:", error);
      alert("상태 변경에 실패했습니다. 다시 시도해주세요.");
      // Rollback
      setIsPublic(!checked);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
      {isUpdating ? (
        <Loader2 className="h-5 w-5 text-purple-600 animate-spin" />
      ) : isPublic ? (
        <Globe className="h-5 w-5 text-purple-600" />
      ) : (
        <Lock className="h-5 w-5 text-slate-400" />
      )}
      <div className="flex flex-col">
        <Label
          htmlFor="visibility-toggle"
          className="text-sm font-semibold text-slate-800"
        >
          피드 공개
        </Label>
        <span className="text-xs text-slate-500">
          {isPublic ? "다른 사용자도 볼 수 있어요" : "나만 볼 수 있어요"}
        </span>
      </div>
      <div className="ml-auto pl-4">
        <Switch
          id="visibility-toggle"
          checked={isPublic}
          onCheckedChange={handleToggle}
          disabled={isUpdating}
        />
      </div>
    </div>
  );
};
