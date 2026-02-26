"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const MOCK_SALES_DATA = [
  { name: "Mon", total: 120000 },
  { name: "Tue", total: 150000 },
  { name: "Wed", total: 200000 },
  { name: "Thu", total: 180000 },
  { name: "Fri", total: 240000 },
  { name: "Sat", total: 300000 },
  { name: "Sun", total: 210000 },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        대시보드
      </h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              총 매출 (주간)
            </CardTitle>
            <span className="text-gray-400">₩</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,400,000원</div>
            <p className="text-xs text-muted-foreground">지난주 대비 +20%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">신규 가입자</CardTitle>
            <span className="text-gray-400">명</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+150</div>
            <p className="text-xs text-muted-foreground">지난주 대비 +12%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">총 결제 건수</CardTitle>
            <span className="text-gray-400">건</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+280</div>
            <p className="text-xs text-muted-foreground">지난주 대비 +5%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              해몽 생성 성공률
            </CardTitle>
            <span className="text-gray-400">%</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.1%</div>
            <p className="text-xs text-muted-foreground">-0.1% 하락</p>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>매출 추이</CardTitle>
          <CardDescription>
            최근 7일간의 총 매출(원) 변동 추이를 시각화합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={MOCK_SALES_DATA}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₩${value.toLocaleString()}`}
              />
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <Tooltip
                formatter={(value: any) =>
                  `₩${Number(value || 0).toLocaleString()}`
                }
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#7c3aed"
                fillOpacity={1}
                fill="url(#colorTotal)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
