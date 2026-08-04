import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicContentPageView } from "@/components/public-content-page";
import { buildSeoMetadata } from "@/lib/seo";
import { getContentPage, type PublicContentPage, servicePages } from "@/modules/public-content";
import { serviceSeoEnhancements } from "@/modules/seo-content";

function getServicePage(slug: string): PublicContentPage | undefined {
  const page = getContentPage(servicePages, slug);
  if (!page) return undefined;
  return { ...page, ...(serviceSeoEnhancements[slug] ?? {}) };
}

export function generateStaticParams() {
  return Object.keys(servicePages).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: Readonly<{ params: Promise<{ slug: string }> }>): Promise<Metadata> {
  const { slug } = await params;
  const page = getServicePage(slug);
  if (!page) return {};
  return buildSeoMetadata(page, `/servicii/${slug}`);
}

export default async function ServicePage({
  params,
}: Readonly<{ params: Promise<{ slug: string }> }>) {
  const { slug } = await params;
  const page = getServicePage(slug);
  if (!page) notFound();
  return (
    <PublicContentPageView
      page={page}
      path={`/servicii/${slug}`}
      breadcrumbs={[
        { label: "Acasă", href: "/" },
        { label: "Servicii", href: "/servicii" },
        { label: page.title, href: `/servicii/${slug}` },
      ]}
    />
  );
}
