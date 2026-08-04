import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicContentPageView } from "@/components/public-content-page";
import { buildSeoMetadata } from "@/lib/seo";
import { guidePages } from "@/modules/seo-content";

export function generateStaticParams() {
  return Object.keys(guidePages).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: Readonly<{ params: Promise<{ slug: string }> }>): Promise<Metadata> {
  const { slug } = await params;
  const page = guidePages[slug];
  if (!page) return {};
  return buildSeoMetadata(page, `/ghiduri/${slug}`);
}

export default async function GuidePage({
  params,
}: Readonly<{ params: Promise<{ slug: string }> }>) {
  const { slug } = await params;
  const page = guidePages[slug];
  if (!page) notFound();
  return (
    <PublicContentPageView
      page={page}
      path={`/ghiduri/${slug}`}
      breadcrumbs={[
        { label: "Acasă", href: "/" },
        { label: "Ghiduri", href: "/ghiduri" },
        { label: page.title, href: `/ghiduri/${slug}` },
      ]}
    />
  );
}
