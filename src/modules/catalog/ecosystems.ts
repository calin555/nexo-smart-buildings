import type { ProductIllustration } from "@prisma/client";

export type Ecosystem = {
  slug: string;
  name: string;
  eyebrow: string;
  title: string;
  description: string;
  paragraphs: [string, string];
  benefits: string[];
  recommendedFor: string;
  compatibility: string;
  illustrations: ProductIllustration[];
  imageUrl: string;
};

export const ecosystems: Ecosystem[] = [
  {
    slug: "smart-home-wifi",
    name: "Smart Home Wi-Fi",
    eyebrow: "SOLUȚII SMART HOME",
    title: "Automatizări flexibile, fără intervenții complicate.",
    description: "Controlează luminile, clima, securitatea și energia dintr-o singură aplicație.",
    paragraphs: [
      "Soluțiile Wi‑Fi sunt potrivite pentru locuințe deja finisate, apartamente și proiecte care se construiesc etapizat.",
      "Alegem produse care lucrează împreună și construim scenarii simple, clare și ușor de folosit de toată familia.",
    ],
    benefits: ["Instalare flexibilă", "Control de la distanță", "Extindere treptată"],
    recommendedFor:
      "Apartamente, renovări și case în care vrei rezultate rapide fără lucrări invazive.",
    compatibility:
      "Matter, Apple Home, Google Home și Home Assistant, în funcție de produsele alese.",
    illustrations: ["KIT", "CLIMATE", "LOCK"],
    imageUrl:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "apple-home",
    name: "Apple Home",
    eyebrow: "ECOSISTEM SMART HOME",
    title: "O casă smart care se simte natural în ecosistemul Apple.",
    description: "Controlează proiectul din Home, Siri, iPhone, iPad și Apple Watch.",
    paragraphs: [
      "Apple Home pune confidențialitatea și interacțiunile simple în centrul experienței de zi cu zi.",
      "Selectăm echipamente compatibile și scenarii care funcționează firesc pentru locuința ta.",
    ],
    benefits: ["Control prin Siri", "Automatizări personale", "Experiență unitară"],
    recommendedFor: "Familii care folosesc deja iPhone, iPad sau Apple TV ca hub pentru casă.",
    compatibility: "Matter și accesoriile certificate Apple Home.",
    illustrations: ["KIT", "CLIMATE", "LOCK"],
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "google-home",
    name: "Google Home",
    eyebrow: "ECOSISTEM SMART HOME",
    title: "Control vocal și automatizări clare pentru fiecare zi.",
    description:
      "O experiență coerentă pentru lumină, climat și siguranță, din aplicația Google Home.",
    paragraphs: [
      "Google Home este o alegere practică pentru case conectate și control vocal rapid în spațiile importante.",
      "Configurăm dispozitivele astfel încât comenzile și rutinele să rămână simple, nu o listă de aplicații.",
    ],
    benefits: ["Comenzi vocale", "Rutine utile", "Control multiutilizator"],
    recommendedFor: "Locuințe care folosesc Android, Google Nest sau control vocal frecvent.",
    compatibility: "Matter, Wi‑Fi, Thread și produse integrate Google Home.",
    illustrations: ["KIT", "CLIMATE", "ENERGY"],
    imageUrl:
      "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "matter",
    name: "Matter",
    eyebrow: "STANDARD DESCHIS",
    title: "Mai multă libertate între ecosisteme.",
    description: "Alege produse pregătite să lucreze împreună, indiferent de aplicația preferată.",
    paragraphs: [
      "Matter reduce blocajele dintre branduri și face mai simplă alegerea echipamentelor pentru un proiect pe termen lung.",
      "Îl folosim acolo unde oferă compatibilitate reală și flexibilitate pentru evoluția casei.",
    ],
    benefits: ["Compatibilitate extinsă", "Alegere mai liberă", "Bază pregătită pentru viitor"],
    recommendedFor:
      "Proiecte în care vrei să păstrezi libertatea de alegere între Apple Home, Google Home și Home Assistant.",
    compatibility: "Apple Home, Google Home, Alexa și Home Assistant, în funcție de produs.",
    illustrations: ["KIT", "CLIMATE", "LOCK"],
    imageUrl:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "home-assistant",
    name: "Home Assistant",
    eyebrow: "CONTROL AVANSAT",
    title: "Automatizări profunde, construite în jurul casei tale.",
    description:
      "O platformă flexibilă pentru scenarii, monitorizare și integrarea mai multor tehnologii.",
    paragraphs: [
      "Home Assistant permite o integrare atentă a unor ecosisteme diferite, cu control local și scenarii complexe.",
      "Îl recomandăm atunci când proiectul are nevoie de mai multă personalizare și de o structură tehnică bine gândită.",
    ],
    benefits: ["Control local", "Integrare multiplă", "Scenarii avansate"],
    recommendedFor:
      "Case cu multe sisteme, proiecte hibride și utilizatori care vor control tehnic avansat.",
    compatibility: "KNX, Zigbee, Matter, Wi‑Fi și numeroase branduri specializate.",
    illustrations: ["ENERGY", "CLIMATE", "BLINDS"],
    imageUrl:
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "aqara",
    name: "Aqara",
    eyebrow: "ECOSISTEM SMART HOME",
    title: "Senzori și automatizări discrete pentru fiecare cameră.",
    description: "Un ecosistem accesibil pentru control, siguranță și confort în locuințe moderne.",
    paragraphs: [
      "Aqara este potrivit pentru proiecte modulare în care contează senzorii, automatizările rapide și designul discret.",
      "Îl integrăm cu restul casei, nu îl tratăm ca pe o colecție de dispozitive separate.",
    ],
    benefits: ["Senzori compacți", "Automatizări de confort", "Bun pentru extindere"],
    recommendedFor:
      "Apartamente, renovări și case care au nevoie de automatizări punctuale bine integrate.",
    compatibility: "Zigbee, Matter, Apple Home, Google Home și Home Assistant.",
    illustrations: ["KIT", "LOCK", "CLIMATE"],
    imageUrl:
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "knx-profesional",
    name: "KNX profesional",
    eyebrow: "INFRASTRUCTURĂ PROFESIONALĂ",
    title: "O infrastructură robustă pentru case și clădiri inteligente.",
    description: "Control predictibil pentru iluminat, climat, umbrire, securitate și energie.",
    paragraphs: [
      "KNX este una dintre specializările N3XO pentru proiecte noi, ample sau cu cerințe tehnice ridicate.",
      "Proiectăm infrastructura înainte de finisaje, pentru un sistem stabil, serviceabil și pregătit să evolueze.",
    ],
    benefits: ["Fiabilitate ridicată", "Scalabilitate", "Integrare de instalații"],
    recommendedFor:
      "Case noi, vile, ansambluri rezidențiale, hoteluri și clădiri cu multe instalații.",
    compatibility: "Module KNX, sisteme BMS, Home Assistant și integrări hibride selectate.",
    illustrations: ["BLINDS", "ENERGY", "CLIMATE"],
    imageUrl:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "securitate",
    name: "Securitate",
    eyebrow: "SIGURANȚĂ CONECTATĂ",
    title: "Securitate discretă, vizibilă doar când ai nevoie.",
    description: "Acces, senzori și notificări integrate într-o experiență clară pentru locuință.",
    paragraphs: [
      "Un sistem bun de securitate nu înseamnă doar alerte: trebuie să ofere context și control fără să complice viața de zi cu zi.",
      "Combinăm accesul, senzori de siguranță și scenarii de prezență pentru o soluție echilibrată.",
    ],
    benefits: ["Acces controlat", "Alerte relevante", "Integrare cu scenarii"],
    recommendedFor:
      "Locuințe, case de vacanță, apartamente în regim de închiriere și proiecte cu acces controlat.",
    compatibility: "Matter, Zigbee, Wi‑Fi și sisteme de automatizare selectate.",
    illustrations: ["LOCK", "KIT"],
    imageUrl:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
  },
];

export function getEcosystem(slug: string): Ecosystem | undefined {
  return ecosystems.find((ecosystem) => ecosystem.slug === slug);
}
