"use client";

import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, supabase } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import {
  Shield, Terminal, FolderOpen, FileCode, Play, FileJson, Settings,
  Upload, HardDrive, Cpu, ExternalLink, Rocket, Link2, FileText,
  CheckCircle2, Sparkles, Zap, ChevronRight
} from "lucide-react";
import { useLanguage } from "@/i18n";

interface ChatMessage {
  role: "ai" | "user";
  content: string;
  agentConfig?: {
    name: string;
    desc: string;
    model: string;
    skills: string;
  };
}

const CONSOLE_SYSTEM = `You are Flap OS, an AI terminal assistant specialized in helping users build and deploy AI agents to the Flap Agent marketplace on BNB Chain.

When a user asks you to create, build, or deploy an agent (or describes what they want an agent to do), you MUST respond in the following JSON format embedded inside your reply:

AGENT_CONFIG:
{
  "name": "Short catchy agent name (2-3 words max)",
  "desc": "Clear 1-sentence description of what the agent does",
  "model": "Grok-4.1-Fast",
  "skills": "comma-separated skills e.g. trading, alerts, market-scanner",
  "message": "Your short, friendly confirmation message to the user explaining what you've configured"
}

For all other questions (non-agent-creation questions), respond helpfully and concisely in plain text — no JSON, no markdown headers. Keep it short and terminal-style.`;

function parseAgentConfig(text: string) {
  try {
    const marker = "AGENT_CONFIG:";
    const idx = text.indexOf(marker);
    if (idx === -1) return null;
    const jsonStr = text.slice(idx + marker.length).trim();
    const end = jsonStr.indexOf("}") + 1;
    return JSON.parse(jsonStr.substring(0, end));
  } catch {
    return null;
  }
}

