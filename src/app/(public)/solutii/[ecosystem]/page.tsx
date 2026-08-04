import { ArrowRight, CheckCircle2, FileUp } from "lucide-react";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { kitDefinitions, kitIds } from "@/modules/commercial-configurator/config";
import { getPublicSolution, publicSolutions } from "@/modules/public-solutions";

export function generateStaticParams() {
  return publicSolutions.map(({ slug }) => ({ ecosystem: slug }));
}

export default async function SolutionPage({
  params,
}: Readonly<{ params: Promise<{ ecosystem: string }> }>) {
  const { ecosystem } = await params;
  const solution = getPublicSolution(ecosystem);
  if (!solution) notFound();
  const kits = kitIds
    .map((id) => kitDefinitions[id])
    .filter(({ solutionSlug }) => solutionSlug === solution.slug);

  return (
    <main className="bg-white">
      <div className="mx-auto grid max-w-[1500px] gap-8 px-5 py-8 lg:grid-cols-[16rem_minmax(0,1fr)] lg:px-8 lg:py-12">
        <aside className="h-fit rounded-xl border border-[#d8e2dd] bg-white p-3 lg:sticky lg:top-28">
          <p className="px-3 py-2 text-xs font-semibold uppercase tracking-[.16em] text-slate">
            Soluții N3XO
          </p>
          <nav aria-label="Soluții" className="mt-1 grid gap-1">
            {publicSolutions.map((item) => (
              <Link
                key={item.slug}
                href={`/solutii/${item.slug}`}
                className={`rounded-lg px-3 py-3 text-sm transition ${item.slug === solution.slug ? "bg-[#edf6f1] font-semibold text-emerald-800" : "text-ink hover:bg-cloud"}`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </aside>

        <div className="min-w-0">
          <section className="relative overflow-hidden rounded-2xl border border-[#d8e2dd] bg-[#f1f6f3]">
            <div className="grid min-h-[350px] lg:grid-cols-[1.05fr_.95fr]">
              <div className="relative z-10 p-7 sm:p-10 lg:p-12">
                <p className="text-xs font-semibold uppercase tracking-[.17em] text-emerald-700">
                  {solution.audience}
                </p>
                <h1 className="mt-5 max-w-3xl text-4xl font-medium tracking-[-.05em] text-ink sm:text-5xl">
                  {solution.title}
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-slate">{solution.summary}</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    href="/kituri"
                    className="inline-flex items-center rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
                  >
                    Vezi kiturile <ArrowRight className="ml-2 size-4" />
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex items-center rounded-lg border border-[#b8c9c1] bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:border-emerald-700"
                  >
                    <FileUp className="mr-2 size-4" /> Încarcă planul
                  </Link>
                </div>
              </div>
              <div className="relative min-h-64 lg:min-h-full">
                <Image
                  src={solution.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#f1f6f3] via-transparent to-transparent lg:block" />
              </div>
            </div>
          </section>

          <section className="grid gap-10 py-14 lg:grid-cols-[1.15fr_.85fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.16em] text-emerald-700">
                Cum abordăm proiectul
              </p>
              <h2 className="mt-3 text-3xl font-medium tracking-[-.04em] text-ink">
                Tehnologia urmează clădirea și modul de utilizare.
              </h2>
              <div className="mt-6 space-y-4 text-base leading-7 text-slate">
                {solution.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-[#d8e2dd] bg-[#f7faf8] p-6">
              <h2 className="text-lg font-semibold text-ink">Avantaje</h2>
              <ul className="mt-4 space-y-3">
                {solution.benefits.map((benefit) => (
                  <li key={benefit} className="flex gap-3 text-sm text-ink">
                    <CheckCircle2 className="size-5 shrink-0 text-emerald-700" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="grid gap-5 border-y border-[#dfe7e3] py-12 md:grid-cols-3">
            <div>
              <h2 className="font-semibold text-ink">Unde se recomandă</h2>
              <p className="mt-3 text-sm leading-6 text-slate">
                {solution.recommendedFor.join(" · ")}
              </p>
            </div>
            <div>
              <h2 className="font-semibold text-ink">Compatibilitate</h2>
              <p className="mt-3 text-sm leading-6 text-slate">
                {solution.technologies.join(" · ")}
              </p>
            </div>
            <div>
              <h2 className="font-semibold text-ink">Ce livrăm</h2>
              <p className="mt-3 text-sm leading-6 text-slate">
                {solution.deliverables.join(" · ")}
              </p>
            </div>
          </section>

          {kits.length > 0 ? (
            <section className="py-14">
              <p className="text-xs font-semibold uppercase tracking-[.16em] text-emerald-700">
                Puncte de plecare
              </p>
              <h2 className="mt-3 text-3xl font-medium tracking-[-.04em] text-ink">
                Kituri recomandate
              </h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {kits.map((kit) => (
                  <article key={kit.id} className="rounded-xl border border-[#d8e2dd] p-6">
                    <h3 className="text-xl font-semibold text-ink">{kit.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate">{kit.shortDescription}</p>
                    <p className="mt-4 text-sm font-semibold text-emerald-800">
                      {kit.recommendedCapacity}
                    </p>
                    <Link
                      href={`/configurator-kit?kit=${kit.id}`}
                      className="mt-5 inline-flex items-center text-sm font-semibold text-emerald-800"
                    >
                      Configurează kitul <ArrowRight className="ml-2 size-4" />
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          <section className="mb-8 rounded-2xl bg-[#102720] p-8 text-white sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[.16em] text-emerald-300">
              Începe cu planul
            </p>
            <h2 className="mt-3 text-3xl font-medium tracking-[-.04em]">
              Încarcă planul și primești o estimare orientativă.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/65">
              Confirmăm camerele, funcțiile și condițiile de instalare înainte de oferta tehnică.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-[#102720]"
              >
                Încarcă planul
              </Link>
              <Link
                href={"/solicita-oferta" as Route}
                className="rounded-lg border border-white/25 px-5 py-3 text-sm font-semibold text-white"
              >
                Solicită ofertă
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
