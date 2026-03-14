"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { ChatInterface } from "@/components/ChatInterface";
import { useAuth } from "@/components/AuthContext";
import { Terminal } from "lucide-react";
import { useLanguage } from "@/i18n";

export default function ChatPage() {
  const { isAuthenticated, isLoading, openAuthModal } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      openAuthModal();
      router.push("/");
    }
  }, [isLoading, isAuthenticated, router, openAuthModal]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#050505]">
        <div className="flex flex-col items-center gap-4">
          <Terminal size={32} className="text-[#ff007f] animate-pulse" />
          <span className="text-xs font-bold text-gray-500 tracking-widest terminal-text uppercase animate-bounce">{t("chat.authenticating")}</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null; // Will redirect

  return (
    <main className="min-h-screen bg-[#050505] flex flex-col">
      <Navbar />
      
      <div className="flex-1 max-w-[1600px] w-full mx-auto flex pt-20 pb-4 px-4 md:px-6 h-screen">
        <div className="flex-1 flex flex-col w-full h-full relative">
          <div className="absolute top-0 right-4 p-2 z-10 hidden lg:flex gap-2">
            <span className="px-3 py-1 bg-[#ff007f11] border border-[#ff007f33] rounded-full text-[10px] terminal-text text-[#ff007f] flex items-center gap-1.5 font-bold tracking-widest">
              {t("chat.secureSession")} <div className="w-1.5 h-1.5 rounded-full bg-[#ff007f] animate-pulse" />
            </span>
          </div>
          <ChatInterface />
        </div>
      </div>
    </main>
  );
}
