import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyAdmin } from "@/lib/admin";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await verifyAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  try {
    const { is_public } = await request.json();

    if (typeof is_public !== "boolean") {
      return NextResponse.json(
        { error: "Invalid boolean value for is_public" },
        { status: 400 },
      );
    }

    const adminClient = createAdminClient();
    const { error: updateError } = await adminClient
      .from("dreams")
      .update({ is_public })
      .eq("id", id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `가시성이 ${is_public} 상태로 업데이트되었습니다.`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
