import { NextRequest } from "next/server";

export const runtime = "edge";

const API_KEY = process.env.GEMINI_API_KEY!;
const MODEL = "models/gemini-2.0-flash-lite-001"; // ✅ confirmed model for your key

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json().catch(() => ({ prompt: "" }));
    const finalPrompt =
      prompt?.trim() ||
      "Suggest 3 friendly anonymous messages separated by ||";

    // Call Gemini REST API (v1)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/${MODEL}:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: finalPrompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);
      return new Response("Error getting Gemini response", { status: 500 });
    }

    // Extract and clean text
    const rawText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      "No response generated.";

    // Remove intro like "Here are three friendly..." if Gemini adds it
    const cleanedText = rawText.replace(/^Here[\s\S]*?:/i, "").trim();

    return new Response(cleanedText, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error("Gemini backend error:", error);
    return new Response("Error getting Gemini response", { status: 500 });
  }
}
