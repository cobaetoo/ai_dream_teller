import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyAdmin } from "@/lib/admin";

export async function GET(request: Request) {
  const user = await verifyAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  const supabase = createAdminClient();

  // 퍼블릭 피드 전체 조회 쿼리 (관리자용 필터 없는 raw 데이터 조회)
  let query = supabase.from("dreams").select(
    `
      id,
      content,
      is_public,
      analysis_result,
      expert_type,
      created_at,
      profiles ( nickname ),
      guests ( phone )
    `,
  );

  if (startDate) {
    query = query.gte("created_at", startDate);
  }
  if (endDate) {
    query = query.lte("created_at", `${endDate}T23:59:59.999Z`);
  }

  const { data: dreams, error } = await query.order("created_at", {
    ascending: false,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ feeds: dreams });
}
