import Link from "next/link";

import { Brand } from "@/components/brand";

export function SiteHeader() {
  return (
    <header className="border-b border-slate/15 bg-white">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-5">
        <Brand />
        <nav aria-label="Navigare principală" className="flex items-center gap-5 text-sm font-medium text-slate">
          <Link href="/">Servicii</Link>
          <Link href="/login" className="rounded-lg bg-ink px-4 py-2 text-white transition hover:bg-ink/90">
            Autentificare
          </Link>
        </nav>
      </div>
    </header>
  );
}
