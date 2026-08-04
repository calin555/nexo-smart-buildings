import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicContentPageView } from "@/components/public-content-page";
import { getContentPage, resourcePages } from "@/modules/public-content";

export function generateStaticParams() {
  return Object.keys(resourcePages).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: Readonly<{ params: Promise<{ slug: string }> }>): Promise<Metadata> {
  const { slug } = await params;
  const page = getContentPage(resourcePages, slug);
  if (!page) return {};
  return { title: page.title, description: page.description };
}

export default async function ResourcePage({
  params,
}: Readonly<{ params: Promise<{ slug: string }> }>) {
  const { slug } = await params;
  const page = getContentPage(resourcePages, slug);
  if (!page) notFound();
  return <PublicContentPageView page={page} />;
}
