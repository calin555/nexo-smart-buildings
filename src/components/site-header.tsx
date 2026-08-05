"use client";

import { ChevronDown, FileUp, LayoutDashboard, LogOut, Menu, UserRound, X } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { Brand } from "@/components/brand";
import type { SessionIdentity } from "@/lib/auth";

function closeDetailsAfterNavigation(ref: React.RefObject<HTMLDetailsElement | null>): void {
  window.setTimeout(() => ref.current?.removeAttribute("open"), 0);
}

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
] as const;

function GoogleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 18 18" className="size-4 shrink-0">
      <path fill="#4285F4" d="M17.64 9.205c0-.638-.057-1.252-.164-1.841H9v3.482h4.844a4.14 4.14 0 0 1-1.797 2.716v2.258h2.909c1.702-1.567 2.684-3.875 2.684-6.615Z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.468-.806 5.956-2.18l-2.909-2.258c-.806.54-1.836.859-3.047.859-2.344 0-4.328-1.585-5.037-3.714H.956v2.332A9 9 0 0 0 9 18Z" />
      <path fill="#FBBC05" d="M3.963 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.281-1.707V4.961H.956A9 9 0 0 0 0 9c0 1.452.347 2.827.956 4.039l3.007-2.332Z" />
      <path fill="#EA4335" d="M9 3.579c1.322 0 2.508.454 3.441 1.346l2.581-2.581C13.464.892 11.426 0 9 0A9 9 0 0 0 .956 4.961l3.007 2.332C4.672 5.164 6.656 3.579 9 3.579Z" />
    </svg>
  );
}

function AccountMenu({ currentUser }: Readonly<{ currentUser: SessionIdentity }>) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const initial = currentUser.name.trim().charAt(0).toUpperCase() || "U";
  const isGoogle = currentUser.provider === "google";
  const workspaceHref = currentUser.isAdmin ? "/admin" : "/portal";
  const workspaceLabel = currentUser.isAdmin ? "Administrare" : "Portal client";

  return (
    <details ref={detailsRef} className="group relative">
      <summary
        aria-label={`Meniu cont ${currentUser.name}`}
        className="relative grid size-10 cursor-pointer list-none place-items-center rounded-full bg-emerald-800 text-sm font-bold text-white ring-1 ring-emerald-900/10 transition hover:bg-emerald-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden"
      >
        {initial}
        {isGoogle ? (
          <span className="absolute -bottom-1 -right-1 grid size-5 place-items-center rounded-full border-2 border-white bg-white shadow-sm">
            <GoogleMark />
          </span>
        ) : null}
      </summary>
      <div className="absolute right-0 top-12 w-72 overflow-hidden rounded-xl border border-[#dce5e0] bg-white shadow-[0_18px_45px_rgba(7,21,29,.16)]">
        <div className="border-b border-[#e2e9e5] px-4 py-4">
          <p className="truncate text-sm font-semibold text-ink">{currentUser.name}</p>
          <p className="mt-0.5 truncate text-xs text-slate">{currentUser.email}</p>
          <p className="mt-3 flex items-center gap-2 text-xs font-medium text-ink">
            {isGoogle ? <GoogleMark /> : <UserRound className="size-4 text-emerald-700" />}
            {isGoogle ? "Conectat cu Google" : "Cont autentificat"}
          </p>
        </div>
        <div className="p-2">
          <Link
            href={workspaceHref}
            onClick={() => closeDetailsAfterNavigation(detailsRef)}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink transition hover:bg-cloud"
          >
            <LayoutDashboard className="size-4 text-emerald-700" /> {workspaceLabel}
          </Link>
          <Link
            href="/portal#profil"
            onClick={() => closeDetailsAfterNavigation(detailsRef)}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink transition hover:bg-cloud"
          >
            <UserRound className="size-4 text-emerald-700" /> Profilul meu
          </Link>
          <form action="/api/auth/logout" method="post">
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-700 transition hover:bg-red-50"
            >
              <LogOut className="size-4" /> Deconectare
            </button>
          </form>
        </div>
      </div>
    </details>
  );
}

function Dropdown({
  label,
  links,
}: Readonly<{ label: string; links: ReadonlyArray<readonly [string, string]> }>) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  return (
    <details ref={detailsRef} className="group relative">
      <summary className="flex cursor-pointer list-none items-center gap-1 py-7 text-xs font-semibold text-ink transition hover:text-emerald-700 [&::-webkit-details-marker]:hidden">
        {label}
        <ChevronDown className="size-3.5 transition group-open:rotate-180" />
      </summary>
      <div className="absolute left-0 top-[4.2rem] min-w-64 rounded-xl border border-[#dce5e0] bg-white p-2 shadow-[0_15px_35px_rgba(7,21,29,.12)]">
        {links.map(([href, text]) => (
          <Link
            key={href}
            href={href as Route}
            onClick={() => closeDetailsAfterNavigation(detailsRef)}
            className="block rounded-lg px-3 py-2.5 text-sm text-ink transition hover:bg-cloud hover:text-emerald-700"
          >
            {text}
          </Link>
        ))}
      </div>
    </details>
  );
}

export function SiteHeader({ currentUser }: Readonly<{ currentUser: SessionIdentity | null }>) {
  const mobileMenuRef = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.dataset.appHydrated = "true";
    mobileMenuRef.current?.removeAttribute("open");

    return () => {
      delete document.documentElement.dataset.appHydrated;
    };
  }, [pathname]);

  return (
    <header className="isolate sticky top-0 z-[100] bg-white shadow-[0_2px_10px_rgba(7,21,29,.10)]">
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
          {currentUser ? (
            <AccountMenu currentUser={currentUser} />
          ) : (
            <Link
              href="/login"
              aria-label="Portal client"
              className="grid size-10 place-items-center rounded-lg border border-[#cbd8d2] text-[#0067ae] transition hover:border-emerald-700 hover:text-emerald-700"
            >
              <UserRound className="size-4" />
            </Link>
          )}
        </div>
        <details ref={mobileMenuRef} className="group ml-auto lg:hidden">
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
              {currentUser ? (
                <div className="mt-3 border-t border-slate/10 pt-3">
                  <div className="mb-2 rounded-lg bg-cloud px-3 py-3">
                    <p className="truncate text-sm font-semibold text-ink">{currentUser.name}</p>
                    <p className="mt-1 flex items-center gap-2 text-xs text-slate">
                      {currentUser.provider === "google" ? <GoogleMark /> : null}
                      {currentUser.provider === "google" ? "Conectat cu Google" : currentUser.email}
                    </p>
                  </div>
                  <Link
                    href={currentUser.isAdmin ? "/admin" : "/portal"}
                    className="block rounded-lg px-3 py-3 text-sm font-semibold text-ink transition hover:bg-cloud"
                  >
                    {currentUser.isAdmin ? "Administrare" : "Portal client"}
                  </Link>
                  <Link
                    href="/portal#profil"
                    className="block rounded-lg px-3 py-3 text-sm font-semibold text-ink transition hover:bg-cloud"
                  >
                    Profilul meu
                  </Link>
                  <form action="/api/auth/logout" method="post">
                    <button
                      type="submit"
                      className="w-full rounded-lg px-3 py-3 text-left text-sm font-semibold text-red-700 transition hover:bg-red-50"
                    >
                      Deconectare
                    </button>
                  </form>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="rounded-lg px-3 py-3 text-sm font-semibold text-ink transition hover:bg-cloud"
                >
                  Portal client
                </Link>
              )}
            </div>
          </nav>
        </details>
      </div>
    </header>
  );
}
