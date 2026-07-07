"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Language } from "@/components/Navbar";
import type { MemoryItem } from "@/lib/site-content";

type MemoryCarouselProps = {
  item: MemoryItem;
  lang: Language;
};

export function MemoryCarousel({ item, lang }: MemoryCarouselProps) {
  const slides = useMemo(
    () => [{ alt: `${item.title} ${item.theme}`, src: item.cover }, ...item.photos],
    [item]
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex];
  const previousLabel =
    lang === "zh" ? `查看${item.title}上一张照片` : `View previous photo from ${item.title}`;
  const nextLabel = lang === "zh" ? `查看${item.title}下一张照片` : `View next photo from ${item.title}`;

  function showPrevious() {
    setActiveIndex((current) => (current === 0 ? slides.length - 1 : current - 1));
  }

  function showNext() {
    setActiveIndex((current) => (current === slides.length - 1 ? 0 : current + 1));
  }

  return (
    <article className="overflow-hidden rounded-lg border border-orange-100 bg-white shadow-card">
      <div className="relative aspect-[4/5] min-h-[360px] overflow-hidden bg-orange-100 sm:aspect-[16/10] lg:aspect-[16/7]">
        <img
          alt={activeSlide.alt}
          className="h-full w-full object-cover transition duration-500"
          key={activeSlide.src}
          src={activeSlide.src}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/78 via-slate-950/18 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-8">
          <span className="inline-flex rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-[#9a4a1f] shadow-sm">
            {item.year}
          </span>
          <h3 className="mt-4 font-display text-3xl font-semibold leading-tight sm:text-5xl">
            {item.title}
          </h3>
          <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-orange-50 sm:text-xl">
            {item.theme}
          </p>
        </div>

        {slides.length > 1 ? (
          <>
            <button
              aria-label={previousLabel}
              className="absolute left-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/90 text-[#9a4a1f] shadow-sm transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-orange-300 sm:left-5"
              onClick={showPrevious}
              type="button"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              aria-label={nextLabel}
              className="absolute right-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/90 text-[#9a4a1f] shadow-sm transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-orange-300 sm:right-5"
              onClick={showNext}
              type="button"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        ) : null}
      </div>
    </article>
  );
}
