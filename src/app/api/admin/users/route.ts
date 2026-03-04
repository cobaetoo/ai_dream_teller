import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyAdmin } from "@/lib/admin";

export async function GET(request: Request) {
  const user = await verifyAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const typeFilter = searchParams.get("type") || "all";
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  const supabase = createAdminClient();
  let result: any[] = [];

  try {
    if (typeFilter === "all" || typeFilter === "user") {
      let q1 = supabase.from("profiles").select(`
          id,
          nickname,
          created_at,
          role,
          dreams (
            orders ( amount, status )
          )
        `);
      if (startDate) q1 = q1.gte("created_at", startDate);
      if (endDate) q1 = q1.lte("created_at", `${endDate}T23:59:59.999Z`);

      const { data: users, error: userErr } = await q1;

      if (userErr) throw userErr;

      const userMap =
        users?.map((u: any) => {
          const paidOrders: any[] = [];
          if (Array.isArray(u.dreams)) {
            u.dreams.forEach((d: any) => {
              if (d.orders) {
                const oList = Array.isArray(d.orders) ? d.orders : [d.orders];
                oList.forEach((o: any) => {
                  if (o.status === "DONE" || o.status === "PAID") {
                    paidOrders.push(o);
                  }
                });
              }
            });
          }

          const totalAmount = paidOrders.reduce(
            (sum: number, o: any) => sum + o.amount,
            0,
          );
          return {
            id: u.id,
            identifier: u.nickname || u.id,
            type: "User",
            created_at: u.created_at,
            paymentCount: paidOrders.length,
            totalAmount: totalAmount,
          };
        }) || [];

      result = result.concat(userMap);
    }

    if (typeFilter === "all" || typeFilter === "guest") {
      let q2 = supabase.from("guests").select(`
          id,
          phone,
          created_at,
          dreams (
            orders ( amount, status )
          )
        `);
      if (startDate) q2 = q2.gte("created_at", startDate);
      if (endDate) q2 = q2.lte("created_at", `${endDate}T23:59:59.999Z`);

      const { data: guests, error: guestErr } = await q2;

      if (guestErr) throw guestErr;

      const guestMap =
        guests?.map((g: any) => {
          const paidOrders: any[] = [];
          if (Array.isArray(g.dreams)) {
            g.dreams.forEach((d: any) => {
              if (d.orders) {
                const oList = Array.isArray(d.orders) ? d.orders : [d.orders];
                oList.forEach((o: any) => {
                  if (o.status === "DONE" || o.status === "PAID") {
                    paidOrders.push(o);
                  }
                });
              }
            });
          }

          const totalAmount = paidOrders.reduce(
            (sum: number, o: any) => sum + o.amount,
            0,
          );
          return {
            id: g.id,
            identifier: g.phone || "비회원",
            type: "Guest",
            created_at: g.created_at,
            paymentCount: paidOrders.length,
            totalAmount: totalAmount,
          };
        }) || [];

      result = result.concat(guestMap);
    }

    // 최신 가입/생성 순 정렬
    result.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    return NextResponse.json({ users: result, total: result.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
