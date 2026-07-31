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

const ecosystems = [
  { label: "Smart Home Wi-Fi", icon: HousePlug, color: "text-[#108361]", mark: "Wi-Fi" },
  { label: "Apple Home", icon: HousePlug, color: "text-[#1d1d1f]", mark: "⌂" },
  { label: "Google Home", icon: HomeMark, color: "text-[#4585f4]", mark: "G" },
  { label: "Matter", icon: MatterMark, color: "text-[#17202a]", mark: "✦" },
  { label: "Home Assistant", icon: MonitorSmartphone, color: "text-[#1f9ed4]", mark: "HA" },
  { label: "Aqara", icon: DoorOpen, color: "text-[#1b92cc]", mark: "AQ" },
  { label: "KNX profesional", icon: Building2, color: "text-[#ec9400]", mark: "KNX" },
  { label: "Securitate NEXO", icon: ShieldCheck, color: "text-[#008b68]", mark: "S" },
];

const products = [
  { brand: "NEXO Home", name: "Kit confort pentru apartament cu 2 camere", price: "de la 2.490 lei", type: "kit" as const, badge: "RECOMANDAT" },
  { brand: "NEXO Home", name: "Pachet de control pentru jaluzele și perdele", price: "de la 1.890 lei", type: "blinds" as const },
  { brand: "NEXO Climate", name: "Termostat inteligent cu senzor de prezență", price: "de la 990 lei", type: "climate" as const },
  { brand: "NEXO Secure", name: "Sistem de acces fără cheie pentru locuință", price: "de la 1.340 lei", type: "lock" as const, badge: "NOU" },
  { brand: "NEXO Energy", name: "Monitorizare consum electric pe circuite", price: "de la 760 lei", type: "energy" as const },
];

function HomeMark() { return <span className="text-5xl font-bold leading-none">⌂</span>; }
function MatterMark() { return <span className="text-6xl leading-none">✦</span>; }

function ProductIllustration({ type }: Readonly<{ type: (typeof products)[number]["type"] }>) {
  if (type === "kit") return <div className="relative flex h-44 items-end justify-center gap-3 bg-[#fafbfb] pb-7"><div className="h-20 w-9 rounded-lg border border-[#dfe4e1] bg-white shadow-sm" /><div className="h-28 w-16 rounded-xl bg-white shadow-[0_8px_16px_rgba(19,39,31,.14)]"><div className="mx-auto mt-6 size-8 rounded-full border-2 border-emerald-500" /></div><div className="h-16 w-20 rounded-xl bg-[#f2f5f3]" /></div>;
  if (type === "blinds") return <div className="relative flex h-44 items-end justify-center gap-5 bg-[#fafbfb] pb-7"><div className="h-28 w-8 rounded-full bg-white shadow-[0_8px_16px_rgba(19,39,31,.14)]" /><div className="h-24 w-8 rounded-full bg-white shadow-[0_8px_16px_rgba(19,39,31,.14)]" /><div className="h-16 w-24 rounded-xl border border-[#dfe4e1] bg-white" /></div>;
  if (type === "climate") return <div className="grid h-44 place-items-center bg-[#fafbfb]"><div className="relative grid size-28 place-items-center rounded-[1.4rem] bg-[#202d35] text-white shadow-[0_10px_20px_rgba(19,39,31,.18)]"><span className="text-3xl font-semibold">22°</span><span className="absolute bottom-5 text-[9px] tracking-[.14em] text-emerald-300">NEXO</span></div></div>;
  if (type === "lock") return <div className="flex h-44 items-center justify-center gap-4 bg-[#fafbfb]"><div className="h-28 w-12 rounded-full bg-[#4a5153] shadow-[0_10px_20px_rgba(19,39,31,.15)]"><div className="mx-auto mt-3 size-6 rounded-full border border-emerald-400" /><div className="mx-auto mt-9 h-6 w-1 rounded bg-emerald-400" /></div><div className="size-14 rounded-full border-4 border-[#e2e7e4] bg-white" /></div>;
  return <div className="relative grid h-44 place-items-center bg-[#fafbfb]"><div className="w-36 rounded-2xl bg-white p-5 shadow-[0_10px_20px_rgba(19,39,31,.13)]"><div className="flex gap-2"><i className="size-3 rounded-full bg-emerald-500" /><i className="size-3 rounded-full bg-[#dfe4e1]" /><i className="size-3 rounded-full bg-[#dfe4e1]" /></div><div className="mt-5 h-1.5 rounded-full bg-[#e8efeb]"><div className="h-full w-2/3 rounded-full bg-emerald-600" /></div></div></div>;
}

