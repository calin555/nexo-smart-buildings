export type PublicSolution = {
  slug: string;
  name: string;
  audience: string;
  title: string;
  summary: string;
  paragraphs: string[];
  benefits: string[];
  recommendedFor: string[];
  technologies: string[];
  deliverables: string[];
  image: string;
};

export const publicSolutions: PublicSolution[] = [
  {
    slug: "case-smart",
    name: "Case Smart",
    audience: "Pentru case inteligente",
    title: "O casă care răspunde simplu, sigur și eficient.",
    summary: "Iluminat, climat, umbrire, securitate și energie proiectate ca un singur sistem.",
    paragraphs: [
      "Pornim de la planul casei și de la rutina familiei, nu de la o listă de produse.",
      "Alegem Wi-Fi, Matter, Zigbee, KNX sau o arhitectură hibridă în funcție de construcție, buget și cerințele de mentenanță.",
    ],
    benefits: [
      "Scene și control centralizat",
      "Confort termic pe zone",
      "Protecție și notificări",
      "Consum măsurat și optimizat",
    ],
    recommendedFor: ["Case noi", "Renovări complete", "Vile și case de vacanță"],
    technologies: ["Matter", "Zigbee", "Wi-Fi", "KNX", "Home Assistant"],
    deliverables: [
      "Concept și buget orientativ",
      "Proiect tehnic",
      "Listă de echipamente",
      "Instalare și programare",
      "Mentenanță",
    ],
    image: "/images/projects/casa-inteligenta-brasov-interactive.png",
  },
  {
    slug: "apartamente-smart",
    name: "Apartamente Smart",
    audience: "Pentru apartamente inteligente",
    title: "Automatizare compactă, fără complexitate inutilă.",
    summary:
      "Control pentru iluminat, temperatură, jaluzele și securitate, adaptat spațiului disponibil.",
    paragraphs: [
      "Pentru un apartament nou putem integra infrastructura din faza de instalații. Pentru renovări alegem soluții cu intervenții controlate.",
      "Păstrăm experiența unitară în aplicație și verificăm compatibilitatea fiecărui subsistem.",
    ],
    benefits: [
      "Instalare rapidă",
      "Control de la distanță",
      "Scene pe camere",
      "Extindere etapizată",
    ],
    recommendedFor: ["Apartamente noi", "Renovări", "Apartamente pentru închiriere"],
    technologies: ["Matter", "Wi-Fi", "Zigbee", "Apple Home", "Google Home"],
    deliverables: [
      "Audit instalație",
      "Configurație pe camere",
      "Instalare",
      "Punere în funcțiune",
    ],
    image: "/images/projects/casa-inteligenta-cluj-technical.png",
  },
  {
    slug: "blocuri-smart",
    name: "Blocuri Smart",
    audience: "Pentru clădiri inteligente",
    title: "Spații comune, acces și energie administrate coerent.",
    summary: "O infrastructură scalabilă pentru dezvoltatori, asociații și administratori tehnici.",
    paragraphs: [
      "Coordonăm accesul, videointerfonul, iluminatul comun, parcarea, stațiile EV și contorizarea.",
      "Sistemul se proiectează pentru operare simplă, diagnostic și extindere pe etapele proiectului.",
    ],
    benefits: [
      "Costuri operaționale controlate",
      "Acces și securitate",
      "Monitorizare tehnică",
      "Scalabilitate",
    ],
    recommendedFor: ["Blocuri noi", "Ansambluri mici", "Modernizarea spațiilor comune"],
    technologies: ["KNX", "Modbus", "BACnet", "IP"],
    deliverables: [
      "Arhitectură de sistem",
      "Coordonare MEP",
      "Tablouri și automatizări",
      "Documentație as-built",
    ],
    image: "/images/projects/bloc-rezidential-cluj-interactive.png",
  },
  {
    slug: "pensiuni-hoteluri-smart",
    name: "Pensiuni și Hoteluri Smart",
    audience: "Pentru ospitalitate inteligentă",
    title: "Confort pentru oaspeți. Control pentru operator.",
    summary: "Automatizări pe cameră, acces, energie și integrare cu operațiunile hotelului.",
    paragraphs: [
      "Fiecare cameră devine o zonă controlabilă, cu scenarii de bun venit și economisire la neocupare.",
      "Pentru operator, sistemul oferă vizibilitate, alarme tehnice și mentenanță mai predictibilă.",
    ],
    benefits: [
      "Consum redus pe cameră",
      "Experiență coerentă",
      "Acces controlat",
      "Intervenții mai rapide",
    ],
    recommendedFor: ["Pensiuni", "Aparthoteluri", "Hoteluri boutique"],
    technologies: ["KNX", "GRMS", "BACnet", "Modbus", "PMS API"],
    deliverables: ["Mock-up cameră", "Proiect pe nivel", "Integrare PMS/GRMS", "Training personal"],
    image: "/images/projects/bloc-rezidential-cluj-interactive.png",
  },
  {
    slug: "automatizare-knx",
    name: "Automatizare KNX",
    audience: "Pentru clădiri inteligente",
    title: "KNX proiectat pentru stabilitate, diagnostic și extindere.",
    summary:
      "Specializare tehnică pentru proiecte în care infrastructura trebuie să funcționeze zeci de ani.",
    paragraphs: [
      "Proiectăm topologia, adresele de grup, tablourile și logica funcțională înainte de programare.",
      "KNX este recomandat pentru case noi și clădiri cu multe instalații, nu impus proiectelor care pot fi rezolvate mai simplu.",
    ],
    benefits: [
      "Standard deschis",
      "Funcționare distribuită",
      "Multi-producător",
      "Service documentat",
    ],
    recommendedFor: ["Case premium", "Blocuri", "Pensiuni și hoteluri"],
    technologies: ["KNX TP", "KNX IP", "DALI", "Modbus", "BACnet"],
    deliverables: [
      "Proiect ETS",
      "Tablouri automatizare",
      "Programare",
      "Fișier as-built și backup",
    ],
    image: "/images/projects/casa-inteligenta-cluj-technical.png",
  },
  {
    slug: "securitate",
    name: "Securitate",
    audience: "Pentru case și clădiri inteligente",
    title: "Securitate integrată, fără puncte oarbe.",
    summary: "Alarmă, fum, acces, videointerfon și supraveghere coordonate într-un plan tehnic.",
    paragraphs: [
      "Definim zonele de protecție și nivelurile de acces înainte de alegerea echipamentelor.",
      "Evenimentele importante pot declanșa lumină, notificări și scenarii de siguranță, fără a slăbi controlul local.",
    ],
    benefits: ["Detecție pe zone", "Acces controlat", "Notificări", "Istoric auditat"],
    recommendedFor: ["Locuințe", "Blocuri", "Spații de cazare"],
    technologies: ["Alarmă cablată", "IP", "PoE", "KNX"],
    deliverables: ["Analiză de risc", "Plan dispozitive", "Instalare", "Testare și instructaj"],
    image: "/images/projects/casa-inteligenta-brasov-interactive.png",
  },
  {
    slug: "energie-eficienta",
    name: "Energie și Eficiență",
    audience: "Pentru clădiri eficiente",
    title: "Măsoară întâi. Automatizează unde contează.",
    summary:
      "Contorizare, management de sarcină și scenarii care reduc consumul fără a reduce confortul.",
    paragraphs: [
      "Monitorizăm circuitele relevante și corelăm consumul cu prezența, clima și producția locală.",
      "Stațiile EV, fotovoltaicele și sarcinile mari sunt coordonate pentru a evita vârfurile și supradimensionarea.",
    ],
    benefits: ["Vizibilitate consum", "Control sarcini", "Pregătire EV/PV", "Rapoarte și alerte"],
    recommendedFor: ["Case", "Blocuri", "Hoteluri mici"],
    technologies: ["Modbus", "KNX", "Smart metering", "OCPP"],
    deliverables: [
      "Audit energetic tehnic",
      "Schema de măsurare",
      "Dashboard",
      "Reguli de optimizare",
    ],
    image: "/images/projects/bloc-rezidential-cluj-interactive.png",
  },
];

export function getPublicSolution(slug: string): PublicSolution | undefined {
  return publicSolutions.find((solution) => solution.slug === slug);
}
