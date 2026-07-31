import Link from "next/link";
import type { ReactNode } from "react";

import { SiteHeader } from "@/components/site-header";

export default function PublicLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      {children}
      <footer className="border-t border-[#e2e8e5] bg-[#102720] text-white">
        <div className="section grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1"><Link href="/" className="inline-flex items-center gap-2 font-semibold tracking-tight text-white"><span className="grid size-8 place-items-center rounded-lg bg-emerald-600 text-sm text-white">N</span><span>NEXO <span className="font-normal text-white/60">Smart Buildings</span></span></Link><p className="mt-4 max-w-xs text-sm leading-6 text-white/60">Automatizări pentru spații care funcționează mai simplu, mai sigur și mai eficient.</p></div>
          <div><p className="text-sm font-semibold">Soluții</p><ul className="mt-4 space-y-2 text-sm text-white/60"><li>Case inteligente Wi‑Fi</li><li>KNX profesional</li><li>Securitate & acces</li><li>Management energetic</li></ul></div>
          <div><p className="text-sm font-semibold">Servicii</p><ul className="mt-4 space-y-2 text-sm text-white/60"><li>Consultanță</li><li>Proiectare tehnică</li><li>Instalare & punere în funcțiune</li><li>Mentenanță</li></ul></div>
          <div><p className="text-sm font-semibold">Date de contact</p><address className="mt-4 not-italic text-sm leading-7 text-white/60">Cluj, România<br />Ing. Augustin Tunaru<br /><a className="text-white/75 hover:text-white" href="tel:+40749988649">+40 749 988 649</a></address></div>
        </div>
        <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3 border-t border-white/10 px-5 py-5 text-xs text-white/45"><span>© 2026 NEXO Smart Buildings. Proiect demonstrativ.</span><span>Confidențialitate · Termeni</span></div>
      </footer>
    </div>
  );
}
