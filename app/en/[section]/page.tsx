import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LandingPage } from "@/components/LandingPage";
import { getPageMetadata } from "@/lib/site-content";
import { getSectionSegment, getSectionView, sectionViews, type SectionView } from "@/lib/site-routes";

type SectionPageProps = {
  params: Promise<{
    section: string;
  }>;
};

export function generateStaticParams() {
  return sectionViews.map((section) => ({ section: getSectionSegment(section) }));
}

export async function generateMetadata(props: SectionPageProps): Promise<Metadata> {
  const params = await props.params;
  const view = getSectionView(params.section);

  return view ? getPageMetadata("en", view) : {};
}

export default async function EnglishSectionPage(props: SectionPageProps) {
  const params = await props.params;
  const view = getSectionView(params.section);

  if (!view) {
    notFound();
  }

  return <LandingPage lang="en" view={view} />;
}
