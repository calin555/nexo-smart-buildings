import { ArrowRight, Building2, FileUp, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

type FooterLink = Readonly<{ label: string; href: string }>;

const companyLinks: FooterLink[] = [
  { label: "Despre noi", href: "/despre-noi" },
  { label: "Proiecte", href: "/proiecte" },
  { label: "Ghiduri", href: "/ghiduri" },
  { label: "Blog", href: "/blog" },
  { label: "Cariere", href: "/cariere" },
];

const solutionLinks: FooterLink[] = [
  { label: "Case Smart", href: "/solutii/case-smart" },
  { label: "Apartamente Smart", href: "/solutii/apartamente-smart" },
  { label: "Blocuri Smart", href: "/solutii/blocuri-smart" },
  { label: "Pensiuni & Hoteluri Smart", href: "/solutii/pensiuni-hoteluri-smart" },
  { label: "Automatizare KNX", href: "/solutii/automatizare-knx" },
  { label: "Integrare sisteme existente", href: "/servicii/integrare-sisteme-existente" },
  { label: "Securitate", href: "/solutii/securitate" },
  { label: "Management energetic", href: "/solutii/energie-eficienta" },
  { label: "Configurator pe plan", href: "/configurator-pe-plan" },
];

const serviceLinks: FooterLink[] = [
  { label: "Consultanță", href: "/servicii/consultanta" },
  { label: "Audit Smart Home", href: "/servicii/audit-smart-home" },
  { label: "Proiectare", href: "/servicii/proiectare" },
  { label: "Configurator pe plan", href: "/configurator-pe-plan" },
  { label: "Instalare", href: "/servicii/instalare" },
  { label: "Programare KNX", href: "/servicii/programare-knx" },
  { label: "Punere în funcțiune", href: "/servicii/punere-in-functiune" },
  { label: "Mentenanță", href: "/servicii/mentenanta" },
  { label: "Service", href: "/servicii/service" },
];

const resourceLinks: FooterLink[] = [
  { label: "Întrebări frecvente", href: "/resurse/intrebari-frecvente" },
  { label: "Ghid KNX", href: "/resurse/ghid-knx" },
  { label: "Ghid Matter", href: "/resurse/ghid-matter" },
  { label: "Google Home", href: "/resurse/google-home" },
  { label: "Apple Home", href: "/resurse/apple-home" },
  { label: "Amazon Alexa", href: "/resurse/amazon-alexa" },
  { label: "Home Assistant", href: "/resurse/home-assistant" },
  { label: "Compatibilități", href: "/resurse/compatibilitati" },
  { label: "Branduri", href: "/branduri" },
];

const legalLinks: FooterLink[] = [
  { label: "Termeni și condiții", href: "/legal/termeni-si-conditii" },
  { label: "Politica de confidențialitate", href: "/legal/politica-de-confidentialitate" },
  { label: "Politica Cookies", href: "/legal/politica-cookies" },
  { label: "GDPR", href: "/legal/gdpr" },
  { label: "Solicitări GDPR", href: "/legal/solicitari-gdpr" },
  { label: "Politica de retenție a datelor", href: "/legal/politica-retentie-date" },
  { label: "Confidențialitatea documentelor", href: "/legal/confidentialitatea-documentelor" },
  { label: "Securitatea informațiilor", href: "/legal/securitatea-informatiilor" },
  { label: "Cum protejăm planurile încărcate", href: "/legal/cum-protejam-planurile-incarcate" },
];

function FooterColumn({ title, links }: Readonly<{ title: string; links: FooterLink[] }>) {
  return (
    <div>
      <h2 className="text-[11px] font-semibold uppercase tracking-[.18em] text-emerald-300">
        {title}
      </h2>
      <ul className="mt-5 space-y-2.5">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href as Route}
              aria-label={`${title}: ${label}`}
              className="text-white/62 text-sm leading-5 transition duration-200 hover:text-white"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PublicFooter() {
  return (
    <>
      <section className="border-t border-[#dce6e1] bg-[#eaf3ee] text-ink">
        <div className="mx-auto grid max-w-[1500px] gap-8 px-5 py-12 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8 lg:py-14">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-emerald-700">
              Începe cu planul
            </p>
            <h2 className="mt-3 text-3xl font-medium tracking-[-.045em] sm:text-4xl">
              Ai deja planul casei?
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate">
              Încarcă planul și configurează fiecare cameră. Primești o estimare orientativă înainte
              de proiectare.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/login"
              aria-label="Deschide configuratorul securizat"
              className="button-primary"
            >
              <FileUp className="mr-2 size-4" /> Încarcă planul
            </Link>
            <Link href={"/solicita-oferta" as Route} className="button-secondary">
              Solicită ofertă <ArrowRight className="ml-2 size-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 bg-[#102720] text-white">
        <div className="mx-auto grid max-w-[1500px] gap-x-8 gap-y-12 px-5 py-14 sm:grid-cols-2 lg:px-8 xl:grid-cols-6 xl:py-16">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 font-semibold tracking-tight">
              <span className="grid size-9 place-items-center rounded-lg bg-emerald-600 text-xs">
                N3
              </span>
              <span>
                N3XO <span className="font-normal text-white/55">Smart Buildings</span>
              </span>
            </Link>
            <p className="text-white/62 mt-5 text-sm leading-6">
              Proiectăm, integrăm și implementăm soluții smart pentru case, apartamente, blocuri,
              pensiuni și hoteluri.
            </p>
            <p className="text-white/62 mt-3 text-sm leading-6">
              De la proiectare până la punerea în funcțiune.
            </p>
            <nav aria-label="Despre companie" className="mt-6">
              <ul className="space-y-2.5">
                {companyLinks.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href as Route}
                      aria-label={`Companie: ${label}`}
                      className="text-white/62 text-sm transition duration-200 hover:text-white"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <FooterColumn title="Soluții" links={solutionLinks} />
          <FooterColumn title="Servicii" links={serviceLinks} />
          <FooterColumn title="Resurse" links={resourceLinks} />
          <FooterColumn title="Legal" links={legalLinks} />

          <div>
            <h2 className="text-[11px] font-semibold uppercase tracking-[.18em] text-emerald-300">
              Contact
            </h2>
            <address className="text-white/62 mt-5 space-y-3 text-sm not-italic">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Cluj-Napoca%2C%20Romania"
                target="_blank"
                rel="noreferrer"
                className="flex gap-2.5 transition duration-200 hover:text-white"
              >
                <MapPin className="mt-0.5 size-4 shrink-0 text-emerald-300" /> Cluj-Napoca, România
              </a>
              <a
                href="tel:+40774542015"
                className="flex gap-2.5 transition duration-200 hover:text-white"
              >
                <Phone className="size-4 shrink-0 text-emerald-300" /> +40 774 542 015
              </a>
              <a
                href="mailto:office@nexcore.ro"
                className="flex gap-2.5 break-all transition duration-200 hover:text-white"
              >
                <Mail className="size-4 shrink-0 text-emerald-300" /> office@nexcore.ro
              </a>
              <a
                href="https://wa.me/40774542015"
                target="_blank"
                rel="noreferrer"
                className="flex gap-2.5 transition duration-200 hover:text-white"
              >
                <MessageCircle className="size-4 shrink-0 text-emerald-300" /> WhatsApp
              </a>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Cluj-Napoca%2C%20Romania"
                target="_blank"
                rel="noreferrer"
                className="flex gap-2.5 transition duration-200 hover:text-white"
              >
                <Building2 className="size-4 shrink-0 text-emerald-300" /> Google Maps
              </a>
            </address>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-[1500px] flex-col gap-4 px-5 py-5 text-xs text-white/45 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <span>© 2026 N3XO Smart Buildings</span>
            <nav aria-label="Navigare legală secundară">
              <ul className="flex flex-wrap gap-x-5 gap-y-2">
                <li>
                  <Link href={"/legal/termeni-si-conditii" as Route} className="hover:text-white">
                    Termeni
                  </Link>
                </li>
                <li>
                  <Link href={"/legal/gdpr" as Route} className="hover:text-white">
                    GDPR
                  </Link>
                </li>
                <li>
                  <Link href={"/legal/politica-cookies" as Route} className="hover:text-white">
                    Cookies
                  </Link>
                </li>
                <li>
                  <Link
                    href={"/legal/politica-de-confidentialitate" as Route}
                    className="hover:text-white"
                  >
                    Confidențialitate
                  </Link>
                </li>
                <li>
                  <Link href={"/sitemap" as Route} className="hover:text-white">
                    Sitemap
                  </Link>
                </li>
                <li>
                  <Link href={"/versiune" as Route} className="hover:text-white">
                    Versiunea platformei 0.1.0
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </footer>
    </>
  );
}
