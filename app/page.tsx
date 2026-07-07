import { LandingPage } from "@/components/LandingPage";
import { getPageMetadata } from "@/lib/site-content";

export const metadata = getPageMetadata("zh", "home");

export default function Home() {
  return <LandingPage lang="zh" />;
}
