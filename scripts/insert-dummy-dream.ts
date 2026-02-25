import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing env vars");
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function main() {
  const phone =
    "010-9999-" +
    Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
  const { data: guestData, error: guestError } = await supabase
    .from("guests")
    .insert({
      phone: phone,
      password_hash: "dummyhash",
    })
    .select("id")
    .single();

  if (guestError) {
    console.error("Failed to insert guest:", guestError);
  }

  const { data, error } = await supabase
    .from("dreams")
    .insert({
      content: "I dreamt about flying over a futuristic city.",
      expert_type: "FREUD",
      status: "PENDING",
      is_public: false,
      guest_id: guestData?.id || null,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Failed to insert dream:", error);
    process.exit(1);
  }

  console.log(data.id);
}

main();
