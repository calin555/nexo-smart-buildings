import type { PublicContentPage } from "@/modules/public-content";

export const pillarPages: Record<string, PublicContentPage> = {
  "casa-smart": {
    slug: "casa-smart",
    eyebrow: "Pagină pilon · Casă smart",
    title: "Casă smart proiectată în jurul locuinței tale.",
    description:
      "Un sistem coerent pentru iluminat, temperatură, jaluzele, securitate și energie, ales după planul casei și modul real de utilizare.",
    seoTitle: "Casă smart și casă inteligentă: proiectare completă | N3XO",
    seoDescription:
      "Configurează o casă smart cu iluminat, climat, securitate și energie. Comparăm KNX, Matter și soluțiile wireless înainte de proiectare.",
    keywords: ["casă smart", "casă inteligentă", "smart home", "automatizare locuință"],
    schemaType: "Service",
    serviceType: "Proiectare și implementare casă smart",
    ogImage: "/images/projects/casa-inteligenta-brasov-interactive.png",
    sections: [
      {
        title: "Ce înseamnă o casă inteligentă bine proiectată",
        paragraphs: [
          "O casă smart nu este o colecție de aplicații. Funcțiile importante trebuie să rămână clare, predictibile și ușor de folosit de toată familia.",
          "Pornim de la camere, circuite și instalații. Abia apoi alegem interfețele și tehnologiile potrivite bugetului și etapei construcției.",
        ],
        subsections: [
          {
            title: "Control local",
            paragraphs: [
              "Lumina, climatul și accesul trebuie să poată fi folosite simplu și fără telefon.",
            ],
          },
          {
            title: "Control din aplicație",
            paragraphs: [
              "Aplicația completează comenzile locale cu acces la distanță, notificări și monitorizare.",
            ],
          },
        ],
      },
      {
        title: "Funcțiile care aduc valoare în fiecare zi",
        paragraphs: ["Selectăm funcțiile după impact, nu după numărul de dispozitive conectate."],
        bullets: [
          "Iluminat și scene",
          "Încălzire și răcire pe zone",
          "Jaluzele și protecție solară",
          "Alarmă și acces",
          "Măsurarea energiei",
          "Control vocal opțional",
        ],
      },
      {
        title: "KNX, Matter sau automatizare wireless",
        paragraphs: [
          "KNX este potrivit infrastructurilor noi și proiectelor cu multe instalații. Matter, Zigbee și Wi-Fi pot fi eficiente în apartamente, renovări și extinderi controlate.",
          "O arhitectură hibridă poate păstra funcțiile esențiale pe infrastructură profesională și integra interfețele consumer numai acolo unde aduc flexibilitate.",
        ],
      },
      {
        title: "De la plan la punerea în funcțiune",
        paragraphs: [
          "Procesul include cerințe, proiectare, ofertare, instalare, programare, testare, instruire și documentație pentru mentenanță.",
        ],
        bullets: [
          "Încarcă planul",
          "Confirmă funcțiile pe camere",
          "Primește estimarea",
          "Validează proiectul tehnic",
          "Implementare și teste",
        ],
      },
    ],
    faq: [
      {
        question: "Cât costă o casă smart?",
        answer:
          "Costul depinde de suprafață, numărul circuitelor, finisaje și integrări. Kiturile oferă un interval orientativ, iar oferta finală necesită planul și verificarea instalațiilor.",
      },
      {
        question: "Este obligatoriu KNX?",
        answer:
          "Nu. KNX este recomandat când proiectul cere infrastructură robustă și scalabilă. Pentru alte locuințe, Matter, Zigbee, Wi-Fi sau o soluție hibridă pot fi mai potrivite.",
      },
      {
        question: "Casa funcționează dacă internetul cade?",
        answer:
          "Funcțiile esențiale pot fi proiectate să funcționeze local. Comenzile vocale și anumite servicii cloud pot fi indisponibile temporar.",
      },
      {
        question: "Când trebuie început proiectul?",
        answer:
          "Ideal înainte de definitivarea instalației electrice și HVAC. În renovări, începem cu un audit al infrastructurii existente.",
      },
    ],
    related: [
      {
        label: "Automatizare casă",
        description: "Etapele tehnice de la cablare la programare.",
        href: "/automatizare-casa",
      },
      {
        label: "Alege un kit",
        description: "Estimări orientative pe tip de clădire.",
        href: "/kituri",
      },
      {
        label: "Încarcă planul",
        description: "Configurează funcțiile pe fiecare cameră.",
        href: "/configurator-pe-plan",
      },
    ],
  },
  "automatizare-casa": {
    slug: "automatizare-casa",
    eyebrow: "Pagină pilon · Automatizare casă",
    title: "Automatizarea casei începe înainte de alegerea produselor.",
    description:
      "Planificăm cablarea, tablourile, senzorii și logica funcțională pentru o locuință ușor de folosit și întreținut.",
    seoTitle: "Automatizare casă și automatizare locuință: ghid de proiect | N3XO",
    seoDescription:
      "Etapele unei automatizări de casă: audit, proiect electric, KNX sau wireless, instalare, programare, testare și mentenanță.",
    keywords: [
      "automatizare casă",
      "automatizare locuință",
      "automatizări smart home",
      "proiect casă inteligentă",
    ],
    schemaType: "Service",
    serviceType: "Automatizare locuință",
    sections: [
      {
        title: "Cerințe și scenarii",
        paragraphs: [
          "Stabilim ce trebuie să facă sistemul în fiecare cameră, cine îl folosește și ce comportamente trebuie să rămână locale.",
        ],
        subsections: [
          {
            title: "Construcție nouă",
            paragraphs: [
              "Putem coordona traseele, dozele, tablourile și instalațiile înainte de finisaje.",
            ],
          },
          {
            title: "Renovare",
            paragraphs: [
              "Audităm instalația și alegem intervențiile cu raport bun între rezultat și complexitate.",
            ],
          },
        ],
      },
      {
        title: "Proiect electric și automatizare",
        paragraphs: [
          "Automatizarea trebuie coordonată cu distribuția electrică, HVAC, securitatea și rețeaua. Lipsa coordonării produce costuri și compromisuri în șantier.",
        ],
        bullets: [
          "Circuite și sarcini",
          "Doze și trasee",
          "Tablouri și protecții",
          "Rețea și alimentări",
          "Interfețe HVAC",
        ],
      },
      {
        title: "Instalare, programare și testare",
        paragraphs: [
          "După montaj, fiecare funcție este parametrizată și testată. Scenariile se ajustează în clădire, apoi sunt documentate și predate.",
        ],
        subsections: [
          {
            title: "Teste funcționale",
            paragraphs: [
              "Verificăm comenzile locale, scenariile, alarmele și revenirea după întreruperea alimentării.",
            ],
          },
          {
            title: "Documentație",
            paragraphs: [
              "Păstrăm configurațiile, descrierea funcțiilor și informațiile necesare intervențiilor ulterioare.",
            ],
          },
        ],
      },
    ],
    faq: [
      {
        question: "Se poate automatiza o casă deja construită?",
        answer:
          "Da, după un audit al instalației și rețelei. Soluția poate combina echipamente wireless cu intervenții cablate în zonele justificate.",
      },
      {
        question: "Automatizarea înlocuiește instalația electrică?",
        answer:
          "Nu. Automatizarea comandă și coordonează instalațiile, dar protecțiile, dimensionarea și execuția electrică rămân fundamentale.",
      },
      {
        question: "Pot implementa proiectul în etape?",
        answer:
          "Da, dacă infrastructura și arhitectura sunt pregătite pentru extindere. Etapizarea trebuie decisă înainte de alegerea modulelor.",
      },
    ],
    related: [
      {
        label: "Casă smart",
        description: "Funcții și tehnologii pentru locuință.",
        href: "/casa-smart",
      },
      {
        label: "Serviciul de proiectare",
        description: "Documentația necesară implementării.",
        href: "/servicii/proiectare",
      },
    ],
  },
  "smart-home": {
    slug: "smart-home",
    eyebrow: "Pagină pilon · Smart home",
    title: "Smart home fără dependență de o singură aplicație.",
    description:
      "Comparăm ecosistemele, protocoalele și controlul local pentru a construi o experiență unitară.",
    seoTitle: "Smart home: Google Home, Apple Home, Alexa și Matter | N3XO",
    seoDescription:
      "Ghid smart home despre ecosisteme, control local, Matter, Thread, Zigbee, Google Home, Apple Home, Alexa și Home Assistant.",
    keywords: ["smart home", "Google Home", "Apple Home", "Alexa", "Matter", "Home Assistant"],
    schemaType: "Service",
    serviceType: "Integrare ecosisteme smart home",
    sections: [
      {
        title: "Ecosistemul este interfața, nu întreaga casă",
        paragraphs: [
          "Google Home, Apple Home și Alexa oferă aplicații și control vocal. Infrastructura de iluminat, climat și securitate trebuie proiectată separat, cu limite clare.",
        ],
        subsections: [
          {
            title: "Control local",
            paragraphs: [
              "Comenzile de bază rămân disponibile la perete și prin sistemul principal.",
            ],
          },
          {
            title: "Servicii cloud",
            paragraphs: [
              "Controlul vocal și accesul la distanță pot depinde de internet și de conturile furnizorului.",
            ],
          },
        ],
      },
      {
        title: "Protocoale și roluri",
        paragraphs: [
          "Matter urmărește interoperabilitatea, Thread este o rețea mesh IP, Zigbee deservește numeroase dispozitive cu consum redus, iar KNX este o infrastructură profesională pentru clădiri.",
        ],
        bullets: ["Matter", "Thread", "Zigbee", "Wi-Fi", "KNX", "IP"],
      },
      {
        title: "O singură experiență pentru utilizator",
        paragraphs: [
          "Selectăm ce funcții sunt expuse în aplicația preferată și păstrăm diagnosticul tehnic separat. Astfel, utilizatorul vede comenzi simple, iar sistemul rămâne serviceabil.",
        ],
      },
    ],
    faq: [
      {
        question: "Pot combina Google Home și Apple Home?",
        answer:
          "Unele dispozitive Matter pot fi partajate între ecosisteme, dar funcțiile exacte diferă. Configurația se verifică pe modelele și versiunile folosite.",
      },
      {
        question: "Home Assistant este obligatoriu?",
        answer:
          "Nu. Este util pentru control local și integrări avansate, însă introduce responsabilități de administrare, backup și actualizare.",
      },
      {
        question: "Matter garantează orice integrare?",
        answer:
          "Nu. Matter definește categorii și funcții, dar produsul poate implementa doar o parte dintre ele. Compatibilitatea se validează concret.",
      },
    ],
    related: [
      {
        label: "Comparația ecosistemelor",
        description: "Google Home, Apple Home, Alexa și Home Assistant.",
        href: "/integrari-smart-home",
      },
      {
        label: "Ghid Matter",
        description: "Standard, Thread și bridge-uri.",
        href: "/resurse/ghid-matter",
      },
    ],
  },
  "automatizare-knx": {
    slug: "automatizare-knx",
    eyebrow: "Pagină pilon · KNX",
    title: "Automatizare KNX pentru case și clădiri proiectate pe termen lung.",
    description:
      "Topologie, tablouri, proiect ETS și integrarea instalațiilor într-un standard deschis, multi-producător.",
    seoTitle: "Automatizare KNX pentru casă și clădiri | Proiectare N3XO",
    seoDescription:
      "Proiectare și programare KNX: topologie, tablouri, ETS, iluminat, HVAC, jaluzele, energie și integrare smart home.",
    keywords: ["KNX", "automatizare KNX", "casă KNX", "programare KNX", "proiect KNX"],
    schemaType: "Service",
    serviceType: "Proiectare și programare KNX",
    ogImage: "/images/projects/casa-inteligenta-cluj-technical.png",
    sections: [
      {
        title: "De ce KNX",
        paragraphs: [
          "KNX distribuie funcțiile între dispozitive și permite selecția mai multor producători. Este potrivit când stabilitatea, extinderea și documentația sunt prioritare.",
        ],
        bullets: [
          "Standard deschis",
          "Funcționare distribuită",
          "Multi-producător",
          "Integrare instalații",
          "Diagnostic și backup",
        ],
      },
      {
        title: "Ce proiectăm",
        paragraphs: [
          "Definim topologia, sursele, segmentele, adresele de grup, tablourile, funcțiile și interfețele cu DALI, HVAC, energie sau platforme IP.",
        ],
        subsections: [
          {
            title: "În tablou",
            paragraphs: ["Actuatoare, surse, gateway-uri, protecții și rezerve pentru extindere."],
          },
          {
            title: "În camere",
            paragraphs: [
              "Senzori, termostate, butoane și panouri alese după funcție și ergonomie.",
            ],
          },
        ],
      },
      {
        title: "ETS și punerea în funcțiune",
        paragraphs: [
          "Programarea ETS urmărește descrierea funcțională. După teste, proiectul, backupul și documentația se predau conform contractului.",
        ],
      },
    ],
    faq: [
      {
        question: "KNX funcționează fără internet?",
        answer:
          "Da, funcțiile KNX de bază pot comunica local pe magistrală. Accesul la distanță și integrarea cloud pot necesita rețea sau gateway-uri.",
      },
      {
        question: "Pot combina mai multe mărci KNX?",
        answer:
          "Da, acesta este un avantaj al standardului. Fiecare aplicație și funcție trebuie totuși verificată în documentația producătorului.",
      },
      {
        question: "KNX se poate integra cu Google Home sau Apple Home?",
        answer:
          "Da, prin gateway-uri sau platforme compatibile selectate pentru proiect. Integrarea nu este implicită pentru fiecare dispozitiv.",
      },
      {
        question: "Este KNX potrivit pentru renovare?",
        answer:
          "Poate fi, dar traseele și tabloul trebuie evaluate. În anumite renovări, o arhitectură hibridă este mai proporțională.",
      },
    ],
    related: [
      {
        label: "Soluția KNX",
        description: "Beneficii și kituri recomandate.",
        href: "/solutii/automatizare-knx",
      },
      {
        label: "Ghid KNX",
        description: "Principii introductive ale standardului.",
        href: "/resurse/ghid-knx",
      },
      {
        label: "Programare KNX",
        description: "Procesul ETS și documentația.",
        href: "/servicii/programare-knx",
      },
    ],
  },
  "integrari-smart-home": {
    slug: "integrari-smart-home",
    eyebrow: "Pagină pilon · Integrări",
    title: "Google Home, Apple Home, Alexa și Home Assistant în același proiect.",
    description:
      "Alegem rolul fiecărei platforme și evităm dublarea comenzilor, automatizărilor și dependențelor cloud.",
    seoTitle: "Google Home, Apple Home, Alexa și Home Assistant | Integrare N3XO",
    seoDescription:
      "Integrare smart home pentru Google Home, Apple Home, Amazon Alexa, Matter și Home Assistant, cu control local și compatibilități verificate.",
    keywords: [
      "Google Home",
      "Apple Home",
      "Amazon Alexa",
      "Home Assistant",
      "integrare smart home",
      "Matter",
    ],
    schemaType: "Service",
    serviceType: "Integrare platforme smart home",
    sections: [
      {
        title: "Alegem platforma după utilizatori",
        paragraphs: [
          "Telefoanele folosite, controlul vocal, confidențialitatea, automatizările locale și administrarea pe termen lung influențează alegerea.",
        ],
        subsections: [
          {
            title: "Google Home",
            paragraphs: [
              "Potrivit familiilor care folosesc Android, Google Nest și rutine vocale.",
            ],
          },
          {
            title: "Apple Home",
            paragraphs: ["Experiență integrată cu iPhone, iPad, Apple Watch și huburi Apple."],
          },
          {
            title: "Amazon Alexa",
            paragraphs: ["Control vocal și rutine prin dispozitive și servicii compatibile."],
          },
          {
            title: "Home Assistant",
            paragraphs: [
              "Control local, dashboarduri și integrări avansate care necesită administrare tehnică.",
            ],
          },
        ],
      },
      {
        title: "Matter și gateway-urile",
        paragraphs: [
          "Matter poate simplifica expunerea unor funcții, însă instalațiile KNX, HVAC sau securitate pot necesita gateway-uri specializate și testare bidirecțională.",
        ],
      },
      {
        title: "Reguli pentru o integrare stabilă",
        paragraphs: [
          "Păstrăm o singură sursă pentru fiecare automatizare importantă, documentăm conturile și dependențele și evităm ca funcțiile critice să depindă exclusiv de cloud.",
        ],
        bullets: [
          "Control local pentru funcții esențiale",
          "Conturi individuale",
          "Backup și documentație",
          "Testarea întreruperilor",
          "Permisiuni minime",
        ],
      },
    ],
    faq: [
      {
        question: "Pot folosi simultan Siri și Google Assistant?",
        answer:
          "Uneori da, prin Matter sau un gateway compatibil. Funcțiile disponibile și sincronizarea stărilor trebuie testate pe configurația concretă.",
      },
      {
        question: "Alexa funcționează cu KNX?",
        answer:
          "Poate funcționa printr-un gateway sau o platformă de integrare. Nu există compatibilitate directă universală între toate produsele KNX și Alexa.",
      },
      {
        question: "Care platformă este cea mai bună?",
        answer:
          "Nu există una universală. Alegerea depinde de dispozitivele familiei, cerințele de control local, mentenanță și funcțiile proiectului.",
      },
    ],
    related: [
      {
        label: "Google Home",
        description: "Rolul platformei în proiect.",
        href: "/resurse/google-home",
      },
      {
        label: "Apple Home",
        description: "Integrarea ecosistemului Apple.",
        href: "/resurse/apple-home",
      },
      {
        label: "Home Assistant",
        description: "Control local și scenarii avansate.",
        href: "/resurse/home-assistant",
      },
    ],
  },
  servicii: {
    slug: "servicii",
    eyebrow: "Servicii N3XO",
    title: "De la audit la mentenanța sistemului smart.",
    description:
      "Servicii tehnice coordonate pentru proiectarea, instalarea, programarea și exploatarea automatizărilor.",
    seoTitle: "Servicii automatizare casă și KNX | N3XO Smart Buildings",
    seoDescription:
      "Consultanță, audit smart home, proiectare, instalare, programare KNX, punere în funcțiune, mentenanță și service.",
    keywords: ["servicii automatizare casă", "proiectare KNX", "instalare smart home"],
    sections: [
      {
        title: "Un flux tehnic complet",
        paragraphs: [
          "Poți contracta o etapă clară sau întregul proces. Responsabilitățile și livrabilele fiecărei faze sunt stabilite înainte de lucru.",
        ],
      },
    ],
    related: [
      {
        label: "Consultanță",
        description: "Cerințe, buget și arhitectură.",
        href: "/servicii/consultanta",
      },
      {
        label: "Proiectare",
        description: "Planuri, scheme și descriere funcțională.",
        href: "/servicii/proiectare",
      },
      {
        label: "Programare KNX",
        description: "ETS, teste și documentație.",
        href: "/servicii/programare-knx",
      },
      {
        label: "Mentenanță",
        description: "Backup, verificări și schimbări controlate.",
        href: "/servicii/mentenanta",
      },
    ],
  },
  solutii: {
    slug: "solutii",
    eyebrow: "Soluții pe tip de clădire",
    title: "Soluția smart pornește de la clădire și utilizatori.",
    description:
      "Arhitecturi distincte pentru case, apartamente, blocuri, ospitalitate, securitate și energie.",
    seoTitle: "Soluții casă smart, KNX, securitate și energie | N3XO",
    seoDescription:
      "Soluții de automatizare pentru case, apartamente, blocuri, pensiuni și hoteluri: KNX, Matter, securitate și management energetic.",
    keywords: ["soluții casă smart", "automatizări clădiri", "sisteme KNX"],
    sections: [
      {
        title: "Alegerea se justifică prin proiect",
        paragraphs: [
          "Tipul clădirii, instalațiile și cerințele de operare determină tehnologia, nivelul de integrare și etapele de implementare.",
        ],
      },
    ],
    related: [
      {
        label: "Case Smart",
        description: "Confort, securitate și energie pentru locuințe.",
        href: "/solutii/case-smart",
      },
      {
        label: "Apartamente Smart",
        description: "Automatizare compactă pentru spații finisate sau noi.",
        href: "/solutii/apartamente-smart",
      },
      {
        label: "Blocuri Smart",
        description: "Acces, spații comune și energie.",
        href: "/solutii/blocuri-smart",
      },
      {
        label: "Pensiuni și hoteluri",
        description: "Control pe camere și operare eficientă.",
        href: "/solutii/pensiuni-hoteluri-smart",
      },
      {
        label: "Automatizare KNX",
        description: "Infrastructură profesională și documentată.",
        href: "/solutii/automatizare-knx",
      },
      {
        label: "Securitate",
        description: "Alarmă, acces și evenimente integrate.",
        href: "/solutii/securitate",
      },
    ],
  },
  resurse: {
    slug: "resurse",
    eyebrow: "Resurse tehnice",
    title: "Ghiduri pentru decizii smart documentate.",
    description:
      "Explicații despre protocoale, ecosisteme și compatibilități, înainte de proiectare și ofertare.",
    seoTitle: "Ghiduri smart home, KNX și Matter | N3XO",
    seoDescription:
      "Ghiduri despre KNX, Matter, Google Home, Apple Home, Alexa, Home Assistant și compatibilități smart home.",
    keywords: ["ghid smart home", "ghid KNX", "ghid Matter"],
    sections: [
      {
        title: "Începe cu întrebarea corectă",
        paragraphs: [
          "Nu căutăm produsul universal, ci arhitectura potrivită clădirii, instalațiilor și modului de administrare.",
        ],
      },
    ],
    related: [
      {
        label: "Ghid KNX",
        description: "Infrastructură profesională și ETS.",
        href: "/resurse/ghid-knx",
      },
      {
        label: "Ghid Matter",
        description: "Interoperabilitate, Thread și bridge-uri.",
        href: "/resurse/ghid-matter",
      },
      {
        label: "Compatibilități",
        description: "Cum validăm integrarea.",
        href: "/resurse/compatibilitati",
      },
    ],
  },
  legal: {
    slug: "legal",
    eyebrow: "Informații legale",
    title: "Transparență pentru date, documente și utilizarea platformei.",
    description:
      "Politicile care explică utilizarea serviciului, prelucrarea datelor și protecția planurilor încărcate.",
    seoTitle: "Informații legale și protecția datelor | N3XO",
    seoDescription:
      "Termeni, confidențialitate, cookies, GDPR, retenția datelor și securitatea documentelor în N3XO Smart Buildings.",
    sections: [
      {
        title: "Documente actualizate",
        paragraphs: [
          "Politicile sunt versiuni inițiale adaptate platformei și trebuie corelate cu datele finale ale entității contractante și cu furnizorii utilizați înainte de lansarea comercială.",
        ],
      },
    ],
    related: [
      {
        label: "Confidențialitate",
        description: "Datele prelucrate și drepturile tale.",
        href: "/legal/politica-de-confidentialitate",
      },
      {
        label: "Cum protejăm planurile",
        description: "Acces, stocare și audit.",
        href: "/legal/cum-protejam-planurile-incarcate",
      },
      {
        label: "Termeni",
        description: "Regulile de utilizare a platformei.",
        href: "/legal/termeni-si-conditii",
      },
    ],
  },
  "automatizari-smart": {
    slug: "automatizari-smart",
    eyebrow: "Acoperire regională",
    title: "Automatizări smart în Cluj și Transilvania.",
    description:
      "Proiectare la distanță și intervenții planificate pentru locuințe și clădiri rezidențiale mici.",
    seoTitle: "Automatizări smart în Cluj și Transilvania | N3XO",
    seoDescription:
      "Servicii de automatizare casă, KNX și smart home în Cluj-Napoca, Brașov și proiecte selectate din Transilvania.",
    keywords: ["automatizări smart Cluj", "smart home Transilvania", "automatizare casă Brașov"],
    sections: [
      {
        title: "Acoperirea se confirmă înainte de ofertă",
        paragraphs: [
          "Disponibilitatea pentru vizită, instalare și service depinde de localitate, etapa proiectului și calendar. Nu sugerăm existența unui sediu local acolo unde nu este declarat.",
        ],
      },
    ],
    related: [
      {
        label: "Cluj-Napoca",
        description: "Case, apartamente și blocuri smart.",
        href: "/automatizari-smart/cluj-napoca",
      },
      {
        label: "Brașov",
        description: "Case, pensiuni și eficiență energetică.",
        href: "/automatizari-smart/brasov",
      },
      {
        label: "Transilvania",
        description: "Coordonare regională pentru proiecte selectate.",
        href: "/automatizari-smart/transilvania",
      },
    ],
  },
};

