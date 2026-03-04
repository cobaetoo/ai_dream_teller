import { createAdminClient } from "../src/lib/supabase/admin";

async function verifyAdminData() {
  const supabase = createAdminClient();

  console.log("--- FETCHING ORDERS ---");
  const {
    data: rawOrders,
    count,
    error,
  } = await supabase
    .from("orders")
    .select(
      `
      id,
      amount,
      status,
      created_at,
      dreams (
        user_id,
        guest_id,
        expert_type,
        status,
        has_image_gen
      )
    `,
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Fetch error:", error);
  } else {
    console.log(`Total count: ${count}`);
    console.log("Top 5 Orders:");
    console.log(JSON.stringify(rawOrders, null, 2));
  }

  console.log("\n--- FETCHING DREAMS directly ---");
  const { data: rawDreams } = await supabase
    .from("dreams")
    .select("id, expert_type, status, has_image_gen")
    .order("created_at", { ascending: false })
    .limit(5);
  console.log(JSON.stringify(rawDreams, null, 2));
}

verifyAdminData();
