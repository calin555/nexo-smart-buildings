import { ArrowRight, CheckCircle2, FileUp, Layers3 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BrandMark } from "@/components/brand-mark";
import { kitDefinitions, type KitId } from "@/modules/commercial-configurator/config";
import {
  getActiveBrandBySlug,
  getActiveBrands,
  getBrandCatalogUrl,
  getBrandPresentation,
  levelLabel,
} from "@/modules/brands/data";

export const dynamic = "force-dynamic";

const faq = [
  [
    "Brandul funcționează cu KNX?",
    "Produsele prezentate pentru acest rol sunt selectate din game KNX. Modelul exact și aplicația lui se verifică în documentația tehnică actuală.",
  ],
  [
    "Poate fi integrat cu Google Home?",
    "Da, proiectul poate include un gateway separat, ales și validat pentru Google Home. Nu presupunem compatibilitate directă pentru fiecare produs.",
  ],
  [
    "Poate fi integrat cu Apple Home?",
    "Da, printr-o interfață compatibilă selectată pentru proiect. Integrarea se testează înainte de predare.",
  ],
  [
    "Poate fi combinat cu alte mărci?",
    "KNX este un standard multi-producător. Combinarea se face pe baza fișelor de aplicație, a funcțiilor necesare și a testării în ETS.",
  ],
  [
    "Cât costă un sistem?",
    "Costul depinde de clădire, numărul de circuite, interfețe și nivelul de finisare. Kiturile oferă un interval orientativ, nu un preț final.",
  ],
  [
    "Este nevoie de proiectare?",
    "Da. Proiectarea stabilește topologia, tablourile, adresele, funcțiile, compatibilitățile și documentația necesară mentenanței.",
  ],
] as const;

