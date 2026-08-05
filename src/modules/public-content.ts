export type ContentSection = Readonly<{
  title: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
  subsections?: readonly Readonly<{
    title: string;
    paragraphs: readonly string[];
  }>[];
}>;

export type RelatedLink = Readonly<{
  label: string;
  description: string;
  href: string;
}>;

export type PublicContentPage = Readonly<{
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  updated?: string;
  seoTitle?: string;
  seoDescription?: string;
  keywords?: readonly string[];
  ogImage?: string;
  contentType?: "article" | "website";
  publishedTime?: string;
  modifiedTime?: string;
  schemaType?: "Service" | "WebPage";
  serviceType?: string;
  sections: readonly ContentSection[];
  related?: readonly RelatedLink[];
  faq?: readonly Readonly<{ question: string; answer: string }>[];
}>;

export const rootPages: Record<string, PublicContentPage> = {
  "despre-noi": {
    slug: "despre-noi",
    eyebrow: "Despre N3XO",
    title: "Un singur partener pentru întregul sistem smart.",
    description:
      "Proiectăm și coordonăm automatizarea ca parte a clădirii: de la cerințe și infrastructură până la programare, documentație și mentenanță.",
    sections: [
      {
        title: "Cum lucrăm",
        paragraphs: [
          "Începem cu planul, instalațiile și modul în care va fi folosită clădirea. Alegerea tehnologiei vine după definirea funcțiilor, nu înainte.",
          "Coordonăm proiectarea, echipamentele, instalarea, programarea și testarea pentru ca toate subsistemele să funcționeze coerent.",
        ],
        bullets: [
          "Consultanță tehnică",
          "Proiectare și ofertare",
          "Implementare coordonată",
          "Documentație și suport",
        ],
      },
      {
        title: "Pentru cine proiectăm",
        paragraphs: [
          "Lucrăm cu proprietari, arhitecți, proiectanți, dezvoltatori și operatori de pensiuni sau hoteluri mici.",
          "Soluția poate fi Wi-Fi, Matter, KNX sau hibridă, în funcție de amploare, buget și cerințele de service.",
        ],
      },
    ],
    related: [
      {
        label: "Vezi proiectele",
        description: "Studii tehnice și configurații orientative.",
        href: "/proiecte",
      },
      {
        label: "Solicită ofertă",
        description: "Descrie clădirea și etapa proiectului.",
        href: "/solicita-oferta",
      },
    ],
  },
  proiecte: {
    slug: "proiecte",
    eyebrow: "Studii tehnice",
    title: "Vezi logica din spatele unei clădiri inteligente.",
    description:
      "Studii conceptuale interactive care prezintă circuite, funcții și echipamente orientative, fără a fi prezentate drept lucrări executate.",
    sections: [
      {
        title: "Ce poți explora",
        paragraphs: [
          "Fiecare studiu pornește de la o tipologie realistă și explică rolul instalațiilor: iluminat, climat, acces, securitate și energie.",
          "Configurația finală a unui proiect real se stabilește numai după planuri, audit și coordonarea cu celelalte specialități.",
        ],
      },
    ],
    related: [
      {
        label: "Bloc rezidențial, Cluj",
        description: "24 apartamente, acces și spații comune.",
        href: "/proiecte/bloc-rezidential-cluj",
      },
      {
        label: "Casă smart, Brașov",
        description: "Climat, energie și arhitectură hibridă.",
        href: "/proiecte/casa-inteligenta-brasov",
      },
      {
        label: "Casă smart, Cluj",
        description: "Circuite KNX, securitate și climatizare.",
        href: "/proiecte/casa-inteligenta-cluj",
      },
    ],
  },
  ghiduri: {
    slug: "ghiduri",
    eyebrow: "Bibliotecă tehnică",
    title: "Decizii mai bune înainte de proiectare.",
    description:
      "Ghiduri introductive despre protocoale, infrastructură și compatibilitate, scrise pentru proprietari și echipe de proiectare.",
    sections: [
      {
        title: "De unde să începi",
        paragraphs: [
          "Pentru o construcție nouă, deciziile importante se iau înainte de instalația electrică. Pentru renovări, auditul infrastructurii arată ce se poate integra fără intervenții disproporționate.",
        ],
      },
    ],
    related: [
      {
        label: "Wi-Fi, Matter sau KNX?",
        description: "Comparație după clădire, control local și mentenanță.",
        href: "/ghiduri/wifi-matter-sau-knx",
      },
      {
        label: "Google Home, Apple Home sau Alexa?",
        description: "Alege ecosistemul după utilizatori și infrastructură.",
        href: "/ghiduri/google-home-apple-home-alexa",
      },
      {
        label: "Home Assistant pentru casă",
        description: "Control local, backup și responsabilități de administrare.",
        href: "/ghiduri/home-assistant-pentru-casa",
      },
      {
        label: "Costul automatizării",
        description: "Factorii reali care formează bugetul.",
        href: "/ghiduri/cost-automatizare-casa",
      },
      {
        label: "Ghid KNX",
        description: "Când merită o infrastructură profesională.",
        href: "/resurse/ghid-knx",
      },
      {
        label: "Ghid Matter",
        description: "Rolul standardului în casa conectată.",
        href: "/resurse/ghid-matter",
      },
      {
        label: "Compatibilități",
        description: "Cum verificăm integrările dintre sisteme.",
        href: "/resurse/compatibilitati",
      },
    ],
  },
  blog: {
    slug: "blog",
    eyebrow: "Jurnal N3XO",
    title: "Note despre proiectare, integrare și exploatare.",
    description:
      "Secțiunea editorială este în pregătire. Primele materiale vor explica alegerile tehnice care influențează costul și fiabilitatea unui proiect smart.",
    sections: [
      {
        title: "Subiecte pregătite",
        paragraphs: [
          "Publicăm materiale tehnice verificate, fără promisiuni comerciale mascate și fără a transforma alegerea tehnologiei într-un clasament universal.",
        ],
        bullets: [
          "Pregătirea instalației electrice",
          "KNX versus soluții wireless",
          "Controlul climatului pe zone",
          "Documentația necesară mentenanței",
        ],
      },
    ],
    related: [
      {
        label: "Pregătirea casei pentru automatizare",
        description: "Ce decizi înainte de cablare și finisaje.",
        href: "/blog/pregatirea-casei-pentru-automatizare",
      },
      {
        label: "KNX sau smart home Wi-Fi",
        description: "Roluri diferite pentru proiecte diferite.",
        href: "/blog/knx-sau-smart-home-wifi",
      },
      {
        label: "Încălzire și energie",
        description: "Control pe zone fără compromisuri HVAC.",
        href: "/blog/automatizare-incalzire-energie",
      },
    ],
  },
  cariere: {
    slug: "cariere",
    eyebrow: "Cariere",
    title: "Construim o echipă tehnică atentă la detalii.",
    description:
      "Nu avem în acest moment roluri publice active. Poți trimite o prezentare profesională pentru oportunități viitoare în proiectare, integrare și punere în funcțiune.",
    sections: [
      {
        title: "Profiluri de interes",
        paragraphs: [
          "Căutăm oameni care documentează corect, testează înainte de predare și pot explica soluțiile tehnice clar beneficiarului.",
        ],
        bullets: [
          "Inginer proiectant",
          "Programator KNX",
          "Tehnician instalații și automatizări",
          "Coordonator punere în funcțiune",
        ],
      },
      {
        title: "Contact",
        paragraphs: [
          "Trimite CV-ul sau portofoliul la office@nexcore.ro. Păstrăm documentele de recrutare numai pentru perioada comunicată candidatului.",
        ],
      },
    ],
  },
  "configurator-pe-plan": {
    slug: "configurator-pe-plan",
    eyebrow: "Configurator pe plan",
    title: "Transformă planul într-o configurație pe camere.",
    description:
      "Încarci un plan PDF, JPG sau PNG, confirmi spațiile și alegi funcțiile dorite. Primești o estimare orientativă înainte de proiectarea detaliată.",
    sections: [
      {
        title: "Cum funcționează",
        paragraphs: [
          "Planul rămâne asociat organizației tale. Confirmi camerele, apoi configurezi iluminatul, climatul, jaluzelele, securitatea și integrările pentru fiecare zonă.",
        ],
        bullets: [
          "Încarcă documentul",
          "Confirmă camerele",
          "Selectează automatizările",
          "Trimite configurația pentru ofertă",
        ],
      },
      {
        title: "Ce primești",
        paragraphs: [
          "Estimarea este orientativă și nu înlocuiește proiectul tehnic. Oferta finală se emite după verificarea planului, instalațiilor și condițiilor de montaj.",
        ],
      },
    ],
    related: [
      {
        label: "Deschide configuratorul",
        description: "Autentifică-te în portalul securizat.",
        href: "/login",
      },
      {
        label: "Cum protejăm planurile",
        description: "Măsurile aplicate documentelor încărcate.",
        href: "/legal/cum-protejam-planurile-incarcate",
      },
    ],
  },
  "solicita-oferta": {
    slug: "solicita-oferta",
    eyebrow: "Solicită ofertă",
    title: "Spune-ne ce clădire și ce etapă ai.",
    description:
      "Pentru o estimare utilă avem nevoie de tipul clădirii, suprafață, stadiul instalațiilor și funcțiile prioritare.",
    sections: [
      {
        title: "Contact direct",
        paragraphs: [
          "Telefon: +40 774 542 015. Email: office@nexcore.ro. Răspundem cu pașii necesari și lista documentelor utile pentru analiza inițială.",
        ],
      },
      {
        title: "Ce poți pregăti",
        paragraphs: [
          "Poți trimite planul arhitectural, schema electrică disponibilă, numărul de camere sau apartamente și nivelul de automatizare urmărit.",
        ],
        bullets: [
          "Tip și suprafață clădire",
          "Construcție nouă sau renovare",
          "Plan PDF/JPG/PNG",
          "Funcții și buget orientativ",
        ],
      },
    ],
    related: [
      { label: "Încarcă planul", description: "Folosește portalul securizat.", href: "/login" },
    ],
  },
  sitemap: {
    slug: "sitemap",
    eyebrow: "Sitemap",
    title: "Structura platformei N3XO.",
    description:
      "Acces rapid la zonele publice, serviciile tehnice, resurse și informațiile legale.",
    sections: [],
    related: [
      {
        label: "Soluții",
        description: "Case, apartamente, blocuri și ospitalitate.",
        href: "/solutii/case-smart",
      },
      { label: "Kituri", description: "Pachete orientative configurabile.", href: "/kituri" },
      {
        label: "Servicii",
        description: "Consultanță, proiectare, instalare și service.",
        href: "/servicii/consultanta",
      },
      { label: "Resurse", description: "Ghiduri și compatibilități.", href: "/ghiduri" },
      {
        label: "Legal",
        description: "Politici și protecția datelor.",
        href: "/legal/politica-de-confidentialitate",
      },
      { label: "Portal client", description: "Proiecte și documente private.", href: "/login" },
    ],
  },
  versiune: {
    slug: "versiune",
    eyebrow: "Versiunea platformei",
    title: "N3XO Smart Buildings 0.1.0",
    description:
      "Versiunea publică actuală a platformei de configurare și management al proiectelor smart.",
    updated: "4 august 2026",
    sections: [
      {
        title: "Module active",
        paragraphs: [
          "Site public, kituri comerciale, configurator pe plan, portal client, administrare internă, autentificare și izolare organizațională.",
        ],
      },
      {
        title: "Despre estimări",
        paragraphs: [
          "Prețurile și listele de materiale generate de configuratoare sunt orientative. Confirmarea necesită proiectare și verificarea condițiilor din teren.",
        ],
      },
    ],
  },
  branduri: {
    slug: "branduri",
    eyebrow: "Branduri și tehnologii integrate",
    title: "Alegem producătorul după rolul din proiect.",
    description:
      "KNX permite arhitecturi multi-brand. Fiecare compatibilitate este verificată la nivelul produsului și aplicației sale.",
    sections: [
      {
        title: "Cum selectăm",
        paragraphs: [
          "Evaluăm funcția, documentația, disponibilitatea pentru service și integrarea cu restul proiectului. Prezența unui brand pe platformă nu implică automat un parteneriat oficial.",
        ],
      },
    ],
    related: [
      {
        label: "ABB",
        description: "Echipamente KNX și automatizare de clădire.",
        href: "/branduri/abb",
      },
      {
        label: "Schneider Electric",
        description: "Distribuție, automatizare și management energetic.",
        href: "/branduri/schneider-electric",
      },
      {
        label: "MDT",
        description: "Echipamente KNX pentru tablou și cameră.",
        href: "/branduri/mdt",
      },
      { label: "Gira", description: "Aparataj, senzori și interfețe.", href: "/branduri/gira" },
      { label: "JUNG", description: "Aparataj și control KNX.", href: "/branduri/jung" },
      {
        label: "Basalte",
        description: "Interfețe premium pentru controlul clădirii.",
        href: "/branduri/basalte",
      },
      {
        label: "Zennio",
        description: "Control cameră, HVAC și interfețe KNX.",
        href: "/branduri/zennio",
      },
      {
        label: "Theben",
        description: "Senzori, control și automatizare KNX.",
        href: "/branduri/theben",
      },
    ],
  },
};

