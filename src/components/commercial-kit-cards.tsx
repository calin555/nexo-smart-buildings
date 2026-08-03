import { ArrowRight, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { kitDefinitions, type KitId } from "@/modules/commercial-configurator/config";

const cardDesign: Record<
  KitId,
  { image: string; eyebrow: string; accent: string; button: string; label: string }
> = {
  essential: {
    image: "/images/projects/casa-inteligenta-brasov-interactive.png",
    eyebrow: "text-[#087657]",
    accent: "bg-[#20a477]",
    button: "bg-[#087657] hover:bg-[#065c43]",
    label: "Începe simplu",
  },
  comfort: {
    image: "/images/projects/casa-inteligenta-cluj-technical.png",
    eyebrow: "text-[#0868a8]",
    accent: "bg-[#2196d2]",
    button: "bg-[#0868a8] hover:bg-[#075486]",
    label: "Cel mai ales",
  },
  premium: {
    image: "/images/projects/bloc-rezidential-cluj-interactive.png",
    eyebrow: "text-[#7251a8]",
    accent: "bg-[#8062b5]",
    button: "bg-[#7251a8] hover:bg-[#5d428b]",
    label: "Experiență completă",
  },
};

function formatEuro(value: number): string {
  return new Intl.NumberFormat("ro-RO", { maximumFractionDigits: 0 }).format(value);
}

export function CommercialKitCards() {
  return (
    <section id="pachete" aria-labelledby="kits-title" className="mt-12 scroll-mt-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.17em] text-emerald-700">
            Configurator comercial
          </p>
          <h2
            id="kits-title"
            className="mt-2 text-2xl font-medium tracking-[-.035em] text-ink sm:text-3xl"
          >
            Alege pachetul potrivit casei tale.
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-slate">
          Pornește de la un kit clar, apoi personalizează camerele și funcțiile. Prețul și lista
          orientativă de echipamente se actualizează instant.
        </p>
      </div>

      <div className="mt-7 grid gap-5 xl:grid-cols-3">
        {(Object.keys(kitDefinitions) as KitId[]).map((kitId) => {
          const kit = kitDefinitions[kitId];
          const design = cardDesign[kitId];
          return (
            <article
              key={kit.id}
              className="group relative overflow-hidden rounded-2xl border border-[#d8e2dd] bg-white shadow-[0_10px_30px_rgba(19,39,31,.06)] transition duration-200 hover:-translate-y-1 hover:border-[#adc8bc] hover:shadow-[0_18px_42px_rgba(19,39,31,.11)]"
            >
              <div className={`absolute inset-x-0 top-0 z-10 h-1 ${design.accent}`} />
              <div className="relative aspect-[16/8.5] overflow-hidden bg-[#edf2ef]">
                <Image
                  src={design.image}
                  alt={`Exemplu pentru ${kit.name}`}
                  fill
                  sizes="(min-width: 1280px) 30vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.025]"
                />
                <div className="absolute inset-0 bg-[#071a20]/20" />
                <span className="absolute left-5 top-5 rounded-full border border-white/35 bg-white/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[.14em] text-ink backdrop-blur">
                  {design.label}
                </span>
              </div>
              <div className="p-6">
                <p className={`text-xs font-semibold uppercase tracking-[.14em] ${design.eyebrow}`}>
                  {kit.name}
                </p>
                <p className="mt-3 text-2xl font-semibold tracking-[-.035em] text-ink">
                  {formatEuro(kit.minPrice)} € – {formatEuro(kit.maxPrice)} €
                </p>
                <p className="mt-3 min-h-12 text-sm leading-6 text-slate">{kit.shortDescription}</p>
                <ul className="mt-5 grid gap-2 text-sm text-ink sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                  {kit.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className={`mt-0.5 size-4 shrink-0 ${design.eyebrow}`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/configurator-kit?kit=${kit.id}`}
                  className={`mt-6 inline-flex w-full items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold text-white transition duration-200 ${design.button}`}
                >
                  Configurează {kit.name.replace("Kit ", "")}
                  <ArrowRight className="ml-2 size-4 transition group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
      <p className="mt-4 text-xs leading-5 text-slate">
        Estimările includ echipamente orientative și configurare de bază. Oferta finală se emite
        după verificarea planului, a tabloului și a instalațiilor existente.
      </p>
    </section>
  );
}
