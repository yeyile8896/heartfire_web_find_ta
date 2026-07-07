"use client";

import { useEffect } from "react";
import type { Language } from "@/components/Navbar";

type DocumentLanguageProps = {
  lang: Language;
};

export function DocumentLanguage({ lang }: DocumentLanguageProps) {
  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-Hans" : "en";
  }, [lang]);

  return null;
}
