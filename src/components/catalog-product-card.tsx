"use client";

import type { Product } from "@prisma/client";
import { ChevronRight, PackageOpen, X } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

type IllustrationType = "kit" | "blinds" | "climate" | "lock" | "energy" | "custom";

const metadata: Record<
  IllustrationType,
  { description: string; tags: string[]; compatibility: string; protocol: string }
> = {
  kit: {
    description: "Punct de plecare echilibrat pentru confortul zilnic al casei.",
    tags: ["Wi-Fi", "Matter", "Apple Home"],
    compatibility: "Apple Home, Google Home",
    protocol: "Wi‑Fi / Matter",
  },
  blinds: {
    description: "Automatizare discretă pentru lumină naturală și intimitate.",
    tags: ["Zigbee", "Home Assistant", "Thread"],
    compatibility: "Home Assistant, Matter",
    protocol: "Zigbee / Thread",
  },
  climate: {
    description: "Confort termic adaptat prezenței, programului și anotimpului.",
    tags: ["Wi-Fi", "Google Home", "Matter"],
    compatibility: "Google Home, Apple Home",
    protocol: "Wi‑Fi / Matter",
  },
  lock: {
    description: "Acces controlat și notificări clare pentru intrarea în locuință.",
    tags: ["Matter", "Apple Home", "Thread"],
    compatibility: "Apple Home, Home Assistant",
    protocol: "Matter / Thread",
  },
  energy: {
    description: "Vizibilitate asupra consumului pentru decizii mai eficiente.",
    tags: ["KNX", "Home Assistant", "Zigbee"],
    compatibility: "KNX, Home Assistant",
    protocol: "KNX / Zigbee",
  },
  custom: {
    description: "Soluție selectată și configurată pentru proiectul tău.",
    tags: ["Wi-Fi", "Matter"],
    compatibility: "Ecosisteme selectate",
    protocol: "În funcție de proiect",
  },
};

function ProductVisual({
  imageUrl,
  name,
  sizes,
}: Readonly<{ imageUrl: string | null; name: string; sizes: string }>) {
  if (imageUrl) {
    return (
      <Image
        src={imageUrl}
        alt={name}
        fill
        sizes={sizes}
        className="object-contain transition duration-200 group-hover:scale-[1.035]"
      />
    );
  }
  return (
    <div className="grid size-full place-items-center bg-[#f4f7f5] text-emerald-700">
      <PackageOpen className="size-12 stroke-[1.4]" aria-hidden="true" />
    </div>
  );
}

function formatPrice(priceFrom: number): string {
  if (priceFrom === 0) return "Preț la cerere";
  return `de la ${new Intl.NumberFormat("ro-RO", { maximumFractionDigits: 2 }).format(priceFrom / 100)} lei`;
}

function displayProductName(name: string): { title: string; reference: string | null } {
  const separatorIndex = name.lastIndexOf(" - ");
  if (separatorIndex < 0) return { title: name, reference: null };
  const possibleReference = name.slice(separatorIndex + 3).trim();
  if (!/^(?=.*\d)[A-Z0-9][A-Z0-9_.\/-]{4,39}$/.test(possibleReference)) {
    return { title: name, reference: null };
  }
  return { title: name.slice(0, separatorIndex), reference: possibleReference };
}

