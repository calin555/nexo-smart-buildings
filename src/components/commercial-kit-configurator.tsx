"use client";

import {
  ArrowLeft,
  ArrowRight,
  BadgeEuro,
  Blinds,
  Building2,
  Cable,
  Check,
  CheckCircle2,
  ChevronRight,
  CloudSun,
  House,
  Hotel,
  Lightbulb,
  PackageCheck,
  ShieldCheck,
  Snowflake,
  ThermometerSun,
  TreePine,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  calculateCommercialSummary,
  commercialOptions,
  configuratorCategories,
  kitDefinitions,
  type ConfiguratorCategoryId,
  type BlockScale,
  type HospitalityScale,
  type KitId,
} from "@/modules/commercial-configurator/config";
import {
  kitQuoteInputSchema,
  type KitQuoteInput,
} from "@/modules/commercial-configurator/quote-request";

const pendingQuoteStorageKey = "n3xo-pending-kit-quote";

const numberFieldClass =
  "mt-2 w-full rounded-lg border border-[#cdd9d3] bg-white px-3 py-3 text-lg font-semibold text-ink outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15";

function NumberField({
  label,
  value,
  min = 0,
  max = 200,
  onChange,
}: Readonly<{
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}>) {
  return (
    <label className="rounded-xl border border-[#dce4e0] bg-[#fafcfb] p-4 text-sm font-semibold text-ink">
      {label}
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(event) =>
          onChange(Math.min(max, Math.max(min, Number(event.target.value) || 0)))
        }
        className={numberFieldClass}
      />
    </label>
  );
}

function ToggleField({
  label,
  checked,
  onChange,
}: Readonly<{ label: string; checked: boolean; onChange: (checked: boolean) => void }>) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm font-semibold transition ${checked ? "border-emerald-600 bg-[#f0f8f4] text-emerald-900" : "border-[#dce4e0] bg-white text-ink"}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="size-4 rounded border-slate/30 text-emerald-700 focus:ring-emerald-600"
      />
      {label}
    </label>
  );
}

const categoryIcons = {
  rooms: House,
  lighting: Lightbulb,
  blinds: Blinds,
  heating: ThermometerSun,
  climate: Snowflake,
  security: ShieldCheck,
  exterior: TreePine,
  integrations: Cable,
} satisfies Record<ConfiguratorCategoryId, typeof House>;

const kitAccent: Record<KitId, { chip: string; line: string }> = {
  "smart-start": { chip: "bg-[#e8f6ef] text-[#087657]", line: "bg-[#20a477]" },
  "apartament-smart": { chip: "bg-[#e7f3fa] text-[#0868a8]", line: "bg-[#2196d2]" },
  "casa-comfort": { chip: "bg-[#e7f3fa] text-[#0868a8]", line: "bg-[#2196d2]" },
  "casa-premium-knx": { chip: "bg-[#f1ecf8] text-[#7251a8]", line: "bg-[#8062b5]" },
  securitate: { chip: "bg-[#fff0ec] text-[#a4432e]", line: "bg-[#cf684e]" },
  energie: { chip: "bg-[#fff7dc] text-[#806211]", line: "bg-[#d7ac27]" },
  "bloc-smart": { chip: "bg-[#edf0f7] text-[#35486d]", line: "bg-[#526b98]" },
  "pensiune-smart": { chip: "bg-[#f4eee8] text-[#765135]", line: "bg-[#a47c5a]" },
  "hotel-smart": { chip: "bg-[#e9f0ef] text-[#164f48]", line: "bg-[#28796d]" },
};

function formatEuro(value: number): string {
  return `${new Intl.NumberFormat("ro-RO", { maximumFractionDigits: 0 }).format(value)} €`;
}

