import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

import { InteractiveSmartHome } from "@/components/interactive-smart-home";

export const metadata: Metadata = {
  title: "Casă inteligentă Cluj — proiect tehnic interactiv | NEXO",
  description:
    "Explorează circuitele, automatizările și produsele folosite într-o casă inteligentă demonstrativă NEXO.",
};

export default function SmartHomeClujProjectPage() {
  return (
    <main className="bg-[#f4f7f5]">
      <section className="mx-auto max-w-[1600px] px-5 pb-16 pt-8 lg:px-8 lg:pb-24">
        <Link
          href="/#catalog"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate transition hover:text-emerald-700"
        >
          <ArrowLeft className="size-4" /> Înapoi la soluții
        </Link>

        <div className="mt-9 grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-emerald-700">
              Proiect demonstrativ · Cluj-Napoca
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-medium tracking-[-.045em] text-ink sm:text-5xl lg:text-6xl">
              Interiorul tehnic al unei case inteligente.
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate sm:text-lg">
              Apasă pe prize, jaluzele, iluminat sau instalații. Vezi ce echipament le controlează,
              pe ce circuit sunt conectate și cum comunică întregul sistem.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-slate lg:justify-end">
            {["8 sisteme interactive", "Circuite vizibile", "Configurație demonstrativă"].map(
              (item) => (
                <span key={item} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  {item}
                </span>
              ),
            )}
          </div>
        </div>

        <div className="mt-9">
          <InteractiveSmartHome />
        </div>

        <div className="mt-10 grid gap-6 rounded-2xl border border-[#d6e1dc] bg-white p-6 shadow-[0_12px_30px_rgba(19,39,31,.05)] sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.16em] text-emerald-700">
              De la demonstrație la proiect real
            </p>
            <h2 className="mt-2 text-2xl font-medium tracking-[-.03em] text-ink">
              Fiecare casă primește propria schemă tehnică.
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate">
              Produsele afișate sunt o configurație demonstrativă. Soluția finală se dimensionează
              după planuri, instalații, finisaje și ecosistemele pe care vrei să le folosești.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-lg bg-[#087657] px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-[#065c43]"
          >
            Configurează proiectul <ArrowRight className="ml-2 size-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
