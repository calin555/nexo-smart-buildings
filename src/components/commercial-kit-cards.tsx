import { ArrowRight, Check, FileUp, Settings2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { kitDefinitions, kitIds, type KitId } from "@/modules/commercial-configurator/config";

const imagery: Record<KitId, string> = {
  "smart-start": "/images/projects/casa-inteligenta-brasov-interactive.png",
  "apartament-smart": "/images/projects/casa-inteligenta-cluj-technical.png",
  "casa-comfort": "/images/projects/casa-inteligenta-brasov-interactive.png",
  "casa-premium-knx": "/images/projects/casa-inteligenta-cluj-technical.png",
  securitate: "/images/projects/casa-inteligenta-brasov-interactive.png",
  energie: "/images/projects/bloc-rezidential-cluj-interactive.png",
  "bloc-smart": "/images/projects/bloc-rezidential-cluj-interactive.png",
  "pensiune-smart": "/images/projects/casa-inteligenta-cluj-technical.png",
  "hotel-smart": "/images/projects/bloc-rezidential-cluj-interactive.png",
};

function formatEuro(value: number): string {
  return new Intl.NumberFormat("ro-RO", { maximumFractionDigits: 0 }).format(value);
}

function KitCard({ kitId, detailed }: Readonly<{ kitId: KitId; detailed: boolean }>) {
  const kit = kitDefinitions[kitId];
  return (
    <article className="group overflow-hidden rounded-2xl border border-[#d8e2dd] bg-white shadow-[0_10px_30px_rgba(19,39,31,.06)] transition duration-200 hover:-translate-y-1 hover:border-[#adc8bc] hover:shadow-[0_18px_42px_rgba(19,39,31,.11)]">
      <div className="relative aspect-[16/7.5] overflow-hidden bg-[#edf2ef]">
        <Image
          src={imagery[kitId]}
          alt=""
          fill
          sizes="(min-width: 1280px) 30vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-[1.025]"
        />
        <div className="absolute inset-0 bg-[#071a20]/30" />
        <span className="absolute left-5 top-5 rounded-full border border-white/30 bg-white/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[.14em] text-ink">
          {kit.recommendedCapacity}
        </span>
      </div>
      <div className="p-6">
        <p className="text-xs font-semibold uppercase tracking-[.14em] text-emerald-700">
          {kit.target}
        </p>
        <h3 className="mt-2 text-2xl font-semibold tracking-[-.035em] text-ink">{kit.name}</h3>
        <p className="mt-2 text-xl font-semibold text-ink">
          {formatEuro(kit.minPrice)} € – {formatEuro(kit.maxPrice)} €
        </p>
        <p className="mt-3 text-sm leading-6 text-slate">{kit.shortDescription}</p>
        <ul className="mt-5 grid gap-2 text-sm text-ink sm:grid-cols-2">
          {kit.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2">
              <Check className="mt-0.5 size-4 shrink-0 text-emerald-700" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        {detailed ? (
          <div className="mt-5 grid gap-4 border-t border-slate/10 pt-5 text-xs leading-5 text-slate sm:grid-cols-2">
            <div>
              <strong className="block text-ink">Opțional</strong>
              {kit.optionalFunctions.join(" · ")}
            </div>
            <div>
              <strong className="block text-ink">Tehnologie</strong>
              {kit.recommendedTechnology}
            </div>
            <div>
              <strong className="block text-ink">Condiții de instalare</strong>
              {kit.installationConditions.join(" · ")}
            </div>
            <div>
              <strong className="block text-ink">Durată orientativă</strong>
              {kit.estimatedDuration}
            </div>
            <div className="sm:col-span-2">
              <strong className="block text-ink">Nu este inclus</strong>
              {kit.excluded.join(" · ")}
            </div>
          </div>
        ) : null}
        <div className="mt-6 grid gap-2 sm:grid-cols-3">
          <Link
            href={`/configurator-kit?kit=${kit.id}`}
            className="inline-flex items-center justify-center rounded-lg bg-[#087657] px-3 py-3 text-center text-xs font-semibold text-white transition hover:bg-[#065c43]"
          >
            <Settings2 className="mr-1.5 size-4" /> Configurează kitul
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-lg border border-[#b9cbc3] px-3 py-3 text-center text-xs font-semibold text-ink transition hover:border-emerald-700 hover:text-emerald-700"
          >
            <FileUp className="mr-1.5 size-4" /> Încarcă planul
          </Link>
          <Link
            href="/#solicita-oferta"
            className="inline-flex items-center justify-center rounded-lg border border-[#b9cbc3] px-3 py-3 text-center text-xs font-semibold text-ink transition hover:border-emerald-700 hover:text-emerald-700"
          >
            Solicită ofertă <ArrowRight className="ml-1.5 size-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function CommercialKitCards({
  detailed = false,
  limit,
}: Readonly<{ detailed?: boolean; limit?: number }>) {
  const visibleKitIds = typeof limit === "number" ? kitIds.slice(0, limit) : kitIds;
  return (
    <section id="kituri" aria-labelledby="kits-title" className="scroll-mt-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.17em] text-emerald-700">
            Kituri orientative
          </p>
          <h2
            id="kits-title"
            className="mt-2 text-2xl font-medium tracking-[-.035em] text-ink sm:text-3xl"
          >
            Alege punctul de plecare potrivit clădirii tale.
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-slate">
          Fiecare kit se personalizează după plan, instalații și modul real de utilizare. Oferta
          finală se emite după verificarea tehnică.
        </p>
      </div>
      <div className="mt-7 grid gap-5 xl:grid-cols-3">
        {visibleKitIds.map((kitId) => (
          <KitCard key={kitId} kitId={kitId} detailed={detailed} />
        ))}
      </div>
      {limit ? (
        <div className="mt-7 text-center">
          <Link
            href="/kituri"
            className="inline-flex items-center rounded-lg border border-emerald-700 px-5 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
          >
            Vezi toate cele 9 kituri <ArrowRight className="ml-2 size-4" />
          </Link>
        </div>
      ) : null}
    </section>
  );
}
