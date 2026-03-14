"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { en } from "./en";
import { zh } from "./zh";

type Lang = "en" | "zh";
type Translations = typeof en;

interface LangCtx {
  lang: Lang;
  toggle: () => void;
  t: (key: keyof Translations) => string;
}

const LanguageContext = createContext<LangCtx>({
  lang: "en",
  toggle: () => {},
  t: (key) => en[key] ?? key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("flap_lang") as Lang | null;
    if (saved === "en" || saved === "zh") setLang(saved);
  }, []);

  const toggle = () => {
    setLang((prev) => {
      const next = prev === "en" ? "zh" : "en";
      localStorage.setItem("flap_lang", next);
      return next;
    });
  };

  const t = (key: keyof Translations): string => {
    const dict = lang === "zh" ? zh : en;
    return (dict as Record<string, string>)[key as string] ?? (en as Record<string, string>)[key as string] ?? String(key);
  };

  return (
    <LanguageContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
