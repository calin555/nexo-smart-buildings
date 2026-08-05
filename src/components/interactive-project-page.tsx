import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import type { Route } from "next";

import { InteractiveSmartHome, type ProjectKey } from "@/components/interactive-smart-home";

type InteractiveProjectPageProps = {
  location: string;
  title: string;
  description: string;
  stats: string[];
  project: ProjectKey;
  ctaTitle: string;
};

export function InteractiveProjectPage({
  location,
  title,
  description,
  stats,
  project,
  ctaTitle,
}: Readonly<InteractiveProjectPageProps>) {
  return (
    <main className="bg-[#f4f7f5]">
      <section className="mx-auto max-w-[1600px] px-5 pb-16 pt-8 lg:px-8 lg:pb-24">
        <Link
          href={"/proiecte" as Route}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate transition hover:text-emerald-700"
        >
          <ArrowLeft className="size-4" /> Înapoi la proiecte
        </Link>

        <div className="mt-9 grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-emerald-700">
              Studiu tehnic interactiv · {location}
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-medium tracking-[-.045em] text-ink sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate sm:text-lg">
              {description}
            </p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-slate lg:max-w-md lg:justify-end">
            {stats.map((item) => (
              <span key={item} className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-600" />
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-9">
          <InteractiveSmartHome project={project} />
        </div>

        <div className="mt-10 grid gap-6 rounded-2xl border border-[#d6e1dc] bg-white p-6 shadow-[0_12px_30px_rgba(19,39,31,.05)] sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.16em] text-emerald-700">
              Studiu tehnic, nu referință de șantier
            </p>
            <h2 className="mt-2 text-2xl font-medium tracking-[-.03em] text-ink">{ctaTitle}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate">
              Imaginea, echipamentele și valorile sunt orientative. Soluția finală se dimensionează
              după releveu, instalații, puterea disponibilă și cerințele beneficiarului.
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
