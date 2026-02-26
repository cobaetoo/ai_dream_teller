import { createClient } from "@supabase/supabase-js";
import assert from "assert";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function runFeedsE2E() {
  console.log("=== Starting Feeds Filter E2E Test ===");
  try {
    // 1. Setup mock user and data
    console.log("Setting up mock user and dreams...");

    // Create a temporary user
    const email = `testuser_filter_${Date.now()}@example.com`;
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

    // Profile is created automatically by a trigger on auth.users

    const expertTypes = ["FREUD", "JUNG", "SHAMAN", "NEUROSCIENCE"];
    const mockDreams = expertTypes.map((ext) => ({
      user_id: userId,
      content: `This is a test dream for ${ext}`,
      expert_type: ext,
      status: "COMPLETED",
      is_public: true,
      analysis_result: {
        title: `${ext} Test Result`,
        analysis: "Test analysis",
      },
    }));

    const { data: inserted, error: insertError } = await supabaseAdmin
      .from("dreams")
      .insert(mockDreams)
      .select("id, expert_type");

    if (insertError)
      throw new Error("Insert mock data failed: " + insertError.message);
    console.log(`Inserted ${inserted.length} mock dreams`);

    // Wait a brief moment
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 2. Fetch HTML and test links & filtering
    const fetchHTML = async (url: string) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status} on ${url}`);
      return await res.text();
    };

    console.log("\n-> Testing ALL (/feeds)");
    const allHtml = await fetchHTML("http://localhost:3000/feeds");
    // All 4 types should exist
    assert(allHtml.includes("FREUD Test Result"), "Missing FREUD in ALL");
    assert(allHtml.includes("JUNG Test Result"), "Missing JUNG in ALL");
    assert(allHtml.includes("SHAMAN Test Result"), "Missing SHAMAN in ALL");
    assert(
      allHtml.includes("NEUROSCIENCE Test Result"),
      "Missing NEUROSCIENCE in ALL",
    );
    console.log("✅ ALL filter test passed");

    console.log("\n-> Testing FREUD Filter (/feeds?expert=FREUD)");
    const freudHtml = await fetchHTML(
      "http://localhost:3000/feeds?expert=FREUD",
    );
    assert(
      freudHtml.includes("FREUD Test Result"),
      "Missing FREUD in FREUD filter",
    );
    assert(
      !freudHtml.includes("JUNG Test Result"),
      "JUNG should NOT be in FREUD filter",
    );
    assert(
      !freudHtml.includes("SHAMAN Test Result"),
      "SHAMAN should NOT be in FREUD filter",
    );
    console.log("✅ FREUD filter test passed");

    console.log("\n-> Testing JUNG Filter (/feeds?expert=JUNG)");
    const jungHtml = await fetchHTML("http://localhost:3000/feeds?expert=JUNG");
    assert(
      jungHtml.includes("JUNG Test Result"),
      "Missing JUNG in JUNG filter",
    );
    assert(
      !jungHtml.includes("FREUD Test Result"),
      "FREUD should NOT be in JUNG filter",
    );
    console.log("✅ JUNG filter test passed");

    console.log("\n-> Testing SHAMAN Filter (/feeds?expert=SHAMAN)");
    const shamanHtml = await fetchHTML(
      "http://localhost:3000/feeds?expert=SHAMAN",
    );
    assert(
      shamanHtml.includes("SHAMAN Test Result"),
      "Missing SHAMAN in SHAMAN filter",
    );
    assert(
      !shamanHtml.includes("JUNG Test Result"),
      "JUNG should NOT be in SHAMAN filter",
    );
    console.log("✅ SHAMAN filter test passed");

    // 3. Cleanup
    console.log("\nCleaning up mock data...");
    const ids = inserted.map((d) => d.id);
    await supabaseAdmin.from("dreams").delete().in("id", ids);
    await supabaseAdmin.from("profiles").delete().eq("id", userId);
    await supabaseAdmin.auth.admin.deleteUser(userId);
    console.log("✅ Cleanup complete");

    console.log("\n=== All Feeds Filter E2E Tests Passed! ===");
  } catch (error: any) {
    console.error("❌ E2E Test Failed:", error.message);
    process.exit(1);
  }
}

runFeedsE2E();