export const servicePages: Record<string, PublicContentPage> = {
  consultanta: {
    slug: "consultanta",
    eyebrow: "Servicii",
    title: "Consultanță înainte de alegerea echipamentelor.",
    description:
      "Clarificăm obiectivele, bugetul, etapa construcției și riscurile tehnice înainte de a propune o arhitectură.",
    sections: [
      {
        title: "Ce analizăm",
        paragraphs: [
          "Planurile, instalațiile existente, funcțiile dorite, interfețele preferate și nivelul de mentenanță acceptat.",
        ],
        bullets: [
          "Tipul clădirii",
          "Stadiul instalațiilor",
          "Priorități și scenarii",
          "Buget și etapizare",
        ],
      },
      {
        title: "Rezultat",
        paragraphs: [
          "Primești recomandări argumentate, o structură de sistem și pașii necesari pentru proiectare și ofertare.",
        ],
      },
    ],
  },
  "audit-smart-home": {
    slug: "audit-smart-home",
    eyebrow: "Servicii",
    title: "Audit tehnic pentru sisteme existente.",
    description:
      "Verificăm ce funcționează, ce poate fi păstrat și unde există riscuri de compatibilitate sau service.",
    sections: [
      {
        title: "Auditul include",
        paragraphs: [
          "Inventarierea echipamentelor, verificarea documentației, rețelei, tablourilor și accesului la configurațiile existente.",
        ],
        bullets: [
          "Topologie și alimentări",
          "Configurații și backup",
          "Rețea și gateway-uri",
          "Defecțiuni și limitări",
        ],
      },
      {
        title: "Raport",
        paragraphs: [
          "Concluziile separă intervențiile urgente de îmbunătățirile opționale și prezintă o ordine realistă de implementare.",
        ],
      },
    ],
  },
  proiectare: {
    slug: "proiectare",
    eyebrow: "Servicii",
    title: "Proiectare coordonată cu arhitectura și instalațiile.",
    description:
      "Definim funcțiile, traseele, tablourile, topologia, integrarea și criteriile de testare înainte de montaj.",
    sections: [
      {
        title: "Documentație",
        paragraphs: [
          "Nivelul de detaliu se adaptează proiectului și poate include planuri, scheme, liste de puncte, tablouri, adrese și descrieri funcționale.",
        ],
        bullets: [
          "Plan dispozitive",
          "Scheme și tablouri",
          "Listă I/O și funcții",
          "Cerințe de programare",
        ],
      },
      {
        title: "Coordonare",
        paragraphs: [
          "Verificăm interfețele cu instalația electrică, HVAC, securitatea, rețeaua și echipamentele furnizate de alte specialități.",
        ],
      },
    ],
  },
  instalare: {
    slug: "instalare",
    eyebrow: "Servicii",
    title: "Instalare pregătită pentru testare și service.",
    description:
      "Montajul urmărește proiectul aprobat, etichetarea și posibilitatea de diagnostic pe termen lung.",
    sections: [
      {
        title: "Execuție controlată",
        paragraphs: [
          "Planificăm etapele, verificăm cablarea înainte de închiderea finisajelor și documentăm schimbările apărute în șantier.",
        ],
        bullets: [
          "Verificare cabluri",
          "Montaj și etichetare",
          "Tablouri automatizare",
          "Proces verbal de teste",
        ],
      },
      {
        title: "Limite clare",
        paragraphs: [
          "Lucrările incluse și responsabilitățile față de instalația electrică sau alte specialități sunt stabilite în ofertă și contract.",
        ],
      },
    ],
  },
  "programare-knx": {
    slug: "programare-knx",
    eyebrow: "Servicii KNX",
    title: "Programare KNX documentată și testabilă.",
    description:
      "Configurăm proiectul ETS, adresele de grup, parametrii și scenariile conform descrierii funcționale aprobate.",
    sections: [
      {
        title: "Proces",
        paragraphs: [
          "Programarea este urmată de teste pe funcții și de corectarea comportamentelor observate în clădire.",
        ],
        bullets: [
          "Structură ETS",
          "Adresare și parametri",
          "Scene și logici",
          "Backup și documentație",
        ],
      },
      {
        title: "Predare",
        paragraphs: [
          "Fișierele și drepturile de utilizare sunt predate conform contractului, împreună cu instrucțiunile relevante pentru mentenanță.",
        ],
      },
    ],
  },
  "punere-in-functiune": {
    slug: "punere-in-functiune",
    eyebrow: "Servicii",
    title: "Punere în funcțiune cu scenarii verificate.",
    description:
      "Testăm echipamentele și interacțiunile dintre sisteme înainte ca proiectul să fie predat beneficiarului.",
    sections: [
      {
        title: "Teste",
        paragraphs: [
          "Verificăm fiecare funcție, comportamentul la revenirea alimentării, alarmele, accesul și scenariile importante.",
        ],
        bullets: [
          "Teste pe circuite",
          "Teste de integrare",
          "Scenarii de avarie",
          "Instruirea utilizatorilor",
        ],
      },
      {
        title: "Recepție",
        paragraphs: [
          "Neconformitățile și ajustările rămase sunt documentate, alocate și închise înainte de acceptarea finală.",
        ],
      },
    ],
  },
  mentenanta: {
    slug: "mentenanta",
    eyebrow: "Servicii",
    title: "Mentenanță pentru o clădire care evoluează.",
    description:
      "Păstrăm configurațiile, istoricul și documentația necesare intervențiilor controlate.",
    sections: [
      {
        title: "Mentenanță preventivă",
        paragraphs: [
          "Verificările periodice pot acoperi backupurile, alarmele tehnice, rețeaua, bateriile și funcțiile critice.",
        ],
        bullets: [
          "Backup configurații",
          "Verificări funcționale",
          "Actualizare documentație",
          "Recomandări de înlocuire",
        ],
      },
      {
        title: "Schimbări",
        paragraphs: [
          "Extinderile și modificările sunt evaluate pentru compatibilitate înainte de aplicare.",
        ],
      },
    ],
  },
  service: {
    slug: "service",
    eyebrow: "Servicii",
    title: "Diagnostic și intervenție cu istoric tehnic.",
    description:
      "Începem cu simptomele, configurația și evenimentele disponibile, nu cu înlocuirea arbitrară a echipamentelor.",
    sections: [
      {
        title: "Sesizare",
        paragraphs: [
          "Pentru diagnostic sunt utile identificarea proiectului, descrierea comportamentului, momentul apariției și fotografii relevante.",
        ],
        bullets: [
          "Identificare proiect",
          "Simptom și interval",
          "Zone afectate",
          "Modificări recente",
        ],
      },
      {
        title: "Intervenție",
        paragraphs: [
          "Accesul la distanță sau la locație se face numai cu autorizare și este documentat în istoricul proiectului.",
        ],
      },
    ],
  },
  "integrare-sisteme-existente": {
    slug: "integrare-sisteme-existente",
    eyebrow: "Servicii",
    title: "Integrare fără a înlocui ce funcționează corect.",
    description:
      "Inventariem sistemele existente și alegem interfețe justificate pentru control unitar, monitorizare și scenarii.",
    sections: [
      {
        title: "Ce verificăm",
        paragraphs: [
          "Documentația, versiunile, protocoalele, accesul la configurații și limitele declarate de producători.",
        ],
        bullets: [
          "KNX și DALI",
          "HVAC și Modbus/BACnet",
          "Securitate și acces",
          "Wi-Fi, Matter și Home Assistant",
        ],
      },
      {
        title: "Compatibilitate verificată",
        paragraphs: [
          "Nu presupunem că două produse sunt compatibile doar pentru că folosesc același protocol. Modelul, aplicația și fluxul de date sunt validate înainte de ofertare.",
        ],
      },
    ],
  },
};

