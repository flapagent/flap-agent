"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Layers, Settings, Play, Save, ChevronRight, Activity, Plus, MessageSquare, Send } from "lucide-react";
import { useState, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { useLanguage } from "@/i18n";

export default function AgentFlowPage() {
  const { t } = useLanguage();
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSidebarTab, setActiveSidebarTab] = useState<'properties' | 'emulator'>('properties');
  const [emulatorInput, setEmulatorInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', content: t("flow.compiled") }
  ]);

  const [nodes, setNodes] = useState([
    { id: 1, type: "Trigger", title: "User Input", desc: "Listens for specific prompt keywords" },
    { id: 2, type: "Logic", title: "Sentiment Filter", desc: "Analyzes intent and sentiment" },
    { id: 3, type: "Model", title: "GPT-4O Core", desc: "Generates appropriate response" },
    { id: 4, type: "Action", title: "Telegram Post", desc: "Forwards response to Telegram group" },
  ]);

  return (
    <main className="min-h-screen flex flex-col bg-[#050505] overflow-hidden">
      <div className="shrink-0 pt-24">
        <Navbar />
      </div>

      <div className="flex-1 w-full max-w-[1900px] mx-auto px-4 md:px-6 flex flex-col my-6 min-h-[600px]">
        <header className="mb-6 flex justify-between items-center shrink-0">
          <div>
            <h1 className="text-2xl font-bold terminal-text pink-gradient-text uppercase">{t("flow.builder")}</h1>
            <p className="text-xs text-gray-500 uppercase tracking-widest">{t("flow.designing")}: Market Scanner v2.0</p>
          </div>
          <div className="flex gap-3">
            <button className="p-2 glass-morphism rounded-lg hover:text-[#ff007f] transition-all">
              <Settings size={18} />
            </button>
            <button className="btn-primary py-2 px-6 rounded-lg flex items-center gap-2 text-sm">
              <Play size={16} /> {t("flow.testFlow")}
            </button>
            <button className="bg-[#1a1a1a] border border-[#ffffff11] py-2 px-6 rounded-lg flex items-center gap-2 text-sm hover:border-[#ff007f] transition-all">
              <Save size={16} /> {t("flow.saveBtn")}
            </button>
          </div>
        </header>

        <div className="flex-1 flex gap-4 md:gap-6 min-h-0 relative">
          {/* Node Library (Hidden on Mobile, but exists on desktop) */}
          <aside className="w-64 glass-morphism rounded-2xl border-[#ffffff11] p-6 hidden lg:block shrink-0 overflow-y-auto">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6">{t("flow.library")}</h3>
            <div className="space-y-4">
              {[
                { key: "flow.cat.inputs", label: t("flow.cat.inputs") },
                { key: "flow.cat.intel", label: t("flow.cat.intel") },
                { key: "flow.cat.actions", label: t("flow.cat.actions") },
                { key: "flow.cat.storage", label: t("flow.cat.storage") },
                { key: "flow.cat.integrations", label: t("flow.cat.integrations") }
              ].map((cat) => (
                <div key={cat.key}>
                  <span className="text-[10px] text-gray-700 font-bold mb-2 block">{cat.label}</span>
                  <div className="space-y-2">
                    <div className="p-3 bg-black rounded-lg border border-[#ffffff11] text-xs hover:border-[#ff007f] cursor-pointer flex justify-between items-center group">
                      <span>{t("flow.addVar")}</span>
                      <Plus size={14} className="text-[#ff007f] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="p-3 bg-black rounded-lg border border-[#ffffff11] text-xs hover:border-[#ff007f] cursor-pointer flex justify-between items-center group">
                      <span>{t("flow.apiRequest")}</span>
                      <Plus size={14} className="text-[#ff007f] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Canvas */}
          <section
            ref={containerRef}
            className="flex-1 glass-morphism rounded-2xl border-[#ff007f22] bg-[#080808] relative overflow-hidden cursor-grab active:cursor-grabbing"
          >
            {/* Grid Pattern */}
            <div 
              className="absolute inset-0 opacity-[0.05] pointer-events-none" 
              style={{ 
                backgroundImage: 'radial-gradient(#ff007f 1.5px, transparent 0)', 
                backgroundSize: `${40 * zoom}px ${40 * zoom}px`,
                backgroundPosition: `${pan.x}px ${pan.y}px`
              }} 
            />
            
            {/* Canvas Draggable Area */}
            <motion.div 
              drag 
              dragConstraints={{ left: -3000, right: 3000, top: -3000, bottom: 3000 }}
              dragElastic={0}
              dragMomentum={false}
              onDrag={(e, info) => {
                setPan({ x: pan.x + info.delta.x, y: pan.y + info.delta.y });
              }}
              className="absolute inset-0 origin-top-left"
              style={{ scale: zoom, touchAction: "none" }}
            >
              <div className="absolute top-0 left-0 w-[4000px] h-[3000px]" />
              
              {/* SVG Connecting Cables */}
              <svg className="absolute top-0 left-0 w-[4000px] h-[3000px] pointer-events-none" style={{ zIndex: 0 }}>
                <defs>
                  <linearGradient id="glowPulse" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ff007f" stopOpacity="0.2" />
                    <stop offset="50%" stopColor="#ff007f" stopOpacity="1" />
                    <stop offset="100%" stopColor="#ff007f" stopOpacity="0.2" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                  <filter id="strongGlow">
                    <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                {nodes.map((_, i) => {
                  if (i === nodes.length - 1) return null;
                  const spacingX = 350;
                  const startX = 50 + (i * spacingX) + 240; // x + node width
                  const endX = 50 + ((i + 1) * spacingX);
                  const y = 200; // Fixed horizontal alignment
                  const midX = (startX + endX) / 2;
                  
                  return (
                    <g key={`connection-${i}`}>
                      {/* Static subtle dashed line background */}
                      <path 
                        d={`M ${startX} ${y} C ${midX} ${y}, ${midX} ${y}, ${endX} ${y}`}
                        stroke="#ffffff11" 
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        fill="none" 
                      />
                      {/* Flowing energy line */}
                      <motion.path
                        d={`M ${startX} ${y} C ${midX} ${y}, ${midX} ${y}, ${endX} ${y}`}
                        stroke="#ff007f"
                        strokeWidth="3"
                        fill="none"
                        filter="url(#glow)"
                        strokeDasharray="50 150"
                        initial={{ strokeDashoffset: 200 }}
                        animate={{ strokeDashoffset: 0 }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                      />
                      {/* Power Particle */}
                      <motion.circle
                        r="3"
                        fill="#ffffff"
                        filter="url(#strongGlow)"
                      >
                        <animateMotion 
                          dur="1.2s" 
                          repeatCount="indefinite"
                          path={`M ${startX} ${y} C ${midX} ${y}, ${midX} ${y}, ${endX} ${y}`}
                        />
                      </motion.circle>
                    </g>
                  );
                })}
              </svg>

              {/* Nodes */}
              {nodes.map((node, i) => (
                <motion.div 
                  key={node.id} 
                  className="absolute w-[240px] glass-morphism p-0 rounded-2xl border border-[#ffffff11] pink-glow-border cursor-grab active:cursor-grabbing hover:border-[#ff007f66] group shadow-[0_8px_30px_#00000088] transition-colors bg-[#080808] z-10 overflow-hidden"
                  style={{ left: `${50 + i * 350}px`, top: '120px' }}
                  whileHover={{ y: -5, boxShadow: "0 10px 40px #ff007f33" }}
                >
                  <div className="h-1 bg-gradient-to-r from-[#ff007f] to-[#ffaa00] w-full" />
                  
                  <div className="p-5">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded bg-[#ff007f11] flex items-center justify-center border border-[#ff007f33]">
                          <Activity size={12} className="text-[#ff007f]" />
                        </span>
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{node.type}</span>
                      </div>
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00ff41] shadow-[0_0_8px_#00ff41] animate-pulse" />
                    </div>
                    
                    <h4 className="font-bold text-sm mb-2 text-white group-hover:text-[#ff007f] transition-colors">{node.title}</h4>
                    <p className="text-[10px] text-gray-500 leading-relaxed min-h-[30px] border-l-2 border-[#ffffff11] pl-2">{node.desc}</p>
                  </div>
                  
                  <div className="bg-[#111] px-5 py-2 border-t border-[#ffffff0a] flex items-center justify-between text-[9px] text-gray-600 terminal-text">
                    <span>{t("flow.status.active")}</span>
                    <span>{Date.now() % 1000}ms</span>
                  </div>
                  
                  {/* Connection Dots */}
                  {i !== 0 && (
                    <div className="absolute top-[80px] -left-1.5 w-3 h-3 rounded-full bg-[#080808] border-2 border-[#ff007f] shadow-[0_0_10px_#ff007f] group-hover:scale-125 transition-transform" />
                  )}
                  {i !== nodes.length - 1 && (
                    <div className="absolute top-[80px] -right-1.5 w-3 h-3 rounded-full bg-[#080808] border-2 border-[#ff007f] shadow-[0_0_10px_#ff007f] group-hover:scale-125 transition-transform" />
                  )}
                </motion.div>
              ))}
            </motion.div>

            {/* Zoom Controls */}
            <div className="absolute bottom-6 right-6 flex gap-2 z-20">
              <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="w-8 h-8 glass-morphism rounded flex items-center justify-center hover:text-[#ff007f] hover:bg-[#ff007f11] font-bold">+</button>
              <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="w-8 h-8 glass-morphism rounded flex items-center justify-center hover:text-[#ff007f] hover:bg-[#ff007f11] font-bold">-</button>
            </div>
          </section>

          {/* Properties Panel (Hidden on Mobile) */}
          <aside className="w-80 glass-morphism rounded-2xl border-[#ffffff11] p-0 hidden xl:flex flex-col shrink-0 overflow-hidden">
            <div className="flex border-b border-[#ffffff11] bg-[#050505] shrink-0">
              <button 
                onClick={() => setActiveSidebarTab('properties')}
                className={`flex-1 py-4 text-[10px] font-bold uppercase tracking-widest flex justify-center items-center gap-2 transition-colors ${activeSidebarTab === 'properties' ? 'text-[#ffaa00] border-b-2 border-[#ffaa00] bg-[#ffaa0011]' : 'text-gray-500 hover:text-gray-300'}`}
              >
                <Layers size={14} /> {t("flow.properties")}
              </button>
              <button 
                onClick={() => setActiveSidebarTab('emulator')}
                className={`flex-1 py-4 text-[10px] font-bold uppercase tracking-widest flex justify-center items-center gap-2 transition-colors ${activeSidebarTab === 'emulator' ? 'text-[#00f0ff] border-b-2 border-[#00f0ff] bg-[#00f0ff11]' : 'text-gray-500 hover:text-gray-300'}`}
              >
                <MessageSquare size={14} /> {t("flow.emulator.tab")}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {activeSidebarTab === 'properties' ? (
                <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                  <div className="p-4 bg-[#ff007f08] rounded-xl border border-[#ff007f22]">
                    <h4 className="text-xs font-bold mb-4 flex items-center gap-2">
                      <Settings size={14} className="text-[#ff007f]" /> {t("flow.globalSettings")}
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] text-gray-600 block mb-1">{t("flow.modelVersion")}</label>
                        <select className="w-full bg-black border border-[#ffffff11] rounded p-2 text-xs focus:outline-none">
                          <option>Grok-4.1-Fast</option>
                          <option>GPT-4o (Stable)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-600 block mb-1">{t("flow.temp")}</label>
                        <input type="range" className="w-full accent-[#ff007f]" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col animate-in fade-in zoom-in duration-300">
                  <div className="flex-1 space-y-4 mb-4">
                    {chatHistory.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`text-xs p-3 rounded-xl max-w-[85%] leading-relaxed ${msg.role === 'user' ? 'bg-[#00f0ff22] text-[#00f0ff] border border-[#00f0ff44]' : 'bg-[#111] text-gray-300 border border-[#ffffff11]'}`}>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                  </div>
                  <form 
                    className="relative shrink-0"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if(!emulatorInput.trim()) return;
                      setChatHistory([...chatHistory, {role: 'user', content: emulatorInput}, {role: 'ai', content: 'Testing node connection... (Emulator Mock)'}]);
                      setEmulatorInput("");
                    }}
                  >
                    <input 
                      type="text" 
                      value={emulatorInput}
                      onChange={(e) => setEmulatorInput(e.target.value)}
                      placeholder={t("flow.testPlaceholder")}
                      className="w-full bg-black border border-[#ffffff22] rounded-lg py-3 pl-3 pr-10 text-xs text-white focus:outline-none focus:border-[#00f0ff]" 
                    />
                    <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-[#00f0ff] hover:text-white transition-colors">
                      <Send size={14} />
                    </button>
                  </form>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      <div className="shrink-0">
        <Footer />
      </div>
    </main>
  );
}