export const localPages: Record<string, PublicContentPage> = {
  "cluj-napoca": {
    slug: "cluj-napoca",
    eyebrow: "Automatizări smart · Cluj-Napoca",
    title: "Casă smart și automatizări KNX în Cluj-Napoca.",
    description:
      "Consultanță, proiectare, instalare și punere în funcțiune pentru case, apartamente și blocuri din Cluj-Napoca.",
    seoTitle: "Casă smart Cluj-Napoca și automatizări KNX | N3XO",
    seoDescription:
      "Automatizare casă în Cluj-Napoca: KNX, Matter, Google Home, Apple Home, securitate și energie, de la plan la punere în funcțiune.",
    keywords: [
      "casă smart Cluj",
      "casă inteligentă Cluj-Napoca",
      "automatizări KNX Cluj",
      "smart home Cluj",
    ],
    schemaType: "Service",
    serviceType: "Automatizări smart home în Cluj-Napoca",
    ogImage: "/images/projects/casa-inteligenta-cluj-technical.png",
    sections: [
      {
        title: "Proiecte rezidențiale în Cluj-Napoca",
        paragraphs: [
          "Pentru construcții noi coordonăm automatizarea cu instalația electrică și HVAC. Pentru apartamente și renovări începem cu auditul infrastructurii disponibile.",
        ],
        subsections: [
          {
            title: "Case și vile",
            paragraphs: [
              "KNX sau arhitecturi hibride pentru iluminat, climat, jaluzele, acces și energie.",
            ],
          },
          {
            title: "Apartamente",
            paragraphs: [
              "Soluții compacte, Matter, Zigbee sau Wi-Fi, cu intervenții proporționale.",
            ],
          },
          {
            title: "Blocuri mici",
            paragraphs: ["Acces, videointerfon, iluminat comun, parcare și monitorizare tehnică."],
          },
        ],
      },
      {
        title: "Cum începe colaborarea",
        paragraphs: [
          "Trimite planul și stadiul proiectului. Stabilim dacă este suficientă o discuție tehnică, un audit la locație sau proiectarea completă.",
        ],
        bullets: [
          "Plan PDF/JPG/PNG",
          "Stadiul instalațiilor",
          "Funcții prioritare",
          "Calendar estimat",
        ],
      },
      {
        title: "Contact local",
        paragraphs: [
          "N3XO are contact operațional în Cluj-Napoca. Vizitele și intervențiile se programează după analiza inițială a proiectului.",
        ],
      },
    ],
    faq: [
      {
        question: "Faceți deplasări în Cluj-Napoca și împrejurimi?",
        answer:
          "Da, pentru proiecte acceptate și după analiza inițială. Programarea și eventualele costuri de deplasare sunt comunicate înainte.",
      },
      {
        question: "Puteți prelua instalația începută de altă echipă?",
        answer:
          "Da, după un audit al documentației, cablării și configurațiilor existente. Nu promitem integrarea înainte de verificare.",
      },
      {
        question: "Lucrați cu arhitectul și electricianul beneficiarului?",
        answer:
          "Da. Coordonarea cu arhitectura, electricul și HVAC este recomandată pentru evitarea modificărilor târzii.",
      },
    ],
    related: [
      {
        label: "Proiect demonstrativ Cluj",
        description: "Casă inteligentă cu circuite vizibile.",
        href: "/proiecte/casa-inteligenta-cluj",
      },
      {
        label: "Configurează casa",
        description: "Pornește de la plan și camere.",
        href: "/configurator-pe-plan",
      },
    ],
  },
  brasov: {
    slug: "brasov",
    eyebrow: "Automatizări smart · Brașov",
    title: "Automatizare pentru case și pensiuni din Brașov.",
    description:
      "Proiecte care prioritizează climatul pe zone, eficiența energetică și operarea simplă pentru locuințe și spații de cazare.",
    seoTitle: "Casă smart Brașov și automatizare pensiune | N3XO",
    seoDescription:
      "Proiectare smart home în Brașov pentru case și pensiuni: climat, energie, securitate, KNX și integrări Matter. Vizite programate.",
    keywords: [
      "casă smart Brașov",
      "automatizare casă Brașov",
      "automatizare pensiune Brașov",
      "KNX Brașov",
    ],
    schemaType: "Service",
    serviceType: "Proiectare smart home în Brașov",
    ogImage: "/images/projects/casa-inteligenta-brasov-interactive.png",
    sections: [
      {
        title: "Climat și consum pentru zona Brașov",
        paragraphs: [
          "Casele și spațiile de cazare au nevoie de control pe zone, protecție la îngheț, monitorizarea surselor și scenarii de neocupare. Soluția se adaptează instalației termice reale.",
        ],
        subsections: [
          {
            title: "Case",
            paragraphs: [
              "Încălzire, răcire, umbrire și energie coordonate cu prezența și programul familiei.",
            ],
          },
          {
            title: "Pensiuni",
            paragraphs: [
              "Control pe cameră, economisire la neocupare, acces și alarme tehnice pentru operator.",
            ],
          },
        ],
      },
      {
        title: "Mod de lucru",
        paragraphs: [
          "Analiza și proiectarea pot începe la distanță. Vizita, instalarea și punerea în funcțiune se programează în funcție de proiect; această pagină nu indică existența unui sediu N3XO în Brașov.",
        ],
        bullets: [
          "Analiză planuri",
          "Coordonare cu proiectanții",
          "Vizită programată",
          "Teste la locație",
        ],
      },
    ],
    faq: [
      {
        question: "Aveți sediu în Brașov?",
        answer:
          "Nu declarăm un sediu în Brașov. Proiectarea poate începe la distanță, iar vizitele și intervențiile se programează pentru proiectele acceptate.",
      },
      {
        question: "Automatizați pensiuni existente?",
        answer:
          "Da, după auditarea accesului, HVAC, instalației electrice și a operațiunilor. Etapizarea este posibilă dacă infrastructura permite.",
      },
      {
        question: "Puteți integra pompa de căldură și fotovoltaicele?",
        answer:
          "Posibilitatea depinde de interfețele oferite de modele, de schema instalației și de obiectivele de control. Verificăm documentația înainte de ofertă.",
      },
    ],
    related: [
      {
        label: "Proiect demonstrativ Brașov",
        description: "Climat, energie solară și baterie.",
        href: "/proiecte/casa-inteligenta-brasov",
      },
      {
        label: "Kit Pensiune Smart",
        description: "Dimensionare după camere și spații comune.",
        href: "/kituri",
      },
    ],
  },
  transilvania: {
    slug: "transilvania",
    eyebrow: "Automatizări smart · Transilvania",
    title: "Coordonare regională pentru proiecte smart selectate.",
    description:
      "Proiectare la distanță și etape la locație pentru case, blocuri mici, pensiuni și hoteluri boutique din Transilvania.",
    seoTitle: "Automatizări smart home și KNX în Transilvania | N3XO",
    seoDescription:
      "Proiectare smart home și KNX pentru proiecte selectate din Transilvania: case, blocuri, pensiuni și hoteluri, cu intervenții programate.",
    keywords: [
      "smart home Transilvania",
      "automatizări KNX Transilvania",
      "automatizare hotel",
      "automatizare pensiune",
    ],
    schemaType: "Service",
    serviceType: "Proiectare automatizări smart în Transilvania",
    sections: [
      {
        title: "Ce proiecte preluăm regional",
        paragraphs: [
          "Prioritizăm proiectele în care proiectarea coordonată și punerea în funcțiune justifică deplasările: case noi, clădiri cu KNX, blocuri mici și ospitalitate.",
        ],
        bullets: [
          "Case noi și renovări complete",
          "Blocuri și spații comune",
          "Pensiuni și hoteluri boutique",
          "Modernizări KNX documentate",
        ],
      },
      {
        title: "Etape la distanță și la locație",
        paragraphs: [
          "Cerințele, planurile și o parte din coordonare se pot gestiona online. Auditul, testele și punerea în funcțiune se programează la locație când sunt necesare.",
        ],
        subsections: [
          {
            title: "La distanță",
            paragraphs: [
              "Analiză planuri, concept, coordonare, revizii și pregătirea documentației.",
            ],
          },
          {
            title: "La locație",
            paragraphs: ["Audit, verificări de cablare, teste, punere în funcțiune și instruire."],
          },
        ],
      },
      {
        title: "Acoperire confirmată individual",
        paragraphs: [
          "Disponibilitatea și costurile logistice se stabilesc pentru fiecare proiect. Nu pretindem prezență permanentă în fiecare localitate menționată de aria regională.",
        ],
      },
    ],
    faq: [
      {
        question: "În ce județe lucrați?",
        answer:
          "Analizăm proiecte din Transilvania, inclusiv Cluj, Brașov și județele apropiate. Acceptarea depinde de tipul proiectului, etapă și calendar.",
      },
      {
        question: "Proiectarea se poate face integral online?",
        answer:
          "O parte importantă da, pe baza planurilor și coordonării cu echipa locală. Auditul sau punerea în funcțiune pot necesita prezență la locație.",
      },
      {
        question: "Puteți lucra cu instalatorul local?",
        answer:
          "Da, dacă responsabilitățile, standardele de execuție și documentarea sunt agreate înainte de lucrări.",
      },
    ],
  },
};