function equipmentLabel(label: string, quantity: number): string {
  if (quantity !== 1) return label;
  const singular: Record<string, string> = {
    "actuatoare iluminat": "actuator iluminat",
    "actuatoare jaluzele": "actuator jaluzele",
    "actuatoare încălzire": "actuator încălzire",
    "surse KNX": "sursă KNX",
    "surse sistem smart": "sursă sistem smart",
    "gateway-uri IP": "gateway IP",
    "gateway-uri aplicație": "gateway aplicație",
    "senzori temperatură": "senzor temperatură",
    "senzori prezență": "senzor prezență",
    "senzori fum": "senzor fum",
    "senzori calitate aer": "senzor calitate aer",
    întrerupătoare: "întrerupător",
    "controlere LED": "controler LED",
    "controlere audio": "controler audio",
    "controlere energie EV": "controler energie EV",
    "canale actuator jaluzele": "canal actuator jaluzele",
    "capete termostatice": "cap termostatic",
    "module alarmă": "modul alarmă",
    "module control piscină": "modul control piscină",
    "panouri tactile": "panou tactil",
    videointerfoane: "videointerfon",
    "camere IP": "cameră IP",
    "zone de irigații": "zonă de irigații",
    "servere automatizare locală": "server automatizare locală",
  };
  return singular[label] ?? label;
}

