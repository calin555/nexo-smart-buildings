import Link from "next/link";
import { ChevronDown, Search, ShoppingCart, UserRound } from "lucide-react";

import { Brand } from "@/components/brand";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-white shadow-[0_2px_10px_rgba(7,21,29,.10)]">
      <div className="mx-auto flex min-h-[5rem] max-w-[1600px] items-center gap-7 px-5 lg:px-8">
        <Brand />
        <nav aria-label="Navigare principală" className="hidden items-center gap-7 whitespace-nowrap text-xs font-medium text-ink lg:flex">
          <Link href="/#catalog" className="inline-flex items-center gap-1 hover:text-emerald-700">PRODUSE <ChevronDown className="size-3.5" /></Link>
          <Link href="/#produse" className="hover:text-emerald-700">PRODUSE NOI</Link>
          <Link href="/#oferte" className="text-red-600 hover:text-red-700">PROMOȚII</Link>
          <Link href="/#proiecte" className="hover:text-emerald-700">PROIECTE</Link>
          <Link href="/#branduri" className="hover:text-emerald-700">BRAND-URI</Link>
          <Link href="/#ghid" className="hover:text-emerald-700">GHIDURI</Link>
        </nav>
        <a href="#produse" className="ml-auto hidden min-w-[13.5rem] items-center rounded border border-[#d6dcd9] px-3 py-3 text-sm text-slate transition hover:border-[#9eaaa5] xl:flex"><span className="flex-1">Ce soluție smart cauți?</span><Search className="size-4 text-ink" /></a>
        <Link href="/login" className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-sm font-medium text-[#0067ae] hover:text-emerald-700"><UserRound className="size-4" /><span className="hidden sm:inline">Contul meu</span></Link>
        <a href="#discutam" className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-sm text-slate hover:text-ink"><ShoppingCart className="size-4" /><span className="hidden sm:inline">Oferta mea</span></a>
      </div>
    </header>
  );
}
