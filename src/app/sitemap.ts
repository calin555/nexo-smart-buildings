import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/seo";

import { publicSolutions } from "@/modules/public-solutions";
import { legalPages, resourcePages, rootPages, servicePages } from "@/modules/public-content";
import { blogPages, guidePages, localPages, pillarPages } from "@/modules/seo-content";

const staticPaths = [
  "",
  "/kituri",
  "/configurator-kit",
  "/proiecte/bloc-rezidential-cluj",
  "/proiecte/casa-inteligenta-brasov",
  "/proiecte/casa-inteligenta-cluj",
  "/branduri/abb",
  "/branduri/schneider-electric",
  "/branduri/mdt",
  "/branduri/gira",
  "/branduri/jung",
  "/branduri/basalte",
  "/branduri/zennio",
  "/branduri/theben",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const paths = [
    ...staticPaths,
    ...Object.keys(rootPages).map((slug) => `/${slug}`),
    ...Object.keys(pillarPages).map((slug) => `/${slug}`),
    ...Object.keys(servicePages).map((slug) => `/servicii/${slug}`),
    ...Object.keys(resourcePages).map((slug) => `/resurse/${slug}`),
    ...Object.keys(legalPages).map((slug) => `/legal/${slug}`),
    ...Object.keys(localPages).map((slug) => `/automatizari-smart/${slug}`),
    ...Object.keys(guidePages).map((slug) => `/ghiduri/${slug}`),
    ...Object.keys(blogPages).map((slug) => `/blog/${slug}`),
    ...publicSolutions.map(({ slug }) => `/solutii/${slug}`),
  ];

  return [...new Set(paths)].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date("2026-08-04"),
    changeFrequency: path.startsWith("/legal/")
      ? "yearly"
      : path.startsWith("/blog/")
        ? "weekly"
        : "monthly",
    priority:
      path === ""
        ? 1
        : ["/casa-smart", "/automatizare-casa", "/smart-home", "/automatizare-knx"].includes(path)
          ? 0.9
          : 0.7,
  }));
}