export const guidePages: Record<string, PublicContentPage> = {
  "wifi-matter-sau-knx": {
    slug: "wifi-matter-sau-knx",
    eyebrow: "Ghid de alegere",
    title: "Wi-Fi, Matter sau KNX pentru casa ta?",
    description:
      "Alegerea depinde de construcție, numărul de instalații, funcționarea locală și mentenanța dorită.",
    seoTitle: "Wi-Fi, Matter sau KNX pentru o casă smart? | Ghid N3XO",
    seoDescription:
      "Compară Wi-Fi, Matter, Thread, Zigbee și KNX pentru casă smart: cablare, control local, cost, extindere și mentenanță.",
    keywords: ["Wi-Fi sau KNX", "Matter sau KNX", "sistem casă smart"],
    contentType: "article",
    publishedTime: "2026-08-04",
    schemaType: "WebPage",
    sections: [
      {
        title: "Întrebarea nu are un răspuns universal",
        paragraphs: [
          "O renovare de apartament și o casă nouă cu HVAC complex nu au aceleași constrângeri. Comparația trebuie făcută pe funcții și ciclul de viață al proiectului.",
        ],
        subsections: [
          {
            title: "Wi-Fi",
            paragraphs: [
              "Util pentru dispozitive punctuale și renovări, dar cere o rețea corectă și administrarea mai multor servicii.",
            ],
          },
          {
            title: "Matter și Thread",
            paragraphs: [
              "Simplifică anumite integrări consumer, cu funcții care diferă între categorii și produse.",
            ],
          },
          {
            title: "KNX",
            paragraphs: [
              "Infrastructură profesională, cablată și distribuită, potrivită proiectelor noi și complexe.",
            ],
          },
        ],
      },
      {
        title: "Criterii de decizie",
        paragraphs: [
          "Compară funcționarea fără internet, disponibilitatea comenzilor locale, extinderea, backupul, service-ul și dependența de producător.",
        ],
        bullets: [
          "Construcție nouă sau renovare",
          "Număr de circuite",
          "HVAC și energie",
          "Control local",
          "Buget inițial și mentenanță",
        ],
      },
      {
        title: "Când alegem o soluție hibridă",
        paragraphs: [
          "Funcțiile esențiale pot rămâne pe KNX sau controlere locale, în timp ce Matter și platformele vocale oferă interfețe suplimentare.",
        ],
      },
    ],
    faq: [
      {
        question: "Matter înlocuiește KNX?",
        answer:
          "Nu. Matter și KNX rezolvă probleme diferite. Matter urmărește interoperabilitatea anumitor dispozitive consumer, iar KNX este o infrastructură de automatizare a clădirii.",
      },
      {
        question: "Wi-Fi este suficient pentru un apartament?",
        answer:
          "Poate fi, dacă funcțiile, rețeaua și numărul de dispozitive sunt gestionabile. Pentru control local și senzori pot fi utile și Matter/Thread sau Zigbee.",
      },
      {
        question: "O casă poate combina KNX cu Matter și Wi-Fi?",
        answer:
          "Da, dacă interfețele sunt alese și documentate corect. Funcțiile esențiale pot rămâne pe infrastructura locală, iar ecosistemele consumer pot completa controlul și interfața utilizatorului.",
      },
    ],
    related: [
      {
        label: "Configurează proiectul",
        description: "Alege funcțiile înainte de tehnologie.",
        href: "/configurator-pe-plan",
      },
    ],
  },
  "google-home-apple-home-alexa": {
    slug: "google-home-apple-home-alexa",
    eyebrow: "Ghid ecosisteme",
    title: "Google Home, Apple Home sau Amazon Alexa?",
    description:
      "Comparație după dispozitivele familiei, control vocal, automatizări și dependența de cloud.",
    seoTitle: "Google Home vs Apple Home vs Alexa | Ghid smart home N3XO",
    seoDescription:
      "Compară Google Home, Apple Home și Amazon Alexa pentru casa smart: Matter, control vocal, huburi, permisiuni și integrare KNX.",
    keywords: ["Google Home vs Apple Home", "Alexa smart home", "Apple Home", "Google Home"],
    contentType: "article",
    publishedTime: "2026-08-04",
    sections: [
      {
        title: "Alege după ecosistemul familiei",
        paragraphs: [
          "Telefonul, boxele, televizoarele și conturile deja folosite contează mai mult decât o listă generică de compatibilități.",
        ],
        subsections: [
          {
            title: "Google Home",
            paragraphs: [
              "Potrivit utilizatorilor Android și dispozitivelor Google Nest, cu rutine și control vocal.",
            ],
          },
          {
            title: "Apple Home",
            paragraphs: ["Integrare cu dispozitivele Apple, automatizări și control prin Siri."],
          },
          {
            title: "Amazon Alexa",
            paragraphs: [
              "Gamă largă de skill-uri și comenzi vocale, cu disponibilitate dependentă de regiune și servicii.",
            ],
          },
        ],
      },
      {
        title: "Matter schimbă comparația",
        paragraphs: [
          "Matter poate permite aceluiași dispozitiv să fie controlat din mai multe ecosisteme, dar nu uniformizează toate funcțiile și automatizările proprietare.",
        ],
      },
      {
        title: "Păstrează infrastructura separată",
        paragraphs: [
          "Iluminatul și climatul nu trebuie să devină inutilizabile dacă schimbi telefonul, contul sau platforma vocală.",
        ],
      },
    ],
    faq: [
      {
        question: "Pot schimba ecosistemul mai târziu?",
        answer:
          "Da, mai ales dacă infrastructura și dispozitivele folosesc standarde deschise sau gateway-uri documentate. Automatizările proprietare pot necesita refacere.",
      },
      {
        question: "Care funcționează cel mai bine cu KNX?",
        answer:
          "Toate pot fi integrate prin gateway-uri potrivite. Calitatea depinde de funcțiile expuse și de implementarea gateway-ului, nu doar de numele platformei.",
      },
    ],
  },
  "home-assistant-pentru-casa": {
    slug: "home-assistant-pentru-casa",
    eyebrow: "Ghid tehnic",
    title: "Home Assistant pentru o casă smart administrată local.",
    description:
      "Beneficii, responsabilități și arhitectura minimă pentru o integrare stabilă pe termen lung.",
    seoTitle: "Home Assistant pentru casă smart: beneficii și riscuri | N3XO",
    seoDescription:
      "Ghid Home Assistant: control local, hardware, backup, actualizări, integrări KNX, Matter și Zigbee pentru o casă smart stabilă.",
    keywords: ["Home Assistant casă", "Home Assistant KNX", "Home Assistant Matter"],
    contentType: "article",
    publishedTime: "2026-08-04",
    sections: [
      {
        title: "Ce aduce Home Assistant",
        paragraphs: [
          "Poate unifica dispozitive, dashboarduri și automatizări locale. Flexibilitatea este mare, dar platforma trebuie administrată ca un sistem tehnic, nu ca o aplicație instalată o dată.",
        ],
        bullets: [
          "Control local",
          "Dashboarduri",
          "Automatizări complexe",
          "Istoric și energie",
          "Integrări multiple",
        ],
      },
      {
        title: "Arhitectură și mentenanță",
        paragraphs: [
          "Alegem hardware stabil, backup automat, alimentare protejată și un plan de actualizare. Integrările comunitare sunt evaluate separat de cele oficiale.",
        ],
        subsections: [
          {
            title: "Backup",
            paragraphs: [
              "Configurația trebuie copiată într-o locație separată și testată periodic.",
            ],
          },
          {
            title: "Actualizări",
            paragraphs: [
              "Schimbările majore se citesc și se testează înainte de aplicarea într-o casă ocupată.",
            ],
          },
        ],
      },
      {
        title: "Relația cu KNX și Matter",
        paragraphs: [
          "Home Assistant poate orchestra și vizualiza, dar funcțiile esențiale pot rămâne distribuite în KNX sau în controlerele locale ale instalațiilor.",
        ],
      },
    ],
    faq: [
      {
        question: "Home Assistant funcționează fără cloud?",
        answer:
          "Multe funcții pot rula local. Integrările cu servicii vocale sau anumite produse pot depinde în continuare de cloud.",
      },
      {
        question: "Este potrivit pentru orice utilizator?",
        answer:
          "Este potrivit când există responsabilitate clară pentru administrare, backup și actualizări. Pentru proiecte fără suport tehnic poate fi necesară o soluție mai simplă.",
      },
    ],
  },
  "cost-automatizare-casa": {
    slug: "cost-automatizare-casa",
    eyebrow: "Ghid de buget",
    title: "Cât costă automatizarea unei case?",
    description:
      "Factorii care formează bugetul: circuite, instalații, aparataj, programare, montaj și documentație.",
    seoTitle: "Cât costă automatizarea unei case smart? | Buget orientativ N3XO",
    seoDescription:
      "Înțelege costul unei case smart: KNX sau wireless, număr de circuite, HVAC, securitate, energie, montaj și programare.",
    keywords: ["preț casă smart", "cost automatizare casă", "preț KNX casă"],
    contentType: "article",
    publishedTime: "2026-08-04",
    sections: [
      {
        title: "Prețul nu se calculează doar pe metru pătrat",
        paragraphs: [
          "Două case cu aceeași suprafață pot avea număr diferit de circuite, zone HVAC, jaluzele, nivel de aparataj și integrări.",
        ],
        bullets: [
          "Circuite de iluminat",
          "Zone de temperatură",
          "Jaluzele și motoare",
          "Securitate și acces",
          "Aparataj și panouri",
          "Integrare și programare",
        ],
      },
      {
        title: "Buget pe niveluri",
        paragraphs: [
          "Un kit de bază poate acoperi funcțiile prioritare. Nivelurile superioare adaugă senzori, integrare energetică, interfețe premium și redundanță. Intervalele din configurator sunt orientative, nu oferte ferme.",
        ],
        subsections: [
          {
            title: "Funcții prioritare",
            paragraphs: [
              "Iluminatul, climatul și umbrirea pot fi etapizate în jurul infrastructurii pregătite corect.",
            ],
          },
          {
            title: "Integrare extinsă",
            paragraphs: [
              "Securitatea, energia și interfețele premium adaugă echipamente, programare și testare.",
            ],
          },
        ],
      },
      {
        title: "Costul total de exploatare",
        paragraphs: [
          "Documentația, accesul la backup și componentele serviceabile reduc riscul intervențiilor costisitoare. Cel mai mic preț inițial nu este întotdeauna cel mai mic cost pe termen lung.",
        ],
      },
    ],
    faq: [
      {
        question: "Pot primi preț fără plan?",
        answer:
          "Poți primi un interval orientativ pe baza tipului clădirii. Pentru ofertă sunt necesare planul, funcțiile, condițiile de montaj și responsabilitățile de execuție.",
      },
      {
        question: "KNX este întotdeauna mai scump?",
        answer:
          "Investiția inițială poate fi mai mare, dar comparația trebuie să includă tabloul, cablarea, aparatajul, integrarea și mentenanța pe termen lung.",
      },
    ],
  },
};

