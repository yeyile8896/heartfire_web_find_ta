import type { Metadata } from "next";
import { LandingPage } from "@/components/LandingPage";
import { getPageMetadata } from "@/lib/site-content";

export const metadata: Metadata = getPageMetadata("en", "home");

export default function EnglishPage() {
  return <LandingPage lang="en" />;
}
