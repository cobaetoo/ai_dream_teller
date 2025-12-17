"use client";

import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import { ko } from "date-fns/locale";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Calendar as CalendarIcon } from "lucide-react";
import "react-day-picker/dist/style.css";

// Mock Data (Shared for now)
const DREAM_DATES = [
  new Date(2025, 11, 1),
  new Date(2025, 11, 5),
  new Date(2025, 11, 12),
  new Date(2025, 11, 15),
  new Date(2025, 11, 17),
];

export function DreamCalendar({ className }: { className?: string }) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  const modifiers = {
    hasDream: DREAM_DATES,
  };

  const modifiersStyles = {
    hasDream: {
      color: "white",
      backgroundColor: "#8b5cf6", // violet-500
      fontWeight: "bold",
      borderRadius: "50%",
    },
  };

  return (
    <Card className={`border-slate-100 shadow-sm ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base md:text-lg">
          <CalendarIcon className="h-5 w-5 text-purple-600" />
          나의 꿈 캘린더
        </CardTitle>
        <CardDescription className="text-xs md:text-sm">
          보라색으로 표시된 날짜에 꿈 기록이 있습니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center p-4">
        <style jsx global>{`
          .rdp {
            --rdp-cell-size: 40px;
            --rdp-accent-color: #8b5cf6;
            --rdp-background-color: #f5f3ff;
            margin: 0;
          }
          .rdp-day_selected:not([disabled]) {
            background-color: #7c3aed;
            font-weight: bold;
            color: white;
          }
        `}</style>
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          locale={ko}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          footer={
            selectedDate && (
              <p className="mt-4 text-center text-sm text-slate-600">
                선택된 날짜:{" "}
                <span className="font-bold text-purple-600">
                  {format(selectedDate, "yyyy년 M월 d일")}
                </span>
              </p>
            )
          }
        />
      </CardContent>
    </Card>
  );
}
