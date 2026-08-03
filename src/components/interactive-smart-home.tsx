"use client";

import Image from "next/image";
import {
  BatteryCharging,
  Blinds,
  Building2,
  Camera,
  ChartNoAxesCombined,
  CircleParking,
  CircuitBoard,
  Droplets,
  Fan,
  KeyRound,
  Lightbulb,
  PlugZap,
  ShieldCheck,
  Sun,
  ThermometerSun,
  Waves,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";

export type ProjectKey = "cluj-house" | "cluj-block" | "brasov-house";

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

type ProjectConfiguration = {
  image: string;
  imageAlt: string;
  instruction: string;
  devices: SmartDevice[];
};

const projectConfigurations: Record<ProjectKey, ProjectConfiguration> = {
  "cluj-house": {
    image: "/images/projects/casa-inteligenta-cluj-technical.png",
    imageAlt: "Secțiune tehnică a unei case inteligente cu traseele circuitelor vizibile",
    instruction: "Selectează un circuit din casă",
    devices: [
      {
        id: "panel",
        label: "Tablou de automatizare",
        zone: "Nucleul instalației",
        product: "Tablou modular 48M · configurație orientativă",
        description:
          "Tablou cu protecții, actuatoare, surse și gateway-uri etichetate pe circuite.",
        protocol: "KNX + Matter + IP",
        circuit: "Alimentare 3P / magistrală BUS / Ethernet",
        compatibility: "Home Assistant, Apple Home, Google Home",
        status: "Configurație demo · 34 circuite",
        position: { left: "47.6%", top: "56%" },
        icon: CircuitBoard,
      },
      {
        id: "socket",
        label: "Priză inteligentă",
        zone: "Living parter",
        product: "Releu de priză 16 A cu măsurare",
        description:
          "Comutare locală și din aplicație, măsurarea consumului și protecție la suprasarcină.",
        protocol: "Matter over Thread",
        circuit: "P-07 · 3 × 2,5 mm² · protecție RCBO",
        compatibility: "Apple Home, Google Home, Home Assistant",
        status: "Exemplu de sarcină · 38 W",
        position: { left: "35.4%", top: "61%" },
        icon: PlugZap,
      },
      {
        id: "blinds",
        label: "Jaluzele motorizate",
        zone: "Dormitor matrimonial",
        product: "Actuator de jaluzele 4 canale",
        description:
          "Poziționare, protecție la vânt și scenarii de umbrire după lumină și temperatură.",
        protocol: "KNX Secure",
        circuit: "J-02 · actuator 4 canale · 230 V",
        compatibility: "KNX, Home Assistant, comenzi locale",
        status: "Poziție demonstrativă · 62%",
        position: { left: "22.6%", top: "31.5%" },
        icon: Blinds,
      },
      {
        id: "lighting",
        label: "Iluminat inteligent",
        zone: "Bucătărie și dining",
        product: "Gateway DALI-2 / KNX",
        description:
          "Reglaj fin, scene de lumină și monitorizarea corpurilor pe zone independente.",
        protocol: "DALI-2 / KNX",
        circuit: "L-11 · magistrală DALI · 8 corpuri",
        compatibility: "KNX, Home Assistant, butoane locale",
        status: "Scenă demonstrativă · Seară",
        position: { left: "64.4%", top: "47.2%" },
        icon: Lightbulb,
      },
      {
        id: "climate",
        label: "Control climatic",
        zone: "Dormitor etaj",
        product: "Controler de cameră cu senzor CO₂",
        description: "Măsoară temperatura, umiditatea și CO₂ și comandă încălzirea și ventilația.",
        protocol: "KNX TP",
        circuit: "C-04 · HVAC zonal · 24 V",
        compatibility: "Pompă de căldură, ventilație, Home Assistant",
        status: "Valori simulate · 22,6 °C",
        position: { left: "54.5%", top: "36%" },
        icon: ThermometerSun,
      },
      {
        id: "security",
        label: "Supraveghere și perimetru",
        zone: "Terasă și acces",
        product: "Cameră IP PoE 4K",
        description: "Supraveghere locală și integrare în scenariul Plecat de acasă.",
        protocol: "PoE / ONVIF",
        circuit: "S-03 · CAT6A · VLAN securitate",
        compatibility: "NVR, Home Assistant, aplicație mobilă",
        status: "Scenariu demonstrativ · Protejat",
        position: { left: "83.2%", top: "22.5%" },
        icon: Camera,
      },
      {
        id: "energy",
        label: "Producție și energie",
        zone: "Acoperiș și tablou",
        product: "Contor trifazat Modbus",
        description:
          "Corelează producția fotovoltaică, importul din rețea și consumul circuitelor.",
        protocol: "Modbus TCP / KNX",
        circuit: "E-01 · contorizare trifazată · 100 A",
        compatibility: "Invertor PV, baterie, Home Assistant",
        status: "Valoare simulată · 4,8 kW",
        position: { left: "36.2%", top: "13.3%" },
        icon: Sun,
      },
      {
        id: "leak",
        label: "Protecție la inundație",
        zone: "Cameră tehnică",
        product: "Senzor apă + electrovană",
        description: "Detectează apa, închide electrovana principală și trimite o alertă.",
        protocol: "Zigbee 3.0",
        circuit: "W-01 · senzor + electrovană 12 V",
        compatibility: "Home Assistant, gateway Zigbee, notificări mobile",
        status: "Scenariu demonstrativ · Uscat",
        position: { left: "68.1%", top: "89.5%" },
        icon: Droplets,
      },
    ],
  },
  "cluj-block": {
    image: "/images/projects/bloc-rezidential-cluj-interactive.png",
    imageAlt: "Bloc rezidențial inteligent din Cluj cu trasee tehnice și sisteme comune vizibile",
    instruction: "Selectează un sistem al clădirii",
    devices: [
      {
        id: "bms",
        label: "Automatizare centrală BMS",
        zone: "Cameră tehnică parter",
        product: "Controler BMS modular cu gateway IP",
        description:
          "Centralizează stările instalațiilor comune, alarmele și programele de funcționare.",
        protocol: "KNX/IP + BACnet + Modbus TCP",
        circuit: "BMS-01 · Ethernet redundant · UPS",
        compatibility: "HVAC, iluminat, contoare, control acces",
        status: "Topologie demo · 86 puncte monitorizate",
        position: { left: "33.4%", top: "79.2%" },
        icon: Building2,
      },
      {
        id: "access",
        label: "Control acces rezidenți",
        zone: "Intrare principală",
        product: "Videointerfon IP + cititor securizat",
        description:
          "Acces cu tag, cod temporar și apel video, cu jurnalizare locală a evenimentelor.",
        protocol: "SIP / PoE / OSDP",
        circuit: "ACC-01 · CAT6A · sursă 24 V cu backup",
        compatibility: "Aplicație mobilă, recepție, sistem incendiu",
        status: "Flux demo · acces securizat",
        position: { left: "60.2%", top: "74%" },
        icon: KeyRound,
      },
      {
        id: "parking",
        label: "Acces parcare subterană",
        zone: "Rampă auto",
        product: "Barieră automată + buclă inductivă",
        description:
          "Gestionează accesul auto și deschiderea sigură după identificarea rezidentului.",
        protocol: "IP / releu securizat / Wiegand",
        circuit: "PARK-01 · 230 V + CAT6A + buclă",
        compatibility: "LPR, telecomenzi, control acces",
        status: "Scenariu demo · barieră închisă",
        position: { left: "14.5%", top: "88.5%" },
        icon: CircleParking,
      },
      {
        id: "lighting",
        label: "Iluminat spații comune",
        zone: "Holuri, scări și exterior",
        product: "Gateway DALI-2 cu senzori de prezență",
        description:
          "Reglează iluminatul după prezență și lumină naturală, cu nivel de siguranță permanent.",
        protocol: "DALI-2 / KNX",
        circuit: "L-COM · 6 linii DALI · 114 corpuri",
        compatibility: "Iluminat de siguranță, BMS, senzori KNX",
        status: "Calcul demo · economie estimată 32%",
        position: { left: "66.5%", top: "53.5%" },
        icon: Lightbulb,
      },
      {
        id: "metering",
        label: "Contorizare energetică",
        zone: "Coloane electrice",
        product: "Contoare trifazate cu citire Modbus",
        description: "Urmărește energia spațiilor comune, HVAC, pompe și stații de încărcare.",
        protocol: "Modbus RTU / TCP",
        circuit: "E-MAIN · RS-485 izolat · 3 × 100 A",
        compatibility: "BMS, rapoarte lunare, fotovoltaice",
        status: "Set de date demonstrativ",
        position: { left: "58.8%", top: "17.8%" },
        icon: ChartNoAxesCombined,
      },
      {
        id: "hvac",
        label: "Cascadă pompe de căldură",
        zone: "Platformă tehnică",
        product: "Manager HVAC în cascadă",
        description:
          "Alternează echipamentele și adaptează temperatura agentului la cererea clădirii.",
        protocol: "BACnet/IP + Modbus",
        circuit: "HVAC-01 · alimentare 3P · rețea tehnică",
        compatibility: "BMS, compensare meteo, contorizare termică",
        status: "Scenariu demo · sarcină parțială",
        position: { left: "12.1%", top: "72%" },
        icon: Fan,
      },
      {
        id: "solar",
        label: "Producție fotovoltaică",
        zone: "Acoperiș",
        product: "Sistem PV colectiv cu monitorizare",
        description:
          "Acoperă prioritar consumul comun și limitează exportul după configurația operatorului.",
        protocol: "Modbus TCP",
        circuit: "PV-01 · invertor trifazat · protecții DC/AC",
        compatibility: "BMS, contor bidirecțional, rapoarte energie",
        status: "Model demonstrativ · 28 kWp",
        position: { left: "32.8%", top: "14.7%" },
        icon: Sun,
      },
      {
        id: "ev",
        label: "Încărcare vehicule electrice",
        zone: "Parcare exterioară",
        product: "Stații AC cu management dinamic",
        description:
          "Distribuie puterea disponibilă între stații fără să depășească branșamentul clădirii.",
        protocol: "OCPP 1.6J / Modbus TCP",
        circuit: "EV-01 · 5 × 6 mm² · RCD tip A-EV",
        compatibility: "BMS, RFID, aplicație operator",
        status: "Configurație demo · 4 × 22 kW",
        position: { left: "86.3%", top: "72.8%" },
        icon: BatteryCharging,
      },
    ],
  },
  "brasov-house": {
    image: "/images/projects/casa-inteligenta-brasov-interactive.png",
    imageAlt: "Casă inteligentă din Brașov cu instalații și circuite tehnice vizibile",
    instruction: "Selectează o funcție a casei",
    devices: [
      {
        id: "climate",
        label: "Control climatic zonal",
        zone: "Cameră tehnică și încăperi",
        product: "Pompă de căldură + actuatoare pe zone",
        description:
          "Coordonează încălzirea în pardoseală, răcirea și apa caldă după ocupare și tarif.",
        protocol: "Modbus RTU + KNX",
        circuit: "HVAC-01 · distribuitor 8 zone · 24 V",
        compatibility: "Pompă de căldură, termostate, Home Assistant",
        status: "Valori simulate · tur 31 °C",
        position: { left: "68.2%", top: "66.5%" },
        icon: ThermometerSun,
      },
      {
        id: "blinds",
        label: "Umbrire automată",
        zone: "Fațada sud-vest",
        product: "Actuator jaluzele 8 canale",
        description:
          "Protejează interiorul de supraîncălzire și păstrează comenzile locale în fiecare cameră.",
        protocol: "KNX Secure",
        circuit: "J-01 · motoare 230 V · senzor meteo",
        compatibility: "Stație meteo, scene, butoane locale",
        status: "Poziție demo · 45%",
        position: { left: "51.7%", top: "32.4%" },
        icon: Blinds,
      },
      {
        id: "lighting",
        label: "Scene de iluminat",
        zone: "Living, dining și exterior",
        product: "Gateway DALI-2 + actuatoare KNX",
        description:
          "Combină iluminatul reglabil cu circuite clasice și scene adaptate momentului zilei.",
        protocol: "DALI-2 / KNX",
        circuit: "L-03 · 2 linii DALI · 18 corpuri",
        compatibility: "Butoane KNX, aplicație, senzori de prezență",
        status: "Scenă demonstrativă · Seară",
        position: { left: "42.7%", top: "55.5%" },
        icon: Lightbulb,
      },
      {
        id: "energy",
        label: "Energie solară și baterie",
        zone: "Acoperiș și cameră tehnică",
        product: "Sistem PV hibrid cu stocare",
        description:
          "Optimizează autoconsumul și mută sarcinile flexibile când există producție solară.",
        protocol: "Modbus TCP",
        circuit: "PV-01 · 10 kWp · baterie 12 kWh",
        compatibility: "Invertor hibrid, contor inteligent, pompă de căldură",
        status: "Model energetic demonstrativ",
        position: { left: "44.2%", top: "16.4%" },
        icon: BatteryCharging,
      },
      {
        id: "security",
        label: "Securitate perimetrală",
        zone: "Poartă și fațade",
        product: "Camere PoE + contact ușă",
        description: "Înregistrează local și activează scenarii doar pentru evenimente confirmate.",
        protocol: "PoE / ONVIF / contact uscat",
        circuit: "SEC-01 · CAT6A · VLAN izolat",
        compatibility: "NVR, videointerfon, Home Assistant",
        status: "Scenariu demo · perimetru protejat",
        position: { left: "8.7%", top: "50.5%" },
        icon: Camera,
      },
      {
        id: "sockets",
        label: "Prize și consumatori smart",
        zone: "Bucătărie și living",
        product: "Relee 16 A cu măsurare energie",
        description:
          "Monitorizează consumatorii selectați și îi oprește în scenariile de siguranță.",
        protocol: "Matter over Thread",
        circuit: "P-05 · 3 × 2,5 mm² · RCBO",
        compatibility: "Apple Home, Google Home, Home Assistant",
        status: "Consum simulat · 126 W",
        position: { left: "57.8%", top: "60.8%" },
        icon: PlugZap,
      },
      {
        id: "leak",
        label: "Protecție apă",
        zone: "Cameră tehnică și bucătărie",
        product: "Senzori de apă + electrovană principală",
        description:
          "Oprește alimentarea cu apă la detecție și păstrează comanda manuală disponibilă.",
        protocol: "Zigbee 3.0 / intrare binară",
        circuit: "W-01 · electrovană 12 V · contact NC",
        compatibility: "Gateway Zigbee, notificări, sistem alarmă",
        status: "Scenariu demo · fără alarmă",
        position: { left: "71.5%", top: "72.8%" },
        icon: Waves,
      },
      {
        id: "air",
        label: "Ventilație și calitatea aerului",
        zone: "Dormitoare și living",
        product: "Ventilație cu recuperare + senzori CO₂",
        description:
          "Adaptează debitul după ocupare și păstrează recuperarea de căldură eficientă iarna.",
        protocol: "Modbus RTU + KNX",
        circuit: "V-01 · 230 V · magistrală RS-485",
        compatibility: "Senzori CO₂, climatizare, scenariu Plecat",
        status: "Valoare simulată · 612 ppm CO₂",
        position: { left: "62.6%", top: "39%" },
        icon: Fan,
      },
    ],
  },
};

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

export function InteractiveSmartHome({
  project = "cluj-house",
}: Readonly<{ project?: ProjectKey }>) {
  const configuration = projectConfigurations[project];
  const [selectedId, setSelectedId] = useState(configuration.devices[0]?.id ?? "");
  const selected =
    configuration.devices.find((device) => device.id === selectedId) ?? configuration.devices[0];

  if (!selected) return null;

  const SelectedIcon = selected.icon;

  return (
    <div className="overflow-hidden rounded-2xl border border-[#244a4b] bg-[#071a20] shadow-[0_24px_70px_rgba(4,20,25,.25)]">
      <div className="grid xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="relative aspect-[16/9] min-h-[26rem] overflow-hidden bg-[#07151b] max-sm:min-h-0">
          <Image
            src={configuration.image}
            alt={configuration.imageAlt}
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
            <p className="mt-1 text-sm font-medium">{configuration.instruction}</p>
          </div>

          {configuration.devices.map(({ id, label, position, icon: Icon }, index) => {
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
              Demo tehnic
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
        {configuration.devices.map(({ id, label, icon: Icon }, index) => (
          <button
            key={id}
            type="button"
            onClick={() => setSelectedId(id)}
            className={`inline-flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition duration-200 ${selectedId === id ? "border-cyan-300/60 bg-cyan-300/15 text-white" : "border-white/10 bg-white/5 text-white/60 hover:border-white/25 hover:text-white"}`}
          >
            <Icon className="size-4" />
            <span>
              {index + 1}. {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
