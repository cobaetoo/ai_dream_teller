import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyAdmin } from "@/lib/admin";

export async function GET() {
  const user = await verifyAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();

  const [
    { count: profilesCount },
    { count: guestsCount },
    { data: orders },
    { count: totalDreams },
    { count: completedDreams },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("guests").select("*", { count: "exact", head: true }),
    supabase
      .from("orders")
      .select("amount, created_at, status")
      .eq("status", "DONE"),
    supabase.from("dreams").select("*", { count: "exact", head: true }),
    supabase
      .from("dreams")
      .select("*", { count: "exact", head: true })
      .eq("status", "COMPLETED"),
  ]);

  const totalUsers = (profilesCount || 0) + (guestsCount || 0);
  const totalPaymentCount = orders?.length || 0;
  const totalRevenue =
    orders?.reduce((sum, o) => sum + (o.amount || 0), 0) || 0;
  const successRate = totalDreams
    ? Math.round((completedDreams! / totalDreams) * 100)
    : 0;

  // 최근 7일 기준으로 데이터 집계
  const chartMap: Record<string, { date: string; total: number }> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const displayStr = `${d.getMonth() + 1}/${d.getDate()}`;
    chartMap[dateStr] = { date: displayStr, total: 0 };
  }

  orders?.forEach((order) => {
    if (order.created_at) {
      const dateStr = order.created_at.split("T")[0];
      if (chartMap[dateStr]) {
        chartMap[dateStr].total += order.amount || 0;
      }
    }
  });

  const chartData = Object.values(chartMap);

  return NextResponse.json({
    totalUsers,
    totalPaymentCount,
    totalRevenue,
    successRate,
    chartData,
  });
}
