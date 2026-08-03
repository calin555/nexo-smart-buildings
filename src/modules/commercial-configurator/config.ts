export type KitId = "essential" | "comfort" | "premium";

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

export const kitDefinitions: Record<KitId, KitDefinition> = {
  essential: {
    id: "essential",
    name: "Kit Essential",
    shortDescription: "Funcțiile esențiale pentru o casă smart simplă și ușor de controlat.",
    minPrice: 990,
    maxPrice: 2490,
    basePrice: 990,
    baseProducts: 12,
    baseDevices: 10,
    features: ["Iluminat", "Încălzire", "Jaluzele", "Control din aplicație"],
    defaultSelections: [
      "room-living",
      "room-master",
      "room-kitchen",
      "room-bath",
      "light-on-off",
      "heating-radiators",
      "integration-google",
    ],
    baseEquipment: [
      { label: "surse sistem smart", quantity: 1 },
      { label: "gateway-uri aplicație", quantity: 1 },
      { label: "întrerupătoare", quantity: 2 },
    ],
  },
  comfort: {
    id: "comfort",
    name: "Kit Comfort",
    shortDescription: "Automatizare completă, senzori și control energetic pentru confort zilnic.",
    minPrice: 2500,
    maxPrice: 5500,
    basePrice: 2500,
    baseProducts: 20,
    baseDevices: 17,
    features: [
      "Tot din Essential",
      "Senzori",
      "Stație meteo",
      "Monitorizare energie",
      "Automatizări",
    ],
    defaultSelections: [
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
    ],
    baseEquipment: [
      { label: "surse KNX", quantity: 1 },
      { label: "gateway-uri IP", quantity: 1 },
      { label: "senzori temperatură", quantity: 4 },
      { label: "întrerupătoare", quantity: 2 },
    ],
  },
  premium: {
    id: "premium",
    name: "Kit Premium",
    shortDescription: "Experiență completă, interfețe premium și integrare multimedia avansată.",
    minPrice: 5500,
    maxPrice: 12000,
    basePrice: 5500,
    baseProducts: 28,
    baseDevices: 24,
    features: [
      "Tot din Comfort",
      "Panouri tactile",
      "Audio",
      "Videointerfon",
      "Apple Home, Google Home și Alexa",
    ],
    defaultSelections: [
      "room-living",
      "room-master",
      "room-bedroom-2",
      "room-kitchen",
      "room-bath",
      "room-hall",
      "room-office",
      "room-garage",
      "light-on-off",
      "light-dimming",
      "light-led",
      "blinds-living",
      "blinds-bedroom-1",
      "blinds-bedroom-2",
      "heating-floor",
      "climate-ac",
      "climate-ventilation",
      "security-alarm",
      "security-smoke",
      "security-cameras",
      "exterior-ev",
      "integration-google",
      "integration-apple",
      "integration-alexa",
      "integration-home-assistant",
    ],
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
  const nextKitMinimum =
    kitId === "essential"
      ? kitDefinitions.comfort.minPrice
      : kitId === "comfort"
        ? kitDefinitions.premium.minPrice
        : kit.maxPrice;
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
    savings: Math.max(0, nextKitMinimum - price),
  };
}

export function isKitId(value: string | undefined): value is KitId {
  return value === "essential" || value === "comfort" || value === "premium";
}
