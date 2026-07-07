import type { Language } from "@/components/Navbar";

export type SiteView =
  | "home"
  | "about"
  | "origin"
  | "vision"
  | "what-we-do"
  | "memories"
  | "find-ta"
  | "join"
  | "contact";
export type SectionView = Exclude<SiteView, "home">;

export const sectionViews: SectionView[] = [
  "about",
  "origin",
  "vision",
  "what-we-do",
  "memories",
  "find-ta",
  "join",
  "contact"
];

const routeSegments: Record<SectionView, string> = {
  about: "about",
  origin: "origin",
  vision: "vision",
  "what-we-do": "what-we-do",
  memories: "memories",
  "find-ta": "find-ta",
  join: "join",
  contact: "contact"
};

export function getSectionSegment(view: SectionView): string {
  return routeSegments[view];
}

export function getPagePath(lang: Language, view: SiteView): string {
  if (view === "home") {
    return lang === "zh" ? "/" : "/en";
  }

  const segment = routeSegments[view];

  return lang === "zh" ? `/${segment}` : `/en/${segment}`;
}

export function getSectionView(section: string): SectionView | null {
  const view = sectionViews.find((item) => routeSegments[item] === section);

  return view ?? null;
}
