import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@/app/globals.css";
import { GoogleAnalytics } from "@/components/google-analytics";
import { defaultOgImage, getSiteUrl, siteName } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Casă smart și automatizări KNX | N3XO Smart Buildings",
    template: `%s | ${siteName}`,
  },
  description:
    "Proiectare și implementare pentru case inteligente: KNX, Matter, Google Home, Apple Home, Alexa și Home Assistant.",
  applicationName: siteName,
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
  },
  category: "automatizări pentru clădiri",
  keywords: [
    "casă smart",
    "casă inteligentă",
    "automatizare casă",
    "smart home",
    "automatizare locuință",
    "KNX",
    "Matter",
    "Google Home",
    "Apple Home",
    "Alexa",
    "Home Assistant",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ro_RO",
    url: "/",
    siteName,
    title: "Casă smart și automatizări KNX | N3XO Smart Buildings",
    description:
      "Configurează sistemul smart potrivit casei sau clădirii tale. Proiectare, instalare, programare și mentenanță.",
    images: [
      {
        url: defaultOgImage,
        width: 1672,
        height: 941,
        alt: "Casă inteligentă cu infrastructură de automatizare",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Casă smart și automatizări KNX | N3XO Smart Buildings",
    description: "Proiectare și implementare smart home pentru case și clădiri.",
    images: [defaultOgImage],
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ro">
      <body>
        {children}
        <GoogleAnalytics />
      </body>
    </html>
  );
}
