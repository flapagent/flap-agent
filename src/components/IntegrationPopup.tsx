"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Twitter, Send, X, ShieldCheck, Zap } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/i18n";

interface IntegrationPopupProps {
  platform: "X" | "Telegram";
  isOpen: boolean;
  onClose: () => void;
}

export const IntegrationPopup = ({ platform, isOpen, onClose }: IntegrationPopupProps) => {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleConnect = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 2000);
  };

  const getTranslatedText = (key: any, plat: string) => {
    return t(key).replace("{platform}", plat);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-md glass-morphism rounded-3xl border-[#ff007f44] pink-glow-border p-8 relative overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#ff007f22] blur-3xl rounded-full" />
            
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-500 hover:text-[#ff007f] transition-colors"
            >
              <X size={20} />
            </button>

            {step === 1 ? (
              <div className="text-center">
                <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6 ${
                  platform === "X" ? "bg-black border border-[#ffffff11]" : "bg-[#0088cc11] text-[#0088cc]"
                }`}>
                  {platform === "X" ? <Twitter size={40} /> : <Send size={40} />}
                </div>
                <h2 className="text-2xl font-bold terminal-text mb-4">{t("popup.connect")} {platform}</h2>
                <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                  {getTranslatedText("popup.authDesc", platform)}
                </p>
                
                <div className="space-y-4">
                  <button 
                    onClick={handleConnect}
                    disabled={loading}
                    className="btn-primary w-full py-4 rounded-xl flex items-center justify-center gap-3 font-bold"
                  >
                    {loading ? (
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Zap size={20} />
                      </motion.div>
                    ) : (
                      <>
                        {platform === "X" ? <Twitter size={20} /> : <Send size={20} />}
                        {t("popup.authBtn")}
                      </>
                    )}
                  </button>
                  <div className="flex items-center justify-center gap-2 text-[10px] text-gray-600 uppercase tracking-widest">
                    <ShieldCheck size={12} /> {t("popup.encryption")}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 mx-auto bg-[#00ff4111] text-[#00ff41] rounded-full flex items-center justify-center mb-6"
                >
                  <ShieldCheck size={40} />
                </motion.div>
                <h2 className="text-2xl font-bold terminal-text mb-4 text-[#00ff41]">{t("popup.success")}</h2>
                <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                  {getTranslatedText("popup.successDesc", platform)}
                </p>
                <button 
                  onClick={onClose}
                  className="w-full bg-[#111] border border-[#ffffff11] py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:border-[#ff007f] transition-all"
                >
                  {t("popup.return")}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
