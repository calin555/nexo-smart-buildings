import { ChevronDown, FileUp, Menu, UserRound, X } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

import { Brand } from "@/components/brand";

const solutionLinks = [
  ["/solutii/case-smart", "Case Smart"],
  ["/solutii/apartamente-smart", "Apartamente Smart"],
  ["/solutii/blocuri-smart", "Blocuri Smart"],
  ["/solutii/pensiuni-hoteluri-smart", "Pensiuni și Hoteluri Smart"],
] as const;

const technologyLinks = [
  ["/solutii/automatizare-knx", "Automatizare KNX"],
  ["/solutii/securitate", "Securitate"],
  ["/solutii/energie-eficienta", "Energie și Eficiență"],
] as const;

const mobileLinks = [
  ["/", "Acasă"],
  ...solutionLinks,
  ...technologyLinks,
  ["/configurator-pe-plan", "Configurator pe plan"],
  ["/kituri", "Kituri"],
  ["/proiecte", "Proiecte"],
  ["/ghiduri", "Ghiduri"],
  ["/despre-noi", "Despre noi"],
  ["/solicita-oferta", "Solicită ofertă"],
  ["/login", "Portal client"],
] as const;

function Dropdown({
  label,
  links,
}: Readonly<{ label: string; links: ReadonlyArray<readonly [string, string]> }>) {
  return (
    <details className="group relative">
      <summary className="flex cursor-pointer list-none items-center gap-1 py-7 text-xs font-semibold text-ink transition hover:text-emerald-700 [&::-webkit-details-marker]:hidden">
        {label}
        <ChevronDown className="size-3.5 transition group-open:rotate-180" />
      </summary>
      <div className="absolute left-0 top-[4.2rem] min-w-64 rounded-xl border border-[#dce5e0] bg-white p-2 shadow-[0_15px_35px_rgba(7,21,29,.12)]">
        {links.map(([href, text]) => (
          <Link
            key={href}
            href={href as Route}
            className="block rounded-lg px-3 py-2.5 text-sm text-ink transition hover:bg-cloud hover:text-emerald-700"
          >
            {text}
          </Link>
        ))}
      </div>
    </details>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-white shadow-[0_2px_10px_rgba(7,21,29,.10)]">
      <div className="mx-auto flex min-h-[4.5rem] max-w-[1600px] items-center gap-4 px-4 sm:px-5 lg:min-h-[5rem] lg:px-8">
        <Brand />
        <nav
          aria-label="Navigare principală"
          className="ml-4 hidden items-center gap-5 whitespace-nowrap lg:flex"
        >
          <Dropdown label="SOLUȚII" links={solutionLinks} />
          <Dropdown label="TEHNOLOGII" links={technologyLinks} />
          <Link href="/kituri" className="text-xs font-semibold text-ink hover:text-emerald-700">
            KITURI
          </Link>
          <Link
            href={"/proiecte" as Route}
            className="text-xs font-semibold text-ink hover:text-emerald-700"
          >
            PROIECTE
          </Link>
          <Link
            href={"/ghiduri" as Route}
            className="hidden text-xs font-semibold text-ink hover:text-emerald-700 xl:block"
          >
            GHIDURI
          </Link>
          <Link
            href={"/despre-noi" as Route}
            className="hidden text-xs font-semibold text-ink hover:text-emerald-700 2xl:block"
          >
            DESPRE NOI
          </Link>
        </nav>
        <div className="ml-auto hidden items-center gap-3 lg:flex">
          <Link
            href={"/configurator-pe-plan" as Route}
            className="inline-flex items-center rounded-lg border border-[#cbd8d2] px-4 py-2.5 text-xs font-semibold text-ink transition hover:border-emerald-700"
          >
            <FileUp className="mr-2 size-4" /> Configurator pe plan
          </Link>
          <Link
            href={"/solicita-oferta" as Route}
            className="rounded-lg bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-800"
          >
            Solicită ofertă
          </Link>
          <Link
            href="/login"
            aria-label="Portal client"
            className="grid size-10 place-items-center rounded-lg border border-[#cbd8d2] text-[#0067ae] transition hover:border-emerald-700 hover:text-emerald-700"
          >
            <UserRound className="size-4" />
          </Link>
        </div>
        <details className="group ml-auto lg:hidden">
          <summary
            aria-label="Meniu principal"
            className="grid size-11 cursor-pointer list-none place-items-center rounded-lg border border-slate/15 text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 [&::-webkit-details-marker]:hidden"
          >
            <Menu className="size-6 group-open:hidden" />
            <X className="hidden size-6 group-open:block" />
          </summary>
          <nav
            aria-label="Navigare mobilă"
            className="fixed inset-x-0 top-[4.5rem] max-h-[calc(100vh-4.5rem)] overflow-y-auto border-t border-slate/10 bg-white px-4 py-4 shadow-[0_14px_24px_rgba(7,21,29,.10)]"
          >
            <div className="mx-auto grid max-w-[1600px] gap-1">
              {mobileLinks.map(([href, label]) => (
                <Link
                  key={`${href}-${label}`}
                  href={href as Route}
                  className="rounded-lg px-3 py-3 text-sm font-semibold text-ink transition hover:bg-cloud"
                >
                  {label}
                </Link>
              ))}
            </div>
          </nav>
        </details>
      </div>
    </header>
  );
}
