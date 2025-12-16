import React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

interface SelectableCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  badge?: string;
}

export const SelectableCard = ({
  title,
  description,
  icon,
  selected,
  onClick,
  badge,
}: SelectableCardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative flex cursor-pointer flex-col rounded-2xl border p-6 transition-all hover:bg-slate-50",
        selected
          ? "border-purple-600 bg-purple-50/50 ring-1 ring-purple-600"
          : "border-slate-200 bg-white"
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {icon && (
            <div
              className={cn(
                "rounded-lg p-2",
                selected
                  ? "bg-purple-100 text-purple-700"
                  : "bg-slate-100 text-slate-600"
              )}
            >
              {icon}
            </div>
          )}
          <div>
            <h3
              className={cn(
                "font-bold",
                selected ? "text-purple-900" : "text-slate-900"
              )}
            >
              {title}
            </h3>
          </div>
        </div>
        {selected && <CheckCircle2 className="h-5 w-5 text-purple-600" />}
      </div>

      <p className="text-sm text-slate-600 leading-relaxed mb-2">
        {description}
      </p>

      {badge && (
        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
          {badge}
        </span>
      )}
    </div>
  );
};
