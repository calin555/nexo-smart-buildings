import type { ReactNode } from "react";

import { PublicFooter } from "@/components/public-footer";
import { SiteHeader } from "@/components/site-header";
import { OrganizationSchema, StructuredData, getSiteUrl } from "@/lib/seo";

export default function PublicLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-screen bg-white">
      <OrganizationSchema />
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": `${getSiteUrl()}/#website`,
          name: "N3XO Smart Buildings",
          url: getSiteUrl(),
          inLanguage: "ro-RO",
          publisher: { "@id": `${getSiteUrl()}/#organization` },
        }}
      />
      <SiteHeader />
      {children}
      <PublicFooter />
    </div>
  );
}
