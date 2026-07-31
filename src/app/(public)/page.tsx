import Link from "next/link";
import {
  ArrowRight,
  Blinds,
  Building2,
  Camera,
  ChevronDown,
  ChevronRight,
  CircleGauge,
  DoorOpen,
  HousePlug,
  Lightbulb,
  MonitorSmartphone,
  PlugZap,
  RadioTower,
  ShieldCheck,
  Smartphone,
  Speaker,
  ThermometerSun,
} from "lucide-react";

import { CatalogProductCard } from "@/components/catalog-product-card";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const categories = [
  { icon: HousePlug, label: "Ecosisteme Smart Home" },
  { icon: CircleGauge, label: "Kit-uri de automatizare" },
  { icon: ThermometerSun, label: "Confortul casei" },
  { icon: Lightbulb, label: "Iluminat inteligent" },
  { icon: Blinds, label: "Întrerupătoare & umbrire" },
  { icon: PlugZap, label: "Prize / relee smart" },
  { icon: Camera, label: "Sisteme de securitate" },
  { icon: RadioTower, label: "Gateway-uri & telecomenzi" },
  { icon: Speaker, label: "Sisteme multimedia" },
  { icon: Smartphone, label: "Accesorii & senzori" },
];

const ecosystemCards = [
  {
    label: "Smart Home Wi-Fi",
    slug: "smart-home-wifi",
    icon: HousePlug,
    color: "text-[#108361]",
    mark: "Wi-Fi",
  },
  { label: "Apple Home", slug: "apple-home", icon: HousePlug, color: "text-[#1d1d1f]", mark: "⌂" },
  { label: "Google Home", slug: "google-home", icon: HomeMark, color: "text-[#4585f4]", mark: "G" },
  { label: "Matter", slug: "matter", icon: MatterMark, color: "text-[#17202a]", mark: "✦" },
  {
    label: "Home Assistant",
    slug: "home-assistant",
    icon: MonitorSmartphone,
    color: "text-[#1f9ed4]",
    mark: "HA",
  },
  { label: "Aqara", slug: "aqara", icon: DoorOpen, color: "text-[#1b92cc]", mark: "AQ" },
  {
    label: "KNX profesional",
    slug: "knx-profesional",
    icon: Building2,
    color: "text-[#ec9400]",
    mark: "KNX",
  },
  {
    label: "Securitate N3XO",
    slug: "securitate",
    icon: ShieldCheck,
    color: "text-[#008b68]",
    mark: "S",
  },
];

function HomeMark() {
  return <span className="text-5xl font-bold leading-none">⌂</span>;
}
function MatterMark() {
  return <span className="text-6xl leading-none">✦</span>;
}

