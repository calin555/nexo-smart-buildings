import type { ReactNode } from "react";

import { SiteHeader } from "@/components/site-header";

export default function PublicLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-screen bg-cloud">
      <SiteHeader />
      {children}
      <footer className="border-t border-slate/15 px-5 py-8 text-center text-sm text-slate">
        NEXO Smart Buildings · Fundație MVP demonstrativă
      </footer>
    </div>
  );
}
