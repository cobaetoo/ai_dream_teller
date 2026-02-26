import { createClient } from "@supabase/supabase-js";
import assert from "assert";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function runDreamResultE2E() {
  console.log("=== Starting Dream Result E2E Test ===");
  try {
    console.log("Setting up mock user and dream...");
    const email = `testuser_result_${Date.now()}@example.com`;
    const password = "Password123!";
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
    if (authError)
      throw new Error("Failed to create user: " + authError.message);
    const userId = authData.user.id;

    const mockDream = {
      user_id: userId,
      content: `This is the user's specific dream for the result page test.`,
      expert_type: "FREUD",
      status: "COMPLETED",
      is_public: true,
      analysis_result: {
        title: "Test Freud Analysis Title",
        analysis: "Test analysis specific full text body",
        symbols: ["apple", "moon"],
      },
    };

    const { data: inserted, error: insertError } = await supabaseAdmin
      .from("dreams")
      .insert([mockDream])
      .select("id")
      .single();

    if (insertError)
      throw new Error("Insert mock data failed: " + insertError.message);
    const dreamId = inserted.id;
    console.log(`Created mock dream: ${dreamId}`);

    // Wait a brief moment for nextjs server
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Fetch HTML
    const fetchHTML = async (url: string) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status} on ${url}`);
      return await res.text();
    };

    console.log(`\n-> Testing /dream-result/${dreamId}`);
    const html = await fetchHTML(
      `http://localhost:3000/dream-result/${dreamId}`,
    );

    // Validations
    assert(
      html.includes(
        "This is the user&#x27;s specific dream for the result page test.",
      ) ||
        html.includes(
          "This is the user's specific dream for the result page test.",
        ),
      "Missing user dream content",
    );
    assert(
      html.includes("Test Freud Analysis Title"),
      "Missing AI result title",
    );
    assert(
      html.includes("Test analysis specific full text body"),
      "Missing AI full text body",
    );
    assert(html.includes("apple"), "Missing keyword apple");
    assert(html.includes("moon"), "Missing keyword moon");

    console.log(
      "✅ Dream Result rendered successfully with REAL data from DB.",
    );

    console.log("\nCleaning up mock data...");
    await supabaseAdmin.from("dreams").delete().eq("id", dreamId);
    await supabaseAdmin.auth.admin.deleteUser(userId);
    console.log("✅ Cleanup complete");

    console.log("\n=== Dream Result E2E Tests Passed! ===");
  } catch (error: any) {
    console.error("❌ E2E Test Failed:", error.message);
    process.exit(1);
  }
}

runDreamResultE2E();
