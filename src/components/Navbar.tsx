"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "./AuthContext";
import { useLanguage } from "@/i18n";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, openAuthModal, logout } = useAuth();
  const { lang, toggle, t } = useLanguage();

  // Filter links based on auth state
  const publicMenuItems = [
    { name: t("nav.marketplace"), href: "/market" },
    { name: t("nav.flow"), href: "/flow" },
    { name: t("nav.docs"), href: "/docs" },
  ];
  
  const privateMenuItems = [
    { name: t("nav.console"), href: "/console" },
    { name: t("nav.myAgents"), href: "/my-agents" },
    { name: t("nav.profile"), href: "/profile" },
  ];

  const menuItems = isAuthenticated 
    ? [...publicMenuItems, ...privateMenuItems] 
    : publicMenuItems;

  return (
    <>
      <nav className="glass-morphism fixed top-0 left-0 w-full z-50 px-4 md:px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <motion.div 
            whileHover={{ rotateY: 180, scale: 1.1 }}
            transition={{ duration: 0.4 }}
            className="p-1.5 pink-glow-border rounded-lg bg-black group-hover:bg-[#ff007f55] transition-colors flex items-center justify-center w-9 h-9"
          >
            <img src="/logo.png" alt="Flap Agent Logo" className="w-full h-full object-contain" />
          </motion.div>
          <span className="text-base md:text-xl font-bold pink-gradient-text tracking-wider terminal-text">
            FLAP AGENT
          </span>
        </Link>

        {/* Desktop Menu - hidden on mobile */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-xs lg:text-sm font-medium text-gray-400 hover:text-[#ff007f] transition-colors uppercase tracking-widest terminal-text whitespace-nowrap"
            >
              {item.name}
            </Link>
          ))}
          {/* Language Toggle */}
          <button
            onClick={toggle}
            className="flex items-center gap-0.5 px-2 py-1 rounded-full border border-[#ffffff22] bg-[#ffffff08] text-[10px] font-bold tracking-widest terminal-text hover:border-[#ff007f55] transition-all"
            title="Toggle Language"
          >
            <span className={lang === 'en' ? 'text-[#ff007f]' : 'text-gray-500'}>EN</span>
            <span className="text-gray-600 mx-0.5">/</span>
            <span className={lang === 'zh' ? 'text-[#ff007f]' : 'text-gray-500'}>ZH</span>
          </button>
          <button 
            onClick={() => isAuthenticated ? logout() : openAuthModal()}
            className="btn-primary flex items-center gap-2 text-xs rounded-lg whitespace-nowrap"
          >
            <Terminal size={13} />
            {isAuthenticated ? t("nav.logout") : t("nav.login")}
          </button>
        </div>

        {/* Hamburger - only on mobile */}
        <button
          className="md:hidden text-[#ff007f] p-2 ml-auto"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Drawer - rendered outside nav to avoid layout conflicts */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-72 bg-[#0a0a0a] border-l border-[#ff007f33] z-50 md:hidden flex flex-col p-8 gap-6"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold terminal-text text-[#ff007f] text-sm tracking-widest">MENU</span>
                <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white">
                  <X size={22} />
                </button>
              </div>
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-lg font-medium text-gray-300 hover:text-[#ff007f] transition-colors terminal-text border-b border-[#ffffff08] pb-4"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {/* Mobile Language toggle */}
              <button
                onClick={toggle}
                className="flex items-center gap-1 px-3 py-2 rounded-full border border-[#ffffff22] bg-[#ffffff08] text-sm font-bold tracking-widest terminal-text w-fit"
              >
                <span className={lang === 'en' ? 'text-[#ff007f]' : 'text-gray-500'}>EN</span>
                <span className="text-gray-600">/</span>
                <span className={lang === 'zh' ? 'text-[#ff007f]' : 'text-gray-500'}>ZH</span>
              </button>
              <button 
                onClick={() => {
                  isAuthenticated ? logout() : openAuthModal();
                  setIsOpen(false);
                }}
                className="btn-primary w-full mt-4 rounded-xl flex items-center justify-center gap-2"
              >
                <Terminal size={14} /> {isAuthenticated ? t("nav.logout") : t("nav.login")}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
