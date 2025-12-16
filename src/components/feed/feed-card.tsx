import React from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Sparkles,
} from "lucide-react";

interface FeedCardProps {
  data: {
    id: string;
    user: {
      name: string;
      image?: string;
      initial: string;
    };
    dream: {
      category: string; // 예: 태몽, 악몽, 길몽
      keywords: string[];
      content: string;
      analysis: string;
      imageUrl?: string;
      createdAt: string;
      likes: number;
      comments: number;
    };
  };
}

export function FeedCard({ data }: FeedCardProps) {
  const { user, dream } = data;

  return (
    <Card className="w-full max-w-xl overflow-hidden border-border/60 shadow-sm transition-all hover:shadow-md dark:bg-slate-900/50">
      {/* Header: User Info */}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border">
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback className="bg-purple-100 text-purple-700 font-medium">
              {user.initial}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">
              {user.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {dream.createdAt}
            </span>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">More options</span>
        </Button>
      </CardHeader>

      {/* Content: Dream & Analysis */}
      <CardContent className="p-4 pt-0 space-y-4">
        {/* Keywords */}
        <div className="flex flex-wrap gap-2">
          <Badge
            variant="secondary"
            className="bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-100"
          >
            {dream.category}
          </Badge>
          {dream.keywords.map((keyword, index) => (
            <Badge
              key={index}
              variant="outline"
              className="text-xs text-slate-500"
            >
              #{keyword}
            </Badge>
          ))}
        </div>

        {/* Dream Content */}
        <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
          {dream.content}
        </p>

        {/* AI Analysis Box */}
        <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-purple-500 fill-purple-500" />
            <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
              AI 해몽 결과
            </span>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {dream.analysis}
          </p>
        </div>

        {/* Dream Image */}
        {dream.imageUrl && (
          <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-md bg-muted">
            <Image
              src={dream.imageUrl}
              alt="Dream visualization"
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        )}
      </CardContent>

      <Separator />

      {/* Footer: Actions */}
      <CardFooter className="flex items-center justify-between p-2 md:p-3">
        <Button
          variant="ghost"
          className="flex-1 gap-2 text-slate-500 hover:text-purple-600 hover:bg-purple-50/50"
        >
          <Heart className="h-5 w-5" />
          <span className="text-sm font-medium">
            {dream.likes > 0 ? dream.likes : "좋아요"}
          </span>
        </Button>
        <Button
          variant="ghost"
          className="flex-1 gap-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50/50"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="text-sm font-medium">
            {dream.comments > 0 ? dream.comments : "댓글"}
          </span>
        </Button>
        <Button
          variant="ghost"
          className="flex-1 gap-2 text-slate-500 hover:text-green-600 hover:bg-green-50/50"
        >
          <Share2 className="h-5 w-5" />
          <span className="text-sm font-medium">공유</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
