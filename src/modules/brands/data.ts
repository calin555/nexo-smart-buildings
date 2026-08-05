import { unstable_noStore as noStore } from "next/cache";

import { prisma } from "@/lib/prisma";

export type BrandLevelValue = "STANDARD" | "PROFESSIONAL" | "LUXURY";

export type BrandRecord = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  description: string;
  usageCategories: string[];
  level: BrandLevelValue;
  kitIds: string[];
  sortOrder: number;
  active: boolean;
  officialUrl: string | null;
};

export type BrandPresentation = {
  role: string;
  recommendedFor: string[];
  projectType: string;
  projectSurface: string;
  projectFunctions: string[];
  projectConfiguration: string;
};

const initialBrands: BrandRecord[] = [
  {
    id: "initial-abb",
    name: "ABB",
    slug: "abb",
    logoUrl: null,
    description:
      "Soluții KNX pentru distribuție, automatizare, senzori și management energetic, selectate în funcție de arhitectura proiectului.",
    usageCategories: ["Echipamente de tablou", "Senzori", "Management energetic"],
    level: "PROFESSIONAL",
    kitIds: ["casa-comfort", "casa-premium-knx", "bloc-smart", "hotel-smart"],
    sortOrder: 10,
    active: true,
    officialUrl:
      "https://new.abb.com/low-voltage/products/building-automation/product-range/abb-i-bus-knx",
  },
  {
    id: "initial-schneider",
    name: "Schneider Electric",
    slug: "schneider-electric",
    logoUrl: null,
    description:
      "Echipamente KNX și de distribuție pentru tablouri, comenzi, gateway-uri și integrarea instalațiilor electrice.",
    usageCategories: ["Echipamente de tablou", "Butoane și aparataj", "Gateway-uri"],
    level: "PROFESSIONAL",
    kitIds: ["casa-comfort", "casa-premium-knx", "bloc-smart", "energie"],
    sortOrder: 20,
    active: true,
    officialUrl: "https://www.se.com/ro/ro/download/document/Catalog_KNX2025/",
  },
  {
    id: "initial-mdt",
    name: "MDT",
    slug: "mdt",
    logoUrl: null,
    description:
      "Portofoliu KNX orientat spre actuatoare, senzori, termostate și comenzi pentru proiecte rezidențiale.",
    usageCategories: ["Echipamente de tablou", "Butoane și aparataj", "Senzori", "Termostate"],
    level: "PROFESSIONAL",
    kitIds: ["apartament-smart", "casa-comfort", "casa-premium-knx", "pensiune-smart"],
    sortOrder: 30,
    active: true,
    officialUrl: "https://www.mdt.de/",
  },
  {
    id: "initial-gira",
    name: "Gira",
    slug: "gira",
    logoUrl: null,
    description:
      "Aparataj, senzori și interfețe KNX cu accent pe integrarea vizuală în proiectele de interior.",
    usageCategories: ["Butoane și aparataj", "Senzori", "Panouri"],
    level: "LUXURY",
    kitIds: ["casa-premium-knx", "pensiune-smart", "hotel-smart"],
    sortOrder: 40,
    active: true,
    officialUrl: "https://www.gira.com/",
  },
  {
    id: "initial-jung",
    name: "JUNG",
    slug: "jung",
    logoUrl: null,
    description:
      "Comenzi, termostate și panouri KNX pentru proiecte în care aparatajul și finisajele fac parte din conceptul interior.",
    usageCategories: ["Butoane și aparataj", "Termostate", "Panouri"],
    level: "LUXURY",
    kitIds: ["apartament-smart", "casa-premium-knx", "hotel-smart"],
    sortOrder: 50,
    active: true,
    officialUrl: "https://www.jung-group.com/",
  },
  {
    id: "initial-basalte",
    name: "Basalte",
    slug: "basalte",
    logoUrl: null,
    description:
      "Interfețe și panouri de control pentru proiecte rezidențiale premium, evaluate împreună cu restul instalației KNX.",
    usageCategories: ["Butoane și aparataj", "Senzori", "Panouri"],
    level: "LUXURY",
    kitIds: ["casa-premium-knx", "hotel-smart"],
    sortOrder: 60,
    active: true,
    officialUrl: "https://www.basalte.be/",
  },
  {
    id: "initial-zennio",
    name: "Zennio",
    slug: "zennio",
    logoUrl: null,
    description:
      "Module KNX, termostate, panouri și gateway-uri folosite în configurații rezidențiale și hoteliere.",
    usageCategories: ["Echipamente de tablou", "Termostate", "Panouri", "Gateway-uri"],
    level: "PROFESSIONAL",
    kitIds: ["apartament-smart", "casa-comfort", "pensiune-smart", "hotel-smart"],
    sortOrder: 70,
    active: true,
    officialUrl: "https://www.zennio.com/",
  },
  {
    id: "initial-theben",
    name: "Theben",
    slug: "theben",
    logoUrl: null,
    description:
      "Senzori de prezență, termostate și echipamente KNX pentru control funcțional și eficiență energetică.",
    usageCategories: ["Senzori", "Termostate", "Echipamente de tablou"],
    level: "STANDARD",
    kitIds: ["smart-start", "apartament-smart", "casa-comfort", "energie"],
    sortOrder: 80,
    active: true,
    officialUrl: "https://www.theben.de/",
  },
];

