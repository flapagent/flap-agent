"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Terminal, Cpu, Sparkles, Wand2, Brain, LogIn, Rocket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "./AuthContext";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/i18n";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isTyping?: boolean;
  isThinking?: boolean;
  cta?: "console" | null;
}

const SESSION_ID = `session_${Math.random().toString(36).slice(2)}`;

const DEMO_RESPONSES: Record<string, string> = {
  default: `> FLAP OS v1.0 — DEMO MODE\n\nAnalyzing your request...\n\nThis is a live preview of the Flap Agent terminal. To deploy your own autonomous agent, you need to:\n\n  [1] Create a free account — takes 30 seconds\n  [2] Open the Console (/console)\n  [3] Describe your agent, pick a model, and hit DEPLOY\n\nYour agent will be live on the marketplace instantly. Want to get started?`,
};

const ThinkingIndicator = () => {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className="flex justify-start"
    >
      <div className="flex items-end gap-2">
        <div className="w-7 h-7 rounded-full bg-black border border-[#ff007f44] flex items-center justify-center shrink-0 overflow-hidden p-1">
          <img src="/logo.png" alt="AI Agent" className="w-full h-full object-contain" />
        </div>
        <div className="bg-[#111] border border-[#ffffff11] rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1.5">
          <span className="text-[10px] text-gray-500 mr-1 terminal-text">{t("chat.reasoning")}</span>
          {[0, 0.2, 0.4].map((delay, i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-[#ff007f]"
              animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 0.8, delay, repeat: Infinity }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const TypewriterMessage = ({ content, onDone }: { content: string; onDone: () => void }) => {
  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);

  useEffect(() => {
    if (indexRef.current >= content.length) {
      onDone();
      return;
    }
    const timer = setInterval(() => {
      if (indexRef.current < content.length) {
        setDisplayed(content.slice(0, indexRef.current + 1));
        indexRef.current++;
      } else {
        clearInterval(timer);
        onDone();
      }
    }, 12);
    return () => clearInterval(timer);
  }, [content, onDone]);

  return (
    <span style={{ whiteSpace: "pre-wrap" }}>
      {displayed}
      {displayed.length < content.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-[2px] h-[1em] bg-[#ff007f] ml-0.5 align-middle"
        />
      )}
    </span>
  );
};

interface ChatInterfaceProps {
  isDemo?: boolean;
}

export const ChatInterface = ({ isDemo = false }: ChatInterfaceProps) => {
  const { t } = useLanguage();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: isDemo
        ? "> FLAP OS — DEMO TERMINAL\n\nWelcome to the Flap Agent Demo. Try typing any prompt and I'll show you what your agent can do. To build and deploy a real agent, login and open the Console."
        : t("chat.ready"),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("gpt-4o");
  const [isReasoning, setIsReasoning] = useState(true);
  const [typingDoneIds, setTypingDoneIds] = useState<Set<string>>(new Set(["1"]));
  const scrollRef = useRef<HTMLDivElement>(null);

  const models = [
    { id: "gpt-4o", name: "GPT-4O", icon: <Cpu size={10} />, color: "text-[#00ff41]" },
    { id: "deepseek-v3", name: "DEEPSEEK V3", icon: <Brain size={10} />, color: "text-[#00f0ff]" },
    { id: "grok-4-1-fast-reasoning", name: "GROK-FAST", icon: <Wand2 size={10} />, color: "text-[#ff00ff]" },
  ];

  const prompts = [
    t("chat.prompt1") || "Build a Market Scanner agent for BNB",
    t("chat.prompt2") || "Create a coding assistant for Rust",
    t("chat.prompt3") || "Analyze token 0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const markTypingDone = useCallback((id: string) => {
    setTypingDoneIds((prev) => new Set([...prev, id]));
  }, []);

  const { isAuthenticated, openAuthModal } = useAuth();

  const handleDemoSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    const thinkingId = `thinking_${Date.now()}`;
    const assistantId = `assistant_${Date.now() + 1}`;
    const currentInput = input.toLowerCase();
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    await new Promise((r) => setTimeout(r, 1200));
    setMessages((prev) => [...prev, { id: thinkingId, role: "assistant", content: "", isThinking: true }]);
    await new Promise((r) => setTimeout(r, 1500));

    let responseText = DEMO_RESPONSES.default;
    if (currentInput.includes("token") || currentInput.includes("bnb") || currentInput.includes("defi")) {
      responseText = `> FLAP SCANNER — DEMO\n\nScanning BNB Chain contract...\nEstimated Liquidity: $1.2M\nVolume 24h: $340K\nHolders: 2,847\n\nTo run real-time analysis on any contract, deploy a Flap Scanner agent from the Console. Login to get started.`;
    } else if (currentInput.includes("build") || currentInput.includes("create") || currentInput.includes("agent")) {
      responseText = `> AGENT BUILDER — DEMO\n\nGreat idea! I can help you build:\n  • Market Scanner Agent\n  • Trading Bot Agent\n  • Content Creator Agent\n  • Telegram/X Poster Agent\n\nThis is just a preview. To actually BUILD and DEPLOY your agent, you need to login and open the Console (/console). It takes under 2 minutes!`;
    }

    setMessages((prev) => prev.filter((m) => m.id !== thinkingId));
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", content: responseText, isTyping: true, cta: "console" },
    ]);
    setIsLoading(false);
  };

  const handleRealSend = async () => {
    if (!input.trim() || isLoading) return;

    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    const thinkingId = `thinking_${Date.now()}`;
    const assistantId = `assistant_${Date.now() + 1}`;

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    await new Promise((r) => setTimeout(r, 300));
    setMessages((prev) => [...prev, { id: thinkingId, role: "assistant", content: "", isThinking: true }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
          sessionId: SESSION_ID,
          userId: null,
          model: selectedModel,
        }),
      });

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      setMessages((prev) => prev.filter((m) => m.id !== thinkingId));
      setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "", isTyping: true }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value);
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: fullText } : m))
        );
      }
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== thinkingId));
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "Connection error. Please check your API configuration and try again.", isTyping: true },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = isDemo ? handleDemoSend : handleRealSend;

  return (
    <div className="w-full h-full flex flex-col glass-morphism rounded-2xl overflow-hidden border border-[#ff007f44] pink-glow-border">
      <div className="bg-[#0d0d0d] border-b border-[#ffffff0d] px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <Terminal className="text-[#ff007f] ml-2" size={16} />
          <span className="text-xs font-bold terminal-text text-gray-300">{t("chat.builder.v1")}</span>
        </div>
        {isDemo && (
          <button
            onClick={() => openAuthModal()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ff007f11] border border-[#ff007f44] rounded-lg text-[10px] text-[#ff007f] terminal-text hover:bg-[#ff007f22] transition-all"
          >
            <LogIn size={12} /> LOGIN TO BUILD
          </button>
        )}
      </div>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-4 custom-scrollbar bg-[#060606]">
        <AnimatePresence>
          {messages.map((msg) => {
            if (msg.isThinking) return <ThinkingIndicator key={msg.id} />;
            const isUser = msg.role === "user";
            const isDone = typingDoneIds.has(msg.id);
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12, x: isUser ? 20 : -20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-full bg-black border border-[#ff007f44] flex items-center justify-center shrink-0 overflow-hidden p-1">
                    <img src="/logo.png" alt="Flap Agent" className="w-full h-full object-contain" />
                  </div>
                )}
                <div className="flex flex-col gap-2 max-w-[78%] md:max-w-[70%]">
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      isUser
                        ? "bg-[#ff007f] text-white rounded-br-none shadow-[0_4px_20px_#ff007f44]"
                        : "bg-[#141414] text-[#e0e0e0] border border-[#ffffff0d] rounded-bl-none"
                    }`}
                  >
                    {!isUser && (
                      <span className="text-[9px] block text-[#ff007f] mb-1.5 tracking-widest terminal-text opacity-70">
                        {isDemo ? "FLAP OS DEMO" : t("chat.flapAgent")}
                      </span>
                    )}
                    {!isUser && msg.isTyping && !isDone ? (
                      <TypewriterMessage content={msg.content} onDone={() => markTypingDone(msg.id)} />
                    ) : (
                      <span style={{ whiteSpace: "pre-wrap" }}>{msg.content}</span>
                    )}
                  </div>
                  {/* CTA button after demo message */}
                  {isDone && msg.cta === "console" && isDemo && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-2 mt-1"
                    >
                      <button
                        onClick={() => openAuthModal()}
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#ff007f] rounded-xl text-white text-xs font-bold terminal-text hover:shadow-[0_0_20px_#ff007f66] transition-all"
                      >
                        <LogIn size={12} /> LOGIN NOW
                      </button>
                      <button
                        onClick={() => router.push("/console")}
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#ffffff0a] border border-[#ffffff22] rounded-xl text-gray-300 text-xs font-bold terminal-text hover:border-[#ff007f44] transition-all"
                      >
                        <Rocket size={12} /> OPEN CONSOLE
                      </button>
                    </motion.div>
                  )}
                </div>
                {isUser && (
                  <div className="w-7 h-7 rounded-full bg-[#ff007f] flex items-center justify-center shrink-0 text-white font-bold text-[10px]">
                    U
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Quick Prompts */}
      <div className="px-4 py-2 flex gap-2 overflow-x-auto shrink-0 border-t border-[#ffffff06]" style={{ scrollbarWidth: "none" }}>
        {prompts.map((p) => (
          <button
            key={p}
            onClick={() => { setInput(p); }}
            disabled={isLoading}
            className="whitespace-nowrap px-3 py-1.5 glass-morphism rounded-full text-[11px] text-gray-500 hover:text-[#ff007f] hover:border-[#ff007f66] transition-all flex items-center gap-1.5 disabled:opacity-40"
          >
            <Wand2 size={11} />
            {p}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-3 md:p-4 bg-[#0d0d0d] border-t border-[#ffffff0d] shrink-0">
        <div className="relative flex flex-col gap-3">
          <div className="relative flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder={t("chat.placeholder")}
              disabled={isLoading}
              className="flex-1 bg-[#1a1a1a] border border-[#ffffff11] rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-[#ff007f] transition-all text-sm text-gray-200 placeholder-gray-600 disabled:opacity-50"
            />
            <motion.button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="absolute right-2 w-9 h-9 flex items-center justify-center bg-[#ff007f] rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_0_18px_#ff007f] transition-all"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                <Send size={16} className="text-white" />
              )}
            </motion.button>
          </div>

          {/* Bottom Controls — hide in demo */}
          {!isDemo && (
            <div className="flex items-center justify-between px-1">
              <div className="flex gap-2">
                {models.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedModel(m.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 bg-[#1a1a1a] rounded-lg text-[10px] terminal-text transition-all border ${
                      selectedModel === m.id
                        ? `border-[#ff007f] bg-[#ff007f11] text-white shadow-[0_0_10px_#ff007f33]`
                        : `border-transparent text-gray-500 hover:text-gray-300 hover:bg-[#222]`
                    }`}
                  >
                    {m.icon} {m.name}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 bg-[#1a1a1a] rounded-lg p-1 border border-[#ffffff0a]">
                <button
                  onClick={() => setIsReasoning(false)}
                  className={`px-3 py-1 rounded-md text-[10px] terminal-text transition-all ${!isReasoning ? "bg-[#ffffff11] text-white" : "text-gray-500 hover:text-gray-300"}`}
                >
                  {t("chat.fast")}
                </button>
                <button
                  onClick={() => setIsReasoning(true)}
                  className={`px-3 py-1 rounded-md flex items-center gap-1.5 text-[10px] terminal-text transition-all ${isReasoning ? "bg-[#ff007f11] border border-[#ff007f33] text-[#ff007f]" : "text-gray-500 hover:text-gray-300"}`}
                >
                  <Brain size={10} /> {t("chat.reasoningBtn")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
