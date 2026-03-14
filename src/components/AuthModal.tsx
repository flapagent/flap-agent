"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Shield, Mail, User } from "lucide-react";
import { useAuth, supabase } from "./AuthContext";
import { ethers } from "ethers";
import { useLanguage } from "@/i18n";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const AuthModal = () => {
  const { t } = useLanguage();
  const { isAuthModalOpen, closeAuthModal } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isAuthModalOpen) return null;

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    if (!isLogin && password !== confirmPassword) {
      setErrorMsg(t("auth.error.match"));
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      }
      closeAuthModal();
    } catch (err: any) {
      setErrorMsg(err.message || t("auth.error.failed"));
    } finally {
      setLoading(false);
    }
  };

  const connectWallet = async () => {
    setErrorMsg("");
    if (typeof window.ethereum !== "undefined") {
      try {
        setLoading(true);
        // Request connection
        await window.ethereum.request({ method: "eth_requestAccounts" });
        
        const provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        
        // Binance Smart Chain Mainnet Chain ID is 56 (0x38 in hex)
        if (Number(network.chainId) !== 56) {
          // Try to switch to BNB network
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x38' }],
            });
          } catch (switchError: any) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: '0x38',
                    chainName: 'Binance Smart Chain',
                    rpcUrls: ['https://bsc-dataseed.binance.org/'],
                    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
                    blockExplorerUrls: ['https://bscscan.com/']
                  }
                ],
              });
            } else {
              throw switchError;
            }
          }
        }
        
        // Simulate successful web3 auth (In production, sign a nonce and verify on backend)
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        
        // For now, we simulate a web3 login by injecting a random password to a generated email
        const web3Email = `${address}@web3.flapagent.sh`.toLowerCase();
        const { data, error: signInError } = await supabase.auth.signInWithPassword({ email: web3Email, password: address });
        
        if (signInError) {
           // Auto register the wallet
           const { error: signUpError } = await supabase.auth.signUp({ email: web3Email, password: address });
           if(signUpError) throw signUpError;
        }
        
        closeAuthModal();
      } catch (err: any) {
        setErrorMsg(err.message || t("auth.error.wallet"));
      } finally {
        setLoading(false);
      }
    } else {
      setErrorMsg(t("auth.error.noMeta"));
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 rounded-2xl"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-[#0a0a0a] border border-[#ff007f55] pink-glow-border rounded-2xl p-8 max-w-sm w-full relative"
        >
          <button 
            onClick={closeAuthModal}
            className="absolute top-4 right-4 text-gray-500 hover:text-[#ff007f] transition-colors"
          >
            ✕
          </button>
          <div className="w-12 h-12 rounded-full bg-[#ff007f22] flex items-center justify-center mb-6 mx-auto">
            <Terminal size={24} className="text-[#ff007f]" />
          </div>
          <h2 className="text-xl font-bold terminal-text text-center mb-2">{t("auth.title")}</h2>
          <p className="text-center text-gray-400 text-xs tracking-widest uppercase mb-8">{t("auth.desc")}</p>
          
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-xs text-red-500 flex items-start gap-2">
               <Shield size={14} className="shrink-0 mt-0.5" />
               <span className="flex-1 break-words leading-relaxed">{errorMsg}</span>
            </div>
          )}

          <div className="space-y-4">
            <button 
              onClick={connectWallet}
              disabled={loading}
              className="w-full btn-primary rounded-xl py-3 font-bold text-sm terminal-text tracking-wide flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <img src="/metamask-icon.svg" alt="MetaMask" className="w-5 h-5 invert mix-blend-screen" onError={(e) => e.currentTarget.style.display='none'} />
              {t("auth.connectWallet")}
            </button>
            
            <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-[#ffffff11]"></div>
                <span className="shrink-0 mx-4 text-gray-600 text-[10px] terminal-text">{t("auth.orEmail")}</span>
                <div className="flex-grow border-t border-[#ffffff11]"></div>
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={t("auth.email")} 
                  required
                  className="w-full bg-[#111] border border-[#ffffff22] focus:border-[#ff007f] rounded-xl py-3 pl-10 pr-4 text-sm text-gray-200 uppercase terminal-text placeholder-gray-600 outline-none transition-all"
                />
              </div>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={t("auth.password")} 
                  required
                  className="w-full bg-[#111] border border-[#ffffff22] focus:border-[#ff007f] rounded-xl py-3 pl-10 pr-4 text-sm text-gray-200 uppercase terminal-text placeholder-gray-600 outline-none transition-all"
                />
              </div>

              {!isLogin && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }}
                  className="relative"
                >
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00f0ff]" size={16} />
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder={t("auth.confirmPassword")} 
                    required={!isLogin}
                    className="w-full bg-[#111] border border-[#ffffff22] focus:border-[#00f0ff] rounded-xl py-3 pl-10 pr-4 text-sm text-[#00f0ff] uppercase terminal-text placeholder-gray-600 outline-none transition-all"
                  />
                </motion.div>
              )}
              
              <button 
                type="submit"
                disabled={loading}
                className={`w-full bg-[#111] rounded-xl py-3 text-sm transition-all font-bold terminal-text tracking-wide disabled:opacity-50 ${isLogin ? 'border border-[#ffffff22] hover:border-[#ff007f55] text-gray-300 hover:text-white hover:bg-[#ff007f11]' : 'border border-[#00f0ff55] text-[#00f0ff] hover:bg-[#00f0ff11] shadow-[0_0_15px_#00f0ff22]'}`}
              >
                {loading ? t("auth.processing") : (isLogin ? t("auth.login") : t("auth.register"))}
              </button>
            </form>

            <button 
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="w-full text-center text-xs text-gray-500 transition-all terminal-text"
            >
              {isLogin ? (
                <>{t("auth.needAccount")} <span className="text-[#00f0ff] hover:underline">{t("auth.register")}</span></>
              ) : (
                <>{t("auth.haveAccount")} <span className="text-[#ff007f] hover:underline">{t("auth.login")}</span></>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
