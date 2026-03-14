"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Plus, MoreVertical, ExternalLink, Rocket, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth, supabase } from "@/components/AuthContext";
import { useLanguage } from "@/i18n";

export default function MyAgentsPage() {
  const { isAuthenticated, user, openAuthModal } = useAuth();
  const { t } = useLanguage();
  const [agents, setAgents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setAgents([]);
      setIsLoading(false);
      return;
    }

    const fetchAgents = async () => {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });
        
      if (!error && data) {
        setAgents(data);
      }
      setIsLoading(false);
    };

    fetchAgents();
  }, [isAuthenticated, user]);

  return (
    <main className="min-h-screen pt-24 pb-12 bg-[#050505]">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold terminal-text pink-gradient-text mb-4">{t("myAgents.title")}</h1>
            <p className="text-gray-400">{t("myAgents.sub")}</p>
          </div>
          <button 
            onClick={() => isAuthenticated ? window.location.href = '/console' : openAuthModal()}
            className="btn-primary py-3 px-8 rounded-xl flex items-center gap-2"
          >
            <Plus size={20} /> {t("myAgents.create")}
          </button>
        </header>

        {/* Stats Summary */}
        {isAuthenticated && agents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              { label: t("myAgents.stat.total"), value: agents.length.toString() },
              { label: t("myAgents.stat.calls"), value: "4.9k" },
              { label: t("myAgents.stat.revenue"), value: "3.7 BNB" },
              { label: t("myAgents.stat.model"), value: "Grok-4.1" },
            ].map((stat, i) => (
              <div key={i} className="glass-morphism p-6 rounded-2xl border-[#ffffff11]">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-2">{stat.label}</span>
                <span className="text-2xl font-bold terminal-text">{stat.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* List View or Empty State */}
        {!isAuthenticated ? (
          <div className="glass-morphism rounded-2xl border-[#ffffff11] p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-16 h-16 rounded-full bg-[#ff007f11] flex items-center justify-center mb-6 border border-[#ff007f33]">
              <Shield size={24} className="text-[#ff007f]" />
            </div>
            <h3 className="text-xl font-bold terminal-text mb-2">{t("myAgents.auth.title")}</h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-6">{t("myAgents.auth.sub")}</p>
            <button onClick={openAuthModal} className="btn-primary py-2 px-6 rounded-lg font-bold terminal-text text-sm">
              {t("myAgents.login")}
            </button>
          </div>
        ) : isLoading ? (
          <div className="glass-morphism rounded-2xl border-[#ffffff11] p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-16 h-16 rounded-full bg-[#ffffff0a] flex items-center justify-center mb-6 border border-[#ffffff11]">
              <div className="w-6 h-6 border-2 border-[#ff007f] border-t-transparent rounded-full animate-spin" />
            </div>
            <h3 className="text-xl font-bold terminal-text mb-2 text-white">{t("myAgents.syncing")}</h3>
          </div>
        ) : agents.length === 0 ? (
          <div className="glass-morphism rounded-2xl border-[#ffffff11] p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-16 h-16 rounded-full bg-[#ffffff0a] flex items-center justify-center mb-6 border border-[#ffffff11]">
              <Rocket size={24} className="text-gray-500" />
            </div>
            <h3 className="text-xl font-bold terminal-text mb-2 text-white">{t("myAgents.empty.title")}</h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-6">{t("myAgents.empty.sub")}</p>
            <button onClick={() => window.location.href = '/console'} className="border border-[#00f0ff55] text-[#00f0ff] hover:bg-[#00f0ff11] py-2 px-6 rounded-lg font-bold terminal-text text-sm transition-colors">
              {t("myAgents.goto")}
            </button>
          </div>
        ) : (
          <div className="glass-morphism rounded-2xl border-[#ffffff11] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#ffffff11] bg-[#ffffff02]">
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t("myAgents.col.name")}</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t("myAgents.col.status")}</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t("myAgents.col.calls")}</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t("myAgents.col.revenue")}</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t("myAgents.col.update")}</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {agents.map((agent) => (
                    <tr key={agent.id} className="border-b border-[#ffffff05] hover:bg-[#ffffff02] transition-colors group">
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#ffffff11] bg-[#111] shrink-0">
                             <img src={agent.avatar_url || "/dev.png"} alt={agent.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <span className="font-bold text-sm tracking-wide text-white group-hover:text-[#ff007f] transition-colors">{agent.name}</span>
                            <span className="text-[10px] text-gray-500 block mt-0.5">{agent.model_type || "Custom Model"} • {agent.config_json?.type || "Custom"}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className="text-[10px] px-2 py-1 rounded uppercase font-bold border border-[#00ff4133] bg-[#00ff4111] text-[#00ff41]">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00ff41] mr-1.5 animate-pulse" />
                          {t("myAgents.status.active")}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-sm text-gray-400 font-mono">0</td>
                      <td className="px-6 py-6 text-sm text-[#ffaa00] font-mono">0 BNB</td>
                      <td className="px-6 py-6 text-sm text-gray-500">
                        {new Date(agent.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-6 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            className="p-2 border border-[#00f0ff33] rounded text-[#00f0ff] hover:bg-[#00f0ff11] transition-all flex items-center gap-1 text-[10px] terminal-text"
                            onClick={() => window.location.href = '/console'}
                          >
                            <ExternalLink size={12} /> {t("myAgents.config")}
                          </button>
                          <button className="p-2 text-gray-500 hover:text-white transition-all"><MoreVertical size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
