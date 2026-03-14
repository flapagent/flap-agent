import Link from "next/link";
import { Github, Twitter, Send } from "lucide-react";
import { useLanguage } from "@/i18n";

export const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="w-full border-t border-[#ffffff11] py-16 px-6 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 items-start">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Flap Agent Logo" className="w-10 h-10 object-contain" />
            <span className="text-2xl font-bold pink-gradient-text terminal-text">FLAP AGENT</span>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
            {t("footer.desc")}
          </p>
          <div className="flex gap-3 mt-2">
            <a href="#" className="w-10 h-10 flex items-center justify-center glass-morphism rounded-full hover:shadow-[0_0_12px_#ff007f] hover:border-[#ff007f55] transition-all" aria-label="Twitter">
              <Twitter size={16} />
            </a>
            <a href="#" className="w-10 h-10 flex items-center justify-center glass-morphism rounded-full hover:shadow-[0_0_12px_#ff007f] hover:border-[#ff007f55] transition-all" aria-label="Github">
              <Github size={16} />
            </a>
            <a href="#" className="w-10 h-10 flex items-center justify-center glass-morphism rounded-full hover:shadow-[0_0_12px_#ff007f] hover:border-[#ff007f55] transition-all" aria-label="Telegram">
              <Send size={16} />
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{t("footer.product")}</span>
          <Link href="/market" className="text-sm text-gray-500 hover:text-[#ff007f] transition-colors">{t("footer.marketplace")}</Link>
          <Link href="/flow" className="text-sm text-gray-500 hover:text-[#ff007f] transition-colors">{t("footer.flow")}</Link>
          <Link href="/my-agents" className="text-sm text-gray-500 hover:text-[#ff007f] transition-colors">{t("footer.myAgents")}</Link>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{t("footer.resources")}</span>
          <Link href="/docs" className="text-sm text-gray-500 hover:text-[#ff007f] transition-colors">{t("footer.docs")}</Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-[#ff007f] transition-colors">{t("footer.mainSite")}</Link>
          <a href="https://flap.sh" target="_blank" rel="noreferrer" className="text-sm text-gray-500 hover:text-[#ff007f] transition-colors">{t("footer.tokenLaunch")}</a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-[#ffffff08] text-center text-xs text-gray-600">
        &copy; {new Date().getFullYear()} {t("footer.copy")}
      </div>
    </footer>
  );
};
