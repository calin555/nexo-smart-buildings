import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicContentPageView } from "@/components/public-content-page";
import { getContentPage, servicePages } from "@/modules/public-content";

export function generateStaticParams() {
  return Object.keys(servicePages).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: Readonly<{ params: Promise<{ slug: string }> }>): Promise<Metadata> {
  const { slug } = await params;
  const page = getContentPage(servicePages, slug);
  if (!page) return {};
  return { title: page.title, description: page.description };
}

export default async function ServicePage({
  params,
}: Readonly<{ params: Promise<{ slug: string }> }>) {
  const { slug } = await params;
  const page = getContentPage(servicePages, slug);
  if (!page) notFound();
  return <PublicContentPageView page={page} />;
}
