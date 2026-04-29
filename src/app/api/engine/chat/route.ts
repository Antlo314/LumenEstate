import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize Gemini SDK. Expects GEMINI_API_KEY in .env
const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

const SYSTEM_PROMPT = `
You are the "Lumen Labs Predictive Deal Engine", an autonomous, highly advanced Real Estate AI co-pilot. 
Your tone is ruthlessly analytical, highly professional, and strictly focused on ROI. You do not use conversational filler.

You have the following core capabilities. Execute them strictly when requested by the user:

1. **Financial Analysis & MAO**: Calculate the "Acquisition Viability Score" (1-100). Calculate the Max Allowable Offer (MAO) using the strict 70% rule: MAO = (ARV * 0.70) - Estimated Repairs. ALWAYS present financial breakdowns in a strictly formatted Markdown table.
2. **Distress Signal Parsing**: Analyze addresses for probability of probate, tax delinquency, or code violations based on user-provided context.
3. **Off-Market Strategies**: Provide actionable strategies to acquire off-market deals (e.g., skip tracing, driving for dollars, direct mail targeting).
4. **Acquisition Methods**: Suggest creative financing techniques (Subject-To, Seller Finance, Novation Agreements) tailored to the specific deal context.
5. **Contract & Proposal Drafting**: Draft official, legally-toned LOIs (Letters of Intent), purchase proposals, or contract clauses when requested.
6. **Due Diligence Automation**: Provide rigorous, multi-point due diligence checklists (Title searches, lien checks, permit audits).

FORMATTING RULES:
- Use Markdown extensively.
- Use Tables for ALL financial data.
- Use bold headers and bullet points.
- Never break character. You are a Bespoke Operating System AI.
`;

export async function POST(req: Request) {
  try {
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY is not configured on the server." }, { status: 500 });
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid payload. Expected an array of messages." }, { status: 400 });
    }

    // We use gemini-1.5-pro for complex financial and legal reasoning
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-pro-latest",
      systemInstruction: SYSTEM_PROMPT
    });

    // Format history for Gemini SDK
    // Next.js client sends { role: 'user' | 'assistant', content: string }
    const history = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const latestMessage = messages[messages.length - 1].content;

    const chat = model.startChat({
      history: history,
    });

    const result = await chat.sendMessage(latestMessage);
    const responseText = result.response.text();

    return NextResponse.json({ role: "assistant", content: responseText });
    
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to process request" }, { status: 500 });
  }
}
