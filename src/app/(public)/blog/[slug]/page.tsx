import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicContentPageView } from "@/components/public-content-page";
import { buildSeoMetadata } from "@/lib/seo";
import { blogPages } from "@/modules/seo-content";

export function generateStaticParams() {
  return Object.keys(blogPages).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: Readonly<{ params: Promise<{ slug: string }> }>): Promise<Metadata> {
  const { slug } = await params;
  const page = blogPages[slug];
  if (!page) return {};
  return buildSeoMetadata(page, `/blog/${slug}`);
}

export default async function BlogArticlePage({
  params,
}: Readonly<{ params: Promise<{ slug: string }> }>) {
  const { slug } = await params;
  const page = blogPages[slug];
  if (!page) notFound();
  return (
    <PublicContentPageView
      page={page}
      path={`/blog/${slug}`}
      breadcrumbs={[
        { label: "Acasă", href: "/" },
        { label: "Blog", href: "/blog" },
        { label: page.title, href: `/blog/${slug}` },
      ]}
    />
  );
}
