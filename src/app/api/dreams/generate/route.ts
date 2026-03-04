import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { GoogleGenAI } from "@google/genai";
import { sendTelegramMessage } from "@/lib/telegram";

// Google AI SDK types (vibe coding rules: no any)
interface GoogleImageResponse {
  generatedImages?: {
    image?: {
      imageBytes: string;
      mimeType: string;
    };
  }[];
}

export const maxDuration = 60; // Allow sufficient time for imagen-4.0 generation
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let currentDreamId: string | undefined;

  try {
    // 1. Internal Auth Check
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { dreamId, force = false } = await req.json();
    currentDreamId = dreamId;

    if (!dreamId) {
      return NextResponse.json({ error: "Missing dreamId" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // 2. Fetch Dream Data
    const { data: dreamData, error: fetchError } = await supabase
      .from("dreams")
      .select("content, expert_type, status, has_image_gen")
      .eq("id", dreamId)
      .single();

    if (fetchError || !dreamData) {
      return NextResponse.json({ error: "Dream not found" }, { status: 404 });
    }

    if (dreamData.status === "COMPLETED" && !force) {
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

    const prompt = `다음은 사용자가 꾼 꿈의 내용입니다. 이 꿈의 핵심 상징들을 분석하고, 심리적/상징적 의미를 담아 반드시 한국어(Korean)로 해몽해주세요.\n\n[꿈 내용]:\n${dreamData.content}\n\n결과는 반드시 다음 JSON 포맷을 엄격하게 지켜주세요: {"title": "꿈의 핵심을 요약한 한 줄 제목(한국어)", "symbols": ["상징1(한국어)", "상징2", "상징3"], "analysis": "해몽 결과 본문 (3~4문단, 한국어)"}`;

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

    // 4. (Optional) Generate Image if has_image_gen is true
    let imageUrl = null;
    let imageError = null;
    let imageResponse: GoogleImageResponse | null = null;
    if (dreamData.has_image_gen) {
      try {
        const imagePrompt = `A mystical, dreamlike, and vibrant digital art illustration of the following dream symbols: ${analysisResult.symbols.join(
          ", ",
        )}. Theme: ${
          analysisResult.title
        }. Style: Aurora gradients background, cinematic lighting, conceptual art.`;

        imageResponse = (await ai.models.generateImages({
          model: "imagen-4.0-generate-001",
          prompt: imagePrompt,
        })) as GoogleImageResponse;

        // Imagen 모델은 generatedImages[0].image.imageBytes 에 이미지를 반환함
        const firstImg = imageResponse.generatedImages?.[0]?.image;
        if (firstImg?.imageBytes) {
          imageUrl = `data:${firstImg.mimeType};base64,${firstImg.imageBytes}`;
        }
      } catch (imgError: any) {
        console.error("Image Generation Failed:", imgError);
        imageError = imgError.message || "Unknown Imagen Error";
      }
    }

    // 5. Update Dream DB
    const { error: updateError } = await supabase
      .from("dreams")
      .update({
        status: "COMPLETED",
        analysis_result: analysisResult,
        image_url: imageUrl,
      })
      .eq("id", dreamId);

    if (updateError) {
      console.error("Failed to update db with AI result:", updateError);
      throw updateError;
    }

    await sendTelegramMessage(
      `🌟 <b>꿈 해석 완료</b>\nDream ID: <code>${dreamId}</code>\n전문가: ${dreamData.expert_type}${imageUrl ? "\n(이미지 생성됨)" : imageError ? `\n(이미지 에러: ${imageError})` : ""}`,
    );

    return NextResponse.json({
      success: true,
      dreamId,
      hasImage: !!imageUrl,
    });
  } catch (error: any) {
    console.error("AI Generation Error:", error);

    // Attempt to update status to FAILED
    try {
      if (currentDreamId) {
        await createAdminClient()
          .from("dreams")
          .update({ status: "FAILED" })
          .eq("id", currentDreamId);
      }
    } catch (e) {}

    await sendTelegramMessage(
      `🚨 <b>꿈 해석 생성 서버 에러</b>\nDream ID: <code>${currentDreamId || "Unknown"}</code>\nError: ${error.message}`,
    );

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
