"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { useAuth, supabase } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { Shield, Terminal, FolderOpen, FileCode, Play, FileJson, Settings, ChevronRight, Upload, HardDrive, Cpu, ExternalLink, Rocket, Link2, FileText, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/i18n";

export default function ConsolePage() {
  const { isAuthenticated, user, openAuthModal } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [chatInput, setChatInput] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);
  const [messages, setMessages] = useState<{role: 'ai'|'user', content: string}[]>([
    { role: 'ai', content: "Flap OS Terminal v1.0 initialized. Ready to compile your agent logic. How can I assist you with your DApp or Agent today?" }
  ]);
  const [deployConfig, setDeployConfig] = useState({ name: "", desc: "", model: "Grok-4.1-Fast", price: "Free", skills: "" });
  const [isDeploying, setIsDeploying] = useState(false);

  const handleDeploy = async () => {
    if (!user || !deployConfig.name) return alert("Please enter an agent name.");
    setIsDeploying(true);
    
    // Defaulting price to 'Free' as requested for newly created agents
    const username = user.email ? `@${user.email.split('@')[0]}` : "@flap_dev";

    const { error } = await supabase.from('agents').insert({
      creator_id: user.id,
      name: deployConfig.name,
      description: deployConfig.desc,
      model_type: deployConfig.model,
      avatar_url: "/dev.png",
      config_json: {
        skills: deployConfig.skills,
        price: "Free",
        type: "Custom",
        username: username
      }
    });

    setIsDeploying(false);
    
    if (error) {
      console.error(error);
      alert("Failed to deploy agent: " + error.message);
    } else {
      router.push('/market');
    }
  };

  const handleChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setMessages([...messages, { role: 'user', content: chatInput }, { role: 'ai', content: "Processing your request. Compiling logic vectors to the file manager..."}]);
    setChatInput("");
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
    <main className="min-h-screen pt-20 bg-[#000000] flex flex-col h-screen md:overflow-hidden overflow-y-auto">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row gap-4 p-4 md:p-6 md:overflow-hidden h-full">
        {/* Left Pane: File Manager */}
        <div className="hidden md:flex flex-col w-64 shrink-0 bg-[#0a0a0a] border border-[#ffffff11] rounded-2xl overflow-hidden">
          <div className="bg-[#111111] p-3 border-b border-[#ffffff11] flex items-center gap-2">
            <HardDrive size={14} className="text-gray-400" />
            <span className="text-[10px] font-bold terminal-text text-gray-400 uppercase tracking-widest">{t("console.workspace")}</span>
          </div>
          <div className="p-4 space-y-3 flex-1 overflow-y-auto">
            <div className="space-y-1">
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
        <div className="flex-1 min-h-[500px] md:min-h-0 bg-[#050505] border border-[#ffffff11] rounded-2xl flex flex-col overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#00f0ff03] blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
          
          <div className="bg-[#111111] p-3 border-b border-[#ffffff11] flex justify-between items-center z-10">
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-[#00f0ff]" />
              <span className="text-[10px] font-bold terminal-text text-[#00f0ff] uppercase tracking-widest">{t("console.terminal")}</span>
            </div>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff000055]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#ffaa0055]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#00ff4155]"></div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar z-10">
            {messages.map((msg, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-[#00f0ff11] border border-[#00f0ff33] text-[#00f0ff]' : 'bg-[#111] border border-[#ffffff11] text-gray-300'}`}>
                  {msg.role === 'ai' && (
                    <div className="flex items-center gap-2 mb-2">
                       <Cpu size={14} className="text-[#ff007f]" />
                       <span className="text-[10px] uppercase tracking-widest text-[#ff007f] font-bold terminal-text">Flap OS</span>
                    </div>
                  )}
                  <p className="text-sm font-mono leading-relaxed">{msg.content}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <form onSubmit={handleChat} className="p-4 bg-[#0a0a0a] border-t border-[#ffffff11] z-10">
            <div className="relative flex items-center">
              <span className="absolute left-4 text-[#00f0ff] font-mono">{">"}</span>
              <input 
                type="text" 
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder={t("console.input")}
                className="w-full bg-[#111] border border-[#ffffff22] focus:border-[#00f0ff] rounded-xl py-3 pl-10 pr-12 text-sm text-gray-200 font-mono focus:outline-none transition-colors"
              />
              <button type="submit" className="absolute right-2 p-2 bg-[#00f0ff11] text-[#00f0ff] hover:bg-[#00f0ff33] rounded-lg transition-colors">
                <Play size={16} />
              </button>
            </div>
          </form>
        </div>

        {/* Right Pane: Deployer Config */}
        <div className="w-full md:w-80 shrink-0 bg-[#0a0a0a] border border-[#ffffff11] rounded-2xl flex flex-col overflow-hidden">
          <div className="bg-[#111111] p-3 border-b border-[#ffffff11] flex items-center gap-2">
            <Settings size={14} className="text-[#ff007f]" />
            <span className="text-[10px] font-bold terminal-text text-[#ff007f] uppercase tracking-widest">{t("console.deployer")}</span>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
             {/* Thumbnail Upload */}
             <div className="border-2 border-dashed border-[#ffffff22] rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#ff007f55] hover:bg-[#ff007f05] transition-colors">
                <Upload size={24} className="text-gray-500 mb-2" />
                <span className="text-[10px] uppercase font-bold text-gray-400">{t("console.uploadThumb")}</span>
             </div>

             <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{t("console.agentName")}</label>
                <input 
                  type="text" 
                  value={deployConfig.name}
                  onChange={e => setDeployConfig({...deployConfig, name: e.target.value})}
                  className="w-full bg-[#111] border border-[#ffffff22] rounded-lg p-2 text-sm text-white focus:outline-none focus:border-[#00f0ff]" 
                  placeholder="e.g. DeFi Sniper" 
                />
             </div>

             <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{t("console.desc")}</label>
                <textarea 
                  rows={3} 
                  value={deployConfig.desc}
                  onChange={e => setDeployConfig({...deployConfig, desc: e.target.value})}
                  className="w-full bg-[#111] border border-[#ffffff22] rounded-lg p-2 text-sm text-gray-400 focus:outline-none focus:border-[#00f0ff] custom-scrollbar" 
                  placeholder="Describe agent behavior..."
                />
             </div>

             <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{t("console.model")}</label>
                  <select 
                    value={deployConfig.model}
                    onChange={e => setDeployConfig({...deployConfig, model: e.target.value})}
                    className="w-full bg-[#111] border border-[#ffffff22] rounded-lg p-2 text-sm text-white focus:outline-none"
                  >
                    <option>Grok-4.1-Fast</option>
                    <option>GPT-4o</option>
                    <option>DeepSeek-V3</option>
                  </select>
               </div>
               <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{t("console.price")}</label>
                  <select 
                    disabled
                    value="Free"
                    className="w-full bg-[#111] border border-[#ffffff22] rounded-lg p-2 text-sm text-[#00ff41] font-bold focus:outline-none opacity-50 cursor-not-allowed"
                  >
                    <option>Free</option>
                  </select>
               </div>
             </div>

             <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{t("console.skills")}</label>
                <input 
                  type="text" 
                  value={deployConfig.skills}
                  onChange={e => setDeployConfig({...deployConfig, skills: e.target.value})}
                  className="w-full bg-[#111] border border-[#ffffff22] rounded-lg p-2 text-sm text-[#ff007f] font-mono focus:outline-none focus:border-[#ff007f]" 
                  placeholder="trading, alerts, memory" 
                />
             </div>

             <div className="pt-4 border-t border-[#ffffff11]">
                <label className="block text-[10px] font-bold text-[#00f0ff] uppercase tracking-widest mb-2 flex items-center gap-1">
                  <FileText size={12} /> {t("console.rag")}
                </label>
                <button className="w-full border border-[#00f0ff33] bg-[#00f0ff05] hover:bg-[#00f0ff11] text-[#00f0ff] text-xs py-2 rounded-lg flex items-center justify-center gap-2 transition-colors terminal-text font-bold">
                   <Upload size={14} /> {t("console.ragBtn")}
                </button>
             </div>

             <div>
                <label className="block text-[10px] font-bold text-[#ffaa00] uppercase tracking-widest mb-3 flex items-center gap-1">
                  <Link2 size={12} /> {t("console.tools")}
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                  <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                    <input type="checkbox" className="accent-[#ffaa00]" defaultChecked /> {t("console.tool.search")}
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                    <input type="checkbox" className="accent-[#ffaa00]" /> {t("console.tool.calc")}
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                    <input type="checkbox" className="accent-[#ffaa00]" defaultChecked /> {t("console.tool.x")}
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                    <input type="checkbox" className="accent-[#ffaa00]" /> {t("console.tool.smart")}
                  </label>
                </div>
             </div>
          </div>
          
          {/* Action Footer */}
          <div className="p-4 bg-[#111111] border-t border-[#ffffff11] space-y-3">
             <button 
                onClick={handleDeploy}
                disabled={isDeploying || !deployConfig.name}
                className="w-full bg-[#00f0ff] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold terminal-text py-3 rounded-xl hover:shadow-[0_0_20px_#00f0ff66] transition-all flex items-center justify-center gap-2"
              >
                {isDeploying ? <Cpu size={16} className="animate-pulse" /> : <Rocket size={16} />} 
                {isDeploying ? t("console.deploying") : t("console.btnDeploy")}
             </button>
             <button 
                onClick={() => window.location.href = '/flow'}
                className="w-full bg-transparent border border-[#ff007f55] text-[#ff007f] font-bold terminal-text py-3 rounded-xl hover:bg-[#ff007f11] hover:shadow-[0_0_15px_#ff007f33] transition-all flex items-center justify-center gap-2"
             >
                <ExternalLink size={16} /> {t("console.btnFlow")}
             </button>
          </div>
        </div>

      </div>
      <Footer />
    </main>
  );
}