function Filter({ title, values }: Readonly<{ title: string; values: string[] }>) {
  return <section className="border-t border-[#dce2df] px-3 py-3"><div className="flex items-center justify-between text-sm font-medium"><span>{title}</span><span>−</span></div><div className="mt-3 max-h-28 space-y-2 overflow-hidden text-sm text-slate">{values.map((value) => <label key={value} className="flex items-center gap-2"><input type="checkbox" className="size-4 rounded border-[#cbd5d0]" />{value}</label>)}</div></section>;
}

export default function HomePage() {
  return (
    <main className="bg-white">
      <div className="mx-auto max-w-[1600px] px-5 pb-16 pt-7 lg:px-8">
        <p className="text-xs text-slate"><a href="#catalog" className="hover:text-emerald-700">Acasă</a> <span className="mx-1">/</span> Soluții Smart Home</p>
        <div id="catalog" className="mt-8 grid gap-8 lg:grid-cols-[20.5rem_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="border border-[#dce2df]">
              <p className="border-b border-[#dce2df] px-3 py-3 text-sm font-medium tracking-[.08em] text-ink">SMART HOME</p>
              <nav aria-label="Categorii Smart Home">{categories.map(({ icon: Icon, label }) => <a key={label} href="#produse" className="flex items-center gap-3 border-b border-[#dce2df] px-3 py-2.5 text-[15px] text-ink transition hover:bg-[#f4f7f5] hover:text-emerald-700"><Icon className="size-7 shrink-0 stroke-[1.35]" /><span className="flex-1">{label}</span><ChevronRight className="size-4" /></a>)}</nav>
            </div>
            <div className="mt-5 border border-[#dce2df]"><p className="px-3 py-3 text-lg font-medium text-[#4b5250]">FILTREAZĂ DUPĂ</p><Filter title="Brand" values={["NEXO Home (18)", "KNX (12)", "Aqara (9)", "Matter (7)"]} /><Filter title="Integrare / ecosistem" values={["Apple Home", "Google Home", "Home Assistant", "Zigbee / Matter"]} /><Filter title="Conectivitate" values={["KNX", "Wi-Fi", "Thread", "Zigbee"]} /></div>
          </aside>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-4"><h1 className="text-2xl font-medium uppercase tracking-[-.025em] text-ink sm:text-3xl">Soluții Smart Home</h1><span className="border-b-2 border-emerald-500 px-1 pb-2 text-xs font-semibold uppercase tracking-[.15em] text-slate">Pentru case inteligente</span></div>
            <section aria-label="Ecosisteme smart home" className="mt-8 grid grid-cols-2 gap-x-5 gap-y-7 sm:grid-cols-4">
              {ecosystems.map(({ label, icon: Icon, color, mark }) => <a key={label} href="#produse" className="group text-center"><div className={`grid h-20 place-items-center ${color}`}><Icon className="size-12 stroke-[1.35]" /><span className="sr-only">{mark}</span></div><div className="mt-2 border-b border-[#dce2df] bg-[#f5f6f5] px-2 py-3 text-sm text-ink transition group-hover:bg-[#e9f2ed]">{label}</div></a>)}
            </section>
            <section className="mt-7 border-y border-[#e1e5e3] py-5 text-[15px] leading-6 text-ink"><p>Construim case inteligente care rămân simple de folosit: lumină, climat, umbrire, securitate și energie în aceeași experiență.</p><p className="mt-3">Pentru o renovare sau un apartament putem recomanda soluții Wi‑Fi și Matter. Pentru case noi și proiecte complexe, KNX oferă o infrastructură profesională. Alegem împreună ce se potrivește proiectului tău.</p><a href="#discutam" className="mt-3 inline-flex font-medium text-[#0072b8] hover:underline">Ai un proiect nou sau o renovare? Discută cu un specialist <ArrowRight className="ml-1.5 mt-0.5 size-4" /></a></section>
            <section className="mt-5 flex flex-wrap items-center justify-between gap-4 border border-[#b9d9ce] bg-[#eff8f3] px-5 py-4"><div><p className="font-medium text-ink">Vrei o casă smart adaptată proiectului tău?</p><p className="mt-1 text-sm text-slate">Accesează portalul pentru a începe o estimare de proiect.</p></div><Link href="/login" className="inline-flex shrink-0 items-center rounded bg-[#087657] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#065c43]">Accesează portalul client <ArrowRight className="ml-2 size-4" /></Link></section>
            <div id="produse" className="mt-5 flex items-center justify-between border-b border-[#e1e5e3] pb-4 text-sm"><button type="button" className="inline-flex items-center gap-1">Sortează după <ChevronDown className="size-4" /></button><span className="text-slate">Afișare: <b className="text-[#0072b8]">▦</b> <span className="ml-2">☷</span></span><span className="hidden sm:inline">Pagina 1 / 2</span></div>
            <section className="mt-6 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 xl:grid-cols-5">
              {products.map((product) => <article key={product.name} className="group relative min-w-0"><div className="relative overflow-hidden"><ProductIllustration type={product.type} />{product.badge && <span className="absolute right-2 top-2 bg-emerald-700 px-2 py-1 text-[10px] font-bold text-white">{product.badge}</span>}</div><p className="mt-4 text-sm text-slate">{product.brand}</p><h2 className="mt-1 min-h-12 text-sm leading-5 text-ink group-hover:text-[#0072b8]">{product.name}</h2><p className="mt-3 text-base font-semibold text-ink">{product.price}</p><a href="#discutam" className="mt-3 inline-flex rounded border border-[#0d815f] px-3 py-2 text-xs font-semibold text-[#087657] transition hover:bg-[#087657] hover:text-white">Solicită ofertă</a></article>)}
            </section>
          </div>
        </div>
      </div>

      <section id="oferte" className="border-y border-[#dce2df] bg-[#f5f7f6]"><div className="mx-auto grid max-w-[1600px] gap-8 px-5 py-12 lg:grid-cols-[1fr_2fr] lg:px-8"><div><p className="text-xs font-semibold tracking-[.16em] text-emerald-700">CASA SMART, PE MĂSURA PROIECTULUI</p><h2 className="mt-3 text-3xl font-medium tracking-[-.035em]">Wi‑Fi, KNX sau hibrid. Alegerea vine după proiect.</h2><p className="mt-4 text-sm leading-6 text-slate">Nu vindem o singură tehnologie. Alegem soluția care are sens pentru casă, etapă de renovare și buget.</p></div><div className="grid gap-4 sm:grid-cols-3"><div className="border-l-2 border-emerald-600 pl-4"><p className="font-medium">Smart Home Wi‑Fi</p><p className="mt-2 text-sm leading-6 text-slate">Flexibil pentru apartamente, renovări și automatizări începute etapizat.</p></div><div className="border-l-2 border-emerald-600 pl-4"><p className="font-medium">KNX profesional</p><p className="mt-2 text-sm leading-6 text-slate">Robust și scalabil pentru case noi, vile și proiecte cu multe instalații.</p></div><div className="border-l-2 border-emerald-600 pl-4"><p className="font-medium">Sistem hibrid</p><p className="mt-2 text-sm leading-6 text-slate">KNX unde contează, Wi‑Fi și Matter acolo unde aduc flexibilitate.</p></div></div></div></section>

      <section id="branduri" className="mx-auto max-w-[1600px] px-5 py-14 lg:px-8"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold tracking-[.16em] text-emerald-700">ECOSISTEME & TEHNOLOGII</p><h2 className="mt-3 text-3xl font-medium tracking-[-.035em]">Tehnologie aleasă pentru proiect, nu impusă.</h2></div><a href="#discutam" className="text-sm font-medium text-[#0072b8]">Verifică compatibilitatea <ChevronRight className="inline size-4" /></a></div><div className="mt-8 grid grid-cols-2 divide-x divide-y divide-[#dce2df] border border-[#dce2df] sm:grid-cols-4 lg:grid-cols-6">{["KNX", "Matter", "Apple Home", "Google Home", "Home Assistant", "Zigbee"].map((brand) => <div key={brand} className="flex h-24 items-center justify-center text-lg font-medium text-[#4b5250]">{brand}</div>)}</div></section>

      <section id="discutam" className="bg-[#173830] text-white"><div className="mx-auto flex max-w-[1600px] flex-wrap items-end justify-between gap-8 px-5 py-14 lg:px-8"><div><p className="text-xs font-semibold tracking-[.16em] text-emerald-300">AI UN PROIECT?</p><h2 className="mt-3 text-4xl font-medium tracking-[-.045em]">Îl discutăm înainte să alegi produsele.</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">Primești o discuție tehnică despre infrastructură, compatibilități și pașii reali de implementare.</p></div><Link href="/login" className="rounded bg-white px-5 py-3 text-sm font-semibold text-[#173830] hover:bg-emerald-100">Accesează portalul client</Link></div></section>
    </main>
  );
}