export const resourcePages: Record<string, PublicContentPage> = {
  "intrebari-frecvente": {
    slug: "intrebari-frecvente",
    eyebrow: "Resurse",
    title: "Întrebări frecvente despre proiectele smart.",
    description: "Răspunsuri scurte despre tehnologie, cost, proiectare și implementare.",
    sections: [
      {
        title: "Cât costă?",
        paragraphs: [
          "Costul depinde de suprafață, circuite, nivelul de finisare și integrări. Kiturile oferă intervale orientative; oferta finală necesită plan și analiză.",
        ],
      },
      {
        title: "Este obligatoriu KNX?",
        paragraphs: [
          "Nu. KNX este potrivit proiectelor care cer infrastructură robustă și scalabilă. Pentru alte situații, Matter, Wi-Fi, Zigbee sau o soluție hibridă pot fi mai potrivite.",
        ],
      },
      {
        title: "Când trebuie începută proiectarea?",
        paragraphs: [
          "Ideal înainte de definitivarea instalației electrice și HVAC. În renovări, auditul stabilește ce se poate păstra.",
        ],
      },
    ],
  },
  "ghid-knx": {
    slug: "ghid-knx",
    eyebrow: "Ghid tehnic",
    title: "KNX: infrastructură deschisă pentru automatizarea clădirilor.",
    description:
      "Principiile de bază, avantajele și condițiile necesare unui proiect KNX documentat.",
    sections: [
      {
        title: "Ce este KNX",
        paragraphs: [
          "KNX este un standard de comunicație pentru automatizarea clădirilor. Funcțiile sunt distribuite între dispozitive, iar proiectul poate combina producători după verificarea aplicațiilor.",
        ],
      },
      {
        title: "Când îl recomandăm",
        paragraphs: [
          "Case noi, clădiri cu multe circuite, control HVAC, umbrire, energie și cerințe de funcționare pe termen lung.",
        ],
        bullets: [
          "Planificare înainte de cablare",
          "Proiect ETS",
          "Tablouri dimensionate",
          "Backup și documentație",
        ],
      },
    ],
  },
  "ghid-matter": {
    slug: "ghid-matter",
    eyebrow: "Ghid tehnic",
    title: "Matter: interoperabilitate pentru casa conectată.",
    description:
      "Ce rezolvă standardul Matter și de ce compatibilitatea trebuie verificată tot la nivelul funcției.",
    sections: [
      {
        title: "Rolul Matter",
        paragraphs: [
          "Matter simplifică integrarea anumitor categorii de dispozitive între ecosisteme precum Apple Home, Google Home și Alexa. Nu înlocuiește proiectarea rețelei sau verificarea funcțiilor suportate.",
        ],
      },
      {
        title: "Thread, Wi-Fi și bridge-uri",
        paragraphs: [
          "Dispozitivele Matter pot comunica prin Thread sau Wi-Fi. Unele ecosisteme folosesc bridge-uri, iar controlul la distanță poate necesita un hub compatibil.",
        ],
      },
    ],
  },
  "google-home": {
    slug: "google-home",
    eyebrow: "Integrare",
    title: "Google Home ca interfață, nu ca infrastructură unică.",
    description:
      "Control vocal și rutine pentru funcțiile expuse în siguranță de sistemul principal.",
    sections: [
      {
        title: "Integrare",
        paragraphs: [
          "Selectăm un gateway sau produse compatibile, verificăm comenzile disponibile și păstrăm funcțiile esențiale independente de serviciile cloud atunci când proiectul o cere.",
        ],
        bullets: [
          "Comenzi vocale",
          "Rutine",
          "Control multiutilizator",
          "Verificarea permisiunilor",
        ],
      },
    ],
  },
  "apple-home": {
    slug: "apple-home",
    eyebrow: "Integrare",
    title: "Apple Home pentru control simplu în ecosistemul Apple.",
    description:
      "O interfață unitară pentru dispozitive compatibile și funcții expuse de sistemul clădirii.",
    sections: [
      {
        title: "Integrare",
        paragraphs: [
          "Verificăm compatibilitatea Matter sau a bridge-ului, rolul hubului de locuință și accesul fiecărui membru al familiei.",
        ],
        bullets: ["Aplicația Home", "Automatizări", "Control prin Siri", "Acces la distanță"],
      },
    ],
  },
  "amazon-alexa": {
    slug: "amazon-alexa",
    eyebrow: "Integrare",
    title: "Amazon Alexa pentru comenzi vocale și rutine.",
    description:
      "Integrarea se face prin produse sau gateway-uri validate pentru funcțiile cerute în proiect.",
    sections: [
      {
        title: "Ce verificăm",
        paragraphs: [
          "Disponibilitatea serviciului, conturile utilizate, comenzile expuse și dependența de cloud. Funcțiile critice nu se bazează exclusiv pe control vocal.",
        ],
        bullets: [
          "Compatibilitate model",
          "Rutine",
          "Conturi și permisiuni",
          "Comportament fără internet",
        ],
      },
    ],
  },
  "home-assistant": {
    slug: "home-assistant",
    eyebrow: "Integrare",
    title: "Home Assistant pentru control local și scenarii avansate.",
    description:
      "O platformă flexibilă care poate unifica sisteme diferite atunci când este proiectată și întreținută responsabil.",
    sections: [
      {
        title: "Arhitectură",
        paragraphs: [
          "Definim hardware-ul, backupul, actualizările, accesul și integrațiile înainte de a construi automatizări. Conectorii comunitari sunt evaluați separat de integrările oficiale.",
        ],
        bullets: ["Control local", "Backup", "Monitorizare", "Plan de actualizare"],
      },
    ],
  },
  compatibilitati: {
    slug: "compatibilitati",
    eyebrow: "Resurse",
    title: "Compatibilitatea se demonstrează, nu se presupune.",
    description:
      "Protocolul comun este doar începutul. Verificăm modelele, funcțiile, versiunile și limitele fiecărei integrări.",
    sections: [
      {
        title: "Metoda de verificare",
        paragraphs: [
          "Consultăm documentația actuală, stabilim fluxul de date, testăm funcțiile importante și documentăm dependențele.",
        ],
        bullets: [
          "Protocol și versiune",
          "Gateway sau bridge",
          "Funcții citite și comandate",
          "Comportament la întreruperi",
        ],
      },
      {
        title: "Proiecte multi-brand",
        paragraphs: [
          "KNX permite combinarea mai multor producători, însă alegerea fiecărui aparat se face după aplicația sa și cerința proiectului.",
        ],
      },
    ],
  },
};