export default async function BrandPage({
  params,
}: Readonly<{ params: Promise<{ slug: string }> }>) {
  const { slug } = await params;
  const [brand, allBrands] = await Promise.all([getActiveBrandBySlug(slug), getActiveBrands()]);
  if (!brand) notFound();
  const presentation = getBrandPresentation(brand.slug);
  const catalogUrl = getBrandCatalogUrl(brand);
  const kits = brand.kitIds.map((kitId) => kitDefinitions[kitId as KitId]).filter(Boolean);
  const otherBrands = allBrands
    .filter(({ slug: otherSlug }) => otherSlug !== brand.slug)
    .slice(0, 6);

  return (
    <main className="bg-white">
      <section className="border-b border-[#dfe7e3] bg-[#f6f9f7]">
        <div className="mx-auto grid min-h-[400px] max-w-[1500px] items-center gap-10 px-5 py-12 lg:grid-cols-[.68fr_1.32fr] lg:px-8">
          {catalogUrl ? (
            <a
              href={catalogUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Deschide catalogul oficial ${brand.name}`}
              className="group flex min-h-56 flex-col items-center justify-center gap-5 rounded-2xl border border-[#d8e2dd] bg-white px-6 py-8 transition duration-200 hover:-translate-y-0.5 hover:border-emerald-700 hover:shadow-[0_16px_36px_rgba(19,39,31,.09)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-4"
            >
              <BrandMark name={brand.name} logoUrl={brand.logoUrl} prominent />
              <span className="inline-flex items-center text-sm font-semibold text-emerald-800">
                Deschide catalogul oficial
                <ArrowRight className="ml-2 size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </span>
            </a>
          ) : (
            <div className="flex min-h-56 items-center justify-center rounded-2xl border border-[#d8e2dd] bg-white px-6 py-8">
              <BrandMark name={brand.name} logoUrl={brand.logoUrl} prominent />
            </div>
          )}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.17em] text-emerald-700">
              Brand integrabil · {levelLabel(brand.level)}
            </p>
            <h1 className="mt-4 text-5xl font-medium tracking-[-.055em] text-ink sm:text-6xl">
              {brand.name}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate">{brand.description}</p>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-ink">
              <strong>Rol în proiect:</strong> {presentation.role}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/kituri"
                className="inline-flex items-center rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white"
              >
                Configurează proiectul <ArrowRight className="ml-2 size-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center rounded-lg border border-[#b8c9c1] bg-white px-5 py-3 text-sm font-semibold text-ink"
              >
                <FileUp className="mr-2 size-4" /> Încarcă planul
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-5 py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.17em] text-emerald-700">
              Pentru ce îl recomandăm
            </p>
            <h2 className="mt-3 text-3xl font-medium tracking-[-.04em] text-ink">
              Roluri potrivite în proiect.
            </h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {presentation.recommendedFor.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[#cbd8d2] bg-[#f6f9f7] px-4 py-2 text-sm text-ink"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-[#d8e2dd] bg-[#f7faf8] p-7">
            <h2 className="text-xl font-semibold text-ink">Unde este folosit în proiect</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {brand.usageCategories.map((category) => (
                <li key={category} className="flex gap-2 text-sm text-ink">
                  <CheckCircle2 className="size-5 shrink-0 text-emerald-700" />
                  {category}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-y border-[#dfe7e3] bg-[#f6f9f7]">
        <div className="mx-auto max-w-[1500px] px-5 py-16 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[.17em] text-emerald-700">
            Kituri compatibile
          </p>
          <h2 className="mt-3 text-3xl font-medium tracking-[-.04em] text-ink">
            Poate fi selectat în aceste configurații.
          </h2>
          <div className="mt-7 grid gap-4 lg:grid-cols-3">
            {kits.map((kit) => (
              <article key={kit.id} className="rounded-xl border border-[#d8e2dd] bg-white p-6">
                <p className="text-xs font-semibold uppercase tracking-[.14em] text-emerald-700">
                  Variantă {levelLabel(brand.level)}
                </p>
                <h3 className="mt-3 text-xl font-semibold text-ink">{kit.name}</h3>
                <p className="mt-3 text-sm leading-6 text-slate">{kit.recommendedCapacity}</p>
                <Link
                  href={`/configurator-kit?kit=${kit.id}`}
                  className="mt-5 inline-flex items-center text-sm font-semibold text-emerald-800"
                >
                  Configurează kitul <ArrowRight className="ml-2 size-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1500px] gap-10 px-5 py-16 lg:grid-cols-[.8fr_1.2fr] lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.17em] text-emerald-700">
            Poate fi combinat cu
          </p>
          <h2 className="mt-3 text-3xl font-medium tracking-[-.04em] text-ink">
            KNX permite proiecte multi-brand.
          </h2>
          <p className="mt-5 text-sm leading-6 text-slate">
            Alegem producătorul potrivit pentru fiecare rol. Compatibilitatea nu este presupusă:
            verificăm obiectele de comunicație, documentația aplicației, topologia și scenariile
            înainte de ofertare.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {otherBrands.map((other) => (
            <Link
              key={other.id}
              href={`/branduri/${other.slug}`}
              className="flex items-center justify-center rounded-xl border border-[#d8e2dd] bg-white p-5 transition hover:border-emerald-700"
            >
              <BrandMark name={other.name} logoUrl={other.logoUrl} compact />
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-[#dfe7e3] bg-[#102720] text-white">
        <div className="mx-auto grid max-w-[1500px] gap-8 px-5 py-14 lg:grid-cols-[.75fr_1.25fr] lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.17em] text-emerald-300">
              Proiect demonstrativ
            </p>
            <h2 className="mt-3 text-3xl font-medium tracking-[-.04em]">
              {presentation.projectType}
            </h2>
            <p className="mt-3 text-sm text-white/65">{presentation.projectSurface}</p>
          </div>
          <div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {presentation.projectFunctions.map((feature) => (
                <li key={feature} className="flex gap-2 text-sm">
                  <Layers3 className="size-5 text-emerald-300" />
                  {feature}
                </li>
              ))}
            </ul>
            <p className="mt-6 border-t border-white/10 pt-5 text-sm leading-6 text-white/65">
              <strong className="text-white">Configurație orientativă:</strong>{" "}
              {presentation.projectConfiguration}
            </p>
            <p className="mt-3 text-xs text-white/45">
              Exemplu demonstrativ; nu reprezintă o afirmație despre un proiect real executat.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1000px] px-5 py-16">
        <p className="text-xs font-semibold uppercase tracking-[.17em] text-emerald-700">
          Întrebări frecvente
        </p>
        <h2 className="mt-3 text-3xl font-medium tracking-[-.04em] text-ink">
          Compatibilitate și proiectare
        </h2>
        <div className="mt-7 divide-y divide-[#d8e2dd] border-y border-[#d8e2dd]">
          {faq.map(([question, answer]) => (
            <details key={question} className="group py-5">
              <summary className="cursor-pointer list-none pr-8 font-semibold text-ink [&::-webkit-details-marker]:hidden">
                {question}
              </summary>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate">{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="bg-[#f0f5f2]">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-6 px-5 py-14 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.17em] text-emerald-700">
              Următorul pas
            </p>
            <h2 className="mt-3 text-3xl font-medium tracking-[-.04em] text-ink">
              Încarcă planul și construim configurația potrivită.
            </h2>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white"
          >
            <FileUp className="mr-2 size-4" /> Încarcă planul
          </Link>
        </div>
      </section>
      <div className="mx-auto max-w-[1500px] px-5 py-6 text-xs leading-5 text-slate lg:px-8">
        Mărcile și logo-urile aparțin titularilor lor. Prezentarea lor indică posibilitatea
        integrării echipamentelor, nu existența automată a unui parteneriat oficial.
      </div>
    </main>
  );
}
