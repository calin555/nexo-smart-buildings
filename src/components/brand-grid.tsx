import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";
import { getActiveBrands } from "@/modules/brands/data";

export async function BrandGrid() {
  const brands = await getActiveBrands();
  return (
    <section id="branduri" className="border-y border-[#dfe7e3] bg-[#f6f9f7]">
      <div className="mx-auto max-w-[1500px] px-5 py-16 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.17em] text-emerald-700">
              Branduri și tehnologii integrate
            </p>
            <h2 className="mt-3 text-3xl font-medium tracking-[-.04em] text-ink sm:text-4xl">
              Selectăm fiecare marcă după rolul din proiect.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate">
            KNX permite o arhitectură multi-brand. Compatibilitatea exactă se verifică în
            documentația tehnică și în proiect.
          </p>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/branduri/${brand.slug}`}
              className="group flex min-h-32 items-center justify-between gap-4 rounded-xl border border-[#d8e2dd] bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[#a9c6ba] hover:shadow-[0_12px_30px_rgba(19,39,31,.07)]"
            >
              <BrandMark name={brand.name} logoUrl={brand.logoUrl} />
              <ArrowRight className="size-4 text-emerald-700 transition group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
        <p className="mt-6 text-xs leading-5 text-slate">
          Mărcile și logo-urile aparțin titularilor lor. Prezentarea lor indică posibilitatea
          integrării echipamentelor, nu existența automată a unui parteneriat oficial.
        </p>
      </div>
    </section>
  );
}
