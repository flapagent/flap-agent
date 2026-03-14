import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { messages, sessionId, userId, model } = await req.json();
  const latestUserMessage = (messages[messages.length - 1]?.content as string) ?? "";

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
  const isGrok = model === "grok-4-1-fast-reasoning";
  const apiKey = isGrok ? process.env.XAI_API_KEY : process.env.OPENAI_API_KEY;

  let ltmContext = "";
  let ragContext = "";
  let marketContext = "";

  // 1. DexScreener Integration (Flap Scanner)
  const bscTokenRegex = /0x[a-fA-F0-9]{40}/;
  const match = latestUserMessage.match(bscTokenRegex);
  if (match) {
    const tokenAddress = match[0];
    try {
      const dexRes = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`);
      const dexData = await dexRes.json();
      if (dexData.pairs && dexData.pairs.length > 0) {
        const p = dexData.pairs[0];
        marketContext = `\nREAL-TIME DATA FOR TOKEN ${tokenAddress}:
- Price: $${p.priceUsd}
- Liquidity: $${p.liquidity?.usd ?? "N/A"}
- 24h Volume: $${p.volume?.h24 ?? "N/A"}
- 24h Change: ${p.priceChange?.h24 ?? "N/A"}%
- DEX: ${p.dexId} (${p.baseToken?.symbol}/${p.quoteToken?.symbol})\n\n`;
      }
    } catch (e) {
      console.error("DexScreener fetch failed:", e);
    }
  }

  // 2. Auth & History logic (Same as before)
  if (userId && supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: memories } = await supabase
      .from("user_memory")
      .select("fact")
      .eq("user_id", userId)
      .limit(10);

    if (memories && memories.length > 0) {
      ltmContext = `Known user facts:\n${memories.map((m: { fact: string }) => `- ${m.fact}`).join("\n")}\n\n`;
    }

    const keywords = latestUserMessage
      .split(/\s+/)
      .filter((w: string) => w.length > 4)
      .slice(0, 5);

    if (keywords.length > 0) {
      const { data: history } = await supabase
        .from("chat_messages")
        .select("role, content")
        .eq("session_id", sessionId)
        .textSearch("content", keywords.join(" | "), { type: "websearch" })
        .order("created_at", { ascending: false })
        .limit(5);

      if (history && history.length > 0) {
        ragContext = `Relevant past context:\n${history.map((m: { role: string; content: string }) => `${m.role}: ${m.content}`).join("\n")}\n\n`;
      }
    }

    await supabase.from("chat_messages").insert({
      session_id: sessionId,
      user_id: userId,
      role: "user",
      content: latestUserMessage,
    });
  }

  const modelLabel = model ? `[NEUROMORPHIC ROUTING ACTIVE: ${model.toUpperCase()} CORE ENGAGED]` : "";
  const systemPrompt = `You are Flap Agent, an elite AI builder assistant powered by Neuromorphic LLM Routing. ${modelLabel} 
Your capabilities include Verifiable Compute (zk-ML/TEE), Graph RAG for self-healing workflows, and Agentic Swarm orchestration.
Help users design, configure, and deploy autonomous AI agents. If provided with market data, use it to analyze tokens for the Flap Scanner feature. Be concise, technical, and inspiring. Act as if you can execute Deterministic Web3 Primitives and sign transactions on the BNB Chain.

[GRAPH RAG CONTEXT]:
${ltmContext}${ragContext}${marketContext}`.trim();

  if (!apiKey) {
    const fallback = `ANALYZING PROMPT... [${model?.toUpperCase() ?? "GPT-4O"}] GENERATING MODEL CONFIG FOR: "${latestUserMessage}". Please add your ${isGrok ? "XAI_API_KEY" : "OPENAI_API_KEY"} to enable live responses.`;
    return NextResponse.json({ content: fallback });
  }

  const { OpenAI } = await import("openai");
  const openai = new OpenAI({ 
    apiKey,
    baseURL: isGrok ? "https://api.x.ai/v1" : undefined
  });

  const completion = await openai.chat.completions.create({
    model: isGrok ? "grok-4-1-fast-reasoning" : "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ],
    stream: true,
  });

  const stream = new ReadableStream({
    async start(controller) {
      let fullResponse = "";
      for await (const chunk of completion) {
        const delta = chunk.choices[0]?.delta?.content ?? "";
        if (delta) {
          fullResponse += delta;
          controller.enqueue(new TextEncoder().encode(delta));
        }
      }

      if (userId && fullResponse && supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        await supabase.from("chat_messages").insert({
          session_id: sessionId,
          user_id: userId,
          role: "assistant",
          content: fullResponse,
        });

        const lower = latestUserMessage.toLowerCase();
        if (lower.includes("my name is") || lower.includes("i am")) {
          await supabase.from("user_memory").insert({
            user_id: userId,
            fact: `User said: ${latestUserMessage.slice(0, 200)}`,
          });
        }
      }

      controller.close();
    },
  });

  return new NextResponse(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