export const blogPages: Record<string, PublicContentPage> = {
  "pregatirea-casei-pentru-automatizare": {
    slug: "pregatirea-casei-pentru-automatizare",
    eyebrow: "Blog · Proiectare",
    title: "Cum pregătești casa pentru automatizare înainte de cablare.",
    description:
      "Deciziile care trebuie coordonate cu arhitectul, electricianul și proiectantul HVAC înainte de finisaje.",
    seoTitle: "Pregătirea casei pentru automatizare înainte de instalația electrică",
    seoDescription:
      "Checklist pentru automatizarea casei înainte de cablare: circuite, doze, tablouri, senzori, rețea, HVAC, jaluzele și stație meteo.",
    keywords: ["pregătire casă smart", "instalație electrică smart home", "cablare KNX"],
    contentType: "article",
    publishedTime: "2026-08-04",
    sections: [
      {
        title: "Începe cu funcțiile",
        paragraphs: [
          "Notează ce trebuie să se întâmple în fiecare cameră: ce lumini există, cum se controlează temperatura, ce suprafețe sunt umbrite și ce evenimente de siguranță contează.",
        ],
        subsections: [
          {
            title: "Pe fiecare cameră",
            paragraphs: [
              "Inventariază comenzile locale, senzorii și scenariile uzuale înainte de alegerea echipamentelor.",
            ],
          },
          {
            title: "La nivelul clădirii",
            paragraphs: [
              "Stabilește tablourile, rețeaua, măsurarea energiei și integrările care deservesc întreaga casă.",
            ],
          },
        ],
      },
      {
        title: "Coordonează instalațiile",
        paragraphs: [
          "Pozițiile senzorilor și comenzilor depind de mobilier, uși, tavane și instalațiile HVAC. Tabloul are nevoie de spațiu, ventilație și rezerve.",
        ],
        bullets: [
          "Plan iluminat",
          "Circuite prize și consumatori",
          "Zone HVAC",
          "Motoare jaluzele",
          "Rețea și Wi-Fi",
          "Securitate și acces",
        ],
      },
      {
        title: "Fotografiază și documentează",
        paragraphs: [
          "Înainte de închiderea pereților și tavanelor, documentează traseele și etichetează cablurile. Aceste informații reduc timpul de diagnostic și riscul intervențiilor ulterioare.",
        ],
      },
    ],
    faq: [
      {
        question: "Când se definitivează proiectul smart?",
        answer:
          "Cerințele și infrastructura se stabilesc înainte de cablare, iar programarea finală și ajustarea scenariilor se fac după montaj și punerea în funcțiune.",
      },
      {
        question: "Ce trebuie pregătit înainte de discuția cu integratorul?",
        answer:
          "Planurile actuale, lista funcțiilor dorite, schema instalației termice și etapa șantierului sunt suficiente pentru o primă analiză realistă.",
      },
    ],
  },
  "knx-sau-smart-home-wifi": {
    slug: "knx-sau-smart-home-wifi",
    eyebrow: "Blog · Tehnologie",
    title: "KNX sau smart home Wi-Fi: ce problemă rezolvă fiecare?",
    description:
      "O comparație practică pentru construcții noi, renovări și proiecte implementate în etape.",
    seoTitle: "KNX sau smart home Wi-Fi pentru casă? Comparație practică",
    seoDescription:
      "Când alegi KNX și când este potrivit un smart home Wi-Fi: cablare, stabilitate, control local, extindere și cost total.",
    keywords: ["KNX sau Wi-Fi", "smart home Wi-Fi", "casă KNX"],
    contentType: "article",
    publishedTime: "2026-08-04",
    sections: [
      {
        title: "KNX pentru infrastructură",
        paragraphs: [
          "KNX este justificat când multe instalații trebuie să coopereze și funcționarea locală, documentația și extinderea sunt cerințe importante.",
        ],
      },
      {
        title: "Wi-Fi pentru flexibilitate",
        paragraphs: [
          "Dispozitivele Wi-Fi pot rezolva rapid funcții punctuale, mai ales în spații finisate. Rețeaua, conturile și dependența de cloud trebuie însă administrate.",
        ],
      },
      {
        title: "Soluția hibridă",
        paragraphs: [
          "În multe proiecte, controlul esențial rămâne pe infrastructură locală, iar Wi-Fi sau Matter adaugă interfețe și funcții secundare.",
        ],
        subsections: [
          {
            title: "Funcții esențiale",
            paragraphs: [
              "Comenzile locale și instalațiile critice rămân predictibile și documentate.",
            ],
          },
          {
            title: "Interfețe suplimentare",
            paragraphs: [
              "Aplicațiile și controlul vocal completează sistemul fără a deveni singura metodă de utilizare.",
            ],
          },
        ],
      },
    ],
    faq: [
      {
        question: "Pot adăuga Google Home peste KNX?",
        answer:
          "Da, printr-un gateway sau o platformă de integrare compatibilă și testată pentru funcțiile proiectului.",
      },
      {
        question: "Wi-Fi și KNX pot funcționa în aceeași casă?",
        answer:
          "Da. O arhitectură hibridă poate păstra funcțiile esențiale pe KNX și poate folosi Wi-Fi pentru dispozitive sau interfețe suplimentare, cu reguli clare de integrare.",
      },
    ],
  },
  "automatizare-incalzire-energie": {
    slug: "automatizare-incalzire-energie",
    eyebrow: "Blog · Energie",
    title: "Automatizarea încălzirii fără a compromite instalația termică.",
    description:
      "Control pe zone, inerție, surse de căldură și măsurarea consumului într-o strategie coerentă.",
    seoTitle: "Automatizarea încălzirii și managementul energiei în casa smart",
    seoDescription:
      "Control inteligent al încălzirii: termostate pe zone, pardoseală, pompe de căldură, fotovoltaice și management energetic.",
    keywords: ["automatizare încălzire", "termostat smart pe zone", "management energetic casă"],
    contentType: "article",
    publishedTime: "2026-08-04",
    sections: [
      {
        title: "Controlul trebuie să respecte instalația",
        paragraphs: [
          "Încălzirea în pardoseală, radiatoarele și ventiloconvectoarele au răspunsuri diferite. Automatizarea nu trebuie să comande sursa în afara limitelor recomandate de proiectantul HVAC.",
        ],
      },
      {
        title: "Zone și senzori",
        paragraphs: [
          "Poziția senzorului, inerția și programul de ocupare sunt mai importante decât schimbările frecvente de setpoint.",
        ],
        bullets: [
          "Temperatură pe camere",
          "Contacte ferestre",
          "Prezență",
          "Temperatură exterioară",
          "Starea sursei",
        ],
        subsections: [
          {
            title: "Zone termice",
            paragraphs: [
              "Fiecare zonă se reglează în limitele instalației și după inerția sistemului de emitere.",
            ],
          },
          {
            title: "Date utile",
            paragraphs: [
              "Temperatura, prezența și contactele ferestrelor trebuie interpretate în context, nu izolat.",
            ],
          },
        ],
      },
      {
        title: "Energie și sarcini",
        paragraphs: [
          "Contorizarea ajută la înțelegerea consumului. Pompa de căldură, stația EV și alte sarcini mari pot fi coordonate pentru a limita vârfurile, dacă interfețele permit.",
        ],
      },
    ],
    faq: [
      {
        question: "Automatizarea reduce garantat consumul?",
        answer:
          "Nu există o economie garantată universal. Rezultatul depinde de clădire, instalații, setări și comportamentul utilizatorilor. Sistemul oferă control și date pentru optimizare.",
      },
      {
        question: "Pot fi coordonate pompa de căldură și stația EV?",
        answer:
          "Da, dacă echipamentele oferă interfețe documentate și proiectul stabilește prioritățile, limitele de putere și modurile sigure de funcționare.",
      },
    ],
  },
};

