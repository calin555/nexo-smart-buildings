import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicContentPageView } from "@/components/public-content-page";
import { buildSeoMetadata } from "@/lib/seo";
import { localPages } from "@/modules/seo-content";

const areaNames: Record<string, string> = {
  "cluj-napoca": "Cluj-Napoca, România",
  brasov: "Brașov, România",
  transilvania: "Transilvania, România",
};

export function generateStaticParams() {
  return Object.keys(localPages).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: Readonly<{ params: Promise<{ slug: string }> }>): Promise<Metadata> {
  const { slug } = await params;
  const page = localPages[slug];
  if (!page) return {};
  return buildSeoMetadata(page, `/automatizari-smart/${slug}`);
}

export default async function LocalSeoPage({
  params,
}: Readonly<{ params: Promise<{ slug: string }> }>) {
  const { slug } = await params;
  const page = localPages[slug];
  if (!page) notFound();
  return (
    <PublicContentPageView
      page={page}
      path={`/automatizari-smart/${slug}`}
      areaServed={areaNames[slug] ?? "România"}
      breadcrumbs={[
        { label: "Acasă", href: "/" },
        { label: "Automatizări smart", href: "/automatizari-smart" },
        { label: page.title, href: `/automatizari-smart/${slug}` },
      ]}
    />
  );
}