function Filter({ title, values }: Readonly<{ title: string; values: string[] }>) {
  return (
    <section className="border-t border-[#dce2df] px-3 py-3">
      <div className="flex items-center justify-between text-sm font-medium">
        <span>{title}</span>
        <span>−</span>
      </div>
      <div className="mt-3 max-h-28 space-y-2 overflow-hidden text-sm text-slate">
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

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return (
    <main className="bg-white">
      <div className="mx-auto max-w-[1600px] px-5 pb-16 pt-7 lg:px-8">
        <p className="text-xs text-slate">
          <a href="#catalog" className="hover:text-emerald-700">
            Acasă
          </a>{" "}
          <span className="mx-1">/</span> Soluții Smart Home
        </p>
        <div id="catalog" className="mt-8 grid gap-8 lg:grid-cols-[20.5rem_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="border border-[#dce2df]">
              <p className="border-b border-[#dce2df] px-3 py-3 text-sm font-medium tracking-[.08em] text-ink">
                SMART HOME
              </p>
              <nav aria-label="Categorii Smart Home">
                {categories.map(({ icon: Icon, label }) => (
                  <a
                    key={label}
                    href="#produse"
                    className="flex items-center gap-3 border-b border-[#dce2df] px-3 py-2.5 text-[15px] text-ink transition hover:bg-[#f4f7f5] hover:text-emerald-700"
                  >
                    <Icon className="size-7 shrink-0 stroke-[1.35]" />
                    <span className="flex-1">{label}</span>
                    <ChevronRight className="size-4" />
                  </a>
                ))}
              </nav>
            </div>
            <div className="mt-5 border border-[#dce2df]">
              <p className="px-3 py-3 text-lg font-medium text-[#4b5250]">FILTREAZĂ DUPĂ</p>
              <Filter
                title="Brand"
                values={["N3XO Home (18)", "KNX (12)", "Aqara (9)", "Matter (7)"]}
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
              <div className="grid min-h-[19rem] lg:grid-cols-[1.15fr_.85fr]">
                <div className="relative z-10 flex flex-col justify-center px-6 py-9 sm:px-9">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[.17em] text-emerald-700">
                      Soluții Smart Home
                    </p>
                    <span className="border-b-2 border-emerald-500 px-1 pb-1 text-[11px] font-semibold uppercase tracking-[.14em] text-slate">
                      Pentru case inteligente
                    </span>
                  </div>
                  <h1 className="mt-5 max-w-xl text-3xl font-medium tracking-[-.045em] text-ink sm:text-4xl">
                    Control pentru lumină, climat, siguranță și energie.
                  </h1>
                  <p className="mt-4 max-w-xl text-[15px] leading-7 text-slate">
                    Alegem tehnologia potrivită proiectului tău — Wi‑Fi, Matter, KNX sau o
                    combinație atent proiectată.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href="/login"
                      className="inline-flex items-center rounded-lg bg-[#087657] px-4 py-2.5 text-sm font-semibold text-white transition duration-200 hover:bg-[#065c43]"
                    >
                      Configurează proiectul <ArrowRight className="ml-2 size-4" />
                    </Link>
                    <a
                      href="#discutam"
                      className="inline-flex items-center rounded-lg border border-[#bfcfc7] bg-white/80 px-4 py-2.5 text-sm font-semibold text-ink transition duration-200 hover:border-[#6c8075] hover:bg-white"
                    >
                      Discută cu un specialist
                    </a>
                  </div>
                </div>
                <Link
                  href="/proiecte/casa-inteligenta-cluj"
                  aria-label="Deschide proiectul tehnic interactiv Casă inteligentă, Cluj"
                  className="group relative min-h-48 overflow-hidden bg-[url('/images/projects/casa-inteligenta-cluj-technical.png')] bg-cover bg-center"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#f4f8f6] via-[#f4f8f6]/10 to-transparent transition duration-200 group-hover:bg-[#071a20]/10" />
                  <div className="absolute bottom-6 left-6 rounded-lg border border-white/30 bg-[#16382f]/90 px-4 py-3 text-sm text-white shadow-lg transition duration-200 group-hover:-translate-y-1 group-hover:bg-[#0b5548]">
                    <p className="text-[10px] uppercase tracking-[.14em] text-emerald-200">
                      Proiect demonstrativ interactiv
                    </p>
                    <p className="mt-1 flex items-center font-medium">
                      Casă inteligentă, Cluj{" "}
                      <ArrowRight className="ml-2 size-4 transition group-hover:translate-x-1" />
                    </p>
                  </div>
                </Link>
              </div>
            </section>
            <section
              aria-label="Ecosisteme smart home"
              className="mt-10 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-4"
            >
              {ecosystemCards.map(({ label, slug, icon: Icon, color, mark }) => (
                <Link key={label} href={`/solutii/${slug}`} className="group text-center">
                  <div className={`grid h-20 place-items-center ${color}`}>
                    <Icon className="size-14 stroke-[1.25] transition duration-200 group-hover:scale-110" />
                    <span className="sr-only">{mark}</span>
                  </div>
                  <div className="mt-2 rounded-lg border border-transparent bg-[#f5f6f5] px-2 py-3 text-sm font-medium text-ink transition duration-200 group-hover:border-[#cfe1d8] group-hover:bg-[#e9f2ed] group-hover:shadow-sm">
                    {label}
                  </div>
                </Link>
              ))}
            </section>
            <section className="mt-9 border-y border-[#e1e5e3] py-6 text-[15px] leading-7 text-ink">
              <p>
                Construim case inteligente care rămân simple de folosit: lumină, climat, umbrire,
                securitate și energie în aceeași experiență.
              </p>
              <p className="mt-3">
                Pentru o renovare sau un apartament putem recomanda soluții Wi‑Fi și Matter. Pentru
                case noi și proiecte complexe, KNX oferă o infrastructură profesională. Alegem
                împreună ce se potrivește proiectului tău.
              </p>
              <a
                href="#discutam"
                className="mt-4 inline-flex font-medium text-[#0072b8] hover:underline"
              >
                Ai un proiect nou sau o renovare? Discută cu un specialist{" "}
                <ArrowRight className="ml-1.5 mt-0.5 size-4" />
              </a>
            </section>
            <section className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#b9d9ce] bg-[#eff8f3] px-5 py-4 shadow-[0_8px_18px_rgba(19,39,31,.04)]">
              <div>
                <p className="font-medium text-ink">Vrei o casă smart adaptată proiectului tău?</p>
                <p className="mt-1 text-sm text-slate">
                  Accesează portalul pentru a începe o estimare de proiect.
                </p>
              </div>
              <Link
                href="/login"
                className="inline-flex shrink-0 items-center rounded-lg bg-[#087657] px-4 py-2.5 text-sm font-semibold text-white transition duration-200 hover:bg-[#065c43]"
              >
                Accesează portalul client <ArrowRight className="ml-2 size-4" />
              </Link>
            </section>
            <div
              id="produse"
              className="mt-8 flex items-center justify-between border-b border-[#e1e5e3] pb-4 text-sm"
            >
              <button
                type="button"
                className="inline-flex items-center gap-1 font-medium transition hover:text-emerald-700"
              >
                Sortează după <ChevronDown className="size-4" />
              </button>
              <span className="text-slate">
                Afișare: <b className="text-[#0072b8]">▦</b> <span className="ml-2">☷</span>
              </span>
              <span className="hidden sm:inline">Pagina 1 / 2</span>
            </div>
            <section className="mt-7 grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3 xl:grid-cols-5">
              {products.map((product) => (
                <CatalogProductCard key={product.id} product={product} />
              ))}
              {products.length === 0 && (
                <p className="col-span-full py-10 text-center text-sm text-slate">
                  Catalogul este în curs de actualizare.
                </p>
              )}
            </section>
          </div>
        </div>
      </div>

      <section id="oferte" className="border-y border-[#dce2df] bg-[#f5f7f6]">
        <div className="mx-auto grid max-w-[1600px] gap-8 px-5 py-12 lg:grid-cols-[1fr_2fr] lg:px-8">
          <div>
            <p className="text-xs font-semibold tracking-[.16em] text-emerald-700">
              CASA SMART, PE MĂSURA PROIECTULUI
            </p>
            <h2 className="mt-3 text-3xl font-medium tracking-[-.035em]">
              Wi‑Fi, KNX sau hibrid. Alegerea vine după proiect.
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate">
              Nu vindem o singură tehnologie. Alegem soluția care are sens pentru casă, etapă de
              renovare și buget.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="border-l-2 border-emerald-600 pl-4">
              <p className="font-medium">Smart Home Wi‑Fi</p>
              <p className="mt-2 text-sm leading-6 text-slate">
                Flexibil pentru apartamente, renovări și automatizări începute etapizat.
              </p>
            </div>
            <div className="border-l-2 border-emerald-600 pl-4">
              <p className="font-medium">KNX profesional</p>
              <p className="mt-2 text-sm leading-6 text-slate">
                Robust și scalabil pentru case noi, vile și proiecte cu multe instalații.
              </p>
            </div>
            <div className="border-l-2 border-emerald-600 pl-4">
              <p className="font-medium">Sistem hibrid</p>
              <p className="mt-2 text-sm leading-6 text-slate">
                KNX unde contează, Wi‑Fi și Matter acolo unde aduc flexibilitate.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="branduri" className="mx-auto max-w-[1600px] px-5 py-14 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[.16em] text-emerald-700">
              ECOSISTEME & TEHNOLOGII
            </p>
            <h2 className="mt-3 text-3xl font-medium tracking-[-.035em]">
              Tehnologie aleasă pentru proiect, nu impusă.
            </h2>
          </div>
          <a href="#discutam" className="text-sm font-medium text-[#0072b8]">
            Verifică compatibilitatea <ChevronRight className="inline size-4" />
          </a>
        </div>
        <div className="mt-8 grid grid-cols-2 divide-x divide-y divide-[#dce2df] border border-[#dce2df] sm:grid-cols-4 lg:grid-cols-6">
          {["KNX", "Matter", "Apple Home", "Google Home", "Home Assistant", "Zigbee"].map(
            (brand) => (
              <div
                key={brand}
                className="flex h-24 items-center justify-center text-lg font-medium text-[#4b5250]"
              >
                {brand}
              </div>
            ),
          )}
        </div>
      </section>

      <section id="discutam" className="bg-[#173830] text-white">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-end justify-between gap-8 px-5 py-14 lg:px-8">
          <div>
            <p className="text-xs font-semibold tracking-[.16em] text-emerald-300">
              AI UN PROIECT?
            </p>
            <h2 className="mt-3 text-4xl font-medium tracking-[-.045em]">
              Îl discutăm înainte să alegi produsele.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
              Primești o discuție tehnică despre infrastructură, compatibilități și pașii reali de
              implementare.
            </p>
          </div>
          <Link
            href="/login"
            className="rounded bg-white px-5 py-3 text-sm font-semibold text-[#173830] hover:bg-emerald-100"
          >
            Accesează portalul client
          </Link>
        </div>
      </section>
    </main>
  );
}
