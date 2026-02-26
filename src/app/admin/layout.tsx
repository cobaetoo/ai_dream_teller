import React from "react";
import AdminSidebar from "@/components/admin/admin-sidebar";
import AdminHeader from "@/components/admin/admin-header";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 로그인되지 않은 사용자는 로그인 페이지로
  if (!user) {
    redirect("/auth");
  }

  // Admin 권한 확인
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "ADMIN") {
    // 권한이 없으면 메인 페이지로 튕겨내기
    redirect("/");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 antialiased dark:bg-gray-900">
      {/* Sidebar 드로어 영역 */}
      <AdminSidebar />
      {/* Body 영역 */}
      <div className="relative h-full w-full overflow-y-auto sm:ml-64">
        <AdminHeader />
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
