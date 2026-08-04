export const kitIds = [
  "smart-start",
  "apartament-smart",
  "casa-comfort",
  "casa-premium-knx",
  "securitate",
  "energie",
  "bloc-smart",
  "pensiune-smart",
  "hotel-smart",
] as const;

export type KitId = (typeof kitIds)[number];

export type ConfiguratorCategoryId =
  | "rooms"
  | "lighting"
  | "blinds"
  | "heating"
  | "climate"
  | "security"
  | "exterior"
  | "integrations";

export type EquipmentContribution = {
  label: string;
  quantity: number;
};

export type CommercialOption = {
  id: string;
  category: ConfiguratorCategoryId;
  label: string;
  description: string;
  price: number;
  products: number;
  devices: number;
  equipment: EquipmentContribution[];
};

export type KitDefinition = {
  id: KitId;
  name: string;
  shortDescription: string;
  minPrice: number;
  maxPrice: number;
  basePrice: number;
  baseProducts: number;
  baseDevices: number;
  features: string[];
  target: string;
  recommendedCapacity: string;
  optionalFunctions: string[];
  excluded: string[];
  installationConditions: string[];
  recommendedTechnology: string;
  estimatedDuration: string;
  solutionSlug: string;
  defaultSelections: string[];
  baseEquipment: EquipmentContribution[];
};

export const configuratorCategories: ReadonlyArray<{
  id: ConfiguratorCategoryId;
  label: string;
  shortLabel: string;
  description: string;
}> = [
  {
    id: "rooms",
    label: "Camere",
    shortLabel: "Camere",
    description:
      "Alege spațiile incluse în estimare. Numărul lor dimensionează senzorii și comenzile.",
  },
  {
    id: "lighting",
    label: "Iluminat",
    shortLabel: "Iluminat",
    description: "Selectează tipurile de circuite și controlul luminii dorit.",
  },
  {
    id: "blinds",
    label: "Jaluzele",
    shortLabel: "Jaluzele",
    description: "Automatizează umbrirea pe încăperi, cu poziționare și scenarii.",
  },
  {
    id: "heating",
    label: "Încălzire",
    shortLabel: "Încălzire",
    description: "Configurează controlul termic potrivit instalației casei.",
  },
  {
    id: "climate",
    label: "Climatizare",
    shortLabel: "Climat",
    description: "Integrează răcirea și ventilația în aceleași scene de confort.",
  },
  {
    id: "security",
    label: "Securitate",
    shortLabel: "Securitate",
    description: "Adaugă protecție perimetrală, fum și supraveghere video.",
  },
  {
    id: "exterior",
    label: "Exterior",
    shortLabel: "Exterior",
    description: "Pregătește infrastructura pentru energie, grădină și piscină.",
  },
  {
    id: "integrations",
    label: "Integrări",
    shortLabel: "Smart Home",
    description: "Alege ecosistemele prin care vei controla casa și scenele.",
  },
];

const room = (
  id: string,
  label: string,
  presenceSensor: boolean,
  description = "Control local, temperatură și scenarii dedicate.",
): CommercialOption => ({
  id,
  category: "rooms",
  label,
  description,
  price: 60,
  products: 1,
  devices: 2,
  equipment: [
    { label: "senzori temperatură", quantity: 1 },
    { label: "întrerupătoare", quantity: 2 },
    ...(presenceSensor ? [{ label: "senzori prezență", quantity: 1 }] : []),
  ],
});

