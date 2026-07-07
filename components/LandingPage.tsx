import {
  ArrowUpRight,
  CheckCircle2,
  Compass,
  CreditCard,
  Flame,
  Globe2,
  Handshake,
  Images,
  Instagram,
  MessageCircle,
  ScanLine,
  ShieldAlert,
  Shuffle,
  Sparkles,
  Target
} from "lucide-react";
import { CTAButton } from "@/components/CTAButton";
import { ContactForm } from "@/components/ContactForm";
import { Container } from "@/components/Container";
import { DocumentLanguage } from "@/components/DocumentLanguage";
import { FeatureCard } from "@/components/FeatureCard";
import { FindTaExperience } from "@/components/FindTaExperience";
import { MemoryExperience } from "@/components/MemoryExperience";
import { Navbar, type Language } from "@/components/Navbar";
import { SectionHeading } from "@/components/SectionHeading";
import { siteContent } from "@/lib/site-content";
import { getPagePath, type SiteView } from "@/lib/site-routes";
import {
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  REVOLUT_GIVING_URL,
  WECHAT_ID
} from "@/lib/site";

export function LandingPage({
  lang,
  view = "home"
}: {
  lang: Language;
  view?: SiteView;
}) {
  const copy = siteContent[lang];
  const homeHref = getPagePath(lang, "home");
  const languageLinks: Record<Language, string> = {
    zh: getPagePath("zh", view),
    en: getPagePath("en", view)
  };
  const showHome = view === "home";
  const showAbout = showHome || view === "about";
  const showOrigin = showHome || view === "origin";
  const showVision = showHome || view === "vision";
  const showWhatWeDo = showHome || view === "what-we-do";
  const showMemories = view === "memories";
  const showFindTa = view === "find-ta";
  const showJoin = showHome || view === "join";
  const showContact = showHome || view === "contact";
  const heroMemory = copy.memories.items.find((item) => item.year === "2024") ?? copy.memories.items[0];
  const heroMemoryPhotos = heroMemory
    ? [
        {
          alt: `${heroMemory.title} ${heroMemory.theme}`,
          label: heroMemory.year,
          src: heroMemory.cover,
          title: heroMemory.title
        },
        ...heroMemory.photos.map((photo) => ({
          alt: photo.alt,
          label: heroMemory.year,
          src: photo.src,
          title: heroMemory.title
        }))
      ]
    : [];
  const supportingHeroPhotos = heroMemoryPhotos.slice(1, 3);
  const homepageMemoryPhotos = heroMemoryPhotos.slice(0, 3);
  const memoryPreviewCopy =
    lang === "zh"
      ? {
          cta: "进入往年回顾",
          description:
            "先看见真实的相聚，再认识这个平台。营会、敬拜、小组和同行关系，是心火最有说服力的介绍。",
          kicker: "真实现场",
          photoLabel: "营会现场",
          title: "不是概念，是一群人在欧洲真实同行"
        }
      : {
          cta: "Explore memories",
          description:
            "Meet the people before the program. Camps, worship, small groups, and long-term companionship are the clearest introduction to Hearts on Fire.",
          kicker: "Real moments",
          photoLabel: "Camp moment",
          title: "Not just an idea, a people walking together across Europe"
        };

  return (
    <>
      <DocumentLanguage lang={lang} />
      <Navbar
        brandAlt={copy.brand.alt}
        brandSubtitle={copy.brand.logoSubtitle}
        brandTitle={copy.brand.logoTitle}
        homeHref={homeHref}
        items={copy.navItems}
        lang={lang}
        languageLinks={languageLinks}
        languageToggleLabel={copy.navbar.languageToggleLabel}
        menuButtonLabel={copy.navbar.menuButtonLabel}
      />

      <main className={showHome ? undefined : "pt-28"} id="main-content">
        {showHome ? (
          <section className="relative isolate overflow-hidden bg-[#fff1df] pt-24 text-slate-950 sm:pt-28">
            <div
              className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,0.94),transparent_34%),radial-gradient(circle_at_86%_12%,rgba(251,146,60,0.22),transparent_30%),linear-gradient(135deg,#fff7ed_0%,#ffe0ad_100%)]"
              aria-hidden="true"
            />
            <Container className="relative pb-14 pt-10 sm:pb-20 sm:pt-14">
              <div className="grid gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(420px,1.08fr)] lg:items-center">
                <div className="space-y-7">
                  <span className="inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-white/75 px-4 py-2 text-sm font-medium text-[#8a3a18] shadow-sm backdrop-blur">
                    <Flame className="h-4 w-4 text-orange-700" />
                    {copy.hero.chip}
                  </span>
                  <div className="space-y-5">
                    <h1 className="font-display text-4xl font-semibold leading-[1.04] text-slate-950 sm:text-5xl lg:text-[4.25rem]">
                      {copy.hero.title}
                    </h1>
                    <p className="max-w-2xl text-balance text-lg leading-8 text-[#8a3a18] sm:text-2xl">
                      {copy.hero.subtitle}
                    </p>
                    <p className="max-w-3xl text-balance text-base leading-8 text-slate-700 sm:text-lg">
                      {copy.hero.description}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <CTAButton href={getPagePath(lang, "join")}>{copy.hero.secondaryCta}</CTAButton>
                    <CTAButton href={getPagePath(lang, "memories")} variant="secondary">
                      {copy.hero.memoriesCta}
                    </CTAButton>
                    <CTAButton href={getPagePath(lang, "about")} variant="quiet">
                      {copy.hero.primaryCta}
                    </CTAButton>
                  </div>

                  <div className="hidden gap-3 border-t border-orange-200/80 pt-6 lg:grid lg:grid-cols-3">
                    {copy.hero.facts.map((fact) => (
                      <div
                        className="rounded-2xl bg-white/55 px-4 py-3 ring-1 ring-orange-200/70"
                        key={fact.label}
                      >
                        <p className="text-sm text-[#9a4a1f]">{fact.label}</p>
                        <p className="mt-1 text-base font-semibold text-slate-950 sm:text-lg">
                          {fact.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {heroMemory ? (
                  <div className="relative lg:min-h-[540px]">
                    <div className="overflow-hidden rounded-[1.25rem] border border-white/70 bg-white shadow-[0_28px_80px_rgba(88,42,18,0.2)]">
                      <div className="relative min-h-[330px] sm:min-h-[420px]">
                        <img
                          alt={`${heroMemory.title} ${heroMemory.theme}`}
                          className="absolute inset-0 h-full w-full object-cover"
                          src={heroMemory.cover}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#2b160e]/70 via-transparent to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
                          <p className="inline-flex rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-[#8a3a18]">
                            {memoryPreviewCopy.photoLabel}
                          </p>
                          <p className="mt-3 font-display text-2xl font-semibold leading-tight sm:text-4xl">
                            {heroMemory.title}
                          </p>
                          <p className="mt-2 max-w-md text-sm font-medium leading-6 text-orange-50 sm:text-base">
                            {heroMemory.theme}
                          </p>
                        </div>
                      </div>
                    </div>

                    {supportingHeroPhotos.map((item, index) => (
                      <div
                        className={`absolute hidden w-52 overflow-hidden rounded-2xl border border-white/80 bg-white p-2 shadow-[0_20px_54px_rgba(88,42,18,0.2)] lg:block ${
                          index === 0
                            ? "-left-8 bottom-8 rotate-[-3deg]"
                            : "-right-4 top-10 rotate-[4deg]"
                        }`}
                        key={`${item.src}-${index}`}
                      >
                        <img
                          alt={item.alt}
                          className="aspect-[4/3] w-full rounded-xl object-cover"
                          src={item.src}
                        />
                        <p className="px-2 py-2 text-sm font-semibold text-[#8a3a18]">{item.label}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="mt-7 grid gap-3 border-t border-orange-200/80 pt-6 sm:grid-cols-3 lg:hidden">
                {copy.hero.facts.map((fact) => (
                  <div
                    className="rounded-2xl bg-white/55 px-4 py-3 ring-1 ring-orange-200/70"
                    key={fact.label}
                  >
                    <p className="text-sm text-[#9a4a1f]">{fact.label}</p>
                    <p className="mt-1 text-base font-semibold text-slate-950 sm:text-lg">{fact.value}</p>
                  </div>
                ))}
              </div>
            </Container>
          </section>
        ) : null}

        {showHome ? (
          <section className="border-b border-stone-200/80 bg-[#fffaf3] py-10 sm:py-12">
            <Container>
              <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
                <div>
                  <div className="inline-flex rounded-2xl bg-[#8f2d12] p-3 text-white shadow-sm">
                    <Compass className="h-6 w-6" />
                  </div>
                  <p className="mt-5 text-sm font-semibold text-[#9a4a1f]">
                    {copy.hero.sideEyebrow}
                  </p>
                  <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl">
                    {copy.hero.sideTitle}
                  </h2>
                </div>
                <div className="space-y-6">
                  <div className="grid gap-5 text-base leading-8 text-slate-700 md:grid-cols-2">
                    {copy.hero.sideParagraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {copy.hero.sideCards.map((item) => (
                      <div
                        className="rounded-full border border-orange-200/80 bg-white/75 px-4 py-2 shadow-sm"
                        key={item.label}
                      >
                        <p className="text-sm text-[#9a4a1f]">
                          <span className="font-semibold text-slate-900">{item.label}</span>
                          <span className="mx-2 text-orange-300">/</span>
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Container>
          </section>
        ) : null}

        {showHome ? (
          <section className="bg-[#2f1d15] py-10 text-white sm:py-14">
            <Container>
              <div className="grid gap-7 lg:grid-cols-[0.42fr_0.58fr] lg:items-end">
                <div className="max-w-xl">
                  <p className="text-sm font-semibold text-orange-200">{memoryPreviewCopy.kicker}</p>
                  <h2 className="mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl">
                    {memoryPreviewCopy.title}
                  </h2>
                  <p className="mt-4 text-base leading-8 text-orange-50/86">{memoryPreviewCopy.description}</p>
                  <div className="mt-6">
                    <CTAButton href={getPagePath(lang, "memories")} variant="secondary">
                      {memoryPreviewCopy.cta}
                    </CTAButton>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {homepageMemoryPhotos.map((item, index) => (
                    <a
                      className={`group relative min-h-64 overflow-hidden rounded-[1rem] border border-white/12 bg-white/10 ${
                        index === 0 ? "sm:col-span-2 lg:col-span-1" : ""
                      }`}
                      href={getPagePath(lang, "memories")}
                      key={`${item.src}-${index}`}
                    >
                      <img
                        alt={item.alt}
                        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        src={item.src}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1c0d08]/78 via-transparent to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <p className="text-sm font-semibold text-orange-100">{item.label}</p>
                        <p className="mt-1 font-display text-2xl font-semibold leading-tight">{item.title}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </Container>
          </section>
        ) : null}

        {showHome ? (
          <section className="border-b border-orange-100/80 bg-[#fffaf3] py-10 sm:py-14">
            <Container>
              <div className="grid gap-7 overflow-hidden rounded-[1.25rem] border border-orange-100 bg-white shadow-[0_18px_50px_rgba(88,42,18,0.08)] lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
                <div className="relative min-h-72 overflow-hidden lg:min-h-full">
                  <img
                    alt={copy.findTa.title}
                    className="absolute inset-0 h-full w-full object-cover"
                    src="/find-ta-hero.png"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2b160e]/70 via-[#2b160e]/12 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <p className="inline-flex rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-[#8a3a18]">
                      {copy.findTa.homepageEyebrow}
                    </p>
                  </div>
                </div>

                <div className="p-6 sm:p-8 lg:p-10">
                  <div className="inline-flex rounded-2xl bg-orange-50 p-3 text-orange-600">
                    <ScanLine className="h-6 w-6" />
                  </div>
                  <p className="mt-5 text-sm font-semibold tracking-[0.18em] text-[#9a4a1f]">
                    {copy.findTa.eyebrow}
                  </p>
                  <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl">
                    {copy.findTa.homepageTitle}
                  </h2>
                  <p className="mt-4 max-w-2xl text-base leading-8 text-slate-700">
                    {copy.findTa.homepageDescription}
                  </p>
                  <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <CTAButton href={getPagePath(lang, "find-ta")}>{copy.findTa.homepageCta}</CTAButton>
                    <CTAButton href={getPagePath(lang, "contact")} variant="secondary">
                      {copy.contact.eyebrow}
                    </CTAButton>
                  </div>
                </div>
              </div>
            </Container>
          </section>
        ) : null}

        {showHome ? (
          <section className="py-12 sm:py-16">
            <Container>
              <SectionHeading
                description={copy.rhythm.description}
                eyebrow={copy.rhythm.eyebrow}
                title={copy.rhythm.title}
              />

              <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="overflow-hidden rounded-[1.25rem] border border-stone-200/80 bg-white/75">
                  {copy.rhythm.items.map((item, index) => (
                    <div className="grid gap-4 p-5 sm:grid-cols-[4.5rem_1fr] sm:p-6" key={item.title}>
                      <div className="flex items-center gap-3 sm:block">
                        <span className="text-sm font-semibold text-[#9a4a1f]">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className="mt-0 inline-flex rounded-2xl bg-orange-50 p-3 text-orange-600 sm:mt-3">
                          <item.icon className="h-6 w-6" />
                        </div>
                      </div>
                      <div>
                        {item.tag ? (
                          <p className="text-sm font-semibold text-[#9a4a1f]">{item.tag}</p>
                        ) : null}
                        <h3 className="mt-2 text-xl font-semibold text-slate-950">{item.title}</h3>
                        <p className="mt-3 text-sm leading-7 text-slate-700 sm:text-base">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="relative overflow-hidden rounded-[1.25rem] bg-[#7c2d12] p-6 text-white shadow-[0_20px_58px_rgba(88,42,18,0.18)] sm:p-8">
                  <div
                    className="absolute -right-20 -top-24 h-56 w-56 rounded-full bg-orange-300/24 blur-3xl"
                    aria-hidden="true"
                  />
                  <div className="relative">
                    <div className="inline-flex rounded-2xl bg-white/12 p-3 text-orange-100 ring-1 ring-white/20">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <h3 className="mt-6 font-display text-3xl font-semibold leading-tight">
                      {copy.rhythm.quoteTitle}
                    </h3>
                    <p className="mt-5 text-base leading-8 text-orange-50/90">{copy.rhythm.quoteBody}</p>
                  </div>
                </div>
              </div>
            </Container>
          </section>
        ) : null}

        {showAbout ? (
          <section className="py-12 sm:py-16">
            <Container>
              <SectionHeading
                description={copy.about.description}
                eyebrow={copy.about.eyebrow}
                title={copy.about.title}
              />

              <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="section-card space-y-5">
                  {copy.about.story.map((paragraph) => (
                    <p className="text-base leading-8 text-slate-700" key={paragraph}>
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="section-card bg-[#fbf6ef]">
                  <div className="space-y-4">
                    <div className="inline-flex rounded-lg bg-white p-3 text-orange-500 shadow-sm">
                      <Globe2 className="h-6 w-6" />
                    </div>
                    <h3 className="font-display text-2xl font-semibold text-slate-950">
                      {copy.about.positioningTitle}
                    </h3>
                    <ul className="space-y-3 text-sm leading-7 text-slate-700 sm:text-base">
                      {copy.about.positioningItems.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Container>
          </section>
        ) : null}

        {showOrigin ? (
          <section className="py-12 sm:py-16">
            <Container>
              <SectionHeading
                description={copy.origin.description}
                eyebrow={copy.origin.eyebrow}
                title={copy.origin.title}
              />

              <div className="grid gap-6 rounded-lg border border-stone-200 bg-white p-6 shadow-card md:grid-cols-[0.72fr_1.28fr] md:items-center">
                <div className="rounded-lg border border-orange-200 bg-gradient-to-br from-orange-100 via-amber-50 to-white p-8 text-slate-950 shadow-card">
                  <Flame className="h-10 w-10 text-orange-600" />
                  <p className="mt-6 font-display text-3xl font-semibold">{copy.origin.cardTitle}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-700 sm:text-base">
                    {copy.origin.cardBody}
                  </p>
                </div>
                <div className="space-y-4 text-base leading-8 text-slate-700">
                  {copy.origin.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </Container>
          </section>
        ) : null}

        {showVision ? (
          <section className="py-12 sm:py-16">
            <Container>
              <SectionHeading
                description={copy.vision.description}
                eyebrow={copy.vision.eyebrow}
                title={copy.vision.title}
              />

              <div className="grid gap-6 md:grid-cols-2">
                {copy.vision.cards.map((item) => (
                  <FeatureCard
                    description={item.description}
                    icon={item.icon}
                    key={item.title}
                    title={item.title}
                  />
                ))}
              </div>

              <div className="mt-10 space-y-6">
                <div className="max-w-3xl">
                  <h3 className="mt-3 font-display text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl">
                    {copy.vision.goalsHeading}
                  </h3>
                  <p className="mt-4 text-base leading-8 text-[color:var(--text-soft)] sm:text-lg">
                    {copy.vision.goalsDescription}
                  </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
                  <div className="section-card space-y-5">
                    <h3 className="font-display text-2xl font-semibold text-slate-950">
                      {copy.vision.goalsTitle}
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {copy.vision.goals.map((goal) => (
                        <div className="stat-card" key={goal.label}>
                          <p className="text-3xl font-semibold text-[#9a4a1f]">{goal.value}</p>
                          <p className="mt-2 text-lg font-semibold text-slate-900">{goal.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="section-card space-y-5">
                    <h3 className="font-display text-2xl font-semibold text-slate-950">
                      {copy.vision.strategyTitle}
                    </h3>
                    <div className="space-y-4">
                      {copy.vision.strategies.map((strategy) => (
                        <div
                          className="flex gap-3 rounded-lg border border-stone-200 bg-[#fbf6ef] p-4"
                          key={strategy}
                        >
                          <div className="mt-1 rounded-full bg-white p-2 text-orange-500 shadow-sm">
                            <Target className="h-4 w-4" />
                          </div>
                          <p className="text-sm leading-7 text-slate-700 sm:text-base">{strategy}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </section>
        ) : null}

        {showWhatWeDo ? (
          <section className="py-12 sm:py-16">
            <Container>
              <SectionHeading
                description={copy.whatWeDo.description}
                eyebrow={copy.whatWeDo.eyebrow}
                title={copy.whatWeDo.title}
              />

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {copy.whatWeDo.items.map((item) => (
                  <FeatureCard
                    description={item.description}
                    icon={item.icon}
                    key={item.title}
                    title={item.title}
                  />
                ))}
              </div>
            </Container>
          </section>
        ) : null}

        {showFindTa ? (
          <>
            <section className="relative isolate overflow-hidden bg-[#2f1d15] text-white">
              <img
                alt={copy.findTa.homepageTitle}
                className="absolute inset-0 h-full w-full object-cover opacity-60"
                src="/find-ta-hero.png"
              />
              <div
                className="absolute inset-0 bg-[linear-gradient(90deg,rgba(47,29,21,0.92),rgba(47,29,21,0.66)_48%,rgba(47,29,21,0.3)),linear-gradient(180deg,rgba(47,29,21,0.1),rgba(47,29,21,0.8))]"
                aria-hidden="true"
              />
              <Container className="relative pb-14 pt-16 sm:pb-20 sm:pt-20">
                <div className="max-w-3xl">
                  <p className="inline-flex rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-[#8a3a18]">
                    {copy.findTa.eyebrow}
                  </p>
                  <h1 className="mt-5 font-display text-4xl font-semibold leading-tight sm:text-6xl">
                    {copy.findTa.title}
                  </h1>
                  <p className="mt-5 max-w-2xl text-lg leading-8 text-orange-50 sm:text-2xl">
                    {copy.findTa.subtitle}
                  </p>
                  <p className="mt-4 max-w-2xl text-base leading-8 text-orange-50/80 sm:text-lg">
                    {copy.findTa.description}
                  </p>
                  <div className="mt-8">
                    <CTAButton href="#findTa-flow" variant="secondary">
                      {copy.findTa.primaryCta}
                    </CTAButton>
                  </div>
                </div>
              </Container>
            </section>

            <FindTaExperience lang={lang} />

            <section className="py-12 sm:py-16" id="findTa-flow">
              <Container>
                <SectionHeading
                  description={copy.findTa.description}
                  eyebrow={copy.findTa.eyebrow}
                  title={copy.findTa.homepageTitle}
                />

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                  {copy.findTa.steps.map((step, index) => {
                    const StepIcon = [Shuffle, MessageCircle, Compass, Handshake][index] ?? CheckCircle2;

                    return (
                      <article className="section-card h-full" key={step.title}>
                        <div className="flex items-center justify-between gap-4">
                          <div className="rounded-lg bg-orange-50 p-3 text-orange-500">
                            <StepIcon className="h-6 w-6" />
                          </div>
                          <span className="text-sm font-semibold text-[#9a4a1f]">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <h2 className="mt-5 text-xl font-semibold text-slate-950">{step.title}</h2>
                        <p className="mt-3 text-sm leading-7 text-slate-700 sm:text-base">
                          {step.description}
                        </p>
                      </article>
                    );
                  })}
                </div>
              </Container>
            </section>

            <section className="border-y border-orange-100/80 bg-[#fff8ef] py-12 sm:py-16">
              <Container>
                <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
                  <div className="section-card bg-white">
                    <div className="inline-flex rounded-lg bg-orange-50 p-3 text-orange-500">
                      <ShieldAlert className="h-6 w-6" />
                    </div>
                    <h2 className="mt-5 font-display text-3xl font-semibold text-slate-950">
                      {copy.findTa.rulesTitle}
                    </h2>
                    <p className="mt-4 text-base leading-8 text-slate-700">
                      {copy.findTa.missionDescription}
                    </p>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-card">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                        <h3 className="text-xl font-semibold text-slate-950">
                          {lang === "zh" ? "可以这样聊" : "Allowed Clues"}
                        </h3>
                      </div>
                      <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700 sm:text-base">
                        {copy.findTa.allowed.map((item) => (
                          <li className="flex gap-3" key={item}>
                            <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-card">
                      <div className="flex items-center gap-3">
                        <ShieldAlert className="h-6 w-6 text-orange-600" />
                        <h3 className="text-xl font-semibold text-slate-950">
                          {lang === "zh" ? "不要这样做" : "Do Not Reveal"}
                        </h3>
                      </div>
                      <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700 sm:text-base">
                        {copy.findTa.forbidden.map((item) => (
                          <li className="flex gap-3" key={item}>
                            <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Container>
            </section>

            <section className="py-12 sm:py-16">
              <Container>
                <div className="overflow-hidden rounded-[1.25rem] bg-[#7c2d12] text-white shadow-[0_20px_58px_rgba(88,42,18,0.18)]">
                  <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
                    <div className="relative min-h-72">
                      <img
                        alt={copy.findTa.missionTitle}
                        className="absolute inset-0 h-full w-full object-cover"
                        src="/find-ta-hero.png"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2b160e]/72 via-transparent to-transparent" />
                    </div>
                    <div className="p-6 sm:p-8 lg:p-10">
                      <div className="inline-flex rounded-2xl bg-white/12 p-3 text-orange-100 ring-1 ring-white/20">
                        <Handshake className="h-6 w-6" />
                      </div>
                      <h2 className="mt-6 font-display text-3xl font-semibold leading-tight sm:text-4xl">
                        {copy.findTa.missionTitle}
                      </h2>
                      <p className="mt-5 text-base leading-8 text-orange-50/90">
                        {copy.findTa.missionDescription}
                      </p>
                      <p className="mt-5 rounded-2xl border border-white/12 bg-white/10 p-5 text-base leading-8 text-orange-50/90">
                        {lang === "zh"
                          ? "挑战成功后，小队成员完成击掌，并由现场同工确认进入下一阶段。"
                          : "After a successful match, teammates high-five and ask the on-site team to confirm the next stage."}
                      </p>
                    </div>
                  </div>
                </div>
              </Container>
            </section>
          </>
        ) : null}

        {showMemories ? (
          <section className="border-y border-orange-100/80 bg-[#fff8ef] py-12 sm:py-16">
            <Container>
              <div className="mb-8 max-w-3xl">
                <div className="inline-flex rounded-lg bg-white p-3 text-orange-500 shadow-sm">
                  <Images className="h-6 w-6" />
                </div>
                <p className="mt-5 text-sm font-semibold tracking-[0.18em] text-[#9a4a1f]">
                  {copy.memories.eyebrow}
                </p>
                <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl">
                  {copy.memories.title}
                </h2>
              </div>

              <MemoryExperience items={copy.memories.items} lang={lang} />
            </Container>
          </section>
        ) : null}

        {showJoin ? (
          <section className="py-12 sm:py-16">
            <Container>
              <SectionHeading
                description={copy.join.description}
                eyebrow={copy.join.eyebrow}
                title={copy.join.title}
              />

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {copy.join.items.map((item) => (
                  <div className="section-card flex h-full flex-col" key={item.title}>
                    <div className="rounded-lg bg-orange-50 p-3 text-orange-500">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-5 text-xl font-semibold text-slate-950">{item.title}</h3>
                    <p className="mt-3 flex-1 text-sm leading-7 text-slate-700 sm:text-base">
                      {item.description}
                    </p>
                    <div className="mt-6">
                      <CTAButton href={getPagePath(lang, "contact")} size="sm">
                        {copy.hero.secondaryCta}
                      </CTAButton>
                    </div>
                  </div>
                ))}
              </div>
            </Container>
          </section>
        ) : null}

        {showContact ? (
          <section className="pb-16 pt-12 sm:pb-20 sm:pt-16">
            <Container>
              <SectionHeading
                description={copy.contact.description}
                eyebrow={copy.contact.eyebrow}
                title={copy.contact.title}
              />

              <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                <ContactForm lang={lang} />

                <div className="space-y-5">
                  <div className="rounded-xl border border-orange-100 bg-white/95 p-6 shadow-card">
                    <p className="text-sm font-semibold tracking-[0.18em] text-[#9a4a1f]">
                      {copy.contact.headingEyebrow}
                    </p>
                    <h3 className="mt-3 font-display text-2xl font-semibold text-slate-950">
                      {copy.contact.headingTitle}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {copy.contact.audienceDescription}
                    </p>
                  </div>

                  <div className="rounded-xl border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-amber-50 p-6 shadow-card">
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-white p-3 text-orange-500 shadow-sm">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{copy.contact.givingTitle}</p>
                        <p className="mt-2 text-sm leading-7 text-slate-600">
                          {copy.contact.givingDescription}
                        </p>
                      </div>
                    </div>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <a
                        className="inline-flex min-h-24 items-center justify-center gap-2 rounded-xl bg-[#8f2d12] px-4 py-4 text-center text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#a93616]"
                        href={REVOLUT_GIVING_URL}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <CreditCard className="h-4 w-4 shrink-0" />
                        <span>{copy.contact.givingRevolutLabel}</span>
                        <ArrowUpRight className="h-4 w-4 shrink-0" />
                      </a>
                      <div className="rounded-xl border border-orange-100 bg-white px-4 py-3 shadow-sm">
                        <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                          <MessageCircle className="h-4 w-4 text-orange-500" />
                          {copy.contact.givingWechatLabel}
                        </p>
                        <p className="mt-2 select-all break-all font-semibold text-[#9a4a1f]">{WECHAT_ID}</p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {copy.contact.givingWechatDescription}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    <div className="rounded-xl border border-orange-100 bg-white/95 p-5 shadow-card">
                      <p className="font-semibold text-slate-900">{copy.contact.socialTitle}</p>
                      <a
                        className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-orange-600 transition hover:text-orange-700"
                        href={INSTAGRAM_URL}
                        rel="noreferrer"
                        target="_blank"
                      >
                        <Instagram className="h-4 w-4 text-orange-500" />
                        Instagram: {INSTAGRAM_HANDLE}
                      </a>
                      <p className="mt-2 text-sm leading-7 text-slate-600">{copy.contact.socialDescription}</p>
                    </div>
                    <div className="rounded-xl border border-orange-100 bg-white/95 p-5 shadow-card">
                      <p className="font-semibold text-slate-900">{copy.contact.audienceTitle}</p>
                      <p className="mt-2 text-sm leading-7 text-slate-600">{copy.contact.audienceDescription}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </section>
        ) : null}
      </main>

      <footer className="border-t border-stone-200/80 bg-white/75 py-8">
        <Container className="flex flex-col gap-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {copy.footer.copyright}</p>
          <p className="font-medium text-[#8a3a18]">{copy.footer.statement}</p>
        </Container>
      </footer>
    </>
  );
}
