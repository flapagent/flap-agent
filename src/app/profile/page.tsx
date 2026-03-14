"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { User, Mail, Settings, Shield, Award, Edit3, Save, Activity, LogIn, ShieldCheck, Key, Smartphone, Wallet } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth, supabase } from "@/components/AuthContext";
import { useLanguage } from "@/i18n";

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
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export default function ProfilePage() {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { t } = useLanguage();
  
  const [profile, setProfile] = useState({
    username: "flap_user",
    bio: "Building the next generation of AI agents. Web3 developer and automation fan.",
    interests: "AI, Blockchain, Neural Networks, Open Source",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Sync profile username with authenticated email if available
  // Also load saved profile from Supabase
  useEffect(() => {
    if (!user) return;

    const emailPrefix = user.email?.split('@')[0] || 'flap_user';
    setProfile(p => ({ ...p, username: `@${emailPrefix}` }));

    const loadProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('bio, interests, avatar_url')
        .eq('id', user.id)
        .single();

      if (data) {
        setProfile(p => ({
          ...p,
          bio: data.bio || p.bio,
          interests: data.interests || p.interests,
        }));
      }
    };

    loadProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    await supabase.from('profiles').upsert({
      id: user.id,
      username: profile.username,
      bio: profile.bio,
      interests: profile.interests,
      updated_at: new Date().toISOString(),
    });
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <main className="min-h-screen pt-24 pb-12 bg-[#050505] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ff007f08] blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#00ff4105] blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
      
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 relative"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff007f11] border border-[#ff007f33] mb-4">
            <Activity size={12} className="text-[#ff007f] animate-pulse" />
            <span className="text-[10px] font-bold text-[#ff007f] tracking-widest uppercase">{t("profile.badge")}</span>
          </div>
          <h1 className="text-4xl font-bold terminal-text pink-gradient-text mb-2">{t("profile.title")}</h1>
          <p className="text-gray-500">{t("profile.sub")}</p>
        </motion.header>

        {isAuthenticated ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10"
          >
            {/* Sidebar */}
            <motion.div variants={itemVariants} className="md:col-span-1 space-y-6">
              <div className="glass-morphism p-8 rounded-2xl border-[#ffffff11] flex flex-col items-center relative overflow-hidden group">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#ff007f33] blur-[40px] rounded-full group-hover:bg-[#ff007f55] transition-colors duration-500" />
                <div className="w-24 h-24 rounded-full pink-glow-border bg-[#1a1a1a] flex items-center justify-center mb-4 overflow-hidden relative z-10">
                  <User size={48} className="text-[#ff007f] group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h2 className="text-xl font-bold terminal-text mb-1">{profile.username}</h2>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-4">{t("profile.role")}</span>
                <button 
                  onClick={() => alert("Avatar upload modal opened.")}
                  className="text-xs text-[#ff007f] hover:underline flex items-center gap-1"
                >
                  <Edit3 size={12} /> {t("profile.changeAvatar")}
                </button>
              </div>

              <nav className="glass-morphism p-4 rounded-2xl border-[#ffffff11] flex flex-col gap-2">
                <button className="flex items-center gap-3 p-3 text-sm text-[#ff007f] bg-[#ff007f11] rounded-lg transition-all">
                  <User size={18} /> {t("profile.general")}
                </button>
                <button 
                  onClick={() => setShowAccountSettings(true)}
                  className="flex items-center gap-3 p-3 text-sm text-gray-400 hover:text-white hover:bg-[#ffffff05] rounded-lg transition-all"
                >
                  <Settings size={18} /> {t("profile.settings")}
                </button>
                <button 
                  onClick={() => setShowSecurity(true)}
                  className="flex items-center gap-3 p-3 text-sm text-gray-400 hover:text-white hover:bg-[#ffffff05] rounded-lg transition-all"
                >
                  <Shield size={18} /> {t("profile.security")}
                </button>
              </nav>
            </motion.div>

            {/* Main Content */}
            <motion.div variants={itemVariants} className="md:col-span-2 space-y-8">
              <div className="glass-morphism p-8 rounded-2xl border-[#ffffff11] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-[#ff007f44] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <h3 className="text-lg font-bold terminal-text mb-6">{t("profile.publicInfo")}</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{t("profile.username")}</label>
                    <input 
                      type="text" 
                      value={profile.username}
                      readOnly
                      className="w-full bg-[#101010] border border-[#ffffff11] rounded-lg px-4 py-3 text-sm text-gray-500 focus:outline-none cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{t("profile.bio")}</label>
                    <textarea 
                      rows={4}
                      value={profile.bio}
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                      className="w-full bg-[#101010] border border-[#ffffff11] rounded-lg px-4 py-3 text-sm font-mono text-gray-300 focus:outline-none focus:border-[#ff007f] transition-all custom-scrollbar"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{t("profile.interests")}</label>
                    <input 
                      type="text" 
                      value={profile.interests}
                      onChange={(e) => setProfile({...profile, interests: e.target.value})}
                      className="w-full bg-[#101010] border border-[#ffffff11] rounded-lg px-4 py-3 text-sm font-mono text-gray-300 focus:outline-none focus:border-[#ff007f] transition-all"
                      placeholder="e.g. AI, Crypto, Gaming"
                    />
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-[#ffffff11] mt-6">
                    <span className="text-xs text-gray-500 flex items-center gap-2"><Activity size={12} className="text-[#00ff41]" /> {t("profile.syncs")}</span>
                    <motion.button 
                      onClick={handleSave}
                      disabled={isSaving}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn-primary w-full md:w-auto flex items-center justify-center gap-2 hover:shadow-[0_0_20px_#ff007f55] transition-shadow bg-[#ff007f] text-black px-6 rounded-lg"
                    >
                      <Save size={16} />
                      {isSaving ? t("profile.saving") : t("profile.save")}
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                <motion.div whileHover={{ y: -5 }} className="glass-morphism p-6 rounded-2xl border-[#ffffff11] group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#ff007f08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Award size={12} className="text-[#ffaa00]" /> {t("profile.created")}
                  </span>
                  <span className="text-3xl font-bold terminal-text group-hover:text-[#ff007f] transition-colors relative z-10 text-white">3</span>
                </motion.div>
                <motion.div whileHover={{ y: -5 }} className="glass-morphism p-6 rounded-2xl border-[#ffffff11] group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00ff4108] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Activity size={12} className="text-[#00ff41]" /> {t("profile.revenue")}
                  </span>
                  <span className="text-3xl font-bold terminal-text group-hover:text-[#00ff41] transition-colors relative z-10 text-white">3.7 BNB</span>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : (
          <div className="flex justify-center items-center min-h-[50vh] relative z-10">
             <div className="glass-morphism rounded-2xl border-[#ffffff11] p-12 text-center flex flex-col items-center max-w-sm w-full">
              <div className="w-16 h-16 rounded-full bg-[#ffffff0a] flex items-center justify-center mb-6 border border-[#ffffff22]">
                <Shield size={24} className="text-gray-500" />
              </div>
              <h3 className="text-xl font-bold terminal-text mb-2 text-white">{t("profile.access.title")}</h3>
              <p className="text-gray-500 text-sm mb-6">{t("profile.access.sub")}</p>
              <button 
                onClick={openAuthModal} 
                className="w-full border border-[#00f0ff55] py-3 px-6 rounded-xl font-bold terminal-text text-sm text-[#00f0ff] hover:bg-[#00f0ff11] transition-colors flex items-center justify-center gap-2"
              >
                <LogIn size={16} /> {t("profile.access.login")}
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />

      {/* Account Settings Modal */}
      {showAccountSettings && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-[#ffffff11] rounded-2xl p-6 md:p-8 max-w-md w-full relative animate-in fade-in zoom-in duration-300">
            <button onClick={() => setShowAccountSettings(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">✕</button>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#00f0ff11] border border-[#00f0ff33] flex items-center justify-center">
                <Settings size={20} className="text-[#00f0ff]" />
              </div>
              <h2 className="text-xl font-bold terminal-text">{t("profile.acc.settings")}</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2 block">{t("profile.acc.wallet.title")}</label>
                <div className="flex justify-between items-center bg-[#111] border border-[#ffffff11] p-3 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Wallet size={16} className="text-[#ffaa00]" />
                    <span className="text-sm text-gray-300 font-mono">0x7F5...3b9A</span>
                  </div>
                  <button className="text-[10px] text-[#ff007f] uppercase tracking-widest font-bold border border-[#ff007f33] px-2 py-1 rounded hover:bg-[#ff007f11] transition-colors">{t("profile.acc.disconnect")}</button>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2 block">{t("profile.acc.2fa.title")}</label>
                <div className="flex justify-between items-center bg-[#111] border border-[#ffffff11] p-3 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Smartphone size={16} className="text-[#00f0ff]" />
                    <div>
                      <span className="text-sm text-gray-300 block">{t("profile.acc.app")}</span>
                      <span className="text-[10px] text-gray-500">{t("profile.acc.totp")}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                    className={`relative w-10 h-5 rounded-full transition-colors ${twoFactorEnabled ? 'bg-[#00ff41]' : 'bg-[#333]'}`}
                  >
                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
              
              <div className="pt-4 border-t border-[#ffffff11]">
                <button className="w-full bg-[#111] hover:bg-[#ff000011] text-red-500 hover:text-red-400 border border-[#ffffff11] hover:border-[#ff000033] py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors mb-2">{t("profile.acc.delete.btn")}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Modal */}
      {showSecurity && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-[#ff007f33] rounded-2xl p-6 md:p-8 max-w-md w-full relative animate-in fade-in zoom-in duration-300 shadow-[0_0_30px_#ff007f11]">
            <button onClick={() => setShowSecurity(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">✕</button>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#ff007f11] border border-[#ff007f33] flex items-center justify-center">
                <ShieldCheck size={20} className="text-[#ff007f]" />
              </div>
              <h2 className="text-xl font-bold terminal-text">{t("profile.sec.title")}</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-[10px] text-[#ff007f] uppercase tracking-widest font-bold mb-2 block flex items-center gap-1"><Key size={12}/> {t("profile.sec.pass.change")}</label>
                <div className="space-y-3">
                  <input type="password" placeholder={t("profile.sec.pass.current")} className="w-full bg-[#111] border border-[#ffffff11] focus:border-[#ff007f] rounded-lg p-3 text-sm text-white focus:outline-none" />
                  <input type="password" placeholder={t("profile.sec.pass.new")} className="w-full bg-[#111] border border-[#ffffff11] focus:border-[#ff007f] rounded-lg p-3 text-sm text-white focus:outline-none" />
                  <button className="w-full bg-[#ff007f] text-black font-bold py-2.5 rounded-lg text-xs uppercase tracking-widest hover:shadow-[0_0_15px_#ff007f66] transition-shadow">{t("profile.sec.pass.update")}</button>
                </div>
              </div>

              <div className="pt-4 border-t border-[#ffffff11]">
                <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2 block">{t("profile.sec.recent")}</label>
                <div className="bg-[#111] border border-[#ffffff11] rounded-xl overflow-hidden text-xs">
                  <div className="p-3 border-b border-[#ffffff11] flex justify-between items-center">
                    <div>
                      <span className="text-gray-300 block font-bold">Windows • Chrome</span>
                      <span className="text-[10px] text-gray-500 mt-0.5 block">Jakarta, ID • IP: 103.xxx</span>
                    </div>
                    <span className="text-[#00ff41] bg-[#00ff4111] px-2 py-1 rounded-full text-[9px] uppercase tracking-widest font-bold">{t("profile.sec.active")}</span>
                  </div>
                  <div className="p-3 flex justify-between items-center opacity-60">
                    <div>
                      <span className="text-gray-300 block">iOS • Safari</span>
                      <span className="text-[10px] text-gray-500 mt-0.5 block">Yesterday, 14:02 PM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
