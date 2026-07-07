import type { ReactNode } from "react";
import Link from "next/link";
import { Flame, Home } from "lucide-react";
import { Container } from "@/components/Container";

type FindTaRoomFrameProps = {
  children: ReactNode;
  description: string;
  eyebrow: string;
  title: string;
};

export function FindTaRoomFrame({
  children,
  description,
  eyebrow,
  title
}: FindTaRoomFrameProps) {
  return (
    <>
      <header className="border-b border-orange-100 bg-white/82 backdrop-blur">
        <Container className="flex min-h-20 items-center justify-between gap-4">
          <Link className="inline-flex items-center gap-3" href="/find-ta">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#8f2d12] text-white shadow-sm">
              <Flame className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-[#9a4a1f]">心火活动</span>
              <span className="block text-lg font-semibold text-slate-950">寻找那个 TA</span>
            </span>
          </Link>

          <Link
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-[#8a3a18] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#fbf6ef]"
            href="/"
          >
            <Home className="h-4 w-4" />
            官网首页
          </Link>
        </Container>
      </header>

      <main id="main-content">
        <section className="border-b border-orange-100 bg-[#fff8ef] py-10 sm:py-12">
          <Container>
            <p className="text-sm font-semibold tracking-[0.18em] text-[#9a4a1f]">{eyebrow}</p>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">
              {title}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700 sm:text-lg">{description}</p>
          </Container>
        </section>

        {children}
      </main>
    </>
  );
}