export const legalPages: Record<string, PublicContentPage> = {
  "termeni-si-conditii": {
    slug: "termeni-si-conditii",
    eyebrow: "Legal",
    title: "Termeni și condiții de utilizare.",
    description:
      "Regulile aplicabile utilizării site-ului, configuratoarelor și portalului N3XO Smart Buildings.",
    updated: "4 august 2026",
    sections: [
      {
        title: "1. Rolul platformei",
        paragraphs: [
          "Platforma prezintă servicii de proiectare și integrare și oferă instrumente pentru configurări și estimări orientative. Informațiile publice nu constituie proiect tehnic, ofertă fermă sau garanție de compatibilitate pentru o clădire concretă.",
        ],
      },
      {
        title: "2. Conturi și acces",
        paragraphs: [
          "Utilizatorul trebuie să furnizeze informații corecte, să protejeze datele de autentificare și să folosească numai organizațiile și proiectele pentru care are drepturi. Activitatea poate fi înregistrată în jurnalul de audit pentru securitate și trasabilitate.",
        ],
      },
      {
        title: "3. Configuratoare și estimări",
        paragraphs: [
          "Prețurile, cantitățile și listele generate sunt orientative. Oferta finală depinde de planuri, instalații, deplasare, condițiile de montaj, disponibilitatea echipamentelor și cerințele aprobate.",
        ],
      },
      {
        title: "4. Documente încărcate",
        paragraphs: [
          "Utilizatorul confirmă că are dreptul să încarce planurile și documentele. Nu trebuie încărcate materiale ilegale, date fără temei sau documente care nu sunt necesare proiectului.",
        ],
      },
      {
        title: "5. Proprietate intelectuală",
        paragraphs: [
          "Conținutul platformei, structura configuratoarelor și materialele N3XO nu pot fi reproduse comercial fără acord. Mărcile terților aparțin titularilor lor și indică doar posibilitatea integrării, dacă aceasta este verificată tehnic.",
        ],
      },
      {
        title: "6. Contractarea serviciilor",
        paragraphs: [
          "Serviciile, termenele, livrabilele, garanțiile și răspunderile sunt stabilite prin oferta și contractul acceptate. În caz de diferență, documentele contractuale prevalează asupra conținutului general al site-ului.",
        ],
      },
      {
        title: "7. Contact",
        paragraphs: [
          "Pentru întrebări despre acești termeni: office@nexcore.ro sau +40 774 542 015.",
        ],
      },
    ],
  },
  "politica-de-confidentialitate": {
    slug: "politica-de-confidentialitate",
    eyebrow: "Legal",
    title: "Politica de confidențialitate.",
    description:
      "Cum prelucrăm datele persoanelor care folosesc site-ul, portalul și serviciile N3XO.",
    updated: "4 august 2026",
    sections: [
      {
        title: "Operator și contact",
        paragraphs: [
          "Operatorul este entitatea N3XO Smart Buildings identificată în oferta sau contractul aplicabil. Pentru întrebări despre datele personale ne poți contacta la office@nexcore.ro. Datele complete ale entității contractante sunt comunicate înainte de contractare.",
        ],
      },
      {
        title: "Date prelucrate",
        paragraphs: [
          "Putem prelucra nume, date de contact, companie sau organizație, rol, date de autentificare gestionate securizat, activitate în platformă, cereri, configurații, documente și informații tehnice despre proiect.",
        ],
        bullets: [
          "Date de cont și contact",
          "Apartenență la organizație",
          "Configurări și solicitări",
          "Jurnale de securitate",
          "Planuri și documente încărcate",
        ],
      },
      {
        title: "Scopuri și temeiuri",
        paragraphs: [
          "Folosim datele pentru furnizarea serviciului și executarea contractului, răspunsul la solicitări, securitatea platformei, respectarea obligațiilor legale și, când este necesar, pe baza consimțământului. Nu folosim planurile clienților pentru publicitate.",
        ],
      },
      {
        title: "Destinatari și furnizori",
        paragraphs: [
          "Accesul este limitat personalului autorizat și furnizorilor tehnici necesari găzduirii, autentificării, stocării sau mentenanței. Furnizorii sunt utilizați în baza rolurilor și obligațiilor aplicabile, fără acces general la proiecte.",
        ],
      },
      {
        title: "Transferuri și locația datelor",
        paragraphs: [
          "Unele servicii tehnice pot implica transferuri în afara Spațiului Economic European. Atunci când se aplică, folosim mecanisme recunoscute, precum decizii de adecvare sau clauze contractuale standard.",
        ],
      },
      {
        title: "Păstrare și drepturi",
        paragraphs: [
          "Păstrăm datele atât cât sunt necesare scopului, contractului, securității și obligațiilor legale. Poți solicita acces, rectificare, ștergere, restricționare, opoziție sau portabilitate, în limitele legii, folosind procedura de solicitări GDPR.",
        ],
      },
    ],
  },
  "politica-cookies": {
    slug: "politica-cookies",
    eyebrow: "Legal",
    title: "Politica privind modulele cookie.",
    description:
      "Ce cookie-uri folosește platforma și de ce sunt necesare pentru funcționarea sigură.",
    updated: "4 august 2026",
    sections: [
      {
        title: "Ce este un cookie",
        paragraphs: [
          "Un cookie este o informație de dimensiune mică stocată de browser. Poate menține o sesiune, o preferință sau o măsură de securitate între solicitări.",
        ],
      },
      {
        title: "Cookie-uri strict necesare",
        paragraphs: [
          "Portalul folosește cookie-uri de autentificare și securitate pentru a păstra sesiunea și a proteja rutele private. Fără acestea, autentificarea și portalul client nu pot funcționa. Nu modificăm numele și valorile generate de furnizorul de autentificare.",
        ],
      },
      {
        title: "Preferințe și analiză",
        paragraphs: [
          "Google Analytics este folosit exclusiv după acordul vizitatorului pentru cookies de analiză. Dacă alegi «Doar necesare», eticheta Google Analytics nu este încărcată. Nu folosim această opțiune pentru activarea automată a cookie-urilor publicitare.",
        ],
      },
      {
        title: "Controlul din browser",
        paragraphs: [
          "Poți șterge sau bloca cookie-urile din setările browserului. Blocarea cookie-urilor necesare poate opri autentificarea, încărcarea planurilor și accesul la proiectele private.",
        ],
      },
      {
        title: "Actualizări",
        paragraphs: [
          "Politica este actualizată când se schimbă tehnologia folosită. Data versiunii curente este afișată în partea de sus a paginii.",
        ],
      },
    ],
  },
  gdpr: {
    slug: "gdpr",
    eyebrow: "Protecția datelor",
    title: "Drepturile tale conform GDPR.",
    description:
      "Informații clare despre drepturile persoanelor vizate și modul de exercitare în platforma N3XO.",
    updated: "4 august 2026",
    sections: [
      {
        title: "Drepturile disponibile",
        paragraphs: [
          "În funcție de situație, poți solicita acces la date, rectificare, ștergere, restricționare, portabilitate sau opoziție. Poți retrage consimțământul fără a afecta prelucrările anterioare retragerii.",
        ],
        bullets: [
          "Acces și copie",
          "Rectificare",
          "Ștergere",
          "Restricționare",
          "Portabilitate",
          "Opoziție",
        ],
      },
      {
        title: "Cum verificăm solicitantul",
        paragraphs: [
          "Pentru a proteja proiectele și conturile, putem cere informații proporționale pentru verificarea identității și a dreptului de reprezentare a organizației. Nu solicităm parole.",
        ],
      },
      {
        title: "Termen și răspuns",
        paragraphs: [
          "Răspundem fără întârzieri nejustificate și, de regulă, în termenul prevăzut de GDPR. Pentru cereri complexe, termenul poate fi prelungit cu informarea solicitantului.",
        ],
      },
      {
        title: "Plângeri",
        paragraphs: [
          "Dacă apreciezi că drepturile nu au fost respectate, poți depune o plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal sau la autoritatea competentă din statul tău.",
        ],
      },
    ],
  },
  "solicitari-gdpr": {
    slug: "solicitari-gdpr",
    eyebrow: "Protecția datelor",
    title: "Cum trimiți o solicitare GDPR.",
    description:
      "Canalul pentru acces, rectificare, ștergere și celelalte drepturi privind datele personale.",
    updated: "4 august 2026",
    sections: [
      {
        title: "Transmiterea cererii",
        paragraphs: [
          "Trimite cererea la office@nexcore.ro cu subiectul «Solicitare GDPR». Menționează dreptul exercitat, datele de contact folosite în relația cu noi și, dacă este relevant, organizația sau proiectul.",
        ],
      },
      {
        title: "Ce să nu trimiți",
        paragraphs: [
          "Nu trimite parola, tokenuri de acces sau copii integrale ale actelor dacă nu au fost solicitate printr-un canal adecvat. Vom cere numai informațiile necesare verificării identității.",
        ],
      },
      {
        title: "Organizații și proiecte",
        paragraphs: [
          "Ștergerea unui cont nu implică automat ștergerea documentației pe care organizația trebuie să o păstreze contractual sau legal. Separăm datele de cont de evidențele tehnice și justificăm orice limitare aplicabilă.",
        ],
      },
    ],
  },
  "politica-retentie-date": {
    slug: "politica-retentie-date",
    eyebrow: "Legal",
    title: "Politica de retenție a datelor.",
    description:
      "Principiile după care stabilim cât timp păstrăm conturile, proiectele, documentele și jurnalele.",
    updated: "4 august 2026",
    sections: [
      {
        title: "Principiu",
        paragraphs: [
          "Datele sunt păstrate numai cât sunt necesare scopului declarat, furnizării serviciului, apărării drepturilor, securității și obligațiilor legale sau contractuale.",
        ],
      },
      {
        title: "Categorii orientative",
        paragraphs: [
          "Solicitările fără contract sunt revizuite periodic și șterse când nu mai sunt necesare. Datele proiectelor active se păstrează pe durata colaborării. Documentația tehnică, ofertele și evidențele financiar-contractuale pot necesita termene mai lungi stabilite de lege sau contract. Jurnalele de securitate sunt păstrate o perioadă limitată, proporțională cu investigarea incidentelor.",
        ],
        bullets: [
          "Cereri și contacte",
          "Conturi și apartenențe",
          "Planuri și configurații",
          "Oferte și contracte",
          "Audit și securitate",
        ],
      },
      {
        title: "Închiderea proiectului",
        paragraphs: [
          "La închiderea colaborării, stabilim ce documentație este predată, arhivată sau ștearsă. Datele care trebuie păstrate sunt izolate și accesibile numai rolurilor autorizate.",
        ],
      },
      {
        title: "Ștergere și backup",
        paragraphs: [
          "Ștergerea din sistemele active poate fi urmată de expirarea controlată a copiilor de backup. Backupurile nu sunt folosite pentru activități curente și sunt suprascrise conform ciclului tehnic.",
        ],
      },
    ],
  },
  "confidentialitatea-documentelor": {
    slug: "confidentialitatea-documentelor",
    eyebrow: "Documente private",
    title: "Confidențialitatea documentelor de proiect.",
    description:
      "Planurile, schemele, ofertele și configurațiile sunt tratate ca informații de proiect cu acces controlat.",
    updated: "4 august 2026",
    sections: [
      {
        title: "Acces pe organizație",
        paragraphs: [
          "Documentele unui client sunt asociate organizației sale. Utilizatorii autentificați văd numai proiectele permise de apartenență și rol. Verificările de acces sunt aplicate server-side.",
        ],
      },
      {
        title: "Acces intern",
        paragraphs: [
          "Personalul N3XO primește acces numai când rolul și sarcina îl justifică: analiză, proiectare, ofertare, implementare sau suport. Operațiile administrative sensibile trebuie justificate și auditate.",
        ],
      },
      {
        title: "Folosire limitată",
        paragraphs: [
          "Documentele nu sunt publicate, folosite ca studiu de prezentare sau transmise altui client fără un acord separat. Furnizorii tehnici pot prelucra date numai pentru operarea serviciului și în condițiile aplicabile.",
        ],
      },
      {
        title: "Partajare",
        paragraphs: [
          "Dacă proiectul necesită colaborarea cu arhitecți, proiectanți sau executanți, partajarea se face la cererea sau cu aprobarea clientului și numai pentru informațiile necesare.",
        ],
      },
    ],
  },
  "securitatea-informatiilor": {
    slug: "securitatea-informatiilor",
    eyebrow: "Securitate",
    title: "Securitatea informațiilor în platformă.",
    description:
      "Măsuri tehnice și organizaționale pentru protejarea conturilor, proiectelor și documentelor.",
    updated: "4 august 2026",
    sections: [
      {
        title: "Identitate și acces",
        paragraphs: [
          "Autentificarea folosește sesiuni securizate, iar accesul la portal și administrare este controlat pe roluri și organizații. Simplul fapt că un URL este cunoscut nu acordă acces la resursă.",
        ],
      },
      {
        title: "Separarea datelor",
        paragraphs: [
          "Operațiile clientului includ contextul organizației și verificări server-side. Politicile de acces din baza de date completează, nu înlocuiesc, validările aplicației.",
        ],
      },
      {
        title: "Jurnal și monitorizare",
        paragraphs: [
          "Acțiunile relevante pot fi înregistrate în jurnale de audit pentru investigarea incidentelor, trasabilitate și respectarea obligațiilor. Jurnalele nu trebuie să conțină parole sau tokenuri complete.",
        ],
      },
      {
        title: "Raportarea incidentelor",
        paragraphs: [
          "Pentru a raporta un incident sau o suspiciune, contactează office@nexcore.ro și descrie momentul, contul afectat și comportamentul observat, fără a transmite parole.",
        ],
      },
    ],
  },
  "cum-protejam-planurile-incarcate": {
    slug: "cum-protejam-planurile-incarcate",
    eyebrow: "Planuri și documente",
    title: "Cum protejăm planurile încărcate.",
    description:
      "Planurile sunt documente private folosite pentru configurarea, proiectarea și ofertarea clădirii tale.",
    updated: "4 august 2026",
    sections: [
      {
        title: "Documente private",
        paragraphs: [
          "Planurile nu sunt listate public și nu sunt accesibile prin catalogul public. Sunt asociate proiectului și organizației care le-a încărcat.",
        ],
      },
      {
        title: "Acces limitat",
        paragraphs: [
          "Accesul este permis utilizatorilor autorizați ai organizației și personalului care are o sarcină justificată în proiect. Rolurile și apartenența sunt verificate server-side; accesul anonim este refuzat.",
        ],
      },
      {
        title: "Stocare securizată",
        paragraphs: [
          "Fișierele sunt păstrate în spații de stocare private. Accesul se acordă controlat aplicației și sesiunii autorizate; linkurile publice permanente nu sunt mecanismul normal de livrare.",
        ],
      },
      {
        title: "Backup și continuitate",
        paragraphs: [
          "Folosim procese de backup și recuperare potrivite infrastructurii. Copiile sunt protejate, au cicluri de retenție și nu sunt folosite pentru acces curent sau publicare.",
        ],
      },
      {
        title: "Controlul accesului",
        paragraphs: [
          "Platforma combină autentificarea, rolurile, izolarea organizațiilor și verificările de permisiune. Operațiile administrative cu privilegii ridicate sunt limitate la situații justificate.",
        ],
      },
      {
        title: "Jurnal de audit",
        paragraphs: [
          "Acțiunile importante asupra proiectului și documentelor pot fi înregistrate pentru trasabilitate. Jurnalul ajută la investigarea incidentelor și la verificarea operațiilor administrative.",
        ],
      },
      {
        title: "Recomandări pentru client",
        paragraphs: [
          "Folosește conturi individuale, protejează accesul la email, revocă utilizatorii care nu mai fac parte din proiect și nu trimite planurile prin canale nesecurizate dacă portalul este disponibil.",
        ],
      },
    ],
  },
};

export function getContentPage(
  pages: Record<string, PublicContentPage>,
  slug: string,
): PublicContentPage | undefined {
  return pages[slug];
}
