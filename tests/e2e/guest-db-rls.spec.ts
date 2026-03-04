import { test, expect } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

// Load environment variables directly if needed (since it's a test file outside Next.js)
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  try {
    const envPath = path.resolve(process.cwd(), ".env.local");
    const envContent = fs.readFileSync(envPath, "utf8");
    envContent.split("\n").forEach((line) => {
      if (line.startsWith("NEXT_PUBLIC_SUPABASE_URL=")) {
        supabaseUrl = line.split("=")[1].replace(/['"\r]/g, "");
      }
      if (line.startsWith("NEXT_PUBLIC_SUPABASE_ANON_KEY=")) {
        supabaseAnonKey = line.split("=")[1].replace(/['"\r]/g, "");
      }
    });
  } catch (e) {
    console.warn("Could not load .env.local file", e);
  }
}

test.describe("Database RLS for Guest Checkout", () => {
  test("Anon users should be able to insert into guests and dreams tables", async () => {
    // Skip test if variables aren't found to avoid false failure
    test.skip(
      !supabaseUrl || !supabaseAnonKey,
      "Supabase credentials not found",
    );

    // Create an Anon client
    const supabaseAnon = createClient(supabaseUrl!, supabaseAnonKey!);

    // 1. Try to insert into guests
    const guestId = crypto.randomUUID();
    const uniquePhone = `010-9999-${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")}`;

    const { error: guestError } = await supabaseAnon.from("guests").insert({
      id: guestId,
      phone: uniquePhone,
      password_hash: "test_hash_rls",
    });

    expect(guestError).toBeNull();

    // 2. Try to insert into dreams without user_id but with guest_id
    const { error: dreamError } = await supabaseAnon.from("dreams").insert({
      content: "RLS 테스트용 비회원 꿈 내용",
      expert_type: "FREUD",
      status: "PENDING",
      user_id: null,
      guest_id: guestId,
      has_image_gen: false,
    });

    expect(dreamError).toBeNull();
  });
});
