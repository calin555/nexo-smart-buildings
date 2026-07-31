"use client";

import Image from "next/image";
import {
  Blinds,
  Camera,
  CircuitBoard,
  Droplets,
  Lightbulb,
  PlugZap,
  ShieldCheck,
  Sun,
  ThermometerSun,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";

type SmartDevice = {
  id: string;
  label: string;
  zone: string;
  product: string;
  description: string;
  protocol: string;
  circuit: string;
  compatibility: string;
  status: string;
  position: { left: string; top: string };
  icon: LucideIcon;
};

const devices: SmartDevice[] = [
  {
    id: "panel",
    label: "Tablou de automatizare",
    zone: "Nucleul instalației",
    product: "N3XO Control Cabinet 48M",
    description:
      "Tablou modular cu protecții, actuatoare, surse și gateway-uri etichetate pe circuite.",
    protocol: "KNX + Matter + IP",
    circuit: "Alimentare 3P / magistrală BUS / Ethernet",
    compatibility: "Home Assistant, Apple Home, Google Home",
    status: "Online · 34 circuite",
    position: { left: "47.6%", top: "56%" },
    icon: CircuitBoard,
  },
  {
    id: "socket",
    label: "Priză inteligentă",
    zone: "Living parter",
    product: "N3XO Socket Relay 16A",
    description:
      "Comutare locală și din aplicație, măsurarea consumului și oprire automată la suprasarcină.",
    protocol: "Matter over Thread",
    circuit: "P-07 · 3 × 2,5 mm² · protecție RCBO",
    compatibility: "Apple Home, Google Home, Home Assistant",
    status: "Activă · 38 W",
    position: { left: "35.4%", top: "61%" },
    icon: PlugZap,
  },
  {
    id: "blinds",
    label: "Jaluzele motorizate",
    zone: "Dormitor matrimonial",
    product: "N3XO Blind Drive 4CH",
    description:
      "Controlează poziția lamelelor, cursa motorului și scenariile de umbrire după lumină și temperatură.",
    protocol: "KNX Secure",
    circuit: "J-02 · actuator 4 canale · 230 V",
    compatibility: "KNX, Home Assistant, scenarii N3XO",
    status: "Poziție · 62%",
    position: { left: "22.6%", top: "31.5%" },
    icon: Blinds,
  },
  {
    id: "lighting",
    label: "Iluminat inteligent",
    zone: "Bucătărie și dining",
    product: "N3XO DALI Gateway 64",
    description:
      "Reglaj fin, scene de lumină și monitorizarea corpurilor de iluminat pe zone independente.",
    protocol: "DALI-2 / KNX",
    circuit: "L-11 · magistrală DALI · 8 corpuri",
    compatibility: "KNX, Home Assistant, butoane locale",
    status: "Scena Seară · 45%",
    position: { left: "64.4%", top: "47.2%" },
    icon: Lightbulb,
  },
  {
    id: "climate",
    label: "Control climatic",
    zone: "Dormitor etaj",
    product: "N3XO Room Controller CO₂",
    description:
      "Măsoară temperatura, umiditatea și CO₂ și comandă încălzirea, răcirea și ventilația.",
    protocol: "KNX TP",
    circuit: "C-04 · HVAC zonal · 24 V",
    compatibility: "Pompă de căldură, ventilație, Home Assistant",
    status: "22,6 °C · aer optim",
    position: { left: "54.5%", top: "36%" },
    icon: ThermometerSun,
  },
  {
    id: "security",
    label: "Supraveghere și perimetru",
    zone: "Terasă și acces",
    product: "N3XO Vision PoE 4K",
    description:
      "Cameră PoE cu analiză locală a evenimentelor și integrare în scenariul Plecat de acasă.",
    protocol: "PoE / ONVIF",
    circuit: "S-03 · CAT6A · VLAN securitate",
    compatibility: "NVR, Home Assistant, aplicația N3XO",
    status: "Protejat · fără evenimente",
    position: { left: "83.2%", top: "22.5%" },
    icon: Camera,
  },
  {
    id: "energy",
    label: "Producție și energie",
    zone: "Acoperiș și tablou",
    product: "N3XO Energy Meter 3P",
    description:
      "Corelează producția fotovoltaică, importul din rețea și consumul fiecărui circuit important.",
    protocol: "Modbus TCP / KNX",
    circuit: "E-01 · contorizare trifazată · 100 A",
    compatibility: "Invertor PV, baterie, Home Assistant",
    status: "Producție · 4,8 kW",
    position: { left: "36.2%", top: "13.3%" },
    icon: Sun,
  },
  {
    id: "leak",
    label: "Protecție la inundație",
    zone: "Cameră tehnică",
    product: "N3XO Water Guard",
    description:
      "Detectează apa, închide electrovana principală și trimite imediat o alertă verificabilă.",
    protocol: "Zigbee 3.0",
    circuit: "W-01 · senzor + electrovană 12 V",
    compatibility: "Home Assistant, gateway N3XO, notificări mobile",
    status: "Uscat · electrovana deschisă",
    position: { left: "68.1%", top: "89.5%" },
    icon: Droplets,
  },
];

function TechnicalRow({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="border-t border-white/10 py-3">
      <dt className="text-[10px] font-semibold uppercase tracking-[.14em] text-cyan-200/60">
        {label}
      </dt>
      <dd className="mt-1 text-sm leading-5 text-white/85">{value}</dd>
    </div>
  );
}

export function InteractiveSmartHome() {
  const [selectedId, setSelectedId] = useState("panel");
  const defaultDevice = devices[0] as SmartDevice;
  const selected = devices.find((device) => device.id === selectedId) ?? defaultDevice;
  const SelectedIcon = selected.icon;

  return (
    <div className="overflow-hidden rounded-2xl border border-[#244a4b] bg-[#071a20] shadow-[0_24px_70px_rgba(4,20,25,.25)]">
      <div className="grid xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="relative aspect-[16/9] min-h-[26rem] overflow-hidden bg-[#07151b] max-sm:min-h-0">
          <Image
            src="/images/projects/casa-inteligenta-cluj-technical.png"
            alt="Secțiune tehnică a unei case inteligente cu traseele circuitelor vizibile"
            fill
            priority
            sizes="(min-width: 1280px) 75vw, 100vw"
            className="object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06171d]/55 via-transparent to-[#06171d]/15" />
          <div className="absolute left-4 top-4 rounded-lg border border-white/15 bg-[#06171d]/80 px-3 py-2 text-white backdrop-blur-md sm:left-6 sm:top-6">
            <p className="text-[10px] font-semibold uppercase tracking-[.17em] text-cyan-300">
              Plan tehnic interactiv
            </p>
            <p className="mt-1 text-sm font-medium">Selectează un circuit din casă</p>
          </div>

          {devices.map(({ id, label, position, icon: Icon }, index) => {
            const active = selectedId === id;
            return (
              <button
                key={id}
                type="button"
                aria-label={`Vezi detalii: ${label}`}
                aria-pressed={active}
                onClick={() => setSelectedId(id)}
                className={`group absolute grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border text-white shadow-[0_0_0_5px_rgba(65,225,218,.12),0_8px_20px_rgba(0,0,0,.35)] transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#071a20] sm:size-11 ${active ? "scale-110 border-white bg-[#087f79]" : "border-cyan-200/80 bg-[#092b31]/90 hover:scale-110 hover:bg-[#087f79]"}`}
                style={position}
              >
                <Icon className="size-4 sm:size-5" strokeWidth={1.8} />
                <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-white text-[9px] font-bold text-[#073139]">
                  {index + 1}
                </span>
                <span className="pointer-events-none absolute bottom-full left-1/2 mb-3 hidden -translate-x-1/2 whitespace-nowrap rounded bg-[#06171d] px-2.5 py-1.5 text-[11px] font-medium shadow-lg group-hover:block sm:block sm:opacity-0 sm:transition sm:group-hover:opacity-100">
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        <aside
          aria-live="polite"
          className="relative flex min-h-[30rem] flex-col bg-[#09232a] p-6 text-white sm:p-7"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="grid size-12 shrink-0 place-items-center rounded-xl border border-cyan-300/25 bg-cyan-300/10 text-cyan-200">
              <SelectedIcon className="size-6" strokeWidth={1.7} />
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[.12em] text-emerald-200">
              <span className="size-1.5 rounded-full bg-emerald-300 shadow-[0_0_8px_#6ee7b7]" />{" "}
              Live demo
            </span>
          </div>
          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[.16em] text-cyan-200/65">
            {selected.zone}
          </p>
          <h2 className="mt-2 text-2xl font-medium tracking-[-.03em]">{selected.label}</h2>
          <p className="mt-2 text-lg font-medium text-cyan-100">{selected.product}</p>
          <p className="mt-4 text-sm leading-6 text-white/65">{selected.description}</p>
          <dl className="mt-5">
            <TechnicalRow label="Protocol" value={selected.protocol} />
            <TechnicalRow label="Circuit" value={selected.circuit} />
            <TechnicalRow label="Compatibilitate" value={selected.compatibility} />
          </dl>
          <div className="mt-auto flex items-center gap-2 rounded-lg border border-emerald-300/15 bg-[#0d302f] px-3 py-3 text-xs font-medium text-emerald-100">
            <ShieldCheck className="size-4 shrink-0" /> {selected.status}
          </div>
        </aside>
      </div>

      <div className="flex gap-2 overflow-x-auto border-t border-white/10 bg-[#071a20] px-4 py-4 sm:px-6">
        {devices.map(({ id, label, icon: Icon }, index) => (
          <button
            key={id}
            type="button"
            onClick={() => setSelectedId(id)}
            className={`inline-flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition duration-200 ${selectedId === id ? "border-cyan-300/60 bg-cyan-300/15 text-white" : "border-white/10 bg-white/5 text-white/60 hover:border-white/25 hover:text-white"}`}
          >
            <Icon className="size-4" />{" "}
            <span>
              {index + 1}. {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
