"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Book, Code, Rocket, Shield, Key, Terminal, Eye, Target, Coins, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/i18n";




export default function DocsPage() {
  const [activeId, setActiveId] = useState("vision-mission");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  const DOCS_CONTENT = [
    {
      category: "Introduction",
      items: [
        {
          id: "vision-mission",
          title: t("docs.vision"),
          icon: <Eye size={18} />,
          content: (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold terminal-text text-[#ff007f]">{t("docs.vision.h1")}</h2>
              <p className="text-gray-400 leading-relaxed text-lg font-light">
                {t("docs.vision.p1")}
              </p>
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div className="glass-morphism p-6 rounded-2xl border-[#ff007f44]">
                  <div className="text-[#ff007f] mb-4"><Eye size={32} /></div>
                  <h3 className="text-xl font-bold terminal-text mb-3">{t("docs.vision.vTitle")}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {t("docs.vision.vDesc")}
                  </p>
                </div>
                <div className="glass-morphism p-6 rounded-2xl border-[#00ff4144]">
                  <div className="text-[#00ff41] mb-4"><Target size={32} /></div>
                  <h3 className="text-xl font-bold terminal-text mb-3">{t("docs.vision.mTitle")}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {t("docs.vision.mDesc")}
                  </p>
                </div>
              </div>
            </div>
          )
        },
        {
          id: "key-features",
          title: t("docs.features"),
          icon: <Shield size={18} />,
          content: (
            <div className="space-y-6 flex flex-col gap-4">
              <h2 className="text-3xl font-bold terminal-text text-[#ff007f]">{t("docs.features.h1")}</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                {t("docs.features.p1")}
              </p>
              
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white terminal-text">🧠 {t("docs.features.core")}</h3>
                <ul className="text-gray-400 space-y-3 list-disc pl-5">
                  <li>{t("docs.features.core1")}</li>
                  <li>{t("docs.features.core2")}</li>
                  <li>{t("docs.features.core3")}</li>
                </ul>
              </div>
  
              <div className="space-y-4 mt-6">
                <h3 className="text-xl font-bold text-white terminal-text">🎨 {t("docs.features.modal")}</h3>
                <ul className="text-gray-400 space-y-3 list-disc pl-5">
                  <li>{t("docs.features.modal1")}</li>
                  <li>{t("docs.features.modal2")}</li>
                </ul>
              </div>
              
              <div className="space-y-4 mt-6">
                <h3 className="text-xl font-bold text-white terminal-text">🔍 {t("docs.features.web3")}</h3>
                <ul className="text-gray-400 space-y-3 list-disc pl-5">
                  <li>{t("docs.features.web31")}</li>
                  <li>{t("docs.features.web32")}</li>
                </ul>
              </div>
            </div>
          )
        },
        {
          id: "tokenomics",
          title: t("docs.token"),
          icon: <Coins size={18} />,
          content: (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold terminal-text text-[#ff007f]">{t("docs.token.h1")}</h2>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffaa0022] border border-[#ffaa00] text-[#ffaa00] text-xs font-bold uppercase tracking-widest mb-4">
                {t("docs.token.badge")}
              </div>
              <p className="text-gray-400 leading-relaxed">
                {t("docs.token.p1")} <a href="https://flap.sh" className="text-[#ff007f] hover:underline" target="_blank" rel="noreferrer">flap.sh</a>.
              </p>
              
              <div className="mt-8 glass-morphism rounded-2xl overflow-hidden border-[#ffffff11]">
                 <div className="bg-[#101010] p-4 border-b border-[#ffffff11]"><h3 className="text-sm font-bold terminal-text">{t("docs.token.mech")}</h3></div>
                 <ul className="p-6 space-y-4 text-sm text-gray-400">
                   <li className="flex items-start gap-3">
                     <div className="w-1.5 h-1.5 rounded-full bg-[#ff007f] mt-1.5" />
                     <div>{t("docs.token.mech1")}</div>
                   </li>
                   <li className="flex items-start gap-3">
                     <div className="w-1.5 h-1.5 rounded-full bg-[#ff007f] mt-1.5" />
                     <div>{t("docs.token.mech2")}</div>
                   </li>
                   <li className="flex items-start gap-3">
                     <div className="w-1.5 h-1.5 rounded-full bg-[#ff007f] mt-1.5" />
                     <div>{t("docs.token.mech3")}</div>
                   </li>
                 </ul>
              </div>
            </div>
          )
        }
      ]
    },
    {
      category: "Technical Guide",
      items: [
        {
          id: "architecture",
          title: t("docs.arch"),
          icon: <Book size={18} />,
          content: (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold terminal-text text-[#ff007f]">{t("docs.arch.h1")}</h2>
              <p className="text-gray-400 leading-relaxed">
                {t("docs.arch.p1")}
              </p>
              
              <h3 className="text-xl font-bold text-white terminal-text mt-8">{t("docs.arch.core")}</h3>
              <ul className="text-gray-400 space-y-2 list-disc pl-5">
                <li>{t("docs.arch.core1")}</li>
                <li>{t("docs.arch.core2")}</li>
                <li>{t("docs.arch.core3")}</li>
                <li>{t("docs.arch.core4")}</li>
                <li>{t("docs.arch.core5")}</li>
              </ul>
  
              <h3 className="text-xl font-bold text-white terminal-text mt-8 mb-4">{t("docs.arch.struct")}</h3>
              <div className="bg-[#111] p-6 rounded-xl border border-[#ffffff11] font-mono text-sm text-gray-300 overflow-x-auto">
                ├── src/<br/>
                │&nbsp;&nbsp;&nbsp;├── app/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-gray-500">// Next.js App Router</span><br/>
                │&nbsp;&nbsp;&nbsp;├── components/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-gray-500">// Reusable UI</span><br/>
                │&nbsp;&nbsp;&nbsp;└── lib/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-gray-500">// Utilities</span><br/>
                ├── public/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-gray-500">// Static assets</span><br/>
                ├── tailwind.config.ts&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-gray-500">// Custom theme</span><br/>
                └── README.md
              </div>
            </div>
          )
        },
        {
          id: "getting-started",
          title: t("docs.setup"),
          icon: <Rocket size={18} />,
          content: (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold terminal-text text-[#ff007f]">{t("docs.setup.h1")}</h2>
              <p className="text-gray-400 leading-relaxed mb-6">
                {t("docs.setup.p1")}
              </p>
              
              <h3 className="text-lg font-bold text-white mb-2">{t("docs.setup.pre")}</h3>
              <ul className="text-gray-400 list-disc pl-5 mb-6">
                <li>Node.js 20+</li>
                <li>Supabase Account</li>
                <li>OpenAI API Key</li>
              </ul>
  
              <h3 className="text-lg font-bold text-white mb-2">{t("docs.setup.ins")}</h3>
              <div className="bg-black p-4 rounded-xl border border-[#ffffff11] font-mono text-sm text-[#00ff41] mb-6">
                git clone https://github.com/flapagent/flap-agent.git<br/>
                cd flap-agent<br/>
                npm install
              </div>
  
              <h3 className="text-lg font-bold text-white mb-2">{t("docs.setup.env")}</h3>
              <p className="text-gray-400 mb-2">Create a <code>.env.local</code> file in your root directory:</p>
              <div className="bg-black p-4 rounded-xl border border-[#ffffff11] font-mono text-sm text-[#00ff41] mb-6">
                OPENAI_API_KEY=your_key<br/>
                XAI_API_KEY=your_key<br/>
                NEXT_PUBLIC_SUPABASE_URL=your_url<br/>
                NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
              </div>
  
              <h3 className="text-lg font-bold text-white mb-2">{t("docs.setup.run")}</h3>
              <div className="bg-black p-4 rounded-xl border border-[#ffffff11] font-mono text-sm text-[#00ff41]">
                npm run dev
              </div>
            </div>
          )
        },
        {
          id: "agent-flow",
          title: t("docs.flow"),
          icon: <Terminal size={18} />,
          content: (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold terminal-text text-[#ff007f]">{t("docs.flow.h1")}</h2>
              <p className="text-gray-400 leading-relaxed">
                {t("docs.flow.p1")}
              </p>
              <p className="text-gray-400 leading-relaxed">
                {t("docs.flow.p2")}
              </p>
            </div>
          )
        },
        {
          id: "api-keys",
          title: t("docs.api"),
          icon: <Key size={18} />,
          content: (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold terminal-text text-[#ff007f]">{t("docs.api.h1")}</h2>
              <p className="text-gray-400 leading-relaxed">
                {t("docs.api.p1")}
              </p>
              <div className="bg-black p-6 rounded-xl border border-[#ffffff11] font-mono text-sm overflow-x-auto">
                <span className="text-[#ff007f]">POST</span> <span className="text-white">https://api.flapagent.sh/v1/chat/</span><span className="text-[#00ff41]">[AGENT_ID]</span>
                <br /><br />
                <span className="text-gray-500">// {t("docs.api.headers")}</span><br />
                Authorization: Bearer <span className="text-[#00ff41]">flp_live_xxx</span><br /><br />
                <span className="text-gray-500">// {t("docs.api.body")}</span><br />
                {`{ "prompt": "Analyze market data...", "stream": true }`}
              </div>
              
              <p className="text-gray-500 text-sm mt-4 italic">
                {t("docs.api.warning")}
              </p>
            </div>
          )
        },
        {
          id: "cli-tools",
          title: t("docs.cli"),
          icon: <Code size={18} />,
          content: (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold terminal-text text-[#ff007f]">{t("docs.cli.h1")}</h2>
              <p className="text-gray-400 leading-relaxed">
                {t("docs.cli.p1")}
              </p>
              <div className="space-y-4">
                <div className="bg-[#111] p-4 rounded-lg border border-[#ffffff0d]">
                  <div className="text-[10px] text-gray-500 mb-2 uppercase tracking-widest font-bold">{t("docs.cli.ins")}</div>
                  <code className="text-sm text-[#00ff41]">npm install -g @flapagent/cli</code>
                </div>
                <div className="bg-[#111] p-4 rounded-lg border border-[#ffffff0d]">
                  <div className="text-[10px] text-gray-500 mb-2 uppercase tracking-widest font-bold">{t("docs.cli.use")}</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-white min-w-[120px]">flap login</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-white min-w-[120px]">flap agents list</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-white min-w-[120px]">flap deploy [path]</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        },
        {
          id: "advanced-int",
          title: t("docs.sdk"),
          icon: <Rocket size={18} />,
          content: (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold terminal-text text-[#ff007f]">{t("docs.sdk.h1")}</h2>
              <p className="text-gray-400 leading-relaxed">
                {t("docs.sdk.p1")}
              </p>
              <div className="space-y-4">
                <div className="bg-[#111] p-4 rounded-lg border border-[#ffffff0d]">
                  <div className="text-[10px] text-gray-500 mb-2 uppercase tracking-widest font-bold">{t("docs.sdk.ins")}</div>
                  <code className="text-sm text-[#00f0ff]">npm install @flapagent/sdk</code>
                </div>
                <div className="bg-[#111] p-4 rounded-lg border border-[#ffffff0d]">
                  <div className="text-[10px] text-gray-500 mb-2 uppercase tracking-widest font-bold">{t("docs.sdk.usage")}</div>
                  <pre className="text-xs text-gray-400 font-mono mt-2 overflow-x-auto">
  {`import { FlapClient } from '@flapagent/sdk';
  
  const sdk = new FlapClient({
    apiKey: process.env.FLAP_API_KEY
  });
  
  // Chat with agent
  const response = await sdk.chat({
    agentId: 'agent_id',
    message: 'Hello'
  });`}
                  </pre>
                </div>
              </div>
            </div>
          )
        }
      ]
    }
  ];

  const activeContent = DOCS_CONTENT.flatMap(c => c.items).find(i => i.id === activeId)?.content;

  return (
    <main className="min-h-screen bg-[#050505] flex flex-col">
      <Navbar />
      
      <div className="flex-1 max-w-[1600px] w-full mx-auto flex pt-20">
        
        {/* Mobile Sidebar Toggle (Top Left) */}
        <div className="lg:hidden fixed top-20 left-4 z-50">
          <button 
            className="p-2 rounded-lg bg-[#111] border border-[#ffffff11] text-gray-400 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* GitBook Style Sidebar */}
        <aside className={`
          fixed lg:sticky top-20 left-0 h-[calc(100vh-80px)] w-72 
          border-r border-[#ffffff11] bg-[#080808] z-40
          transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          overflow-y-auto custom-scrollbar
        `}>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-8 pb-4 border-b border-[#ffffff11]">
              <Book className="text-[#ff007f]" size={20} />
              <span className="font-bold terminal-text tracking-widest text-[#e0e0e0]">{t("docs.title")}</span>
            </div>

            <nav className="space-y-8">
              {DOCS_CONTENT.map((section) => (
                <div key={section.category}>
                  <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 px-2">
                    {section.category === 'Introduction' ? t("docs.catIntro") : t("docs.catTech")}
                  </h4>
                  <ul className="space-y-1">
                    {section.items.map((item) => {
                      const titleKeys: Record<string, string> = {
                        'vision-mission': 'docs.vision',
                        'key-features': 'docs.features',
                        'tokenomics': 'docs.token',
                        'architecture': 'docs.arch',
                        'getting-started': 'docs.setup',
                        'agent-flow': 'docs.flow',
                        'api-keys': 'docs.api',
                        'cli-tools': 'docs.cli',
                        'advanced-int': 'docs.sdk',
                      };
                      return (
                      <li key={item.id}>
                        <button
                          onClick={() => {
                            setActiveId(item.id);
                            setIsMobileMenuOpen(false);
                          }}
                          className={`
                            w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all text-left
                            ${activeId === item.id 
                              ? "bg-[#ff007f11] text-[#ff007f] font-medium" 
                              : "text-gray-400 hover:bg-[#ffffff05] hover:text-white"
                            }
                          `}
                        >
                          <span className={`${activeId === item.id ? "opacity-100" : "opacity-50"}`}>
                            {item.icon}
                          </span>
                          {item.title}
                        </button>
                      </li>
                    )})}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <div className="flex-1 w-full max-w-4xl mx-auto px-6 lg:px-12 py-16 lg:py-20 mt-8 lg:mt-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="prose prose-invert max-w-none"
            >
              {activeContent}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

    </main>
  );
}
