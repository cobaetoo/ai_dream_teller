import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const API_URL = "http://localhost:3000/api/dreams/generate";

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing env vars");
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function createPendingDream() {
  try {
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
      throw new Error(`Guest Error: ${guestError.message}`);
    }

    const { data, error } = await supabase
      .from("dreams")
      .insert({
        content: "I dreamt about flying over a futuristic city.",
        expert_type: "FREUD",
        status: "PENDING",
        is_public: false,
        guest_id: guestData.id,
      })
      .select("id")
      .single();

    if (error) throw new Error(`Dream Error: ${error.message}`);
    return data.id;
  } catch (err: any) {
    console.error("Failed to setup tests:", err);
    process.exit(1);
  }
}

async function runTests() {
  console.log("=== Starting API-D-12 E2E Tests ===");

  // Setup: Create a new pending dream for the success test
  const validDreamId = await createPendingDream();
  console.log(`[Setup] Created pending dream: ${validDreamId}`);

  const tests = [
    {
      name: "1. Missing Auth Header",
      headers: { "Content-Type": "application/json" },
      body: { dreamId: validDreamId },
      expectedStatus: 401,
    },
    {
      name: "2. Invalid Auth Header",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer invalid-key",
      },
      body: { dreamId: validDreamId },
      expectedStatus: 401,
    },
    {
      name: "3. Missing dreamId in Body",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      body: {}, // empty body
      expectedStatus: 400,
    },
    {
      name: "4. Invalid dreamId (Not Found)",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      body: { dreamId: "00000000-0000-0000-0000-000000000000" },
      expectedStatus: 404,
    },
    {
      name: "5. Valid Request (Successful generation)",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      body: { dreamId: validDreamId },
      expectedStatus: 200,
    },
    {
      name: "6. Dream Already Processed",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      body: { dreamId: validDreamId }, // Resending same ID after success
      expectedStatus: 200, // The API returns 200 with { message: "Already completed" }
      validateFn: async (res: Response, json: any) => {
        return json.message === "Already completed";
      },
    },
  ];

  let passed = 0;
  for (const t of tests) {
    console.log(`\nTesting: ${t.name}`);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: t.headers,
        body: JSON.stringify(t.body),
      });
      const data = await res.json();
      const statusMatch = res.status === t.expectedStatus;
      let valid = statusMatch;

      if (statusMatch && t.validateFn) {
        valid = await t.validateFn(res, data);
      }

      console.log(`-> Status: ${res.status} (Expected: ${t.expectedStatus})`);
      console.log(`-> Response: ${JSON.stringify(data)}`);

      if (valid) {
        console.log("-> ✅ PASS");
        passed++;
      } else {
        console.log("-> ❌ FAIL");
      }
    } catch (e: any) {
      console.log("-> ❌ ERROR:", e.message);
    }
  }

  console.log(`\n=== Test Results: ${passed}/${tests.length} Passed ===`);
  if (passed === tests.length) {
    console.log("All E2E scenarios for API-D-12 successfully PASSED!");
  } else {
    process.exit(1);
  }
}

runTests();