export function CatalogProductCard({ product }: Readonly<{ product: Product }>) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const type = product.illustration.toLowerCase() as IllustrationType;
  const { title, reference } = displayProductName(product.name);
  const details =
    product.brand === "ABB"
      ? {
          description: "Produs profesional pentru instalații ABB i-bus KNX.",
          tags: ["KNX", "ETS", "ABB i-bus"],
          compatibility: "Instalații KNX și ABB i-bus",
          protocol: "KNX TP / KNX IP, conform produsului",
        }
      : product.brand === "Schneider Electric"
        ? {
            description: "Produs profesional pentru instalații KNX.",
            tags: ["KNX", "ETS", "SpaceLogic"],
            compatibility: "Instalații KNX și EcoStruxure Building",
            protocol: "KNX TP / KNX IP, conform produsului",
          }
        : metadata[type];

  return (
    <>
      <article className="group relative overflow-hidden rounded-xl border border-[#e1e7e4] bg-white transition duration-200 hover:-translate-y-0.5 hover:border-[#b8d5c9] hover:shadow-[0_12px_28px_rgba(19,39,31,.08)]">
        <button
          type="button"
          onClick={() => dialogRef.current?.showModal()}
          aria-haspopup="dialog"
          className="grid w-full grid-cols-[7.25rem_minmax(0,1fr)] items-center gap-4 p-4 text-left outline-none transition focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-600 sm:grid-cols-[9.5rem_minmax(0,1fr)_auto] sm:gap-6 sm:p-5"
        >
          <span className="relative block h-28 overflow-hidden rounded-lg bg-white sm:h-32">
            <ProductVisual imageUrl={product.imageUrl} name={product.name} sizes="160px" />
          </span>

          <span className="min-w-0">
            <span className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate">
              {product.brand}
              {product.badge && (
                <span className="rounded-full border border-[#cfe3da] bg-[#f1f8f5] px-2 py-0.5 text-[10px] font-semibold text-[#087657]">
                  {product.badge}
                </span>
              )}
            </span>
            <span className="mt-1.5 block text-base font-semibold leading-6 text-ink transition group-hover:text-[#087657] sm:text-lg">
              {title}
            </span>
            {reference && (
              <span className="mt-1 block font-mono text-xs font-semibold tracking-wide text-slate sm:text-sm">
                {reference}
              </span>
            )}
            <span className="mt-2 block text-sm text-slate">{product.category}</span>
            <span className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[#087657] sm:hidden">
              Vezi detalii <ChevronRight className="size-4" />
            </span>
          </span>

          <span className="hidden min-w-36 justify-self-end text-right sm:block">
            <span className="block text-sm font-semibold text-ink">
              {formatPrice(product.priceFrom)}
            </span>
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-[#b9d9ce] px-3 py-2 text-xs font-semibold text-[#087657] transition group-hover:border-[#087657] group-hover:bg-[#087657] group-hover:text-white">
              Vezi detalii <ChevronRight className="size-4" />
            </span>
          </span>
        </button>
      </article>

      <dialog
        ref={dialogRef}
        aria-labelledby={`product-title-${product.id}`}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialogRef.current?.close();
        }}
        className="m-auto max-h-[90vh] w-[min(92vw,56rem)] overflow-y-auto rounded-2xl bg-white p-0 text-ink shadow-[0_30px_90px_rgba(7,25,20,.28)] backdrop:bg-[#061813]/55 backdrop:backdrop-blur-sm"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#e1e7e4] bg-white/95 px-5 py-4 backdrop-blur sm:px-7">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.14em] text-emerald-700">
              Detalii produs
            </p>
            {reference && <p className="mt-1 font-mono text-xs text-slate">{reference}</p>}
          </div>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Închide detaliile produsului"
            className="grid size-10 place-items-center rounded-full border border-[#d9e2de] transition hover:border-emerald-700 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="grid gap-7 p-5 sm:p-7 md:grid-cols-[18rem_minmax(0,1fr)]">
          <div className="relative h-64 overflow-hidden rounded-xl border border-[#e5ebe8] bg-white">
            <ProductVisual imageUrl={product.imageUrl} name={product.name} sizes="288px" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate">{product.brand}</p>
            <h2
              id={`product-title-${product.id}`}
              className="mt-2 text-2xl font-semibold leading-tight"
            >
              {title}
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate">
              {product.description ?? details.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {details.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#d5e4dd] bg-[#f4faf7] px-3 py-1.5 text-xs font-medium text-[#087657]"
                >
                  {tag}
                </span>
              ))}
            </div>
            <dl className="mt-6 grid gap-4 border-y border-[#e5ebe8] py-5 text-sm sm:grid-cols-2">
              <div>
                <dt className="font-medium text-ink">Compatibil cu</dt>
                <dd className="mt-1 text-slate">{details.compatibility}</dd>
              </div>
              <div>
                <dt className="font-medium text-ink">Protocol</dt>
                <dd className="mt-1 text-slate">{details.protocol}</dd>
              </div>
              <div>
                <dt className="font-medium text-ink">Disponibilitate</dt>
                <dd className="mt-1 text-slate">La comandă</dd>
              </div>
              <div>
                <dt className="font-medium text-ink">Categorie</dt>
                <dd className="mt-1 text-slate">{product.category}</dd>
              </div>
            </dl>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <p className="text-lg font-semibold">{formatPrice(product.priceFrom)}</p>
              <a
                href="#discutam"
                onClick={() => dialogRef.current?.close()}
                className="inline-flex rounded-lg bg-[#087657] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#065c43] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
              >
                Solicită ofertă
              </a>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
