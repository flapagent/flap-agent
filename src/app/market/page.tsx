"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Terminal, ShoppingBag, Search, Filter, ShoppingCart, Cpu, Code, ChevronLeft, ChevronRight, Star, Crown } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, supabase } from "@/components/AuthContext";
import { useLanguage } from "@/i18n";

// Generate 30 mock agents to fill 5 pages
const AGENT_TEMPLATES = [
  { name: "Market Scanner", desc: "Scans real-time crypto markets for BNB opportunities.", type: "Market", basePrice: 0.5, image: "/scanner.png" },
  { name: "Flap Security", desc: "Advanced cross-chain security scanner for tokens.", type: "Security", basePrice: 1.2, image: "/security.png" },
  { name: "Agent Code", desc: "Full-stack coding assistant optimized for Web3.", type: "Dev", basePrice: 0, image: "/dev.png" },
  { name: "Social Viral", desc: "Automated Twitter/X growth agent with viral analysis.", type: "Social", basePrice: 0.8, image: "/scanner.png" },
  { name: "Logic Pro", desc: "Deep reasoning engine for complex problem solving.", type: "Logic", basePrice: 2.0, image: "/dev.png" },
  { name: "Data Viz", desc: "Transforms raw chain data into beautiful visualizations.", type: "Data", basePrice: 0.3, image: "/security.png" },
];