export const commercialOptions: CommercialOption[] = [
  room("room-living", "Living", true),
  room("room-master", "Dormitor matrimonial", false),
  room("room-bedroom-2", "Dormitor 2", false),
  room("room-kitchen", "Bucătărie", true),
  room("room-bath", "Baie", true),
  room("room-hall", "Hol", true),
  room("room-office", "Birou", false),
  room("room-garage", "Garaj", true, "Control acces, lumină și monitorizare tehnică."),
  {
    id: "light-on-off",
    category: "lighting",
    label: "Iluminat On/Off",
    description: "Comandă centralizată pentru circuitele principale de iluminat.",
    price: 80,
    products: 4,
    devices: 8,
    equipment: [{ label: "actuatoare iluminat", quantity: 1 }],
  },
  {
    id: "light-dimming",
    category: "lighting",
    label: "Dimming",
    description: "Reglarea intensității și scene pentru diferite momente ale zilei.",
    price: 90,
    products: 3,
    devices: 6,
    equipment: [{ label: "actuatoare iluminat", quantity: 1 }],
  },
  {
    id: "light-led",
    category: "lighting",
    label: "Benzi LED",
    description: "Control pentru iluminat ambiental alb sau RGBW.",
    price: 140,
    products: 4,
    devices: 6,
    equipment: [{ label: "controlere LED", quantity: 2 }],
  },
  {
    id: "blinds-living",
    category: "blinds",
    label: "Jaluzele living",
    description: "Control individual și poziționare automată după lumină.",
    price: 60,
    products: 2,
    devices: 2,
    equipment: [{ label: "actuatoare jaluzele", quantity: 1 }],
  },
  {
    id: "blinds-bedroom-1",
    category: "blinds",
    label: "Jaluzele dormitor matrimonial",
    description: "Umbrire integrată în scenele de dimineață și noapte.",
    price: 60,
    products: 2,
    devices: 2,
    equipment: [{ label: "canale actuator jaluzele", quantity: 2 }],
  },
  {
    id: "blinds-bedroom-2",
    category: "blinds",
    label: "Jaluzele dormitor 2",
    description: "Control local, central și din aplicație.",
    price: 60,
    products: 2,
    devices: 2,
    equipment: [{ label: "canale actuator jaluzele", quantity: 2 }],
  },
  {
    id: "heating-floor",
    category: "heating",
    label: "Încălzire în pardoseală",
    description: "Reglare pe zone, programe și temperaturi de confort.",
    price: 100,
    products: 5,
    devices: 9,
    equipment: [{ label: "actuatoare încălzire", quantity: 1 }],
  },
  {
    id: "heating-radiators",
    category: "heating",
    label: "Radiatoare",
    description: "Control zonal al radiatoarelor și programare săptămânală.",
    price: 80,
    products: 4,
    devices: 7,
    equipment: [{ label: "capete termostatice", quantity: 5 }],
  },
  {
    id: "climate-ac",
    category: "climate",
    label: "Aer condiționat",
    description: "Integrare în scene și oprire automată la fereastră deschisă.",
    price: 80,
    products: 2,
    devices: 1,
    equipment: [{ label: "gateway-uri climatizare", quantity: 1 }],
  },
  {
    id: "climate-ventilation",
    category: "climate",
    label: "Ventilație cu recuperare",
    description: "Control după CO₂, umiditate și prezență.",
    price: 180,
    products: 3,
    devices: 5,
    equipment: [{ label: "senzori calitate aer", quantity: 3 }],
  },
  {
    id: "security-alarm",
    category: "security",
    label: "Alarmă",
    description: "Armare pe zone, notificări și integrare cu scenele casei.",
    price: 70,
    products: 3,
    devices: 5,
    equipment: [{ label: "module alarmă", quantity: 1 }],
  },
  {
    id: "security-smoke",
    category: "security",
    label: "Senzori de fum",
    description: "Alertare locală și notificare în aplicație.",
    price: 30,
    products: 2,
    devices: 4,
    equipment: [{ label: "senzori fum", quantity: 4 }],
  },
  {
    id: "security-cameras",
    category: "security",
    label: "Camere video",
    description: "Supraveghere perimetrală și acces securizat la imagini.",
    price: 280,
    products: 4,
    devices: 4,
    equipment: [{ label: "camere IP", quantity: 4 }],
  },
  {
    id: "exterior-ev",
    category: "exterior",
    label: "Stație de încărcare EV",
    description: "Management dinamic al puterii disponibile pentru mașina electrică.",
    price: 260,
    products: 3,
    devices: 2,
    equipment: [{ label: "controlere energie EV", quantity: 1 }],
  },
  {
    id: "exterior-irrigation",
    category: "exterior",
    label: "Irigații",
    description: "Programare după vreme, umiditate și anotimp.",
    price: 160,
    products: 3,
    devices: 5,
    equipment: [{ label: "zone de irigații", quantity: 4 }],
  },
  {
    id: "exterior-pool",
    category: "exterior",
    label: "Piscină",
    description: "Monitorizare temperatură, pompe și iluminat exterior.",
    price: 240,
    products: 4,
    devices: 6,
    equipment: [{ label: "module control piscină", quantity: 2 }],
  },
  {
    id: "integration-google",
    category: "integrations",
    label: "Google Home",
    description: "Comenzi vocale și scene prin ecosistemul Google.",
    price: 40,
    products: 1,
    devices: 0,
    equipment: [],
  },
  {
    id: "integration-apple",
    category: "integrations",
    label: "Apple Home",
    description: "Control din aplicația Home, Siri și automatizări personale.",
    price: 70,
    products: 1,
    devices: 0,
    equipment: [],
  },
  {
    id: "integration-alexa",
    category: "integrations",
    label: "Amazon Alexa",
    description: "Comenzi vocale și rutine prin dispozitive Alexa.",
    price: 40,
    products: 1,
    devices: 0,
    equipment: [],
  },
  {
    id: "integration-home-assistant",
    category: "integrations",
    label: "Home Assistant",
    description: "Integrare locală avansată și automatizări personalizate.",
    price: 120,
    products: 2,
    devices: 1,
    equipment: [{ label: "servere automatizare locală", quantity: 1 }],
  },
];

