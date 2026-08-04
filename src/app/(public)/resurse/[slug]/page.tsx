import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicContentPageView } from "@/components/public-content-page";
import { buildSeoMetadata } from "@/lib/seo";
import { getContentPage, type PublicContentPage, resourcePages } from "@/modules/public-content";
import { resourceSeoEnhancements } from "@/modules/seo-content";

function getResourcePage(slug: string): PublicContentPage | undefined {
  const page = getContentPage(resourcePages, slug);
  if (!page) return undefined;
  return { ...page, ...(resourceSeoEnhancements[slug] ?? {}) };
}

export function generateStaticParams() {
  return Object.keys(resourcePages).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: Readonly<{ params: Promise<{ slug: string }> }>): Promise<Metadata> {
  const { slug } = await params;
  const page = getResourcePage(slug);
  if (!page) return {};
  return buildSeoMetadata(page, `/resurse/${slug}`);
}

export default async function ResourcePage({
  params,
}: Readonly<{ params: Promise<{ slug: string }> }>) {
  const { slug } = await params;
  const page = getResourcePage(slug);
  if (!page) notFound();
  return (
    <PublicContentPageView
      page={page}
      path={`/resurse/${slug}`}
      breadcrumbs={[
        { label: "Acasă", href: "/" },
        { label: "Resurse", href: "/resurse" },
        { label: page.title, href: `/resurse/${slug}` },
      ]}
    />
  );
}
