import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyAdmin } from "@/lib/admin";

export async function GET(request: Request) {
  const user = await verifyAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient();

  // 퍼블릭 피드 전체 조회 쿼리 (관리자용 필터 없는 raw 데이터 조회)
  const { data: dreams, error } = await supabase
    .from("dreams")
    .select(
      `
      id,
      content,
      is_public,
      analysis_result,
      expert_type,
      created_at,
      profiles ( email, nickname ),
      guests ( email, nickname )
    `,
    )
    // 여기서 PRD상 퍼블릭 피드 관리라고 했으므로 보통 is_public=true인 글만 가져올수도 있으나,
    // 관리자가 강제로 숨긴(is_public=false) 이력도 볼 수 있도록 필터를 넣지 않거나 is_public인 것만 가져올 수 있습니다.
    // 기존 mock 코드에서 is_public 상태 토글이 가능했으므로, 우선 전체 dreams를 보여주고 프론트에서 is_public 플래그를 확인합니다.
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ feeds: dreams });
}
