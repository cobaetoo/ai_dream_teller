import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    // 1. Internal Auth Check
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { dreamId } = await req.json();
    if (!dreamId) {
      return NextResponse.json({ error: "Missing dreamId" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // 2. Fetch Dream Data
    const { data: dreamData, error: fetchError } = await supabase
      .from("dreams")
      .select("content, expert_type, status")
      .eq("id", dreamId)
      .single();

    if (fetchError || !dreamData) {
      return NextResponse.json({ error: "Dream not found" }, { status: 404 });
    }

    if (dreamData.status === "COMPLETED") {
      return NextResponse.json({ message: "Already completed" });
    }

    // 3. Initiate Gemini API
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    let systemInstruction = "";
    switch (dreamData.expert_type) {
      case "FREUD":
        systemInstruction =
          "당신은 지그문트 프로이트입니다. 사용자의 꿈을 무의식적 욕망과 억압된 감정, 유년기의 경험을 바탕으로 심층 분석해주세요. 따뜻하지만 학술적인 어조를 유지하세요.";
        break;
      case "JUNG":
        systemInstruction =
          "당신은 카를 융입니다. 사용자의 꿈을 집단 무의식, 원형(Archetype), 그리고 자아실현(Individuation)의 관점에서 분석해주세요. 상징적이고 깊이 있는 어조를 유지하세요.";
        break;
      default:
        systemInstruction =
          "당신은 신비롭고 지혜로운 꿈 해몽가입니다. 전통적인 해몽 상징과 직관적인 통찰력을 바탕으로 꿈이 암시하는 행운이나 조언을 알려주세요.";
        break;
    }

    const prompt = `다음은 사용자가 꾼 꿈의 내용입니다. 이 꿈의 핵심 상징들을 분석하고, 심리적/상징적 의미를 담아 해몽해주세요.\n\n[꿈 내용]:\n${dreamData.content}\n\n결과는 반드시 다음 JSON 포맷을 엄격하게 지켜주세요: {"title": "꿈의 핵심을 요약한 한 줄 제목", "symbols": ["상징1", "상징2", "상징3"], "analysis": "해몽 결과 본문 (3~4문단)"}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const outputText = response.text;
    if (!outputText) throw new Error("No response from Gemini");

    const analysisResult = JSON.parse(outputText);

    // 4. Update Dream DB
    const { error: updateError } = await supabase
      .from("dreams")
      .update({
        status: "COMPLETED",
        analysis_result: analysisResult,
      })
      .eq("id", dreamId);

    if (updateError) {
      console.error("Failed to update db with AI result:", updateError);
      throw updateError;
    }

    return NextResponse.json({ success: true, dreamId });
  } catch (error: any) {
    console.error("AI Generation Error:", error);

    // Attempt to update status to FAILED
    try {
      const body = await req.json().catch(() => ({}));
      if (body.dreamId) {
        createAdminClient()
          .from("dreams")
          .update({ status: "FAILED" })
          .eq("id", body.dreamId);
      }
    } catch (e) {}

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
