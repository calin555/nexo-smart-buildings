import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicContentPageView } from "@/components/public-content-page";
import { buildSeoMetadata } from "@/lib/seo";
import { getContentPage, rootPages } from "@/modules/public-content";
import { pillarPages } from "@/modules/seo-content";

const pages = { ...rootPages, ...pillarPages };

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: Readonly<{ params: Promise<{ slug: string }> }>): Promise<Metadata> {
  const { slug } = await params;
  const page = getContentPage(pages, slug);
  if (!page) return {};
  return buildSeoMetadata(page, `/${slug}`);
}

export default async function RootContentPage({
  params,
}: Readonly<{ params: Promise<{ slug: string }> }>) {
  const { slug } = await params;
  const page = getContentPage(pages, slug);
  if (!page) notFound();
  return (
    <PublicContentPageView
      page={page}
      path={`/${slug}`}
      breadcrumbs={[
        { label: "Acasă", href: "/" },
        { label: page.title, href: `/${slug}` },
      ]}
    />
  );
}