const catalogUrls: Readonly<Record<string, string>> = {
  abb: "https://new.abb.com/low-voltage/products/building-automation/product-range/abb-i-bus-knx",
  "schneider-electric": "https://www.se.com/ro/ro/download/document/Catalog_KNX2025/",
};

export function getBrandCatalogUrl(brand: BrandRecord): string | null {
  return catalogUrls[brand.slug] ?? brand.officialUrl;
}

const presentations: Record<string, BrandPresentation> = {
  abb: {
    role: "Automatizare de tablou, senzori și măsurare într-o arhitectură KNX documentată.",
    recommendedFor: ["Case", "Blocuri", "Hoteluri", "Iluminat", "HVAC", "Jaluzele", "Energie"],
    projectType: "Studiu conceptual · bloc rezidențial",
    projectSurface: "3.800 m² · 24 apartamente",
    projectFunctions: ["Iluminat comun", "Contorizare", "Control pompe", "Alarme tehnice"],
    projectConfiguration:
      "Actuatoare KNX, senzori, gateway IP și contoare selectate orientativ după proiectul electric.",
  },
  "schneider-electric": {
    role: "Integrarea distribuției electrice cu automatizarea KNX și monitorizarea energiei.",
    recommendedFor: ["Case", "Blocuri", "Pensiuni", "Iluminat", "Jaluzele", "Energie"],
    projectType: "Studiu conceptual · casă inteligentă",
    projectSurface: "240 m² · 8 zone",
    projectFunctions: ["Iluminat", "Jaluzele", "Încălzire", "Măsurare energie"],
    projectConfiguration:
      "Echipamente modulare, sursă KNX, gateway IP și aparataj evaluate în etapa de proiectare.",
  },
  mdt: {
    role: "Actuatoare, senzori și comenzi KNX cu raport funcțional potrivit proiectelor rezidențiale.",
    recommendedFor: ["Case", "Apartamente", "Pensiuni", "Iluminat", "HVAC", "Jaluzele"],
    projectType: "Studiu conceptual · casă inteligentă",
    projectSurface: "185 m² · 7 camere",
    projectFunctions: ["Scene lumină", "Încălzire pe zone", "Umbrire", "Prezență"],
    projectConfiguration:
      "Actuatoare de tablou, termostate și butoane KNX, dimensionate după numărul circuitelor.",
  },
  gira: {
    role: "Interfața vizibilă a sistemului: aparataj, senzori și control potrivite conceptului de interior.",
    recommendedFor: ["Case", "Pensiuni", "Hoteluri", "Iluminat", "HVAC", "Jaluzele"],
    projectType: "Studiu conceptual · vilă inteligentă",
    projectSurface: "320 m² · 12 zone",
    projectFunctions: ["Scene", "Climat", "Jaluzele", "Interfețe centrale"],
    projectConfiguration:
      "Aparataj și panouri KNX combinate cu actuatoare selectate separat pe criterii tehnice.",
  },
  jung: {
    role: "Comenzi, termostate și panouri pentru zonele în care ergonomia și finisajul sunt esențiale.",
    recommendedFor: ["Case", "Apartamente", "Hoteluri", "Iluminat", "HVAC", "Jaluzele"],
    projectType: "Studiu conceptual · apartament premium",
    projectSurface: "135 m² · 5 camere",
    projectFunctions: ["Iluminat", "Climat", "Scene", "Control central"],
    projectConfiguration:
      "Aparataj și termostate KNX integrate cu actuatoare multi-brand validate în ETS.",
  },
  basalte: {
    role: "Interfețe tactile și comenzi premium pentru proiecte cu cerințe ridicate de design.",
    recommendedFor: ["Case", "Hoteluri", "Iluminat", "HVAC", "Jaluzele"],
    projectType: "Studiu conceptual · casă premium",
    projectSurface: "410 m² · 14 zone",
    projectFunctions: ["Scene", "Climat", "Audio", "Control central"],
    projectConfiguration:
      "Interfețe premium conectate la o infrastructură KNX proiectată și testată separat.",
  },
  zennio: {
    role: "Control pe cameră, termostate, panouri și gateway-uri pentru rezidențial și ospitalitate.",
    recommendedFor: ["Case", "Apartamente", "Pensiuni", "Hoteluri", "HVAC", "Iluminat", "Jaluzele"],
    projectType: "Studiu conceptual · pensiune inteligentă",
    projectSurface: "12 camere · 620 m²",
    projectFunctions: ["Control cameră", "HVAC", "Acces", "Economisire la neocupare"],
    projectConfiguration:
      "Termostate și module KNX pe camere, cu gateway-uri verificate pentru instalațiile selectate.",
  },
  theben: {
    role: "Detecție de prezență, control termic și funcții energetice bazate pe utilizarea reală a spațiului.",
    recommendedFor: ["Case", "Apartamente", "Blocuri", "Iluminat", "HVAC", "Energie"],
    projectType: "Studiu conceptual · casă eficientă",
    projectSurface: "160 m² · 6 zone",
    projectFunctions: ["Prezență", "Iluminat", "Încălzire", "Reducere consum"],
    projectConfiguration:
      "Senzori și termostate KNX combinați cu actuatoare alese după sarcini și tabloul electric.",
  },
};

export function getBrandPresentation(slug: string): BrandPresentation {
  return (
    presentations[slug] ?? {
      role: "Echipamente selectate în funcție de rolul tehnic, design, buget și documentația producătorului.",
      recommendedFor: ["Case", "Apartamente", "Clădiri rezidențiale mici"],
      projectType: "Studiu conceptual",
      projectSurface: "Configurație adaptată planului",
      projectFunctions: ["Iluminat", "Climat", "Umbrire", "Energie"],
      projectConfiguration:
        "Configurația exactă se stabilește prin proiectare și verificarea documentației tehnice.",
    }
  );
}

export async function getActiveBrands(): Promise<BrandRecord[]> {
  noStore();
  try {
    return await prisma.brand.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
  } catch {
    return initialBrands;
  }
}

export async function getActiveBrandBySlug(slug: string): Promise<BrandRecord | undefined> {
  const brands = await getActiveBrands();
  return brands.find((brand) => brand.slug === slug);
}

export function levelLabel(level: BrandLevelValue): string {
  return level === "STANDARD" ? "Standard" : level === "PROFESSIONAL" ? "Professional" : "Luxury";
}