export function CommercialKitConfigurator({ initialKit }: Readonly<{ initialKit: KitId }>) {
  const kit = kitDefinitions[initialKit];
  const [isReady, setIsReady] = useState(false);
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const autoSubmitStarted = useRef(false);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [selectedOptionIds, setSelectedOptionIds] = useState<Set<string>>(
    () => new Set(kit.defaultSelections),
  );
  const [blockScale, setBlockScale] = useState<BlockScale>({
    kind: "block",
    staircases: 1,
    studios: 4,
    twoRoom: 8,
    threeRoom: 8,
    fourPlusRoom: 4,
    parking: true,
    basement: true,
    exterior: true,
  });
  const [hospitalityScale, setHospitalityScale] = useState<HospitalityScale>({
    kind: "hospitality",
    standardRooms: initialKit === "hotel-smart" ? 30 : 10,
    suites: initialKit === "hotel-smart" ? 4 : 2,
    accessibleRooms: initialKit === "hotel-smart" ? 2 : 1,
    reception: true,
    restaurant: initialKit === "hotel-smart",
    spa: false,
  });
  const isBlockConfigurator = initialKit === "bloc-smart";
  const isHospitalityConfigurator = initialKit === "pensiune-smart" || initialKit === "hotel-smart";
  const buildingScale = isBlockConfigurator
    ? blockScale
    : isHospitalityConfigurator
      ? hospitalityScale
      : undefined;
  const activeCategory = configuratorCategories[activeCategoryIndex] ?? configuratorCategories[0];
  const summary = useMemo(
    () => calculateCommercialSummary(initialKit, selectedOptionIds, buildingScale),
    [buildingScale, initialKit, selectedOptionIds],
  );
  const visibleOptions = commercialOptions.filter(
    ({ category }) => category === activeCategory?.id,
  );
  const accent = kitAccent[initialKit];
  const isScaleStep = activeCategory?.id === "rooms" && Boolean(buildingScale);
  const scaleStepTitle = isBlockConfigurator
    ? "Clădire și apartamente"
    : isHospitalityConfigurator
      ? "Camere și spații comune"
      : activeCategory?.label;
  const scaleStepDescription = isBlockConfigurator
    ? "Introdu numărul de scări și distribuția apartamentelor pe tipologii. Apartamentele identice sunt calculate împreună."
    : isHospitalityConfigurator
      ? "Dimensionează camerele de cazare pe tipuri și selectează spațiile comune incluse."
      : activeCategory?.description;
  const scaleSelectedCount = summary.scale?.units ?? 0;

  const submitQuote = useCallback(async (input: KitQuoteInput): Promise<void> => {
    setIsSubmittingQuote(true);
    setQuoteError(null);
    try {
      const response = await fetch("/api/portal/kit-quote-requests", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (response.status === 401) {
        const continuation = `/configurator-kit?kit=${input.kitId}&submit=1`;
        window.location.assign(`/login?next=${encodeURIComponent(continuation)}`);
        return;
      }
      if (!response.ok) {
        setQuoteError(
          response.status === 403
            ? "Cererea poate fi trimisă numai dintr-un cont de client."
            : "Cererea nu a putut fi trimisă. Încearcă din nou.",
        );
        return;
      }
      const result = (await response.json()) as { redirectTo?: string };
      window.localStorage.removeItem(pendingQuoteStorageKey);
      window.location.assign(result.redirectTo ?? "/portal?request=sent");
    } catch {
      setQuoteError("Conexiunea a fost întreruptă. Selecția ta a rămas salvată.");
    } finally {
      setIsSubmittingQuote(false);
    }
  }, []);

  useEffect(() => {
    setIsReady(true);
    const shouldResume = new URLSearchParams(window.location.search).get("submit") === "1";
    if (!shouldResume || autoSubmitStarted.current) return;
    autoSubmitStarted.current = true;
    const stored = window.localStorage.getItem(pendingQuoteStorageKey);
    if (!stored) return;
    try {
      const parsed: unknown = JSON.parse(stored);
      const result = kitQuoteInputSchema.safeParse(parsed);
      if (result.success) void submitQuote(result.data);
    } catch {
      window.localStorage.removeItem(pendingQuoteStorageKey);
    }
  }, [submitQuote]);

  function requestQuote(): void {
    const input: KitQuoteInput = {
      kitId: initialKit,
      selectedOptionIds: [...selectedOptionIds],
      ...(buildingScale ? { buildingScale } : {}),
    };
    window.localStorage.setItem(pendingQuoteStorageKey, JSON.stringify(input));
    void submitQuote(input);
  }

  function toggleOption(optionId: string): void {
    setSelectedOptionIds((current) => {
      const next = new Set(current);
      if (next.has(optionId)) next.delete(optionId);
      else next.add(optionId);
      return next;
    });
  }

  function selectCategory(index: number): void {
    setActiveCategoryIndex(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const isLastStep = activeCategoryIndex === configuratorCategories.length - 1;
  const savingsLabel = "Rezervă până la limita orientativă a kitului";

  return (
    <main
      data-testid="commercial-configurator"
      data-ready={isReady ? "true" : "false"}
      aria-busy={!isReady}
      className={`bg-[#f4f7f5] ${isReady ? "" : "[&_button]:pointer-events-none"}`}
    >
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-5 lg:px-8 lg:py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/kituri"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate transition hover:text-emerald-700"
          >
            <ArrowLeft className="size-4" /> Înapoi la kituri
          </Link>
          <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${accent.chip}`}>
            Estimare orientativă · fără obligații
          </span>
        </div>

        <section className="mt-6 overflow-hidden rounded-2xl border border-[#d9e2de] bg-white shadow-[0_12px_35px_rgba(19,39,31,.06)]">
          <div className={`h-1 ${accent.line}`} />
          <div className="grid gap-5 px-5 py-6 sm:px-7 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.17em] text-emerald-700">
                Configurator comercial
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-[-.04em] text-ink sm:text-4xl">
                {kit.name}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate">{kit.shortDescription}</p>
            </div>
            <div className="rounded-xl border border-[#dce5e0] bg-[#f7faf8] px-5 py-4 lg:min-w-64 lg:text-right">
              <p className="text-xs font-semibold uppercase tracking-[.12em] text-slate">
                Preț estimat
              </p>
              <p
                aria-live="polite"
                data-testid="header-price"
                className="mt-1 text-3xl font-semibold tracking-[-.035em] text-ink"
              >
                {formatEuro(summary.price)}
              </p>
            </div>
          </div>
        </section>

        <div
          className="mt-5 flex gap-2 overflow-x-auto pb-2 lg:hidden"
          aria-label="Pași configurator"
        >
          {configuratorCategories.map((category, index) => (
            <button
              key={category.id}
              type="button"
              onClick={() => selectCategory(index)}
              className={`shrink-0 rounded-full border px-3 py-2 text-xs font-semibold transition ${
                index === activeCategoryIndex
                  ? "border-emerald-700 bg-emerald-700 text-white"
                  : "border-[#ccd8d2] bg-white text-slate"
              }`}
            >
              {index + 1}.{" "}
              {category.id === "rooms" && isBlockConfigurator
                ? "Apartamente"
                : category.id === "rooms" && isHospitalityConfigurator
                  ? "Camere cazare"
                  : category.shortLabel}
            </button>
          ))}
        </div>

        <div className="mt-5 grid items-start gap-5 lg:grid-cols-[14rem_minmax(0,1fr)_21rem] xl:grid-cols-[15rem_minmax(0,1fr)_23rem]">
          <aside className="sticky top-24 hidden overflow-hidden rounded-xl border border-[#d9e2de] bg-white lg:block">
            <p className="border-b border-[#e2e8e5] px-4 py-4 text-xs font-semibold uppercase tracking-[.14em] text-slate">
              Configurează pe pași
            </p>
            <nav aria-label="Pași configurator comercial" className="p-2">
              {configuratorCategories.map((category, index) => {
                const Icon =
                  category.id === "rooms" && isBlockConfigurator
                    ? Building2
                    : category.id === "rooms" && isHospitalityConfigurator
                      ? Hotel
                      : categoryIcons[category.id];
                const selectedCount =
                  category.id === "rooms" && buildingScale
                    ? scaleSelectedCount
                    : commercialOptions.filter(
                        (option) =>
                          option.category === category.id && selectedOptionIds.has(option.id),
                      ).length;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => selectCategory(index)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition ${
                      index === activeCategoryIndex
                        ? "bg-[#edf6f1] font-semibold text-[#087657]"
                        : "text-ink hover:bg-[#f5f8f6]"
                    }`}
                  >
                    <Icon className="size-5 shrink-0 stroke-[1.6]" />
                    <span className="flex-1">
                      {category.id === "rooms" && isBlockConfigurator
                        ? "Apartamente"
                        : category.id === "rooms" && isHospitalityConfigurator
                          ? "Camere cazare"
                          : category.shortLabel}
                    </span>
                    {selectedCount > 0 ? (
                      <span className="grid size-6 place-items-center rounded-full bg-white text-[11px] font-semibold text-emerald-700 shadow-sm">
                        {selectedCount}
                      </span>
                    ) : (
                      <ChevronRight className="size-4 text-slate" />
                    )}
                  </button>
                );
              })}
            </nav>
          </aside>

          <section className="min-w-0 rounded-xl border border-[#d9e2de] bg-white p-5 shadow-[0_8px_24px_rgba(19,39,31,.04)] sm:p-7">
            <div className="flex items-start gap-4 border-b border-[#e3e9e6] pb-5">
              {activeCategory &&
                (() => {
                  const Icon =
                    activeCategory.id === "rooms" && isBlockConfigurator
                      ? Building2
                      : activeCategory.id === "rooms" && isHospitalityConfigurator
                        ? Hotel
                        : categoryIcons[activeCategory.id];
                  return (
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#edf6f1] text-emerald-700">
                      <Icon className="size-6 stroke-[1.6]" />
                    </span>
                  );
                })()}
              <div>
                <p className="text-xs font-semibold uppercase tracking-[.14em] text-slate">
                  Pasul {activeCategoryIndex + 1} din {configuratorCategories.length}
                </p>
                <h2 className="mt-1 text-2xl font-semibold tracking-[-.03em] text-ink">
                  {scaleStepTitle}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate">{scaleStepDescription}</p>
              </div>
            </div>

            {isBlockConfigurator && isScaleStep ? (
              <div className="mt-5 space-y-6">
                <div>
                  <div className="flex items-center gap-3">
                    <Building2 className="size-5 text-emerald-700" />
                    <h3 className="font-semibold text-ink">Structura blocului</h3>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <NumberField
                      label="Număr de scări"
                      value={blockScale.staircases}
                      min={1}
                      max={10}
                      onChange={(staircases) =>
                        setBlockScale((current) => ({ ...current, staircases }))
                      }
                    />
                    <NumberField
                      label="Garsoniere"
                      value={blockScale.studios}
                      onChange={(studios) => setBlockScale((current) => ({ ...current, studios }))}
                    />
                    <NumberField
                      label="Apartamente cu 2 camere"
                      value={blockScale.twoRoom}
                      onChange={(twoRoom) => setBlockScale((current) => ({ ...current, twoRoom }))}
                    />
                    <NumberField
                      label="Apartamente cu 3 camere"
                      value={blockScale.threeRoom}
                      onChange={(threeRoom) =>
                        setBlockScale((current) => ({ ...current, threeRoom }))
                      }
                    />
                    <NumberField
                      label="Apartamente cu 4+ camere"
                      value={blockScale.fourPlusRoom}
                      onChange={(fourPlusRoom) =>
                        setBlockScale((current) => ({ ...current, fourPlusRoom }))
                      }
                    />
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[.12em] text-emerald-800">
                        Total calculat
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-ink">
                        {summary.scale?.units ?? 0} apartamente
                      </p>
                      <p className="mt-1 text-xs text-slate">
                        {summary.scale?.spaces ?? 0} camere locuibile
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-ink">Spații comune incluse</h3>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <ToggleField
                      label="Parcare"
                      checked={blockScale.parking}
                      onChange={(parking) => setBlockScale((current) => ({ ...current, parking }))}
                    />
                    <ToggleField
                      label="Subsol și spații tehnice"
                      checked={blockScale.basement}
                      onChange={(basement) =>
                        setBlockScale((current) => ({ ...current, basement }))
                      }
                    />
                    <ToggleField
                      label="Exterior și alei"
                      checked={blockScale.exterior}
                      onChange={(exterior) =>
                        setBlockScale((current) => ({ ...current, exterior }))
                      }
                    />
                  </div>
                </div>
                <p className="rounded-lg bg-[#f5f8f6] px-4 py-3 text-xs leading-5 text-slate">
                  Nu configurăm fiecare apartament separat în această etapă. După încărcarea
                  planului poți ajusta apartamentele care diferă de tipologia standard.
                </p>
              </div>
            ) : isHospitalityConfigurator && isScaleStep ? (
              <div className="mt-5 space-y-6">
                <div className="flex items-center gap-3">
                  <Hotel className="size-5 text-emerald-700" />
                  <h3 className="font-semibold text-ink">Capacitatea de cazare</h3>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <NumberField
                    label="Camere standard"
                    value={hospitalityScale.standardRooms}
                    onChange={(standardRooms) =>
                      setHospitalityScale((current) => ({ ...current, standardRooms }))
                    }
                  />
                  <NumberField
                    label="Suite / apartamente"
                    value={hospitalityScale.suites}
                    onChange={(suites) =>
                      setHospitalityScale((current) => ({ ...current, suites }))
                    }
                  />
                  <NumberField
                    label="Camere accesibile"
                    value={hospitalityScale.accessibleRooms}
                    onChange={(accessibleRooms) =>
                      setHospitalityScale((current) => ({ ...current, accessibleRooms }))
                    }
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <ToggleField
                    label="Recepție"
                    checked={hospitalityScale.reception}
                    onChange={(reception) =>
                      setHospitalityScale((current) => ({ ...current, reception }))
                    }
                  />
                  <ToggleField
                    label="Restaurant"
                    checked={hospitalityScale.restaurant}
                    onChange={(restaurant) =>
                      setHospitalityScale((current) => ({ ...current, restaurant }))
                    }
                  />
                  <ToggleField
                    label="Spa / wellness"
                    checked={hospitalityScale.spa}
                    onChange={(spa) => setHospitalityScale((current) => ({ ...current, spa }))}
                  />
                </div>
                <p className="rounded-lg bg-[#f5f8f6] px-4 py-3 text-xs leading-5 text-slate">
                  Camerele identice folosesc aceeași tipologie. Diferențele se confirmă după
                  încărcarea planurilor pe nivel.
                </p>
              </div>
            ) : (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {visibleOptions.map((option) => {
                  const checked = selectedOptionIds.has(option.id);
                  return (
                    <label
                      key={option.id}
                      className={`group relative flex cursor-pointer gap-3 rounded-xl border p-4 transition duration-200 ${
                        checked
                          ? "border-emerald-600 bg-[#f0f8f4] shadow-[0_6px_18px_rgba(8,118,87,.08)]"
                          : "border-[#dce4e0] bg-white hover:border-[#aac9bc] hover:bg-[#fafcfb]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleOption(option.id)}
                        className="peer sr-only"
                      />
                      <span
                        aria-hidden="true"
                        className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded border transition ${
                          checked
                            ? "border-emerald-700 bg-emerald-700 text-white"
                            : "border-[#aebdb6] bg-white"
                        }`}
                      >
                        {checked && <Check className="size-3.5 stroke-[2.5]" />}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-ink">{option.label}</span>
                        <span className="mt-1 block text-xs leading-5 text-slate">
                          {option.description}
                        </span>
                        <span className="mt-2 block text-xs font-semibold text-emerald-700">
                          + {formatEuro(option.price)}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            )}

            <div className="mt-7 flex items-center justify-between gap-3 border-t border-[#e3e9e6] pt-5">
              <button
                type="button"
                disabled={activeCategoryIndex === 0}
                onClick={() => selectCategory(Math.max(0, activeCategoryIndex - 1))}
                className="inline-flex items-center rounded-lg border border-[#ccd8d2] px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-ink disabled:cursor-not-allowed disabled:opacity-35"
              >
                <ArrowLeft className="mr-2 size-4" /> Înapoi
              </button>
              {isLastStep ? (
                <a
                  href="#summary-mobile"
                  className="inline-flex items-center rounded-lg bg-[#087657] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#065c43] lg:hidden"
                >
                  Vezi estimarea <BadgeEuro className="ml-2 size-4" />
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => selectCategory(activeCategoryIndex + 1)}
                  className="inline-flex items-center rounded-lg bg-[#087657] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#065c43]"
                >
                  Următorul pas <ArrowRight className="ml-2 size-4" />
                </button>
              )}
            </div>
          </section>

          <aside
            id="summary-mobile"
            className="sticky top-24 overflow-hidden rounded-xl border border-[#cfdcd6] bg-[#102720] text-white shadow-[0_18px_45px_rgba(10,35,28,.18)]"
          >
            <div className={`h-1 ${accent.line}`} />
            <div className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[.15em] text-white/55">
                    Rezumat live
                  </p>
                  <h2 className="mt-1 text-xl font-semibold">{kit.name}</h2>
                </div>
                <PackageCheck className="size-6 text-emerald-300" />
              </div>

              <ul className="mt-5 max-h-[19rem] space-y-2.5 overflow-y-auto border-y border-white/10 py-4 text-sm">
                {summary.equipment.map(({ label, quantity }) => (
                  <li key={label} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-300" />
                    <span>
                      <strong className="font-semibold">{quantity}</strong>{" "}
                      {equipmentLabel(label, quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              {summary.scale ? (
                <div className="mt-4 rounded-lg border border-white/10 bg-white/[.06] p-4 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-white/60">Infrastructură și funcții</span>
                    <strong>{formatEuro(summary.price - summary.scale.price)}</strong>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <span className="text-white/60">
                      Dimensionare {summary.scale.label.toLowerCase()}
                    </span>
                    <strong>{formatEuro(summary.scale.price)}</strong>
                  </div>
                </div>
              ) : null}

              <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-white/[.07] p-3">
                  <dt className="text-xs text-white/55">
                    {summary.scale ? summary.scale.label : "Poziții materiale"}
                  </dt>
                  <dd className="mt-1 text-lg font-semibold" data-testid="product-count">
                    {summary.scale?.units ?? summary.products}
                  </dd>
                </div>
                <div className="rounded-lg bg-white/[.07] p-3">
                  <dt className="text-xs text-white/55">
                    {summary.scale ? "Camere / spații" : "Dispozitive"}
                  </dt>
                  <dd className="mt-1 text-lg font-semibold" data-testid="device-count">
                    {summary.scale?.spaces ?? summary.devices}
                  </dd>
                </div>
                <div className="rounded-lg bg-white/[.07] p-3">
                  <dt className="text-xs text-white/55">Tablou</dt>
                  <dd className="mt-1 font-semibold">Da</dd>
                </div>
                <div className="rounded-lg bg-white/[.07] p-3">
                  <dt className="text-xs text-white/55">Montaj</dt>
                  <dd className="mt-1 font-semibold">Estimare</dd>
                </div>
              </dl>

              <div className="mt-5 border-t border-white/10 pt-5">
                <p className="text-xs font-semibold uppercase tracking-[.14em] text-white/55">
                  Total estimat
                </p>
                <p
                  aria-live="polite"
                  data-testid="summary-price"
                  className="mt-1 text-3xl font-semibold tracking-[-.035em]"
                >
                  {formatEuro(summary.price)}
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs text-emerald-200">
                  <CloudSun className="size-4" />
                  <span>
                    {savingsLabel}: <strong>{formatEuro(summary.savings)}</strong>
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={requestQuote}
                disabled={isSubmittingQuote}
                className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-semibold text-[#102720] transition hover:bg-emerald-50 disabled:cursor-wait disabled:opacity-70"
              >
                {isSubmittingQuote ? "Se trimite…" : "Solicită ofertă"}{" "}
                <ArrowRight className="ml-2 size-4" />
              </button>
              {quoteError ? (
                <p role="alert" className="mt-3 rounded-lg bg-red-950/40 p-3 text-xs text-red-100">
                  {quoteError}
                </p>
              ) : null}
              <Link
                href="/login"
                className="mt-3 inline-flex w-full items-center justify-center rounded-lg border border-white/25 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Încarcă planul
              </Link>
              <p className="mt-3 text-center text-[11px] leading-4 text-white/45">
                Estimare orientativă. Confirmarea finală necesită analiza proiectului și a
                instalațiilor.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
