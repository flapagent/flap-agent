"use client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChatInterface } from "@/components/ChatInterface";
import { Terminal, Shield, Globe, Rocket, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { useState } from "react";
import { useLanguage } from "@/i18n";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, openAuthModal } = useAuth();
  const [activePage, setActivePage] = useState(1);
  const totalPages = 5;
  const { t } = useLanguage();

  const allModels = [
    { id: "image", title: t("home.model.image.title"), icon: "🎨", desc: t("home.model.image.desc"), color: "from-[#ff007f] to-[#ff007f44]" },
    { id: "video", title: t("home.model.video.title"), icon: "🎬", desc: t("home.model.video.desc"), color: "from-[#00ff41] to-[#00ff4144]" },
    { id: "voice", title: t("home.model.voice.title"), icon: "🎙️", desc: t("home.model.voice.desc"), color: "from-[#9d00ff] to-[#9d00ff44]" },
    { id: "music", title: t("home.model.music.title"), icon: "🎵", desc: t("home.model.music.desc"), color: "from-[#00f0ff] to-[#00f0ff44]" },
    { id: "char", title: t("home.model.char.title"), icon: "🧛", desc: t("home.model.char.desc"), color: "from-[#ffaa00] to-[#ffaa0044]" },
    { id: "3d", title: t("home.model.3d.title"), icon: "🧊", desc: t("home.model.3d.desc"), color: "from-[#ff3300] to-[#ff330044]" },
    { id: "dapp", title: t("home.model.dapp.title"), icon: "🌐", desc: t("home.model.dapp.desc"), color: "from-[#ffffff] to-[#ffffff44]" },
    { id: "code", title: t("home.model.code.title"), icon: "💻", desc: t("home.model.code.desc"), color: "from-[#00f0ff] to-[#00f0ff44]" },
    { id: "data", title: t("home.model.data.title"), icon: "📊", desc: t("home.model.data.desc"), color: "from-[#ff007f] to-[#ff007f44]" },
  ];

  const startIndex = ((activePage - 1) * 3) % allModels.length;
  // Ensure we always show 3 items, wrapping around if necessary
  const currentModels = [
    allModels[startIndex],
    allModels[(startIndex + 1) % allModels.length],
    allModels[(startIndex + 2) % allModels.length],
  ];

  return (
    <main className="min-h-screen pt-24 pb-12 flex flex-col items-center">
      <Navbar />
      
      {/* Hero Section */}
      <div className="text-center px-6 mb-16 relative">
        <motion.div 
          animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#ff007f11] blur-[120px] rounded-full -z-10" 
        />
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff007f22] border border-[#ff007f44] mb-6">
          <Zap size={14} className="text-[#ff007f]" />
          <span className="text-[10px] font-bold text-[#ff007f] tracking-[0.2em] uppercase">{t("home.hero.zap")}</span>
        </div>
        <h1 className="text-5xl md:text-8xl font-bold mb-6 tracking-tighter">
          {t("home.hero.title1")} <span className="pink-gradient-text">{t("home.hero.title2")}</span> <br />
          {t("home.hero.title3")} <span className="pink-gradient-text">{t("home.hero.title4")}</span>
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            className="inline-block ml-2 mb-1 md:mb-2 text-[#ff007f] font-normal"
          >
            _
          </motion.span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed mb-8">
          {t("home.hero.desc")}
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <button 
            onClick={() => isAuthenticated ? router.push('/chat') : openAuthModal()}
            className="btn-primary py-4 px-10 rounded-2xl text-sm flex items-center gap-2"
          >
            <Rocket size={18} /> {t("home.hero.start")}
          </button>
          <button 
            onClick={() => router.push('/market')}
            className="glass-morphism py-4 px-10 rounded-2xl text-sm border-[#ffffff11] hover:border-[#ff007f44] transition-all flex items-center gap-2 text-gray-300 hover:text-white"
          >
            <Globe size={18} /> {t("home.hero.market")}
          </button>
        </div>
      </div>

      {/* Hero Image / Avatar */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="w-full max-w-2xl px-6 mb-32"
      >
        <motion.div 
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent z-10" />
          <img 
            src="/hero_agent_avatar_1773475109161.png" 
            alt="Flap Agent Hero" 
            className="w-full h-auto rounded-3xl pink-glow-border group-hover:scale-[1.02] transition-transform duration-700"
          />
        </motion.div>
      </motion.div>

      {/* Chat Builder */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.8 }}
        className="w-full px-4 mb-32 relative"
      >
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#00ff4108] blur-[150px] rounded-full -z-10" 
        />
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold terminal-text mb-4 glow-text">{t("home.terminal.title")}</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">{t("home.terminal.desc")}</p>
        </div>
        <ChatInterface />
      </motion.section>

      {/* Multi-Modal Showcase */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto px-6 w-full mb-32"
      >
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-6xl font-bold terminal-text">{t("home.modals.title1")} <span className="text-white">{t("home.modals.title2")}</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">{t("home.modals.desc")}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 min-h-[250px]">
          {currentModels.map((mode, i) => (
            <motion.div 
              key={`${mode.id}-${activePage}`} // Force re-render on page change for animation
              onClick={() => isAuthenticated ? router.push('/chat') : openAuthModal()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="cursor-pointer glass-morphism rounded-2xl p-6 relative overflow-hidden group border-[#ffffff11]"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${mode.color} rounded-full blur-[50px] opacity-20 group-hover:opacity-60 transition-opacity duration-500`} />
              <div className="text-4xl mb-6 relative z-10">{mode.icon}</div>
              <h3 className="text-xl font-bold terminal-text mb-3 relative z-10 tracking-wide text-white">{mode.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed relative z-10">{mode.desc}</p>
              
              <div className="mt-8 pt-4 border-t border-[#ffffff11] flex items-center justify-between text-xs terminal-text text-[#ff007f] relative z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <span>{t("home.modals.init")}</span>
                <Zap size={12} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-center gap-2">
          <button 
            onClick={() => setActivePage((p: number) => Math.max(1, p - 1))}
            disabled={activePage === 1}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-[#ffffff11] text-gray-400 hover:bg-[#ff007f11] hover:text-[#ff007f] hover:border-[#ff007f55] disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          >
            <ChevronLeft size={18} />
          </button>
          
          {[1, 2, 3, 4, 5].map(pageNum => (
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
            onClick={() => setActivePage((p: number) => Math.min(totalPages, p + 1))}
            disabled={activePage === totalPages}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-[#ffffff11] text-gray-400 hover:bg-[#ff007f11] hover:text-[#ff007f] hover:border-[#ff007f55] disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </motion.section>

      {/* Features Showcase */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-32"
      >
        {[
          { icon: <Shield size={32} />, title: t("home.feat.secure.title"), desc: t("home.feat.secure.desc") },
          { icon: <Globe size={32} />, title: t("home.feat.deploy.title"), desc: t("home.feat.deploy.desc") },
          { icon: <Rocket size={32} />, title: t("home.feat.xai.title"), desc: t("home.feat.xai.desc") }
        ].map((f, i) => (
          <div key={i} className="glass-morphism p-8 rounded-2xl group hover:pink-glow-border transition-all">
            <div className="text-[#ff007f] mb-6 group-hover:scale-110 transition-transform duration-300">
              {f.icon}
            </div>
            <h3 className="text-xl font-bold mb-4 terminal-text">{f.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </motion.section>

      <Footer />
    </main>
  );
}
