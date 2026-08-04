import type { Metadata } from "next";

import type { PublicContentPage } from "@/modules/public-content";

export const siteName = "N3XO Smart Buildings";
export const defaultOgImage = "/images/projects/casa-inteligenta-cluj-technical.png";

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

export function absoluteUrl(path: string): string {
  return `${getSiteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildSeoMetadata(page: PublicContentPage, path: string): Metadata {
  const title = page.seoTitle ?? `${page.title} | ${siteName}`;
  const description = page.seoDescription ?? page.description;
  const image = page.ogImage ?? defaultOgImage;

  return {
    title: { absolute: title },
    description,
    keywords: page.keywords ? [...page.keywords] : undefined,
    alternates: { canonical: path },
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
      type: page.contentType === "article" ? "article" : "website",
      locale: "ro_RO",
      url: path,
      siteName,
      title,
      description,
      images: [{ url: image, width: 1672, height: 941, alt: page.title }],
      ...(page.contentType === "article"
        ? {
            publishedTime: page.publishedTime,
            modifiedTime: page.modifiedTime ?? page.publishedTime,
            authors: ["N3XO Smart Buildings"],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export type BreadcrumbItem = Readonly<{ label: string; href: string }>;

type StructuredDataValue =
  | string
  | number
  | boolean
  | null
  | StructuredDataValue[]
  | { [key: string]: StructuredDataValue };

export function StructuredData({ data }: Readonly<{ data: StructuredDataValue }>) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function OrganizationSchema() {
  const siteUrl = getSiteUrl();
  return (
    <StructuredData
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: siteName,
        url: siteUrl,
        email: "office@nexcore.ro",
        telephone: "+40774542015",
        areaServed: { "@type": "Country", name: "România" },
        knowsAbout: [
          "casă smart",
          "automatizare locuință",
          "KNX",
          "Matter",
          "Google Home",
          "Apple Home",
          "Amazon Alexa",
          "Home Assistant",
        ],
      }}
    />
  );
}

export function PageSchemas({
  page,
  path,
  breadcrumbs,
  areaServed,
}: Readonly<{
  page: PublicContentPage;
  path: string;
  breadcrumbs: readonly BreadcrumbItem[];
  areaServed?: string;
}>) {
  const url = absoluteUrl(path);
  const graph: StructuredDataValue[] = [
    {
      "@type": page.contentType === "article" ? "Article" : "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: page.seoTitle ?? page.title,
      headline: page.title,
      description: page.seoDescription ?? page.description,
      inLanguage: "ro-RO",
      isPartOf: { "@id": `${getSiteUrl()}/#website` },
      about: [...(page.keywords ?? [])],
      ...(page.contentType === "article"
        ? {
            datePublished: page.publishedTime ?? "2026-08-04",
            dateModified: page.modifiedTime ?? page.publishedTime ?? "2026-08-04",
            author: { "@id": `${getSiteUrl()}/#organization` },
          }
        : {}),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
        item: absoluteUrl(item.href),
      })),
    },
  ];

  if (page.schemaType === "Service") {
    graph.push({
      "@type": "Service",
      "@id": `${url}#service`,
      name: page.title,
      description: page.description,
      url,
      provider: { "@id": `${getSiteUrl()}/#organization` },
      areaServed: areaServed ?? "România",
      serviceType: page.serviceType ?? page.title,
    });
  }

  if (page.faq && page.faq.length > 0) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: page.faq.map(({ question, answer }) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    });
  }

  return <StructuredData data={{ "@context": "https://schema.org", "@graph": graph }} />;
}
