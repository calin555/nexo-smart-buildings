# Strategia SEO N3XO Smart Buildings

## Principiu

Strategia urmărește intenții reale de proiectare și implementare, nu generarea mecanică de pagini pentru fiecare variație de cuvânt-cheie. Sinonimele apropiate sunt consolidate pe aceeași pagină, iar URL-urile alternative folosesc redirect permanent.

Exemple:

- `casă smart` și `casă inteligentă` → `/casa-smart`;
- `automatizare casă` și `automatizare locuință` → `/automatizare-casa`;
- `/casa-inteligenta` redirecționează permanent către `/casa-smart`;
- `/automatizare-locuinte` redirecționează permanent către `/automatizare-casa`.

## Clustere și intenții

### Pagini pilon

| URL                     | Intenție principală                 | Termeni secundari                              |
| ----------------------- | ----------------------------------- | ---------------------------------------------- |
| `/casa-smart`           | proiect complet de casă inteligentă | casă inteligentă, smart home                   |
| `/automatizare-casa`    | proces și infrastructură            | automatizare locuință, proiect electric        |
| `/smart-home`           | ecosisteme și protocoale            | Matter, Thread, Zigbee                         |
| `/automatizare-knx`     | infrastructură profesională         | proiect KNX, ETS, programare KNX               |
| `/integrari-smart-home` | integrarea platformelor             | Google Home, Apple Home, Alexa, Home Assistant |

Paginile comerciale `/solutii/*` răspund intenției de alegere a soluției pe tip de clădire. Paginile pilon explică domeniul și procesul; cele două tipuri nu repetă aceeași structură.

### Pagini locale

- `/automatizari-smart/cluj-napoca`: servicii locale pentru case, apartamente și blocuri;
- `/automatizari-smart/brasov`: case, pensiuni, climat și energie; precizează că nu există un sediu declarat;
- `/automatizari-smart/transilvania`: coordonare regională și etape programate.

Nu se adaugă un oraș nou fără conținut, disponibilitate și ofertă distincte. Paginile care schimbă doar numele localității sunt interzise.

### Servicii

Fiecare serviciu are titlu SEO, descriere, termeni asociați, H1, secțiuni proprii, FAQ și schema `Service`:

- consultanță;
- audit Smart Home;
- proiectare;
- instalare;
- programare KNX;
- punere în funcțiune;
- mentenanță;
- service;
- integrarea sistemelor existente.

### Ghiduri și blog

Ghidurile răspund întrebărilor de selecție și comparație. Articolele de blog tratează decizii din proiectare și exploatare. Fiecare articol are dată, metadata de tip `article`, breadcrumbs, FAQ și legături către configurator sau ofertare.

Următoarele materiale trebuie publicate numai după revizie tehnică și indicarea autorului/revizorului:

1. DALI în proiectele rezidențiale;
2. proiectarea rețelei pentru o casă smart;
3. integrarea pompei de căldură;
4. scenarii de securitate fără dependență de cloud;
5. mentenanța și backupul proiectului ETS.

## Metadata și social sharing

- `metadataBase` folosește `NEXT_PUBLIC_SITE_URL`;
- fiecare pagină SEO are canonical propriu;
- titlurile și descrierile sunt definite în modelul de conținut;
- Open Graph folosește imagini locale 1200×630 și locale `ro_RO`;
- Twitter/X folosește `summary_large_image`;
- paginile private și autentificarea sunt `noindex, nofollow`.

## Date structurate

Platforma emite JSON-LD pentru:

- `Organization` și `WebSite` global;
- `WebPage` sau `Article` pentru conținut;
- `Service` pentru soluții, servicii și pagini locale;
- `BreadcrumbList` pentru ierarhia vizibilă;
- `FAQPage` numai pentru întrebările afișate în pagină.

FAQ-ul rămâne util semantic și pentru utilizatori, însă nu se presupune eligibilitatea pentru un rich result Google.

## Crawl și indexare

- `/sitemap.xml` include numai URL-uri publice, canonice și indexabile;
- `/robots.txt` blochează crawl-ul pentru `/admin`, `/portal`, `/api` și `/auth`;
- loginul, portalul și administrarea folosesc și `noindex`;
- toate paginile importante sunt accesibile prin legături HTML, nu doar prin sitemap;
- paginile locale și articolele nu depind de JavaScript pentru conținutul principal.

## Verificări înainte de lansare

1. Setează `NEXT_PUBLIC_SITE_URL` la domeniul canonic de producție.
2. Verifică sitemapul și robots.txt pe domeniul final.
3. Validează JSON-LD în Schema Markup Validator și Rich Results Test.
4. Adaugă proprietatea domeniului în Google Search Console.
5. Trimite `/sitemap.xml` în Search Console.
6. Creează sau verifică profilul Google Business numai cu date reale.
7. Adaugă autor și revizor tehnic materialelor editoriale.
8. Monitorizează paginile indexate, interogările, CTR-ul și conversiile către configurator.

## Indicatori

- clickuri organice către paginile pilon și locale;
- interogări non-brand relevante;
- CTR pe pagină și interogare;
- accesări ale configuratorului din conținut;
- solicitări de ofertă atribuite organic;
- pagini excluse, duplicate sau cu canonical diferit în Search Console;
- Core Web Vitals și erori de date structurate.