type SeoEnhancement = Pick<
  PublicContentPage,
  "seoTitle" | "seoDescription" | "keywords" | "faq" | "schemaType" | "serviceType"
>;

export const serviceSeoEnhancements: Record<string, SeoEnhancement> = {
  consultanta: {
    seoTitle: "Consultanță casă smart și automatizări | N3XO",
    seoDescription:
      "Consultanță tehnică pentru casă smart, KNX și automatizarea locuinței: cerințe, buget, arhitectură și etape de implementare.",
    keywords: ["consultanță casă smart", "consultanță KNX", "proiect smart home"],
    schemaType: "Service",
    serviceType: "Consultanță smart home",
    faq: [
      {
        question: "Ce documente sunt utile la prima discuție?",
        answer:
          "Planul arhitectural, stadiul instalațiilor, funcțiile prioritare și un buget orientativ ajută la delimitarea soluțiilor realiste.",
      },
      {
        question: "Consultanța include și oferta?",
        answer:
          "Scopul și livrabilele se stabilesc înainte. O ofertă tehnică detaliată poate necesita proiectare sau audit suplimentar.",
      },
    ],
  },
  "audit-smart-home": {
    seoTitle: "Audit Smart Home pentru sisteme existente | N3XO",
    seoDescription:
      "Audit tehnic smart home: echipamente, rețea, tablouri, backup, compatibilități și plan de remediere sau extindere.",
    keywords: ["audit smart home", "verificare sistem casă inteligentă", "diagnoză KNX"],
    schemaType: "Service",
    serviceType: "Audit Smart Home",
    faq: [
      {
        question: "Puteți audita un sistem fără documentație?",
        answer:
          "Da, dar timpul și limitele auditului cresc. Inventariem ceea ce poate fi verificat și marcăm explicit necunoscutele.",
      },
      {
        question: "Auditul garantează repararea?",
        answer:
          "Nu. Auditul identifică starea și opțiunile. Reparația depinde de acces, componente și acceptarea intervenției propuse.",
      },
    ],
  },
  proiectare: {
    seoTitle: "Proiectare casă smart și automatizare KNX | N3XO",
    seoDescription:
      "Proiect tehnic pentru automatizare casă: planuri, scheme, tablouri, funcții, KNX, HVAC, securitate și energie.",
    keywords: ["proiectare casă smart", "proiect KNX", "proiect automatizare casă"],
    schemaType: "Service",
    serviceType: "Proiectare automatizări smart",
    faq: [
      {
        question: "Când trebuie începută proiectarea?",
        answer:
          "Înainte de definitivarea instalației electrice și HVAC, ideal în etapa de proiectare a arhitecturii și instalațiilor.",
      },
      {
        question: "Primesc documentația proiectului?",
        answer:
          "Livrabilele și formatele sunt stabilite în ofertă și contract și pot include planuri, scheme, descrieri funcționale și backupuri.",
      },
    ],
  },
  instalare: {
    seoTitle: "Instalare sisteme casă smart și KNX | N3XO",
    seoDescription:
      "Instalare și verificare pentru automatizări smart home: cablare, tablouri, senzori, actuatoare și pregătirea punerii în funcțiune.",
    keywords: ["instalare casă smart", "instalare KNX", "montaj automatizări"],
    schemaType: "Service",
    serviceType: "Instalare sisteme smart home",
    faq: [
      {
        question: "Faceți și instalația electrică completă?",
        answer:
          "Limitele lucrărilor electrice și responsabilitățile se stabilesc pentru fiecare proiect. Automatizarea trebuie coordonată cu executantul autorizat al instalației electrice.",
      },
      {
        question: "Instalați echipamente cumpărate separat?",
        answer:
          "Numai după verificarea compatibilității, documentației, provenienței și condițiilor de garanție.",
      },
    ],
  },
  "programare-knx": {
    seoTitle: "Programare KNX și proiect ETS | N3XO",
    seoDescription:
      "Programare KNX în ETS: adrese de grup, parametri, scene, integrare, teste, backup și documentație as-built.",
    keywords: ["programare KNX", "proiect ETS", "configurare KNX"],
    schemaType: "Service",
    serviceType: "Programare KNX",
    faq: [
      {
        question: "Puteți modifica un proiect ETS existent?",
        answer:
          "Da, dacă există acces legal la proiect, backup valid și suficientă documentație. În lipsa lor este necesar un audit.",
      },
      {
        question: "Predați backupul ETS?",
        answer:
          "Predarea și drepturile asupra fișierelor sunt stabilite contractual. Recomandăm păstrarea controlată a unui backup actualizat.",
      },
    ],
  },
  "punere-in-functiune": {
    seoTitle: "Punere în funcțiune sisteme smart home și KNX | N3XO",
    seoDescription:
      "Testare, reglaj și punere în funcțiune pentru iluminat, HVAC, jaluzele, securitate, energie și integrări smart home.",
    keywords: ["punere în funcțiune KNX", "testare smart home", "commissioning automatizări"],
    schemaType: "Service",
    serviceType: "Punere în funcțiune automatizări",
    faq: [
      {
        question: "Ce se testează înainte de predare?",
        answer:
          "Comenzile locale, scenariile, alarmele, integrările, revenirea după întreruperi și funcțiile descrise în proiect.",
      },
      {
        question: "Include instruirea utilizatorului?",
        answer:
          "Poate include instruire și documentație de utilizare, conform livrabilelor agreate.",
      },
    ],
  },
  mentenanta: {
    seoTitle: "Mentenanță KNX și sisteme casă smart | N3XO",
    seoDescription:
      "Mentenanță preventivă pentru smart home: backup, verificări, actualizări controlate, documentație și recomandări de înlocuire.",
    keywords: ["mentenanță KNX", "mentenanță smart home", "service casă inteligentă"],
    schemaType: "Service",
    serviceType: "Mentenanță sisteme smart home",
    faq: [
      {
        question: "Cât de des este necesară mentenanța?",
        answer:
          "Frecvența depinde de sistemele integrate, criticitate, baterii, actualizări și condițiile de exploatare.",
      },
      {
        question: "Actualizați automat toate dispozitivele?",
        answer:
          "Nu. Actualizările sunt evaluate după compatibilitate, risc și beneficiu și se aplică într-o fereastră controlată.",
      },
    ],
  },
  service: {
    seoTitle: "Service casă inteligentă și automatizări KNX | N3XO",
    seoDescription:
      "Diagnostic și service pentru sisteme smart home și KNX, cu verificarea configurațiilor, rețelei, integrărilor și istoricului tehnic.",
    keywords: ["service casă inteligentă", "service KNX", "reparații smart home"],
    schemaType: "Service",
    serviceType: "Service automatizări smart",
    faq: [
      {
        question: "Interveniți la sisteme instalate de altă firmă?",
        answer:
          "Da, după verificarea documentației, accesului și stării sistemului. Unele intervenții necesită mai întâi audit.",
      },
      {
        question: "Oferiți diagnostic la distanță?",
        answer:
          "Uneori, dacă există acces autorizat și securizat. Accesul la distanță nu este activat fără acord și justificare.",
      },
    ],
  },
  "integrare-sisteme-existente": {
    seoTitle: "Integrare sisteme existente în casa smart | N3XO",
    seoDescription:
      "Integrare KNX, HVAC, securitate, Modbus, BACnet, Matter și Home Assistant cu funcții și compatibilități verificate.",
    keywords: ["integrare smart home", "integrare KNX Home Assistant", "integrare HVAC"],
    schemaType: "Service",
    serviceType: "Integrare sisteme smart existente",
    faq: [
      {
        question: "Orice sistem poate fi integrat?",
        answer:
          "Nu. Este necesară o interfață documentată, acces la configurație și un flux de date compatibil cu funcția dorită.",
      },
      {
        question: "Integrarea afectează garanția echipamentelor?",
        answer:
          "Poate, dacă sunt folosite interfețe sau modificări neacceptate. Verificăm documentația și delimităm responsabilitățile înainte de lucru.",
      },
    ],
  },
};

