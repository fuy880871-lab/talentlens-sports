import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const incomingHeaders = await headers();
  const host = incomingHeaders.get("x-forwarded-host") ?? incomingHeaders.get("host") ?? "localhost:3000";
  const protocol = incomingHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const imageUrl = `${origin}/og.png`;

  return {
    title: "TalentLens Sports｜体育人才与薪酬决策平台",
    description: "面向体育公司的行业人才、薪酬洞察与组织编制决策平台。",
    openGraph: {
      title: "TalentLens Sports｜体育人才与薪酬决策平台",
      description: "用人才供需、薪酬定位和编制情景测算，支持体育公司的增长决策。",
      url: origin,
      type: "website",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: "TalentLens Sports 体育人才与薪酬决策平台" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "TalentLens Sports｜体育人才与薪酬决策平台",
      description: "体育行业人才、薪酬与组织编制决策平台。",
      images: [imageUrl],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