const AGENTS = Array.from({ length: 30 }).map((_, i) => {
  const template = AGENT_TEMPLATES[i % AGENT_TEMPLATES.length];
  // Slightly adjust prices/names to differentiate them across pages
  const priceVal = template.basePrice === 0 ? "Free" : `${(template.basePrice + (i * 0.1)).toFixed(2)} BNB`;
  return {
    id: i + 1,
    name: `${template.name} v${Math.floor(i / 6) + 1}`,
    desc: template.desc,
    type: template.type,
    price: priceVal,
    image: template.image
  };
});
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export default function MarketPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [activePage, setActivePage] = useState(1);
  const [selectedAgent, setSelectedAgent] = useState<typeof AGENTS[0] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'api'|'telegram'|'x'|'embed'>('api');
  const [customAgents, setCustomAgents] = useState<any[]>([]);

  useEffect(() => {
    const fetchCustomAgents = async () => {
      const { data, error } = await supabase.from('agents').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        const mappedData = data.map(agent => ({
          id: agent.id,
          name: agent.name,
          desc: agent.description || "Custom AI Agent deployed from Console.",
          type: agent.config_json?.type || "Custom",
          price: agent.config_json?.price || "Free",
          image: agent.avatar_url || "/dev.png"
        }));
        setCustomAgents(mappedData);
      }
    };
    fetchCustomAgents();
  }, []);

  const allAgents = [...customAgents, ...AGENTS];
  const itemsPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(allAgents.length / itemsPerPage));
  
  const currentAgents = allAgents.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage);

  const handleActionClick = (agent: typeof AGENTS[0]) => {
    setSelectedAgent(agent);
  };

  const handleConfirmAction = async () => {
    if (!selectedAgent) return;
    setIsProcessing(true);
    const isFree = selectedAgent.price === 'Free' || selectedAgent.price === 'free';

    if (isFree && user) {
      // Generate a unique API key and persist to Supabase
      const agentSlug = selectedAgent.name.toLowerCase().replace(/\s+/g, '_');
      const keyValue = `sk_flap_${agentSlug}_${Math.random().toString(36).substring(2, 10)}`;
      await supabase.from('api_keys').upsert({
        user_id: user.id,
        agent_id: String(selectedAgent.id),
        key_value: keyValue,
      });
    } else {
      // Simulate payment delay
      await new Promise(r => setTimeout(r, 1500));
    }

    setIsProcessing(false);
    setSelectedAgent(null);
    router.push('/console');
  };

  return (
    <main className="min-h-screen pt-24 pb-12 bg-[#050505] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-b from-[#ff007f08] to-transparent pointer-events-none" />
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff007f11] border border-[#ff007f33] mb-4">
              <ShoppingBag size={12} className="text-[#ff007f]" />
              <span className="text-[10px] font-bold text-[#ff007f] tracking-widest uppercase">{t("market.badge")}</span>
            </div>
            <h1 className="text-4xl font-bold terminal-text pink-gradient-text mb-4">{t("market.title")}</h1>
            <p className="text-gray-400">{t("market.sub")}</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex gap-4"
          >
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder={t("market.search")} 
                className="w-full bg-[#101010] border border-[#ffffff11] rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#ff007f] transition-all"
              />
            </div>
            <button className="p-2 glass-morphism rounded-lg hover:text-[#ff007f] transition-colors">
              <Filter size={18} />
            </button>
          </motion.div>
        </header>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          key={activePage} // Trigger animation on page change
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {currentAgents.map((agent) => {
            const isFree = agent.price === "Free";
            return (
            <motion.div 
              variants={itemVariants}
              key={agent.id}
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass-morphism rounded-2xl p-6 border-[#ffffff11] hover:pink-glow-border transition-all duration-300 group flex flex-col relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#ff007f] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border border-[#ffffff11] group-hover:border-[#ff007f55] transition-all shrink-0 relative">
                  <div className="absolute inset-0 bg-[#ff007f] mix-blend-overlay opacity-0 group-hover:opacity-20 transition-opacity z-10" />
                  <img src={agent.image} alt={agent.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  {!isFree && parseFloat(agent.price) >= 1 && (
                    <div className="absolute top-0 right-0 bg-gradient-to-tr from-[#ffaa00] to-[#ffdd00] text-black text-[8px] font-bold px-3 py-1 pb-1.5 shadow-[0_2px_10px_#ffaa0066] transform rotate-45 translate-x-[12px] -translate-y-[2px]">
                      PRO
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1 text-[10px] terminal-text text-[#ff007f] px-2 py-1 bg-[#ff007f11] rounded uppercase tracking-widest border border-[#ff007f33]">
                    {!isFree && parseFloat(agent.price) >= 1 && <Crown size={12} className="text-[#ffaa00]" /> }
                    {agent.type}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-[#ffaa00] font-bold bg-[#ffaa0011] px-2 py-1 rounded border border-[#ffaa0033]">
                    <Star size={10} fill="currentColor" /> 4.9
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold terminal-text mb-2 group-hover:text-[#ff007f] transition-colors">{agent.name}</h3>
              <p className="text-sm text-gray-500 mb-8 leading-relaxed flex-1">{agent.desc}</p>
              
              <div className="flex items-center justify-between border-t border-[#ffffff11] pt-6 shrink-0">
                <div>
                  <span className="text-[10px] text-gray-600 block uppercase mb-1">{t("market.price")}</span>
                  <span className={`text-lg font-bold terminal-text flex items-center gap-1.5 ${isFree ? 'text-[#00f0ff]' : 'text-[#00ff41]'}`}>
                    {!isFree && <span className="w-2 h-2 rounded-full bg-[#f3ba2f] inline-block animate-pulse" />}
                    {agent.price === 'Free' || agent.price === 'free' ? t("market.free") : agent.price}
                  </span>
                </div>
                <motion.button 
                  onClick={() => handleActionClick(agent)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`${isFree ? 'bg-[#00f0ff] hover:bg-[#00c0cc]' : 'btn-primary'} py-2 px-4 rounded-lg flex items-center gap-2 text-xs text-black font-bold hover:shadow-[0_0_15px_#ff007f44]`}
                >
                  {isFree ? <Terminal size={14} /> : <ShoppingCart size={14} />}
                  {isFree ? t("market.useNow") : t("market.buyNow")}
                </motion.button>
              </div>
            </motion.div>
          )})}
        </motion.div>

        {/* Pagination Controls */}
        {/* Pagination Controls */}
        <div className="flex items-center justify-center gap-2 mt-16 relative z-10">
          <button 
            onClick={() => setActivePage(p => Math.max(1, p - 1))}
            disabled={activePage === 1}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-[#ffffff11] text-gray-400 hover:bg-[#ff007f11] hover:text-[#ff007f] hover:border-[#ff007f55] disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            aria-label={t("market.prev")}
          >
            <ChevronLeft size={18} />
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
            <button
              key={pageNum}
              onClick={() => setActivePage(pageNum)}
              className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-all font-bold terminal-text ${
                activePage === pageNum 
                  ? 'bg-[#ff007f] border-[#ff007f] text-white shadow-[0_0_15px_#ff007f66]' 
                  : 'border-[#ffffff11] text-gray-500 hover:bg-[#ffffff0a] hover:text-white'
              }`}
            >
              {pageNum}
            </button>
          ))}
          
          <button 
            onClick={() => setActivePage(p => Math.min(totalPages, p + 1))}
            disabled={activePage === totalPages}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-[#ffffff11] text-gray-400 hover:bg-[#ff007f11] hover:text-[#ff007f] hover:border-[#ff007f55] disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            aria-label={t("market.next")}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <Footer />

      {/* Dynamic Agent Action Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            className={`bg-[#0a0a0a] border rounded-2xl p-6 md:p-8 max-w-2xl w-full relative max-h-[90vh] overflow-y-auto custom-scrollbar ${selectedAgent.price === "Free" ? 'border-[#00f0ff55] shadow-[0_0_30px_#00f0ff33]' : 'border-[#ff007f55] pink-glow-border'}`}
          >
            <button 
              onClick={() => setSelectedAgent(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            >
              ✕
            </button>
            
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className={`w-24 h-24 shrink-0 rounded-2xl flex items-center justify-center border ${selectedAgent.price === "Free" ? 'border-[#00f0ff33] bg-[#00f0ff11]' : 'border-[#ff007f33] bg-[#ff007f11]'}`}>
                <img src={selectedAgent.image} alt="Agent" className="w-16 h-16 object-contain" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold terminal-text text-white">{selectedAgent.name}</h2>
                  <span className="text-[10px] terminal-text text-gray-500 border border-[#ffffff22] px-2 py-0.5 rounded uppercase">v1.0.4</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                  <span>{t("market.by")} <strong className={selectedAgent.price === "Free" ? "text-[#00f0ff]" : "text-[#ff007f]"}>@flap_core</strong></span>
                  <span>•</span>
                  <span>{t("market.openSource")}</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{selectedAgent.desc}</p>
              </div>
            </div>

            {selectedAgent.price === "Free" ? (
              <div className="space-y-6">
                {/* Free Agent Tutorial Tabs */}
                <div className="flex gap-2 border-b border-[#ffffff11] pb-0 overflow-x-auto custom-scrollbar">
                  <button onClick={() => setActiveTab('api')} className={`px-4 py-2 text-xs font-bold uppercase tracking-widest terminal-text border-b-2 transition-colors whitespace-nowrap ${activeTab === 'api' ? 'border-[#00f0ff] text-[#00f0ff]' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>{t("market.tab.api")}</button>
                  <button onClick={() => setActiveTab('telegram')} className={`px-4 py-2 text-xs font-bold uppercase tracking-widest terminal-text border-b-2 transition-colors whitespace-nowrap ${activeTab === 'telegram' ? 'border-[#00f0ff] text-[#00f0ff]' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>{t("market.tab.telegram")}</button>
                  <button onClick={() => setActiveTab('x')} className={`px-4 py-2 text-xs font-bold uppercase tracking-widest terminal-text border-b-2 transition-colors whitespace-nowrap ${activeTab === 'x' ? 'border-[#00f0ff] text-[#00f0ff]' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>{t("market.tab.x")}</button>
                  <button onClick={() => setActiveTab('embed')} className={`px-4 py-2 text-xs font-bold uppercase tracking-widest terminal-text border-b-2 transition-colors whitespace-nowrap ${activeTab === 'embed' ? 'border-[#ffaa00] text-[#ffaa00]' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>{t("market.tab.embed")}</button>
                </div>

                <div className="bg-[#050505] p-5 rounded-xl border border-[#ffffff11] min-h-[200px]">
                  {activeTab === 'api' && (() => {
                    const apiKey = `sk_${selectedAgent.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${selectedAgent.id}x9a8f2`;
                    return (
                    <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                      <div>
                        <h4 className="text-[10px] text-[#00f0ff] uppercase tracking-widest font-bold mb-2">Integration API Key</h4>
                        <div className="flex items-center gap-2">
                          <input type="text" readOnly value={apiKey} className="flex-1 bg-[#111] border border-[#ffffff22] rounded py-2 px-3 text-sm text-gray-300 font-mono focus:outline-none" />
                          <button className="p-2 bg-[#111] border border-[#ffffff22] rounded hover:border-[#00f0ff] transition-colors"><Code size={16} className="text-[#00f0ff]" /></button>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">Example cURL Request</h4>
                        <pre className="bg-[#111] border border-[#ffffff11] p-3 rounded text-[10px] text-[#00ff41] font-mono overflow-x-auto">
                          curl -X POST https://flapagent.sh/api/v1/chat \<br/>
                          &nbsp;&nbsp;-H "Authorization: Bearer {apiKey}" \<br/>
                          &nbsp;&nbsp;-d '{"{"}"message": "Analyze market"{"}"}'
                        </pre>
                      </div>
                    </div>
                  )})()}

                  {activeTab === 'telegram' && (
                    <div className="space-y-4 animate-in fade-in zoom-in duration-300 text-sm text-gray-400">
                      <p>Connect this agent to your Telegram Bot in 3 steps:</p>
                      <ol className="list-decimal list-inside space-y-2 text-gray-300">
                        <li>Talk to <span className="text-[#00f0ff]">@BotFather</span> and create a new bot to get a Token.</li>
                        <li>Set the webhook URL to your Flap Agent endpoint:</li>
                        <pre className="bg-[#111] border border-[#ffffff11] p-2 mt-2 rounded text-[10px] text-[#00ff41] font-mono block">
                          https://api.telegram.org/bot[TOKEN]/setWebhook?url=https://flapagent.sh/api/tg/{selectedAgent.id}
                        </pre>
                        <li className="pt-2">Send <code className="bg-[#111] px-1 rounded text-[#00f0ff]">/start</code> to your bot. The agent will reply automatically.</li>
                      </ol>
                    </div>
                  )}

                  {activeTab === 'x' && (
                    <div className="space-y-4 animate-in fade-in zoom-in duration-300 text-sm text-gray-400">
                      <p>Deploy this agent to auto-reply on X (Twitter):</p>
                      <ol className="list-decimal list-inside space-y-2 text-gray-300">
                        <li>Get your API keys from the <span className="text-[#00f0ff]">X Developer Portal</span>.</li>
                        <li>Input your keys into the Flap Agent Dashboard settings.</li>
                        <li>Define triggering rules (e.g. mention <code className="bg-[#111] px-1 rounded text-[#00f0ff]">@your_handle</code>):</li>
                        <div className="bg-[#111] border border-[#ffffff11] p-2 mt-2 rounded flex flex-col gap-2">
                          <input type="text" placeholder="Enter keywords or phrases..." className="bg-transparent border-b border-[#ffffff22] text-xs pb-1 focus:outline-none focus:border-[#00f0ff]" />
                        </div>
                      </ol>
                    </div>
                  )}

                  {activeTab === 'embed' && (
                    <div className="space-y-4 animate-in fade-in zoom-in duration-300 text-sm text-gray-400">
                      <p>Embed this agent as a chat widget directly on your website UI:</p>
                      <h4 className="text-[10px] text-[#ffaa00] uppercase tracking-widest font-bold mt-4 mb-2">HTML Snippet</h4>
                      <pre className="bg-[#111] border border-[#ffffff11] p-3 rounded text-[10px] text-[#ffaa00] font-mono overflow-x-auto whitespace-pre-wrap">
                        {`<script src="https://flapagent.sh/embed/v1.js"></script>\n<flap-agent-widget \n  agent-id="${selectedAgent.id}" \n  theme="dark" \n  position="bottom-right">\n</flap-agent-widget>`}
                      </pre>
                      <p className="text-xs">Just paste this snippet right before the closing <code className="text-[#ffaa00]">&lt;/body&gt;</code> tag of your website.</p>
                    </div>
                  )}
                </div>

                <button 
                  onClick={handleConfirmAction}
                  disabled={isProcessing}
                  className="w-full bg-[#00f0ff] text-black font-bold terminal-text py-3 rounded-xl hover:shadow-[0_0_20px_#00f0ff66] transition-all flex items-center justify-center gap-2"
                >
                   {isProcessing ? t("market.initializing") : <><Terminal size={16} /> {t("market.startTest")}</>}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Premium Agent Profile Details */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-[#050505] p-4 rounded-xl border border-[#ffffff11]">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold flex items-center gap-1 mb-2"><Cpu size={12}/> Model</span>
                    <span className="text-sm font-mono text-gray-300">Grok-4.1-Fast</span>
                  </div>
                  <div className="bg-[#050505] p-4 rounded-xl border border-[#ffffff11]">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold flex items-center gap-1 mb-2"><Code size={12}/> Architecture</span>
                    <span className="text-sm font-mono text-gray-300">Next.js Edge</span>
                  </div>
                </div>

                 <div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold block mb-2">{t("market.capabilities")}</span>
                    <div className="flex flex-wrap gap-2">
                     {['Real-time execution', 'On-chain Analytics', 'Autonomous Posting', 'Secure Memory'].map(skill => (
                       <span key={skill} className="px-2 py-1 bg-[#ff007f11] border border-[#ff007f33] rounded text-[10px] text-[#ff007f]">{skill}</span>
                     ))}
                   </div>
                </div>

                <div className="pt-4 border-t border-[#ffffff11]">
                   <div className="flex justify-between items-center mb-4">
                    <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">{t("market.totalCost")}</span>
                    <span className="text-2xl font-bold text-[#00ff41] terminal-text drop-shadow-[0_0_8px_#00ff41]">{selectedAgent.price === 'Free' || selectedAgent.price === 'free' ? t("market.free") : selectedAgent.price}</span>
                  </div>
                  <button 
                    onClick={handleConfirmAction}
                    disabled={isProcessing}
                    className="w-full btn-primary py-3 rounded-xl font-bold terminal-text hover:shadow-[0_0_20px_#ff007f66] transition-all flex items-center justify-center gap-2"
                  >
                    {isProcessing ? "AWAITING WALLET..." : <><ShoppingBag size={16} /> CONFIRM PURCHASE</>}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </main>
  );
}
