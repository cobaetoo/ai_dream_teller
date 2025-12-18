"use client";

import React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, Calendar, Sparkles } from "lucide-react";
import { GuestOrder } from "./actions";

interface OrderListProps {
  orders: GuestOrder[];
}

export default function OrderList({ orders }: OrderListProps) {
  if (orders.length === 0) {
    return (
      <Card className="bg-white/60 backdrop-blur-md border-white/40 shadow-xl text-center py-12">
        <CardContent>
          <div className="flex justify-center mb-4">
            <Sparkles className="h-12 w-12 text-purple-300" />
          </div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">
            주문 내역이 없습니다.
          </h3>
          <p className="text-slate-500 mb-6">
            아직 구매하신 꿈 해몽 내역이 없습니다.
            <br />
            당신의 무의식을 탐험해보세요.
          </p>
          <Link href="/dream-teller">
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
              꿈 해몽하러 가기
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">분석 완료</Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">분석 중</Badge>
        );
      case "FAILED":
        return <Badge className="bg-red-500 hover:bg-red-600">분석 실패</Badge>;
      default:
        return <Badge variant="secondary">알 수 없음</Badge>;
    }
  };

  const getExpertLabel = (type: string) => {
    switch (type) {
      case "FREUD":
        return "프로이트";
      case "JUNG":
        return "칼 융";
      case "NEURO":
        return "신경과학";
      case "GESTALT":
        return "게슈탈트";
      default:
        return type;
    }
  };

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Link
          href={
            order.status === "COMPLETED" ? `/dream-result/${order.id}` : "#"
          }
          key={order.id}
          className="block group"
        >
          <Card className="bg-white/80 backdrop-blur-xl border-white/50 hover:bg-white/90 hover:shadow-lg transition-all duration-200 overflow-hidden">
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center space-x-2 text-sm text-slate-500">
                <Calendar className="w-4 h-4" />
                <span>
                  {format(new Date(order.createdAt), "yyyy. MM. dd.")}
                </span>
                <span className="text-slate-300">|</span>
                <span className="font-medium text-slate-600">
                  {getExpertLabel(order.expertType)} 전문가
                </span>
              </div>
              {getStatusBadge(order.status)}
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <p className="text-slate-800 font-medium line-clamp-2 pr-8 group-hover:text-purple-700 transition-colors">
                  {order.content}
                </p>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-purple-600 transform group-hover:translate-x-1 transition-all" />
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