const essentialSelections = [
  "room-living",
  "room-master",
  "room-kitchen",
  "room-bath",
  "light-on-off",
  "heating-radiators",
  "integration-google",
];

const comfortSelections = [
  "room-living",
  "room-master",
  "room-kitchen",
  "room-bath",
  "room-garage",
  "light-on-off",
  "light-dimming",
  "blinds-living",
  "heating-floor",
  "climate-ac",
  "security-alarm",
  "security-smoke",
  "integration-google",
  "integration-apple",
];

const premiumSelections = commercialOptions
  .map(({ id }) => id)
  .filter((id) => id !== "exterior-pool");

export const kitDefinitions: Record<KitId, KitDefinition> = {
  "smart-start": {
    id: "smart-start",
    name: "Kit Smart Start",
    shortDescription: "Funcțiile esențiale pentru o casă smart simplă și ușor de controlat.",
    minPrice: 990,
    maxPrice: 2490,
    basePrice: 990,
    baseProducts: 12,
    baseDevices: 10,
    features: ["Iluminat", "Încălzire", "Jaluzele", "Control din aplicație"],
    target: "Garsoniere, apartamente mici și renovări etapizate",
    recommendedCapacity: "Până la 70 m² · 2–4 camere",
    optionalFunctions: ["Dimming", "Senzori de fum", "Control vocal"],
    excluded: ["Refacerea instalației electrice", "Lucrări de finisaj"],
    installationConditions: ["Rețea Wi-Fi stabilă", "Doze și nul disponibile unde este necesar"],
    recommendedTechnology: "Wi-Fi, Zigbee sau Matter",
    estimatedDuration: "1–3 zile",
    solutionSlug: "apartamente-smart",
    defaultSelections: essentialSelections,
    baseEquipment: [
      { label: "surse sistem smart", quantity: 1 },
      { label: "gateway-uri aplicație", quantity: 1 },
      { label: "întrerupătoare", quantity: 2 },
    ],
  },
  "apartament-smart": {
    id: "apartament-smart",
    name: "Kit Apartament Smart",
    shortDescription:
      "Control integrat pentru iluminat, climat, umbrire și securitate într-un apartament.",
    minPrice: 1800,
    maxPrice: 5500,
    basePrice: 1800,
    baseProducts: 16,
    baseDevices: 14,
    features: ["Iluminat și scene", "Climat", "Jaluzele", "Securitate de bază"],
    target: "Apartamente noi sau renovate",
    recommendedCapacity: "45–140 m² · 2–5 camere",
    optionalFunctions: ["Videointerfon", "Monitorizare energie", "Apple Home / Google Home"],
    excluded: ["Aparate HVAC", "Motoare de jaluzele", "Lucrări de construcții"],
    installationConditions: ["Plan electric disponibil", "Acces la tabloul apartamentului"],
    recommendedTechnology: "Matter, Zigbee, Wi-Fi sau sistem hibrid",
    estimatedDuration: "2–6 zile",
    solutionSlug: "apartamente-smart",
    defaultSelections: [...essentialSelections, "light-dimming", "security-alarm"],
    baseEquipment: [
      { label: "surse sistem smart", quantity: 1 },
      { label: "gateway-uri aplicație", quantity: 1 },
      { label: "întrerupătoare", quantity: 4 },
    ],
  },
  "casa-comfort": {
    id: "casa-comfort",
    name: "Kit Casă Comfort",
    shortDescription: "Automatizare completă, senzori și control energetic pentru confort zilnic.",
    minPrice: 2500,
    maxPrice: 5500,
    basePrice: 2500,
    baseProducts: 20,
    baseDevices: 17,
    features: [
      "Iluminat și scene",
      "Senzori",
      "Stație meteo",
      "Monitorizare energie",
      "Automatizări",
    ],
    target: "Case noi și renovări complete",
    recommendedCapacity: "100–250 m² · 4–10 camere",
    optionalFunctions: ["Camere video", "Stație EV", "Irigare", "Home Assistant"],
    excluded: ["Cablare de forță", "Corpuri de iluminat", "Echipamente HVAC"],
    installationConditions: [
      "Plan electric și planuri de arhitectură",
      "Spațiu rezervat în tabloul electric",
    ],
    recommendedTechnology: "Sistem hibrid sau KNX pentru construcții noi",
    estimatedDuration: "5–12 zile",
    solutionSlug: "case-smart",
    defaultSelections: comfortSelections,
    baseEquipment: [
      { label: "surse KNX", quantity: 1 },
      { label: "gateway-uri IP", quantity: 1 },
      { label: "senzori temperatură", quantity: 4 },
      { label: "întrerupătoare", quantity: 2 },
    ],
  },
  "casa-premium-knx": {
    id: "casa-premium-knx",
    name: "Kit Casă Premium KNX",
    shortDescription: "Experiență completă, interfețe premium și integrare multimedia avansată.",
    minPrice: 6500,
    maxPrice: 20000,
    basePrice: 6500,
    baseProducts: 28,
    baseDevices: 24,
    features: [
      "Automatizare KNX",
      "Panouri tactile",
      "Audio și videointerfon",
      "Management energetic",
    ],
    target: "Vile și case premium proiectate de la zero",
    recommendedCapacity: "180–600 m² · până la 20 zone",
    optionalFunctions: ["Piscină", "Irigare", "Audio multiroom", "Integrare BMS"],
    excluded: ["Tablou de forță complet", "Aparate audio/video", "Licențe terțe"],
    installationConditions: [
      "Proiect KNX înainte de execuția electrică",
      "Tablou dimensionat și cablu bus",
    ],
    recommendedTechnology: "KNX TP/IP cu integrare Matter și Home Assistant",
    estimatedDuration: "3–8 săptămâni",
    solutionSlug: "automatizare-knx",
    defaultSelections: premiumSelections,
    baseEquipment: [
      { label: "surse KNX", quantity: 2 },
      { label: "gateway-uri IP", quantity: 1 },
      { label: "panouri tactile", quantity: 2 },
      { label: "controlere audio", quantity: 1 },
      { label: "videointerfoane", quantity: 1 },
      { label: "senzori temperatură", quantity: 4 },
      { label: "întrerupătoare", quantity: 2 },
    ],
  },
  securitate: {
    id: "securitate",
    name: "Kit Securitate",
    shortDescription: "Protecție integrată pentru interior, perimetru și acces.",
    minPrice: 1500,
    maxPrice: 6000,
    basePrice: 1500,
    baseProducts: 10,
    baseDevices: 8,
    features: ["Alarmă", "Senzori fum", "Control acces", "Notificări"],
    target: "Apartamente, case și pensiuni",
    recommendedCapacity: "Până la 500 m² · 4–24 zone",
    optionalFunctions: ["Camere IP", "Videointerfon", "Detecție perimetrală"],
    excluded: ["Abonament dispecerat", "Cablare ascunsă și reparații finisaje"],
    installationConditions: ["Acoperire rețea verificată", "Poziții de montaj accesibile"],
    recommendedTechnology: "Alarmă cablată/hibridă și camere IP",
    estimatedDuration: "2–7 zile",
    solutionSlug: "securitate",
    defaultSelections: ["security-alarm", "security-smoke", "room-living", "room-hall"],
    baseEquipment: [{ label: "module alarmă", quantity: 1 }],
  },
  energie: {
    id: "energie",
    name: "Kit Energie",
    shortDescription: "Măsurare, control și optimizare pentru consumurile importante.",
    minPrice: 900,
    maxPrice: 4500,
    basePrice: 900,
    baseProducts: 8,
    baseDevices: 6,
    features: ["Contorizare", "Rapoarte consum", "Control sarcini", "Pregătire fotovoltaic/EV"],
    target: "Locuințe și clădiri rezidențiale mici",
    recommendedCapacity: "Monofazat sau trifazat · până la 12 circuite monitorizate",
    optionalFunctions: ["Stație EV", "Fotovoltaic", "Baterie", "Control boiler/pompă"],
    excluded: ["Panouri fotovoltaice", "Stație EV și lucrări de branșament"],
    installationConditions: [
      "Acces și spațiu în tabloul electric",
      "Măsurători electrice preliminare",
    ],
    recommendedTechnology: "Contorizare Modbus/KNX și gateway IP",
    estimatedDuration: "1–4 zile",
    solutionSlug: "energie-eficienta",
    defaultSelections: ["exterior-ev", "light-on-off"],
    baseEquipment: [{ label: "gateway-uri IP", quantity: 1 }],
  },
  "bloc-smart": {
    id: "bloc-smart",
    name: "Kit Bloc Smart",
    shortDescription: "Infrastructură comună pentru acces, energie, siguranță și servicii tehnice.",
    minPrice: 12000,
    maxPrice: 60000,
    basePrice: 12000,
    baseProducts: 42,
    baseDevices: 38,
    features: ["Acces comun", "Iluminat spații comune", "Contorizare", "Monitorizare tehnică"],
    target: "Dezvoltatori și asociații de proprietari",
    recommendedCapacity: "8–60 apartamente · 1–4 scări",
    optionalFunctions: ["Videointerfon", "Parcare", "Stații EV", "Integrare apartamente"],
    excluded: ["Automatizarea apartamentelor", "Cablarea de forță integrală"],
    installationConditions: [
      "Planuri instalații și spații comune",
      "Rețea tehnică și tablou comun",
    ],
    recommendedTechnology: "KNX/BMS, Modbus și IP",
    estimatedDuration: "4–12 săptămâni",
    solutionSlug: "blocuri-smart",
    defaultSelections: [...comfortSelections, "security-cameras", "exterior-ev"],
    baseEquipment: [
      { label: "surse KNX", quantity: 2 },
      { label: "gateway-uri IP", quantity: 2 },
    ],
  },
  "pensiune-smart": {
    id: "pensiune-smart",
    name: "Kit Pensiune Smart",
    shortDescription: "Confort pentru oaspeți și control centralizat pentru operator.",
    minPrice: 8000,
    maxPrice: 40000,
    basePrice: 8000,
    baseProducts: 30,
    baseDevices: 28,
    features: ["Control camere", "Acces", "Energie", "Securitate"],
    target: "Pensiuni și aparthoteluri",
    recommendedCapacity: "5–20 camere",
    optionalFunctions: ["Check-in digital", "HVAC pe cameră", "Senzori ferestre", "Integrare PMS"],
    excluded: ["Licențe PMS", "Încuietori și aparate HVAC dacă nu sunt ofertate"],
    installationConditions: ["Plan pe nivel și tabel de camere", "Rețea tehnică separată"],
    recommendedTechnology: "KNX sau sistem hibrid cu gateway PMS",
    estimatedDuration: "3–8 săptămâni",
    solutionSlug: "pensiuni-hoteluri-smart",
    defaultSelections: [...comfortSelections, "security-cameras", "climate-ventilation"],
    baseEquipment: [
      { label: "surse KNX", quantity: 2 },
      { label: "gateway-uri IP", quantity: 1 },
    ],
  },
  "hotel-smart": {
    id: "hotel-smart",
    name: "Kit Hotel Smart",
    shortDescription: "Automatizare scalabilă pentru camere, zone comune și operațiuni hoteliere.",
    minPrice: 25000,
    maxPrice: 150000,
    basePrice: 25000,
    baseProducts: 80,
    baseDevices: 72,
    features: ["Room management", "BMS", "Control acces", "Eficiență energetică"],
    target: "Hoteluri boutique și hoteluri mici",
    recommendedCapacity: "15–80 camere",
    optionalFunctions: ["PMS", "GRMS", "HVAC central", "Mentenanță predictivă"],
    excluded: ["Licențe PMS/GRMS", "Servere și echipamente HVAC neincluse în ofertă"],
    installationConditions: ["Proiect tehnic coordonat MEP", "Backbone IP și tablouri pe nivel"],
    recommendedTechnology: "KNX, BACnet/Modbus și integrare PMS",
    estimatedDuration: "2–6 luni",
    solutionSlug: "pensiuni-hoteluri-smart",
    defaultSelections: premiumSelections,
    baseEquipment: [
      { label: "surse KNX", quantity: 4 },
      { label: "gateway-uri IP", quantity: 3 },
      { label: "panouri tactile", quantity: 2 },
    ],
  },
};

