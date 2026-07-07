import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LandingPage } from "@/components/LandingPage";
import { getPageMetadata } from "@/lib/site-content";
import { getSectionSegment, getSectionView, sectionViews, type SectionView } from "@/lib/site-routes";

type SectionPageProps = {
  params: {
    section: string;
  };
};

export function generateStaticParams() {
  return sectionViews.map((section) => ({ section: getSectionSegment(section) }));
}

export function generateMetadata({ params }: SectionPageProps): Metadata {
  const view = getSectionView(params.section);

  return view ? getPageMetadata("zh", view) : {};
}

export default function ChineseSectionPage({ params }: SectionPageProps) {
  const view = getSectionView(params.section);

  if (!view) {
    notFound();
  }

  return <LandingPage lang="zh" view={view} />;
}
