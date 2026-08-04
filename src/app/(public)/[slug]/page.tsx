import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicContentPageView } from "@/components/public-content-page";
import { getContentPage, rootPages } from "@/modules/public-content";

export function generateStaticParams() {
  return Object.keys(rootPages).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: Readonly<{ params: Promise<{ slug: string }> }>): Promise<Metadata> {
  const { slug } = await params;
  const page = getContentPage(rootPages, slug);
  if (!page) return {};
  return { title: page.title, description: page.description };
}

export default async function RootContentPage({
  params,
}: Readonly<{ params: Promise<{ slug: string }> }>) {
  const { slug } = await params;
  const page = getContentPage(rootPages, slug);
  if (!page) notFound();
  return <PublicContentPageView page={page} />;
}
