import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function runTests() {
  console.log("=== Starting Telegram E2E Tests ===");
  try {
    // 0. Create a fake guest
    const { data: guest, error: guestErr } = await supabase
      .from("guests")
      .insert({
        phone: "010-9999-9999",
        password_hash: "fake_hash",
      })
      .select()
      .single();

    // Ignore error if phone already exists, just fetch it
    let guestId = guest?.id;
    if (guestErr) {
      const { data: existingGuest } = await supabase
        .from("guests")
        .select()
        .eq("phone", "010-9999-9999")
        .single();
      guestId = existingGuest.id;
    }

    // 1. Create a fake dream
    const { data: dream, error: dreamErr } = await supabase
      .from("dreams")
      .insert({
        guest_id: guestId,
        content:
          "I dreamt of flying over a beautiful ocean with a golden sunset.",
        expert_type: "FREUD",
        status: "PENDING",
        is_public: false,
      })
      .select()
      .single();

    if (dreamErr)
      throw new Error("Failed to create dream: " + dreamErr.message);
    console.log("Created test dream:", dream.id);

    // 2. Create a fake order
    const mockOrderId = `test_order_${Date.now()}`;
    const { error: orderErr } = await supabase.from("orders").insert({
      id: mockOrderId,
      dream_id: dream.id,
      amount: 2500,
      status: "READY",
    });

    if (orderErr)
      throw new Error("Failed to create order: " + orderErr.message);
    console.log("Created test order:", mockOrderId);

    // TEST 1: Payment Fail Scenario (Toss API Fail with invalid key)
    console.log("\n-> Testing Payment Failure Notification (Toss Rejection)");
    const resPaymentFail = await fetch(
      "http://localhost:3000/api/payments/confirm",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentKey: "invalid_key",
          orderId: mockOrderId,
          amount: 2500,
        }),
      },
    );
    console.log("Payment failure status:", resPaymentFail.status);
    console.log("Payment failure body:", await resPaymentFail.text());

    // TEST 2: Dream Generate Success Scenario
    console.log("\n-> Testing Dream Generation Success Notification");
    const resDreamSuccess = await fetch(
      "http://localhost:3000/api/dreams/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        body: JSON.stringify({ dreamId: dream.id }),
      },
    );
    console.log("Dream success stat:", resDreamSuccess.status);
    const dreamResBody = await resDreamSuccess.text();
    console.log("Dream Success response body:", dreamResBody);

    // TEST 3: Dream Generate Error Scenario (invalid UUID triggers DB JS Error)
    console.log("\n-> Testing Dream System Error Notification (Invalid UUID)");
    const resDreamFail = await fetch(
      "http://localhost:3000/api/dreams/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        body: JSON.stringify({ dreamId: "invalid-uuid" }),
      },
    );
    console.log("Dream fail stat:", resDreamFail.status);
    const failBody = await resDreamFail.text();
    console.log("Dream Fail response:", failBody);

    console.log("\n=== Telegram E2E Tests Finished ===");
  } catch (err) {
    console.error("Test execution failed:", err);
  } finally {
    process.exit(0);
  }
}

runTests();
