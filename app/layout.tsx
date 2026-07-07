import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";
import { CONTACT_EMAIL, GOOGLE_FORM_URL, INSTAGRAM_URL, SITE_URL } from "@/lib/site";
import "./globals.css";

const title = "心火欧洲青年事工 | Hearts on Fire Youth Ministry of Europe";
const description =
  "连接欧洲青年，扎根真理，活出使命。Hearts on Fire Youth Ministry of Europe connects, disciples, and equips young people across Europe through camps, online gatherings, and cross-border companionship.";

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Hearts on Fire Youth Ministry of Europe",
    alternateName: ["心火欧洲青年事工", "Hearts on Fire"],
    url: SITE_URL,
    logo: `${SITE_URL}/logo.jpg`,
    email: CONTACT_EMAIL,
    sameAs: [INSTAGRAM_URL],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "general inquiry",
        email: CONTACT_EMAIL,
        availableLanguage: ["zh", "en"]
      }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Hearts on Fire Youth Ministry of Europe",
    url: SITE_URL,
    inLanguage: ["zh-Hans", "en"],
    potentialAction: {
      "@type": "CommunicateAction",
      name: "Open ministry interest form",
      target: GOOGLE_FORM_URL
    }
  }
];

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  keywords: [
    "心火欧洲青年事工",
    "Hearts on Fire",
    "Hearts on Fire Youth Ministry of Europe",
    "欧洲青年事工",
    "跨国青年营会",
    "基督徒青年平台",
    "European youth ministry",
    "Christian youth network in Europe"
  ],
  icons: {
    icon: "/logo.jpg",
    shortcut: "/logo.jpg",
    apple: "/logo.jpg"
  },
  openGraph: {
    title,
    description,
    type: "website",
    locale: "zh_CN",
    alternateLocale: ["en_US"],
    siteName: "心火欧洲青年事工 | Hearts on Fire",
    url: SITE_URL,
    images: [
      {
        url: "/opengraph-card.png",
        width: 1200,
        height: 630,
        alt: "Hearts on Fire Youth Ministry of Europe"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/opengraph-card.png"]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="zh-Hans">
      <body className="min-h-screen bg-[var(--background)] bg-warm-radial font-sans text-slate-900 antialiased">
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
          type="application/ld+json"
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
