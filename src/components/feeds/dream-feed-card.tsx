import Image from "next/image";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart, MessageCircle, Quote, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DreamFeedCardProps {
  imageUrl?: string | null;
  title: string;
  dreamContent: string;
  interpretationContent: string;
  expertType: string;
  className?: string;
}

export const DreamFeedCard = ({
  imageUrl,
  title,
  dreamContent,
  interpretationContent,
  expertType,
  className,
}: DreamFeedCardProps) => {
  return (
    <div
      className={cn(
        "group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-100",
        className
      )}
    >
      {/* 1. Card Header */}
      <div className="p-6 pb-4 flex items-start justify-between">
        <div>
          <Badge
            variant="outline"
            className="mb-2 border-purple-200 text-purple-700 bg-purple-50"
          >
            {expertType}
          </Badge>
          <h3 className="text-xl font-bold text-slate-900 leading-tight">
            {title}
          </h3>
        </div>
      </div>

      {/* 2. User's Dream (Question) */}
      <div className="px-6 pb-6">
        <div className="relative rounded-2xl bg-slate-50 p-5 text-slate-700 leading-relaxed font-medium">
          <Quote className="absolute top-4 left-4 h-4 w-4 text-slate-300 -scale-x-100" />
          <p className="pl-6 pt-1 text-sm md:text-base">{dreamContent}</p>
        </div>
      </div>

      {/* 3. Image Section (Optional) */}
      {imageUrl && (
        <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
          <Image
            src={imageUrl}
            alt="Dream visualization"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      {/* 4. AI Interpretation (Answer) */}
      <div className="p-6 pt-6">
        <div className="mb-3 flex items-center gap-2 text-purple-600">
          <Sparkles className="h-5 w-5" />
          <span className="font-bold text-sm">AI Dream Teller 해석</span>
        </div>
        <div className="prose prose-sm md:prose-base text-slate-600 leading-relaxed">
          <p>{interpretationContent}</p>
        </div>
      </div>

      {/* 5. Footer (Removed per request) */}
      <div className="h-4"></div>
    </div>
  );
};
