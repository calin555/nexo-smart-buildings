import { ChevronDown, Menu, Search, ShoppingCart, UserRound, X } from "lucide-react";
import Link from "next/link";

import { Brand } from "@/components/brand";

const navigation = [
  { href: "/#catalog", label: "PRODUSE", emphasized: false },
  { href: "/#produse", label: "PRODUSE NOI", emphasized: false },
  { href: "/#oferte", label: "PROMOȚII", emphasized: true },
  { href: "/#proiecte", label: "PROIECTE", emphasized: false },
  { href: "/#branduri", label: "BRAND-URI", emphasized: false },
  { href: "/#ghid", label: "GHIDURI", emphasized: false },
] as const;

export function SiteHeader() {
  return (
    <header className="relative sticky top-0 z-40 bg-white shadow-[0_2px_10px_rgba(7,21,29,.10)]">
      <div className="mx-auto flex min-h-[4.5rem] max-w-[1600px] items-center gap-4 px-4 sm:px-5 lg:min-h-[5rem] lg:gap-7 lg:px-8">
        <Brand />
        <nav
          aria-label="Navigare principală"
          className="hidden items-center gap-7 whitespace-nowrap text-xs font-medium text-ink lg:flex"
        >
          <Link href="/#catalog" className="inline-flex items-center gap-1 hover:text-emerald-700">
            PRODUSE <ChevronDown className="size-3.5" />
          </Link>
          {navigation.slice(1).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                item.emphasized ? "text-red-600 hover:text-red-700" : "hover:text-emerald-700"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <a
          href="#produse"
          className="ml-auto hidden min-w-[13.5rem] items-center rounded border border-[#d6dcd9] px-3 py-3 text-sm text-slate transition hover:border-[#9eaaa5] xl:flex"
        >
          <span className="flex-1">Ce soluție smart cauți?</span>
          <Search className="size-4 text-ink" />
        </a>
        <Link
          href="/login"
          className="hidden shrink-0 items-center gap-1.5 whitespace-nowrap text-sm font-medium text-[#0067ae] hover:text-emerald-700 lg:inline-flex"
        >
          <UserRound className="size-4" />
          <span>Contul meu</span>
        </Link>
        <a
          href="#discutam"
          className="hidden shrink-0 items-center gap-1.5 whitespace-nowrap text-sm text-slate hover:text-ink lg:inline-flex"
        >
          <ShoppingCart className="size-4" />
          <span>Oferta mea</span>
        </a>
        <details className="group ml-auto lg:hidden">
          <summary
            aria-label="Meniu principal"
            className="grid size-11 cursor-pointer list-none place-items-center rounded-lg border border-slate/15 text-ink transition hover:border-emerald-700 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden"
          >
            <Menu className="size-6 group-open:hidden" />
            <X className="hidden size-6 group-open:block" />
          </summary>
          <nav
            id="mobile-navigation"
            aria-label="Navigare mobilă"
            className="fixed inset-x-0 top-[4.5rem] border-t border-slate/10 bg-white px-4 pb-5 pt-2 shadow-[0_14px_24px_rgba(7,21,29,.10)]"
          >
            <div className="mx-auto grid max-w-[1600px] gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-3 text-sm font-semibold transition hover:bg-cloud ${item.emphasized ? "text-red-600" : "text-ink"}`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="my-2 h-px bg-slate/10" />
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-semibold text-[#0067ae] transition hover:bg-cloud"
              >
                <UserRound className="size-4" /> Contul meu
              </Link>
              <Link
                href="/#discutam"
                className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-cloud"
              >
                <ShoppingCart className="size-4" /> Cere o ofertă
              </Link>
            </div>
          </nav>
        </details>
      </div>
    </header>
  );
}
