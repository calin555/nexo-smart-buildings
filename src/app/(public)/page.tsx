import {
  ArrowRight,
  Building2,
  CheckCircle2,
  FileUp,
  Home,
  Hotel,
  Layers3,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";

import { CommercialKitCards } from "@/components/commercial-kit-cards";
import { BrandGrid } from "@/components/brand-grid";
import { publicSolutions } from "@/modules/public-solutions";

const icons = [Home, Layers3, Building2, Hotel, Sparkles, ShieldCheck, Zap];
const process = [
  "Alege tipul clădirii",
  "Selectează un kit de bază",
  "Personalizează funcțiile",
  "Încarcă planul PDF, JPG sau PNG",
  "Confirmă camerele detectate",
  "Alege automatizările pe cameră",
  "Primește estimarea",
  "Trimite proiectul pentru ofertă",
  "Urmărește proiectul în portal",
];
const projects = [
  {
    title: "Bloc rezidențial inteligent, Cluj-Napoca",
    subtitle: "24 apartamente · acces, energie și spații comune",
    href: "/proiecte/bloc-rezidential-cluj",
    image: "/images/projects/bloc-rezidential-cluj-interactive.png",
  },
  {
    title: "Casă inteligentă, Brașov",
    subtitle: "210 m² · sistem hibrid și eficiență energetică",
    href: "/proiecte/casa-inteligenta-brasov",
    image: "/images/projects/casa-inteligenta-brasov-interactive.png",
  },
  {
    title: "Casă inteligentă, Cluj-Napoca",
    subtitle: "320 m² · KNX, securitate și climatizare",
    href: "/proiecte/casa-inteligenta-cluj",
    image: "/images/projects/casa-inteligenta-cluj-technical.png",
  },
];

export default function HomePage() {
  return (
    <main className="bg-white">
      <section className="border-b border-[#dfe7e3] bg-[#f6f9f7]">
        <div className="mx-auto grid min-h-[560px] max-w-[1500px] items-center gap-10 px-5 py-14 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.2em] text-emerald-700">
              Proiecte smart pentru case și clădiri
            </p>
            <h1 className="mt-6 max-w-4xl text-5xl font-medium tracking-[-.06em] text-ink sm:text-6xl lg:text-7xl">
              Configurează sistemul smart potrivit clădirii tale.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate">
              Proiectare, echipamente, instalare, programare și mentenanță într-un singur proiect.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/kituri"
                className="inline-flex items-center rounded-lg bg-emerald-700 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                Alege un kit <ArrowRight className="ml-2 size-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center rounded-lg border border-[#b8c9c1] bg-white px-5 py-3.5 text-sm font-semibold text-ink transition hover:border-emerald-700"
              >
                <FileUp className="mr-2 size-4" /> Încarcă planul
              </Link>
            </div>
            <p className="mt-6 text-sm font-medium text-emerald-800">
              Încarcă planul și primești o estimare orientativă.
            </p>
          </div>
          <Link
            href="/proiecte/casa-inteligenta-cluj"
            aria-label="Deschide demonstrația tehnică pentru casa din Cluj-Napoca"
            className="group relative min-h-[420px] overflow-hidden rounded-2xl border border-[#d8e2dd] shadow-[0_18px_50px_rgba(19,39,31,.12)]"
          >
            <Image
              src="/images/projects/casa-inteligenta-cluj-technical.png"
              alt="Casă inteligentă cu circuite tehnice vizibile"
              fill
              priority
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="object-cover transition duration-500 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-[#071a20]/25" />
            <div className="absolute inset-x-6 bottom-6 rounded-xl border border-white/20 bg-[#103c31]/90 p-5 text-white backdrop-blur-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[.16em] text-emerald-200">
                Proiect demonstrativ interactiv
              </p>
              <p className="mt-2 text-xl font-semibold">Casă inteligentă, Cluj-Napoca</p>
              <p className="mt-2 text-sm text-white/70">
                Explorează circuitele și echipamentele folosite.
              </p>
            </div>
          </Link>
        </div>
      </section>

      <section
        className="mx-auto max-w-[1500px] px-5 py-16 lg:px-8"
        aria-labelledby="solutions-title"
      >
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.17em] text-emerald-700">
              Soluții pe tip de clădire
            </p>
            <h2
              id="solutions-title"
              className="mt-3 text-3xl font-medium tracking-[-.045em] text-ink sm:text-4xl"
            >
              Începem cu proiectul, nu cu produsul.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate">
            Alegem arhitectura tehnică după clădire, instalații, buget și nivelul de automatizare
            dorit.
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {publicSolutions.map((solution, index) => {
            const Icon = icons[index] ?? Home;
            return (
              <Link
                key={solution.slug}
                href={`/solutii/${solution.slug}`}
                className="group rounded-xl border border-[#d8e2dd] bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-[#a9c6ba] hover:shadow-[0_14px_35px_rgba(19,39,31,.08)]"
              >
                <Icon className="size-7 text-emerald-700" />
                <h3 className="mt-6 text-xl font-semibold text-ink">{solution.name}</h3>
                <p className="mt-3 text-sm leading-6 text-slate">{solution.summary}</p>
                <span className="mt-6 inline-flex items-center text-sm font-semibold text-emerald-800">
                  Vezi soluția{" "}
                  <ArrowRight className="ml-2 size-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-y border-[#dfe7e3] bg-[#f6f9f7]">
        <div className="mx-auto max-w-[1500px] px-5 py-16 lg:px-8">
          <CommercialKitCards limit={6} />
        </div>
      </section>

      <BrandGrid />

      <section className="mx-auto max-w-[1500px] px-5 py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.17em] text-emerald-700">
              Flux simplu, rezultat tehnic
            </p>
            <h2 className="mt-3 text-4xl font-medium tracking-[-.045em] text-ink">
              De la clădire la ofertă, în 9 pași clari.
            </h2>
            <p className="mt-5 text-base leading-7 text-slate">
              Configuratorul organizează cerințele, iar specialistul N3XO validează soluția înainte
              de implementare.
            </p>
          </div>
          <ol className="grid gap-px overflow-hidden rounded-2xl border border-[#d8e2dd] bg-[#d8e2dd] sm:grid-cols-3">
            {process.map((step, index) => (
              <li key={step} className="bg-white p-5">
                <span className="text-xs font-semibold text-emerald-700">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="mt-3 text-sm font-semibold leading-5 text-ink">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-y border-[#dfe7e3] bg-[#f3f7f5]">
        <div className="mx-auto max-w-[1500px] px-5 py-16 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[.17em] text-emerald-700">
            Exemple de configurații
          </p>
          <h2 className="mt-3 text-3xl font-medium tracking-[-.04em] text-ink">
            Ce poate include un proiect.
          </h2>
          <div className="mt-7 grid gap-4 lg:grid-cols-3">
            {[
              [
                "Apartament urban · 78 m²",
                "Iluminat, climat, jaluzele, scenarii și securitate de bază",
                "Matter + Zigbee",
              ],
              [
                "Casă nouă · 210 m²",
                "KNX, încălzire pe zone, DALI, acces, energie și stație EV",
                "KNX + IP",
              ],
              [
                "Pensiune · 12 camere",
                "Control pe cameră, acces, HVAC, economisire și alarme tehnice",
                "KNX + PMS",
              ],
            ].map(([title, text, technology]) => (
              <article key={title} className="rounded-xl border border-[#d8e2dd] bg-white p-6">
                <p className="text-xs font-semibold uppercase tracking-[.14em] text-emerald-700">
                  {technology}
                </p>
                <h3 className="mt-3 text-xl font-semibold text-ink">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="proiecte" className="mx-auto max-w-[1500px] scroll-mt-24 px-5 py-16 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.17em] text-emerald-700">
              Proiecte tehnice interactive
            </p>
            <h2 className="mt-3 text-3xl font-medium tracking-[-.04em] text-ink">
              Vezi ce se află în spatele automatizării.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate">
            Studii demonstrative realiste. Apasă pe punctele tehnice pentru a explora circuitele și
            echipamentele orientative.
          </p>
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.href}
              href={project.href as Route}
              aria-label={`Deschide proiectul ${project.title}`}
              className="group overflow-hidden rounded-2xl border border-[#d8e2dd] bg-white transition hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(19,39,31,.10)]"
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={project.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 32vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.025]"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-ink">{project.title}</h3>
                <p className="mt-2 text-sm text-slate">{project.subtitle}</p>
                <span className="mt-4 inline-flex items-center text-sm font-semibold text-emerald-800">
                  Explorează proiectul <ArrowRight className="ml-2 size-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="ghiduri" className="border-y border-[#dfe7e3] bg-white">
        <div className="mx-auto grid max-w-[1500px] gap-6 px-5 py-16 md:grid-cols-3 lg:px-8">
          {[
            "Wi-Fi, Matter sau KNX?",
            "Cum pregătești instalația electrică",
            "Ce conține o ofertă smart completă",
          ].map((title) => (
            <article key={title} className="rounded-xl border border-[#d8e2dd] p-6">
              <p className="text-xs font-semibold uppercase tracking-[.14em] text-emerald-700">
                Ghid tehnic
              </p>
              <h2 className="mt-3 text-xl font-semibold text-ink">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate">
                Repere clare pentru decizii corecte înainte de proiectare și ofertare.
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="despre-noi"
        className="mx-auto grid max-w-[1500px] gap-10 px-5 py-16 lg:grid-cols-2 lg:px-8"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.17em] text-emerald-700">
            Despre N3XO
          </p>
          <h2 className="mt-3 text-4xl font-medium tracking-[-.045em] text-ink">
            Un singur partener pentru întregul sistem smart.
          </h2>
        </div>
        <div className="grid gap-3 text-sm leading-6 text-slate sm:grid-cols-2">
          {[
            "Consultanță și proiectare",
            "Echipamente compatibile",
            "Instalare și programare",
            "Documentație și mentenanță",
          ].map((item) => (
            <div key={item} className="flex gap-3 rounded-xl border border-[#d8e2dd] p-5">
              <CheckCircle2 className="size-5 shrink-0 text-emerald-700" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
