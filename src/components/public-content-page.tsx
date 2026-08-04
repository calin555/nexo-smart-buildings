import { ArrowRight, CheckCircle2, FileUp, Mail, Phone } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

import type { PublicContentPage } from "@/modules/public-content";

export function PublicContentPageView({ page }: Readonly<{ page: PublicContentPage }>) {
  return (
    <main className="bg-white">
      <section className="border-b border-[#dfe7e3] bg-[#f4f8f6]">
        <div className="mx-auto max-w-[1500px] px-5 py-14 lg:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-emerald-700">
            {page.eyebrow}
          </p>
          <h1 className="mt-5 max-w-5xl text-4xl font-medium tracking-[-.055em] text-ink sm:text-5xl lg:text-6xl">
            {page.title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate">{page.description}</p>
          {page.updated ? (
            <p className="mt-5 text-xs font-medium uppercase tracking-[.12em] text-slate">
              Actualizat: {page.updated}
            </p>
          ) : null}
        </div>
      </section>

      <div className="mx-auto grid max-w-[1500px] gap-10 px-5 py-14 lg:grid-cols-[minmax(0,1fr)_19rem] lg:px-8 lg:py-16">
        <div className="min-w-0 space-y-5">
          {page.sections.map((section, index) => (
            <section
              key={section.title}
              className="rounded-2xl border border-[#d8e2dd] bg-white p-6 sm:p-8"
            >
              <div className="flex gap-4">
                <span className="mt-1 text-xs font-semibold text-emerald-700">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-2xl font-medium tracking-[-.035em] text-ink">
                    {section.title}
                  </h2>
                  <div className="mt-4 space-y-4">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph} className="text-sm leading-7 text-slate sm:text-base">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  {section.bullets ? (
                    <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                      {section.bullets.map((item) => (
                        <li key={item} className="flex gap-2.5 text-sm leading-6 text-ink">
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-700" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            </section>
          ))}

          {page.related && page.related.length > 0 ? (
            <section className="pt-3">
              <p className="text-xs font-semibold uppercase tracking-[.17em] text-emerald-700">
                Continuă explorarea
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {page.related.map((item) => (
                  <Link
                    key={`${item.href}-${item.label}`}
                    href={item.href as Route}
                    className="group rounded-xl border border-[#d8e2dd] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[#a9c6ba] hover:shadow-[0_12px_28px_rgba(19,39,31,.07)]"
                  >
                    <h2 className="font-semibold text-ink">{item.label}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate">{item.description}</p>
                    <span className="mt-4 inline-flex items-center text-sm font-semibold text-emerald-800">
                      Deschide{" "}
                      <ArrowRight className="ml-2 size-4 transition group-hover:translate-x-1" />
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <aside className="h-fit rounded-2xl bg-[#102720] p-6 text-white lg:sticky lg:top-28">
          <p className="text-xs font-semibold uppercase tracking-[.16em] text-emerald-300">
            Discutăm proiectul
          </p>
          <h2 className="mt-3 text-2xl font-medium tracking-[-.035em]">
            Ai planul sau o întrebare tehnică?
          </h2>
          <p className="text-white/62 mt-4 text-sm leading-6">
            Trimite informațiile disponibile și îți spunem care este următorul pas util.
          </p>
          <div className="mt-6 grid gap-3">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-3 text-sm font-semibold text-[#102720]"
            >
              <FileUp className="mr-2 size-4" /> Încarcă planul
            </Link>
            <a
              href="mailto:office@nexcore.ro"
              className="inline-flex items-center justify-center rounded-lg border border-white/20 px-4 py-3 text-sm font-semibold text-white"
            >
              <Mail className="mr-2 size-4" /> Trimite email
            </a>
          </div>
          <div className="text-white/62 mt-6 border-t border-white/10 pt-5 text-sm">
            <a href="tel:+40774542015" className="inline-flex items-center hover:text-white">
              <Phone className="mr-2 size-4 text-emerald-300" /> +40 774 542 015
            </a>
          </div>
        </aside>
      </div>
    </main>
  );
}
