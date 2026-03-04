import { createAdminClient } from "@/lib/supabase/admin";
import { verifyGuestSession } from "@/lib/auth/guest";

export type GuestOrder = {
  id: string;
  dreamId: string;
  content: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  createdAt: string;
  expertType: string;
};

export type GuestData = {
  phone: string;
  orders: GuestOrder[];
};

export async function getGuestOrders(): Promise<GuestData | null> {
  const session = await verifyGuestSession();

  if (!session || !session.sub) {
    return null;
  }

  const supabase = createAdminClient();

  // Get guest phone
  const { data: guest } = await supabase
    .from("guests")
    .select("phone")
    .eq("id", session.sub)
    .single();

  // If guest doesn't exist, exit early
  if (!guest) {
    return null;
  }

  // Fetch orders linked to this guest's dreams
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      created_at,
      status,
      amount,
      dreams!inner(
        id,
        content,
        status,
        expert_type,
        guest_id
      )
    `,
    )
    .eq("dreams.guest_id", session.sub)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Failed to fetch guest orders:", error);
    return { phone: guest.phone, orders: [] };
  }

  const mappedOrders = data.map((order: any) => ({
    id: order.id,
    dreamId: order.dreams.id,
    content: order.dreams.content,
    // Use the dream's analysis status usually, or order status if it failed before analysis
    status: order.dreams.status,
    createdAt: order.created_at,
    expertType: order.dreams.expert_type,
  }));

  return { phone: guest.phone, orders: mappedOrders };
}
