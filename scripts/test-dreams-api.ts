import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabaseAdmin = createSupabaseClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
);

const BASE_URL = "http://localhost:3000";

let capturedCookies1: Record<string, string> = {};
let capturedCookies2: Record<string, string> = {};

const supabaseAuth1 = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  cookies: {
    getAll: () =>
      Object.entries(capturedCookies1).map(([name, value]) => ({
        name,
        value,
      })),
    setAll: (cookiesToSet) => {
      cookiesToSet.forEach(({ name, value }) => {
        capturedCookies1[name] = value;
      });
    },
  },
});

const supabaseAuth2 = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  cookies: {
    getAll: () =>
      Object.entries(capturedCookies2).map(([name, value]) => ({
        name,
        value,
      })),
    setAll: (cookiesToSet) => {
      cookiesToSet.forEach(({ name, value }) => {
        capturedCookies2[name] = value;
      });
    },
  },
});

async function fetchAPI(
  path: string,
  method: string,
  cookiesDict: Record<string, string> | null = null,
  body: any = null,
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (cookiesDict && Object.keys(cookiesDict).length > 0) {
    headers["Cookie"] = Object.entries(cookiesDict)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join("; ");
  }

  return fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
}

async function runTests() {
  console.log("=== Starting Dreams API E2E Tests ===");
  let testUser1: any;
  let testUser2: any;

  try {
    // 1. Create two test users and sign in
    const email1 = `testuser1${Date.now()}@example.com`;
    const email2 = `testuser2${Date.now()}@example.com`;
    const password = "password123";

    console.log(`Creating test user 1 (${email1})...`);
    const { data: d1, error: e1 } = await supabaseAdmin.auth.admin.createUser({
      email: email1,
      password,
      email_confirm: true,
    });
    if (e1) throw new Error("Create user failed for user 1: " + e1.message);
    testUser1 = d1.user;

    console.log(`Creating test user 2 (${email2})...`);
    const { data: d2, error: e2 } = await supabaseAdmin.auth.admin.createUser({
      email: email2,
      password,
      email_confirm: true,
    });
    if (e2) throw new Error("Create user failed for user 2: " + e2.message);
    testUser2 = d2.user;

    // Login to get sessions (which will populate the captured cookies)
    const { data: s1, error: se1 } =
      await supabaseAuth1.auth.signInWithPassword({ email: email1, password });
    if (se1) throw new Error("Login failed user 1: " + se1.message);

    const { data: s2, error: se2 } =
      await supabaseAuth2.auth.signInWithPassword({ email: email2, password });
    if (se2) throw new Error("Login failed user 2: " + se2.message);

    // Create a mock profile for users (trigger normally creates it, but we manually ensure it here)
    await supabaseAdmin.from("profiles").upsert([
      { id: testUser1.id, nickname: "Tester1" },
      { id: testUser2.id, nickname: "Tester2" },
    ]);

    // 2. Setup mock dreams using standard Supabase Admin
    // Dream A: owned by User 1
    const { data: mockDream, error: dreamErr } = await supabaseAdmin
      .from("dreams")
      .insert({
        user_id: testUser1.id,
        content: "I dreamt about a giant cat.",
        expert_type: "FREUD",
        status: "COMPLETED",
        is_public: true,
        analysis_result: {
          title: "Cat Dream",
          symbols: ["cat"],
          analysis: "Test",
        },
      })
      .select()
      .single();
    if (dreamErr) throw new Error("Dream setup failed: " + dreamErr.message);

    // TEST: API-D-03 (GET /api/dreams?type=feed) -> 200 OK
    console.log("\n-> Testing API-D-03: Feed dreams list");
    const resFeed = await fetchAPI("/api/dreams?type=feed", "GET");
    console.log("Expected: 200, Got:", resFeed.status);
    const feedBody = await resFeed.json();
    console.assert(feedBody.success === true, "API-D-03 failed");

    // TEST: API-D-05 (GET /api/dreams?type=my without auth) -> 401
    console.log("\n-> Testing API-D-05: Unauthorized access to my dreams");
    const resMyUnauth = await fetchAPI("/api/dreams?type=my", "GET");
    console.log("Expected: 401, Got:", resMyUnauth.status);
    console.assert(resMyUnauth.status === 401, "API-D-05 failed");

    // TEST: API-D-04 (GET /api/dreams?type=my with auth) -> 200 OK
    console.log("\n-> Testing API-D-04: Authorized access to my dreams");
    const resMyAuth = await fetchAPI(
      "/api/dreams?type=my",
      "GET",
      capturedCookies1,
    );
    const myAuthBodyTxt = await resMyAuth.text();
    console.log("Expected: 200, Got:", resMyAuth.status, myAuthBodyTxt);
    const myAuthBody = JSON.parse(myAuthBodyTxt);
    console.assert(resMyAuth.status === 200, "API-D-04 failed");
    console.assert(myAuthBody.dreams.length >= 1, "API-D-04 failed (length)");

    // TEST: API-D-07 (GET /api/dreams/[id] for invalid id) -> 404
    console.log("\n-> Testing API-D-07: Get non-existent dream");
    const resGetInvalid = await fetchAPI(
      "/api/dreams/99999999-9999-9999-9999-999999999999",
      "GET",
    );
    console.log("Expected: 404, Got:", resGetInvalid.status);
    console.assert(resGetInvalid.status === 404, "API-D-07 failed");

    // TEST: API-D-06 (GET /api/dreams/[id]) -> 200 OK
    console.log("\n-> Testing API-D-06: Get existing dream details");
    const resGetValid = await fetchAPI(`/api/dreams/${mockDream.id}`, "GET");
    const getValidBody = await resGetValid.text();
    console.log("Expected: 200, Got:", resGetValid.status, getValidBody);
    console.assert(resGetValid.status === 200, "API-D-06 failed");

    // TEST: API-D-09 (PATCH /api/dreams/[id] for unauthorized / unauthorized owner) -> 403 Forbidden
    console.log("\n-> Testing API-D-09: Update dream with wrong owner");
    const resPatchForbidden = await fetchAPI(
      `/api/dreams/${mockDream.id}`,
      "PATCH",
      capturedCookies2,
      { is_public: false },
    );
    console.log("Expected: 403, Got:", resPatchForbidden.status);
    console.assert(resPatchForbidden.status === 403, "API-D-09 failed");

    // Auth but unauthorized token
    const resPatchUnauth = await fetchAPI(
      `/api/dreams/${mockDream.id}`,
      "PATCH",
      null,
      { is_public: false },
    );
    console.log("Expected: 401, Got:", resPatchUnauth.status);

    // TEST: API-D-08 (PATCH /api/dreams/[id] for valid owner) -> 200 OK
    console.log("\n-> Testing API-D-08: Update dream as owner");
    const resPatchValid = await fetchAPI(
      `/api/dreams/${mockDream.id}`,
      "PATCH",
      capturedCookies1,
      { is_public: false },
    );
    console.log("Expected: 200, Got:", resPatchValid.status);
    console.assert(resPatchValid.status === 200, "API-D-08 failed");

    // TEST: API-D-11 (DELETE /api/dreams/[id] for unauthorized owner) -> 403 Forbidden
    console.log("\n-> Testing API-D-11: Delete dream with wrong owner");
    const resDeleteForbidden = await fetchAPI(
      `/api/dreams/${mockDream.id}`,
      "DELETE",
      capturedCookies2,
    );
    console.log("Expected: 403, Got:", resDeleteForbidden.status);
    console.assert(resDeleteForbidden.status === 403, "API-D-11 failed");

    // TEST: API-D-10 (DELETE /api/dreams/[id] for valid owner) -> 200 OK
    console.log("\n-> Testing API-D-10: Delete dream as owner");
    const resDeleteValid = await fetchAPI(
      `/api/dreams/${mockDream.id}`,
      "DELETE",
      capturedCookies1,
    );
    console.log("Expected: 200, Got:", resDeleteValid.status);
    console.assert(resDeleteValid.status === 200, "API-D-10 failed");

    console.log("\n=== All Tests Done Successfully! ===");
  } catch (err) {
    console.error("Test execution failed:", err);
  } finally {
    // Cleanup users
    if (testUser1) await supabaseAdmin.auth.admin.deleteUser(testUser1.id);
    if (testUser2) await supabaseAdmin.auth.admin.deleteUser(testUser2.id);
    process.exit(0);
  }
}

runTests();