export default function ConsolePage() {
  const { isAuthenticated, user, openAuthModal } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [formHighlight, setFormHighlight] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "ai", content: "Flap OS v1.0 initialized.\n\nDescribe the agent you want to build and I'll configure it automatically, or fill in the form manually and hit DEPLOY." }
  ]);
  const [deployConfig, setDeployConfig] = useState({
    name: "", desc: "", model: "Grok-4.1-Fast", skills: ""
  });
  const [isDeploying, setIsDeploying] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleDeploy = async () => {
    if (!user || !deployConfig.name) return alert("Please enter an agent name.");
    setIsDeploying(true);
    const username = user.email ? `@${user.email.split("@")[0]}` : "@flap_dev";
    const { error } = await supabase.from("agents").insert({
      creator_id: user.id,
      name: deployConfig.name,
      description: deployConfig.desc,
      model_type: deployConfig.model,
      avatar_url: "/dev.png",
      config_json: { skills: deployConfig.skills, price: "Free", type: "Custom", username }
    });
    setIsDeploying(false);
    if (error) {
      alert("Failed to deploy: " + error.message);
    } else {
      setMessages(prev => [...prev, { role: "ai", content: `✓ Agent "${deployConfig.name}" deployed successfully! Redirecting to marketplace...` }]);
      setTimeout(() => router.push("/market"), 1500);
    }
  };

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isLoadingChat) return;

    const userMsg: ChatMessage = { role: "user", content: chatInput };
    setMessages(prev => [...prev, userMsg, { role: "ai", content: "..." }]);
    setChatInput("");
    setIsLoadingChat(true);

    try {
      // Use the AI with the console system prompt
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: CONSOLE_SYSTEM },
            ...[...messages, userMsg].filter(m => m.role !== "ai" || (m.content && m.content !== "...")).map(m => ({
              role: m.role === "ai" ? "assistant" : "user",
              content: m.content
            }))
          ],
          model: "gpt-4o",
          sessionId: `console_${user?.id}`,
          skipSystemPrompt: true,
        }),
      });

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      // clear the "..." placeholder
      setMessages(prev => prev.map((m, i) => i === prev.length - 1 ? { ...m, content: "" } : m));

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value);
        setMessages(prev => prev.map((m, i) => i === prev.length - 1 ? { ...m, content: fullText } : m));
      }

      // Parse for agent config
      const config = parseAgentConfig(fullText);
      if (config) {
        // Auto-fill form
        setDeployConfig({
          name: config.name || "",
          desc: config.desc || "",
          model: config.model || "Grok-4.1-Fast",
          skills: config.skills || "",
        });
        // Replace raw JSON response with a clean message + structured card
        setMessages(prev => prev.map((m, i) =>
          i === prev.length - 1
            ? { ...m, content: config.message || "Agent configuration ready!", agentConfig: config }
            : m
        ));
        // Highlight the form
        setFormHighlight(true);
        setTimeout(() => setFormHighlight(false), 2000);
      }
    } catch {
      setMessages(prev => prev.map((m, i) =>
        i === prev.length - 1 ? { ...m, content: "Error: Could not reach the AI. Please try again." } : m
      ));
    } finally {
      setIsLoadingChat(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen pt-24 pb-12 bg-[#050505] flex items-center justify-center">
        <Navbar />
        <div className="glass-morphism rounded-2xl border-[#ffffff11] p-12 text-center flex flex-col items-center max-w-md">
          <Shield size={48} className="text-[#ff007f] mb-6" />
          <h1 className="text-2xl font-bold terminal-text mb-4">{t("console.title")}</h1>
          <p className="text-gray-500 mb-8">{t("console.authDesc")}</p>
          <button onClick={openAuthModal} className="btn-primary py-3 px-8 rounded-xl flex items-center gap-2">
            <Terminal size={18} /> {t("console.authBtn")}
          </button>
        </div>
        <Footer />
      </main>
    );
  }

  if (!mounted) return null;

  return (
    <main className="h-screen pt-20 bg-[#000000] flex flex-col overflow-hidden">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row gap-4 p-4 md:p-6 overflow-y-auto md:overflow-hidden">
        {/* Left Pane: File Tree */}
        <div className="hidden md:flex flex-col w-56 shrink-0 bg-[#0a0a0a] border border-[#ffffff11] rounded-2xl overflow-hidden">
          <div className="bg-[#111111] p-3 border-b border-[#ffffff11] flex items-center gap-2">
            <HardDrive size={14} className="text-gray-400" />
            <span className="text-[10px] font-bold terminal-text text-gray-400 uppercase tracking-widest">{t("console.workspace")}</span>
          </div>
          <div className="p-4 space-y-1 flex-1 overflow-y-auto">
            <div className="flex items-center gap-2 text-sm text-gray-300 hover:text-[#00f0ff] cursor-pointer transition-colors px-2 py-1 rounded hover:bg-[#ffffff05]">
              <FolderOpen size={16} className="text-[#ffaa00]" /> src/
            </div>
            <div className="ml-4 space-y-1">
              <div className="flex items-center gap-2 text-xs text-gray-400 hover:text-[#00f0ff] cursor-pointer transition-colors px-2 py-1 rounded hover:bg-[#ffffff05]">
                <FileCode size={14} className="text-[#00f0ff]" /> core_logic.rs
              </div>
              <div className="flex items-center gap-2 text-xs text-[#00f0ff] bg-[#00f0ff11] cursor-pointer transition-colors px-2 py-1 rounded">
                <FileJson size={14} className="text-[#ffaa00]" /> config.json
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400 hover:text-[#00f0ff] cursor-pointer transition-colors px-2 py-1 rounded hover:bg-[#ffffff05]">
                <FileCode size={14} className="text-[#00ff41]" /> webhook.ts
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300 hover:text-[#00f0ff] cursor-pointer transition-colors px-2 py-1 rounded hover:bg-[#ffffff05]">
              <FolderOpen size={16} className="text-gray-500" /> tests/
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300 hover:text-[#00f0ff] cursor-pointer transition-colors px-2 py-1 rounded hover:bg-[#ffffff05]">
              <FolderOpen size={16} className="text-gray-500" /> .flap/
            </div>
          </div>
        </div>

        {/* Center Pane: Terminal Chat */}
        <div className="flex-1 min-h-[500px] md:min-h-0 bg-[#050505] border border-[#ffffff11] rounded-2xl flex flex-col overflow-hidden relative">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#00f0ff03] blur-[120px] rounded-full pointer-events-none" />

          <div className="bg-[#111111] p-3 border-b border-[#ffffff11] flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-[#00f0ff]" />
              <span className="text-[10px] font-bold terminal-text text-[#00f0ff] uppercase tracking-widest">{t("console.terminal")}</span>
              <span className="text-[9px] bg-[#00f0ff11] border border-[#00f0ff22] px-2 py-0.5 rounded-full text-[#00f0ff] terminal-text">AI Builder</span>
            </div>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff000055]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#ffaa0055]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#00ff4155]" />
            </div>
          </div>

          {/* Quick commands */}
          <div className="px-4 pt-3 pb-1 flex gap-2 flex-wrap shrink-0">
            {[
              "Build a DeFi market scanner",
              "Create a Telegram alert bot",
              "Make an X/Twitter posting agent",
            ].map(p => (
              <button
                key={p}
                onClick={() => setChatInput(p)}
                className="text-[10px] terminal-text px-3 py-1 rounded-full border border-[#ffffff11] text-gray-500 hover:text-[#00f0ff] hover:border-[#00f0ff44] transition-all"
              >
                <Zap size={9} className="inline mr-1" />{p}
              </button>
            ))}
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            <AnimatePresence>
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm ${
                    msg.role === "user"
                      ? "bg-[#00f0ff11] border border-[#00f0ff33] text-[#00f0ff] rounded-br-none"
                      : "bg-[#111] border border-[#ffffff11] text-gray-300 rounded-bl-none"
                  }`}>
                    {msg.role === "ai" && (
                      <div className="flex items-center gap-2 mb-2">
                        <Cpu size={12} className="text-[#ff007f]" />
                        <span className="text-[9px] uppercase tracking-widest text-[#ff007f] font-bold terminal-text">Flap OS</span>
                      </div>
                    )}
                    <p className="font-mono leading-relaxed text-xs whitespace-pre-wrap">
                      {msg.agentConfig ? msg.content : (
                        msg.content === "..." ? (
                          <span className="flex gap-1 items-center">
                            {[0, 0.15, 0.3].map((d, i) => (
                              <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]"
                                animate={{ opacity: [0.2, 1, 0.2] }}
                                transition={{ duration: 0.8, delay: d, repeat: Infinity }}
                              />
                            ))}
                          </span>
                        ) : msg.content
                      )}
                    </p>

                    {/* Agent Config Card — shown when AI configured an agent */}
                    {msg.agentConfig && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 p-3 bg-[#00f0ff08] border border-[#00f0ff33] rounded-xl space-y-2"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles size={12} className="text-[#00f0ff]" />
                          <span className="text-[9px] font-bold text-[#00f0ff] uppercase tracking-widest terminal-text">Agent Configured ↗ See form →</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                          <div><span className="text-gray-500">Name:</span> <span className="text-white font-bold">{msg.agentConfig.name}</span></div>
                          <div><span className="text-gray-500">Model:</span> <span className="text-[#00f0ff]">{msg.agentConfig.model}</span></div>
                          <div className="col-span-2"><span className="text-gray-500">Skills:</span> <span className="text-[#ff007f]">{msg.agentConfig.skills}</span></div>
                        </div>
                        <button
                          onClick={handleDeploy}
                          disabled={isDeploying || !deployConfig.name}
                          className="w-full mt-2 bg-[#00f0ff] text-black font-bold text-[10px] terminal-text py-2 rounded-lg hover:shadow-[0_0_15px_#00f0ff55] transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                        >
                          <Rocket size={12} /> {isDeploying ? "Deploying..." : "DEPLOY NOW"}
                        </button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <form onSubmit={handleChat} className="p-4 bg-[#0a0a0a] border-t border-[#ffffff11] shrink-0">
            <div className="relative flex items-center">
              <span className="absolute left-4 text-[#00f0ff] font-mono text-sm">{">"}</span>
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder={isLoadingChat ? "AI is thinking..." : "Describe an agent or ask anything..."}
                disabled={isLoadingChat}
                className="w-full bg-[#111] border border-[#ffffff22] focus:border-[#00f0ff] rounded-xl py-3 pl-10 pr-12 text-sm text-gray-200 font-mono focus:outline-none transition-colors disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={isLoadingChat || !chatInput.trim()}
                className="absolute right-2 p-2 bg-[#00f0ff11] text-[#00f0ff] hover:bg-[#00f0ff33] rounded-lg transition-colors disabled:opacity-40"
              >
                {isLoadingChat
                  ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-4 h-4 border-2 border-[#00f0ff44] border-t-[#00f0ff] rounded-full" />
                  : <Play size={16} />
                }
              </button>
            </div>
          </form>
        </div>

        {/* Right Pane: Deployer Config */}
        <motion.div
          animate={{ boxShadow: formHighlight ? "0 0 30px #00f0ff44" : "none" }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-72 shrink-0 bg-[#0a0a0a] border border-[#ffffff11] rounded-2xl flex flex-col overflow-hidden"
          style={{ borderColor: formHighlight ? "#00f0ff33" : undefined }}
        >
          <div className="bg-[#111111] p-3 border-b border-[#ffffff11] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings size={14} className="text-[#ff007f]" />
              <span className="text-[10px] font-bold terminal-text text-[#ff007f] uppercase tracking-widest">{t("console.deployer")}</span>
            </div>
            {deployConfig.name && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1 text-[9px] text-[#00ff41] terminal-text">
                <CheckCircle2 size={10} /> Ready
              </motion.div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {/* AI hint */}
            {!deployConfig.name && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 bg-[#00f0ff05] border border-[#00f0ff22] rounded-xl text-[10px] text-gray-500 leading-relaxed"
              >
                <Sparkles size={10} className="inline text-[#00f0ff] mr-1" />
                Tell the AI what kind of agent you want in the terminal, and this form will be filled automatically.
              </motion.div>
            )}

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{t("console.agentName")}</label>
              <input
                type="text"
                value={deployConfig.name}
                onChange={e => setDeployConfig({ ...deployConfig, name: e.target.value })}
                className={`w-full bg-[#111] border rounded-lg p-2 text-sm text-white focus:outline-none transition-all ${deployConfig.name ? "border-[#00f0ff44] shadow-[0_0_10px_#00f0ff11]" : "border-[#ffffff22] focus:border-[#00f0ff]"}`}
                placeholder="e.g. DeFi Sniper"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{t("console.desc")}</label>
              <textarea
                rows={3}
                value={deployConfig.desc}
                onChange={e => setDeployConfig({ ...deployConfig, desc: e.target.value })}
                className={`w-full bg-[#111] border rounded-lg p-2 text-xs text-gray-400 focus:outline-none custom-scrollbar transition-all resize-none ${deployConfig.desc ? "border-[#00f0ff44]" : "border-[#ffffff22] focus:border-[#00f0ff]"}`}
                placeholder="Describe agent behavior..."
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{t("console.model")}</label>
              <select
                value={deployConfig.model}
                onChange={e => setDeployConfig({ ...deployConfig, model: e.target.value })}
                className="w-full bg-[#111] border border-[#ffffff22] rounded-lg p-2 text-sm text-white focus:outline-none"
              >
                <option>Grok-4.1-Fast</option>
                <option>GPT-4o</option>
                <option>DeepSeek-V3</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{t("console.skills")}</label>
              <input
                type="text"
                value={deployConfig.skills}
                onChange={e => setDeployConfig({ ...deployConfig, skills: e.target.value })}
                className={`w-full bg-[#111] border rounded-lg p-2 text-xs text-[#ff007f] font-mono focus:outline-none transition-all ${deployConfig.skills ? "border-[#ff007f44]" : "border-[#ffffff22] focus:border-[#ff007f]"}`}
                placeholder="trading, alerts, memory"
              />
            </div>

            <div className="pt-3 border-t border-[#ffffff11]">
              <label className="block text-[10px] font-bold text-[#ffaa00] uppercase tracking-widest mb-2 flex items-center gap-1">
                <Link2 size={10} /> {t("console.tools")}
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                {[
                  { label: t("console.tool.search"), checked: true },
                  { label: t("console.tool.calc"), checked: false },
                  { label: t("console.tool.x"), checked: true },
                  { label: t("console.tool.smart"), checked: false },
                ].map(tool => (
                  <label key={tool.label} className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                    <input type="checkbox" defaultChecked={tool.checked} className="accent-[#ffaa00]" /> {tool.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#ffffff11]">
              <label className="block text-[10px] font-bold text-[#00f0ff] uppercase tracking-widest mb-2 flex items-center gap-1">
                <FileText size={10} /> {t("console.rag")}
              </label>
              <button className="w-full border border-[#00f0ff33] bg-[#00f0ff05] hover:bg-[#00f0ff11] text-[#00f0ff] text-[10px] py-2 rounded-lg flex items-center justify-center gap-2 transition-colors terminal-text font-bold">
                <Upload size={12} /> {t("console.ragBtn")}
              </button>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-4 bg-[#111111] border-t border-[#ffffff11] space-y-2 shrink-0">
            <button
              onClick={handleDeploy}
              disabled={isDeploying || !deployConfig.name}
              className="w-full bg-[#00f0ff] disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold terminal-text py-3 rounded-xl hover:shadow-[0_0_20px_#00f0ff66] transition-all flex items-center justify-center gap-2 text-sm"
            >
              {isDeploying ? <Cpu size={16} className="animate-pulse" /> : <Rocket size={16} />}
              {isDeploying ? t("console.deploying") : t("console.btnDeploy")}
            </button>
            <button
              onClick={() => window.location.href = "/flow"}
              className="w-full bg-transparent border border-[#ff007f44] text-[#ff007f] font-bold terminal-text py-2.5 rounded-xl hover:bg-[#ff007f11] transition-all flex items-center justify-center gap-2 text-xs"
            >
              <ExternalLink size={14} /> {t("console.btnFlow")}
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
