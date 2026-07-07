"use client";

import { useState } from "react";
import Link from "next/link";

type LogoMarkProps = {
  alt?: string;
  href: string;
  showText?: boolean;
  subtitle: string;
  title: string;
};

export function LogoMark({
  alt = "Hearts on Fire Logo",
  href,
  showText = true,
  subtitle,
  title
}: LogoMarkProps) {
  const [imageMissing, setImageMissing] = useState(false);

  return (
    <Link className="flex items-center gap-3" href={href}>
      <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-lg border border-stone-300 bg-[#fbf6ef] shadow-sm">
        {imageMissing ? (
          <span className="font-display text-sm font-semibold text-[#9a4a1f]">HOF</span>
        ) : (
          <img
            alt={alt}
            className="h-full w-full object-cover"
            onError={() => setImageMissing(true)}
            src="/logo.jpg"
          />
        )}
      </div>
      {showText ? (
        <div className="max-w-[11.5rem] leading-tight sm:max-w-none">
          <p className="truncate font-display text-sm font-semibold text-slate-950 sm:text-base lg:text-lg">
            {title}
          </p>
          <p className="hidden text-[11px] tracking-[0.18em] text-[#9a4a1f] sm:block sm:text-xs">
            {subtitle}
          </p>
        </div>
      ) : null}
    </Link>
  );
}
