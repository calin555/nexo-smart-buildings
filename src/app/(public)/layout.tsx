import type { ReactNode } from "react";

import { PublicFooter } from "@/components/public-footer";
import { SiteHeader } from "@/components/site-header";

export default function PublicLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      {children}
      <PublicFooter />
    </div>
  );
}
