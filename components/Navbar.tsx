"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Container } from "@/components/Container";
import { LogoMark } from "@/components/LogoMark";

export type Language = "zh" | "en";

export type NavItem = {
  label: string;
  href: string;
};

type NavbarProps = {
  brandAlt?: string;
  brandSubtitle: string;
  brandTitle: string;
  homeHref: string;
  lang: Language;
  languageLinks: Record<Language, string>;
  languageToggleLabel: string;
  items: NavItem[];
  menuButtonLabel: string;
};

export function Navbar({
  brandAlt,
  brandSubtitle,
  brandTitle,
  homeHref,
  lang,
  languageLinks,
  languageToggleLabel,
  items,
  menuButtonLabel
}: NavbarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const handleClose = () => setOpen(false);

  function renderLanguageToggle() {
    return (
      <div
        aria-label={languageToggleLabel}
        className="inline-flex items-center rounded-full border border-stone-300 bg-white/90 p-1 shadow-sm"
        role="group"
      >
        {(["zh", "en"] as const).map((option) => {
          const active = option === lang;

          return (
            <Link
              aria-current={active ? "page" : undefined}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition sm:text-sm ${
                active
                  ? "bg-[#8f2d12] text-white shadow-sm"
                  : "text-slate-600 hover:bg-[#fbf6ef] hover:text-[#9a4a1f]"
              }`}
              href={languageLinks[option]}
              key={option}
              onClick={handleClose}
            >
              {option === "zh" ? "中文" : "EN"}
            </Link>
          );
        })}
      </div>
    );
  }

  function getNavClass(href: string, mobile = false) {
    const active = pathname === href;
    const base = mobile
      ? "rounded-lg px-4 py-3 text-sm font-medium transition"
      : "rounded-full px-4 py-2 text-sm font-medium transition";

    return `${base} ${
      active
        ? "bg-[#f4ece1] text-[#8a3a18]"
        : "text-slate-700 hover:bg-[#fbf6ef] hover:text-[#9a4a1f]"
    }`;
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-stone-200/80 bg-[#fffaf3]/95 backdrop-blur-xl">
      <Container className="flex min-h-20 items-center justify-between gap-4">
        <LogoMark alt={brandAlt} href={homeHref} subtitle={brandSubtitle} title={brandTitle} />

        <div className="flex items-center gap-3">
          <nav className="hidden items-center gap-1 lg:flex">
            {items.map((item) => (
              <Link
                aria-current={pathname === item.href ? "page" : undefined}
                className={getNavClass(item.href)}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:block">{renderLanguageToggle()}</div>

          <div className="flex items-center gap-2 lg:hidden">
            {renderLanguageToggle()}

            <button
              aria-expanded={open}
              aria-label={menuButtonLabel}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-orange-200 bg-white text-orange-600"
              onClick={() => setOpen((value) => !value)}
              type="button"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </Container>

      {open ? (
        <div className="border-t border-stone-200 bg-white/95 lg:hidden">
          <Container className="flex flex-col py-3">
            {items.map((item) => (
              <Link
                aria-current={pathname === item.href ? "page" : undefined}
                className={getNavClass(item.href, true)}
                href={item.href}
                key={item.href}
                onClick={handleClose}
              >
                {item.label}
              </Link>
            ))}
          </Container>
        </div>
      ) : null}
    </header>
  );
}