export type CommercialSummary = {
  price: number;
  products: number;
  devices: number;
  equipment: EquipmentContribution[];
  savings: number;
};

export function calculateCommercialSummary(
  kitId: KitId,
  selectedOptionIds: ReadonlySet<string>,
): CommercialSummary {
  const kit = kitDefinitions[kitId];
  const selected = commercialOptions.filter(({ id }) => selectedOptionIds.has(id));
  const equipment = new Map<string, number>();
  for (const contribution of [
    ...kit.baseEquipment,
    ...selected.flatMap(({ equipment }) => equipment),
  ]) {
    equipment.set(
      contribution.label,
      (equipment.get(contribution.label) ?? 0) + contribution.quantity,
    );
  }
  const price = kit.basePrice + selected.reduce((total, option) => total + option.price, 0);
  const equipmentPriority = [
    "actuatoare iluminat",
    "actuatoare jaluzele",
    "surse KNX",
    "gateway-uri IP",
    "senzori temperatură",
    "întrerupătoare",
    "senzori prezență",
  ];
  return {
    price,
    products: kit.baseProducts + selected.reduce((total, option) => total + option.products, 0),
    devices: kit.baseDevices + selected.reduce((total, option) => total + option.devices, 0),
    equipment: [...equipment.entries()]
      .map(([label, quantity]) => ({ label, quantity }))
      .filter(({ quantity }) => quantity > 0)
      .sort((left, right) => {
        const leftPriority = equipmentPriority.indexOf(left.label);
        const rightPriority = equipmentPriority.indexOf(right.label);
        if (leftPriority === -1 && rightPriority === -1)
          return left.label.localeCompare(right.label);
        if (leftPriority === -1) return 1;
        if (rightPriority === -1) return -1;
        return leftPriority - rightPriority;
      }),
    savings: Math.max(0, kit.maxPrice - price),
  };
}

export function isKitId(value: string | undefined): value is KitId {
  return kitIds.some((kitId) => kitId === value);
}

export function normalizeKitId(value: string | undefined): KitId {
  if (isKitId(value)) return value;
  if (value === "essential") return "smart-start";
  if (value === "comfort") return "casa-comfort";
  if (value === "premium") return "casa-premium-knx";
  return "casa-comfort";
}
