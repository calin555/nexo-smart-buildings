import { Check, ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CatalogProductCard } from "@/components/catalog-product-card";
import { prisma } from "@/lib/prisma";
import { ecosystems, getEcosystem } from "@/modules/catalog/ecosystems";
import { productCategories } from "@/modules/products/categories";

export const dynamic = "force-dynamic";

function Filter({ title, values }: Readonly<{ title: string; values: string[] }>) {
  return (
    <section className="border-t border-[#dce2df] px-3 py-3">
      <div className="flex items-center justify-between text-sm font-medium">
        <span>{title}</span>
        <span>−</span>
      </div>
      <div className="mt-3 space-y-2 text-sm text-slate">
        {values.map((value) => (
          <label key={value} className="flex items-center gap-2">
            <input type="checkbox" className="size-4 rounded border-[#cbd5d0]" />
            {value}
          </label>
        ))}
      </div>
    </section>
  );
}

export default async function EcosystemPage({
  params,
}: Readonly<{ params: Promise<{ ecosystem: string }> }>) {
  const { ecosystem: slug } = await params;
  const ecosystem = getEcosystem(slug);
  if (!ecosystem) notFound();
  const products = await prisma.product.findMany({
    where: { active: true, illustration: { in: ecosystem.illustrations } },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-[1600px] px-5 pb-20 pt-7 lg:px-8">
        <p className="text-xs text-slate">
          <Link href="/" className="hover:text-emerald-700">
            Acasă
          </Link>{" "}
          <span className="mx-1">/</span>{" "}
          <Link href="/#catalog" className="hover:text-emerald-700">
            Soluții Smart Home
          </Link>{" "}
          <span className="mx-1">/</span> {ecosystem.name}
        </p>
        <div className="mt-8 grid gap-8 lg:grid-cols-[20.5rem_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="border border-[#dce2df]">
              <p className="border-b border-[#dce2df] px-3 py-3 text-sm font-medium tracking-[.08em] text-ink">
                SMART HOME
              </p>
              <nav aria-label="Categorii Smart Home">
                {productCategories.map((category) => (
                  <Link
                    key={category}
                    href="/#produse"
                    className="flex items-center gap-3 border-b border-[#dce2df] px-3 py-2.5 text-[15px] text-ink transition duration-200 hover:bg-[#f4f7f5] hover:text-emerald-700"
                  >
                    <span className="flex-1">{category}</span>
                    <ChevronRight className="size-4" />
                  </Link>
                ))}
              </nav>
            </div>
            <div className="mt-5 border border-[#dce2df]">
              <p className="px-3 py-3 text-lg font-medium text-[#4b5250]">FILTREAZĂ DUPĂ</p>
              <Filter
                title="Brand"
                values={["N3XO Home", "N3XO Climate", "N3XO Secure", "N3XO Energy"]}
              />
              <Filter
                title="Integrare / ecosistem"
                values={["Apple Home", "Google Home", "Home Assistant", "Zigbee / Matter"]}
              />
              <Filter title="Conectivitate" values={["KNX", "Wi-Fi", "Thread", "Zigbee"]} />
            </div>
          </aside>
          <div className="min-w-0">
            <section className="relative overflow-hidden rounded-xl border border-[#dce5e0] bg-[#f4f8f6] shadow-[0_10px_24px_rgba(19,39,31,.06)]">
              <div className="grid min-h-[20rem] lg:grid-cols-[1.15fr_.85fr]">
                <div className="relative z-10 flex flex-col justify-center px-6 py-9 sm:px-9">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[.17em] text-emerald-700">
                      {ecosystem.eyebrow}
                    </p>
                    <span className="border-b-2 border-emerald-500 px-1 pb-1 text-[11px] font-semibold uppercase tracking-[.14em] text-slate">
                      Pentru case inteligente
                    </span>
                  </div>
                  <h1 className="mt-5 max-w-xl text-3xl font-medium tracking-[-.045em] text-ink sm:text-4xl">
                    {ecosystem.title}
                  </h1>
                  <p className="mt-4 max-w-xl text-[15px] leading-7 text-slate">
                    {ecosystem.description}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href="/login"
                      className="inline-flex items-center rounded-lg bg-[#087657] px-4 py-2.5 text-sm font-semibold text-white transition duration-200 hover:bg-[#065c43]"
                    >
                      Configurează proiectul
                    </Link>
                    <Link
                      href="/#discutam"
                      className="inline-flex items-center rounded-lg border border-[#bfcfc7] bg-white/80 px-4 py-2.5 text-sm font-semibold text-ink transition duration-200 hover:border-[#6c8075] hover:bg-white"
                    >
                      Discută cu un specialist
                    </Link>
                  </div>
                </div>
                <div
                  aria-hidden="true"
                  className="relative min-h-48 bg-cover bg-center"
                  style={{ backgroundImage: `url(${ecosystem.imageUrl})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#f4f8f6] via-[#f4f8f6]/20 to-transparent" />
                </div>
              </div>
            </section>
            <section className="mt-10 grid gap-8 border-y border-[#e1e5e3] py-8 lg:grid-cols-[1.15fr_.85fr]">
              <div className="space-y-4 text-[15px] leading-7 text-slate">
                <p>{ecosystem.paragraphs[0]}</p>
                <p>{ecosystem.paragraphs[1]}</p>
              </div>
              <dl className="rounded-xl border border-[#dce5e0] bg-[#fbfcfb] p-5 text-sm">
                <div>
                  <dt className="font-semibold text-ink">Unde se recomandă</dt>
                  <dd className="mt-1 leading-6 text-slate">{ecosystem.recommendedFor}</dd>
                </div>
                <div className="mt-5 border-t border-[#e1e8e4] pt-5">
                  <dt className="font-semibold text-ink">Compatibilitate</dt>
                  <dd className="mt-1 leading-6 text-slate">{ecosystem.compatibility}</dd>
                </div>
              </dl>
            </section>
            <section className="mt-8">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[.16em] text-emerald-700">
                    AVANTAJE
                  </p>
                  <h2 className="mt-2 text-2xl font-medium tracking-[-.035em] text-ink">
                    Gândit pentru viața de zi cu zi.
                  </h2>
                </div>
                <Link
                  href="/login"
                  className="text-sm font-semibold text-[#087657] transition hover:text-[#065c43]"
                >
                  Configurează proiectul <ChevronRight className="inline size-4" />
                </Link>
              </div>
              <ul className="mt-5 grid gap-3 sm:grid-cols-3">
                {ecosystem.benefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-center gap-2 rounded-lg border border-[#dce5e0] bg-[#fbfcfb] px-4 py-3 text-sm font-medium text-ink"
                  >
                    <Check className="size-4 text-emerald-700" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </section>
            <div className="mt-10 flex items-center justify-between border-b border-[#e1e5e3] pb-4">
              <h2 className="text-xl font-semibold tracking-[-.025em] text-ink">
                Produse recomandate
              </h2>
              <span className="text-xs font-semibold uppercase tracking-[.14em] text-emerald-700">
                {products.length} produse
              </span>
            </div>
            <section className="mt-7 grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <CatalogProductCard key={product.id} product={product} />
              ))}
              {products.length === 0 && (
                <p className="col-span-full py-10 text-center text-sm text-slate">
                  Produsele pentru această soluție sunt în curs de actualizare.
                </p>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

export function generateStaticParams() {
  return ecosystems.map(({ slug }) => ({ ecosystem: slug }));
}