export const resourceSeoEnhancements: Record<string, SeoEnhancement> = {
  "intrebari-frecvente": {
    seoTitle: "Întrebări frecvente despre casă smart și KNX | N3XO",
    seoDescription:
      "Răspunsuri despre cost, proiectare, KNX, Matter, renovare, instalare și mentenanța unei case inteligente.",
    keywords: ["întrebări casă smart", "FAQ KNX", "automatizare casă"],
    faq: [
      {
        question: "Care este primul pas pentru o casă smart?",
        answer:
          "Încarcă planul sau pregătește lista funcțiilor și stadiul instalațiilor. Alegerea produselor vine după definirea cerințelor.",
      },
      {
        question: "Pot combina KNX cu Matter?",
        answer:
          "Da, prin gateway-uri sau platforme potrivite, după verificarea funcțiilor care trebuie expuse între sisteme.",
      },
    ],
  },
  "ghid-knx": {
    seoTitle: "Ghid KNX pentru case și clădiri inteligente | N3XO",
    seoDescription:
      "Introducere în KNX: magistrală, topologie, ETS, dispozitive multi-brand, iluminat, HVAC și integrare smart home.",
    keywords: ["ghid KNX", "ce este KNX", "KNX casă"],
    faq: [
      {
        question: "KNX este un brand?",
        answer:
          "Nu. KNX este un standard deschis folosit de numeroși producători pentru automatizarea clădirilor.",
      },
    ],
  },
  "ghid-matter": {
    seoTitle: "Ghid Matter și Thread pentru smart home | N3XO",
    seoDescription:
      "Ce este Matter, cum folosește Wi-Fi sau Thread și cum se integrează cu Google Home, Apple Home, Alexa și Home Assistant.",
    keywords: ["ghid Matter", "Matter smart home", "Thread smart home"],
    faq: [
      {
        question: "Matter funcționează numai prin Thread?",
        answer:
          "Nu. Matter poate folosi Thread sau Wi-Fi, în funcție de categoria și implementarea dispozitivului.",
      },
    ],
  },
  "google-home": {
    seoTitle: "Integrare Google Home pentru casă smart | N3XO",
    seoDescription:
      "Integrare Google Home cu Matter, KNX și sisteme smart: control vocal, rutine, permisiuni și funcționare locală.",
    keywords: ["Google Home România", "integrare Google Home", "Google Home KNX"],
    faq: [
      {
        question: "Google Home poate controla KNX?",
        answer:
          "Da, printr-un gateway sau o platformă de integrare compatibilă cu funcțiile proiectului.",
      },
    ],
  },
  "apple-home": {
    seoTitle: "Integrare Apple Home pentru casă smart | N3XO",
    seoDescription:
      "Apple Home, Siri și Matter într-un proiect smart home, cu hub, acces la distanță și integrarea sistemului principal.",
    keywords: ["Apple Home România", "Apple Home KNX", "Siri casă smart"],
    faq: [
      {
        question: "Este necesar un hub Apple?",
        answer:
          "Pentru anumite automatizări și acces la distanță este necesar un hub de locuință compatibil, conform cerințelor Apple.",
      },
    ],
  },
  "amazon-alexa": {
    seoTitle: "Integrare Amazon Alexa pentru smart home | N3XO",
    seoDescription:
      "Integrarea Alexa cu Matter și automatizările casei: control vocal, rutine, conturi și dependențe cloud.",
    keywords: ["Alexa smart home", "integrare Alexa KNX", "Amazon Alexa casă"],
    faq: [
      {
        question: "Alexa funcționează fără internet?",
        answer:
          "Majoritatea comenzilor Alexa depind de serviciile cloud. Funcțiile locale ale casei trebuie proiectate independent.",
      },
    ],
  },
  "home-assistant": {
    seoTitle: "Integrare Home Assistant cu KNX și Matter | N3XO",
    seoDescription:
      "Control local cu Home Assistant: integrare KNX, Matter, Zigbee, backup, dashboarduri și mentenanță.",
    keywords: ["Home Assistant România", "Home Assistant KNX", "Home Assistant Matter"],
    faq: [
      {
        question: "Home Assistant necesită mentenanță?",
        answer:
          "Da. Hardware-ul, backupul, integrările și actualizările trebuie administrate pentru stabilitate.",
      },
    ],
  },
  compatibilitati: {
    seoTitle: "Compatibilități KNX, Matter și smart home | N3XO",
    seoDescription:
      "Cum verificăm compatibilitatea între KNX, Matter, Google Home, Apple Home, Alexa, Home Assistant, HVAC și securitate.",
    keywords: ["compatibilitate smart home", "compatibilitate KNX Matter", "integrare sisteme"],
    faq: [
      {
        question: "Același protocol garantează compatibilitatea?",
        answer:
          "Nu. Trebuie verificate profilul, funcțiile implementate, versiunile, gateway-ul și comportamentul în caz de eroare.",
      },
    ],
  },
};

export const solutionSeoEnhancements: Record<string, SeoEnhancement> = {
  "case-smart": {
    seoTitle: "Soluții casă smart și casă inteligentă | N3XO",
    seoDescription:
      "Soluții pentru casă smart: iluminat, climat, jaluzele, securitate și energie prin KNX, Matter sau arhitectură hibridă.",
    keywords: ["soluții casă smart", "casă inteligentă", "automatizare locuință"],
    schemaType: "Service",
    serviceType: "Soluții pentru case inteligente",
    faq: [
      {
        question: "Soluția se alege înainte de proiectul electric?",
        answer:
          "Cerințele și principiile de infrastructură trebuie stabilite înainte de definitivarea instalației electrice. Modelele exacte pot fi selectate în etapa de ofertare.",
      },
      {
        question: "Pot combina KNX cu dispozitive wireless?",
        answer:
          "Da, dacă rolurile, gateway-urile și comportamentul în caz de întrerupere sunt definite și testate.",
      },
    ],
  },
  "apartamente-smart": {
    seoTitle: "Apartament smart: automatizare fără complexitate inutilă | N3XO",
    seoDescription:
      "Automatizare apartament pentru iluminat, temperatură, jaluzele și securitate cu Matter, Zigbee, Wi-Fi sau soluții hibride.",
    keywords: ["apartament smart", "automatizare apartament", "apartament inteligent"],
    schemaType: "Service",
    serviceType: "Automatizare apartamente",
    faq: [
      {
        question: "Se poate automatiza un apartament finisat?",
        answer:
          "Da. Audităm dozele, circuitele, nulul disponibil și rețeaua pentru a alege intervenții wireless sau locale potrivite.",
      },
      {
        question: "Este necesar un tablou nou?",
        answer:
          "Depinde de funcții și spațiul disponibil. Unele soluții se montează distribuit, altele necesită module și protecții în tablou.",
      },
    ],
  },
  "blocuri-smart": {
    seoTitle: "Bloc smart: acces, energie și spații comune | N3XO",
    seoDescription:
      "Automatizare pentru blocuri mici: acces, videointerfon, iluminat comun, parcare, stații EV și monitorizare energetică.",
    keywords: ["bloc smart", "automatizare bloc", "control acces bloc"],
    schemaType: "Service",
    serviceType: "Automatizare blocuri rezidențiale",
    faq: [
      {
        question: "Configurația se calculează pe apartament?",
        answer:
          "Dimensionăm tipologiile de apartamente, scările și spațiile comune, apoi tratăm separat excepțiile confirmate din plan.",
      },
      {
        question: "Se poate implementa doar în spațiile comune?",
        answer:
          "Da. Accesul, iluminatul, parcarea și energia comună pot forma o etapă independentă de automatizarea apartamentelor.",
      },
    ],
  },
  "pensiuni-hoteluri-smart": {
    seoTitle: "Automatizare pensiune și hotel smart | N3XO",
    seoDescription:
      "Control pe camere pentru pensiuni și hoteluri: HVAC, acces, energie, alarme tehnice, KNX și integrare PMS/GRMS.",
    keywords: ["automatizare pensiune", "hotel smart", "automatizare cameră hotel"],
    schemaType: "Service",
    serviceType: "Automatizare pensiuni și hoteluri",
    faq: [
      {
        question: "Camerele identice se configurează separat?",
        answer:
          "Definim mai întâi tipologii repetabile, apoi aplicăm excepțiile pentru suite, camere accesibile sau instalații diferite.",
      },
      {
        question: "Puteți integra sistemul cu PMS?",
        answer:
          "Numai dacă PMS-ul și controlerul de cameră oferă interfețe documentate. Validăm fluxurile înainte de ofertare.",
      },
    ],
  },
  "automatizare-knx": {
    seoTitle: "Soluții automatizare KNX pentru case și clădiri | N3XO",
    seoDescription:
      "Soluții KNX pentru iluminat, HVAC, jaluzele, securitate și energie, cu proiect ETS, instalare, programare și documentație.",
    keywords: ["soluții KNX", "automatizare KNX", "casă KNX"],
    schemaType: "Service",
    serviceType: "Automatizare KNX",
    faq: [
      {
        question: "Ce primește beneficiarul la final?",
        answer:
          "Livrabilele pot include documentație as-built, descrierea funcțiilor și backupul ETS, conform contractului.",
      },
      {
        question: "KNX permite mai mulți producători?",
        answer:
          "Da. Selecția este multi-brand, dar fiecare aplicație și funcție se verifică în documentația producătorului.",
      },
    ],
  },
  securitate: {
    seoTitle: "Securitate integrată pentru casă smart și clădiri | N3XO",
    seoDescription:
      "Alarmă, acces, videointerfon, fum și supraveghere integrate cu automatizarea casei, fără a slăbi controlul local.",
    keywords: ["securitate casă smart", "alarmă casă inteligentă", "control acces"],
    schemaType: "Service",
    serviceType: "Securitate integrată",
    faq: [
      {
        question: "Alarma depinde de aplicația smart home?",
        answer:
          "Nu recomandăm ca funcția principală de alarmă să depindă exclusiv de o aplicație consumer. Integrarea expune doar comenzile și evenimentele justificate.",
      },
      {
        question: "Camerele video pot declanșa scene?",
        answer:
          "Uneori, prin analitice sau evenimente documentate. Funcțiile exacte depind de echipamente, rețea și cerințele de confidențialitate.",
      },
    ],
  },
  "energie-eficienta": {
    seoTitle: "Management energetic pentru case și clădiri smart | N3XO",
    seoDescription:
      "Contorizare, management de sarcină, stații EV, fotovoltaice și automatizarea consumului pentru case, blocuri și hoteluri mici.",
    keywords: ["management energetic casă", "automatizare energie", "stație EV smart"],
    schemaType: "Service",
    serviceType: "Management energetic",
    faq: [
      {
        question: "Monitorizarea reduce automat consumul?",
        answer:
          "Monitorizarea oferă date. Economiile apar când datele sunt folosite în reguli corecte și utilizatorii acceptă strategia de control.",
      },
      {
        question: "Puteți coordona stația EV și pompa de căldură?",
        answer:
          "Da, dacă echipamentele oferă interfețe potrivite și proiectul electric permite managementul sarcinilor.",
      },
    ],
  },
};
