# N3XO Smart Buildings

Fundația MVP pentru deployment exclusiv pe Vercel + Supabase. Include Next.js App Router, Tailwind, Supabase Auth SSR, profile sincronizat cu `auth.users`, organizații/membership-uri, RBAC server-side, Prisma, audit, RLS SQL pregătit și layout-uri public/portal/admin.

## Instalare locală

1. Creați un proiect Supabase și completați `.env` după `.env.example`.
2. Instalați: `npm install`.
3. Generați clientul: `npx prisma generate`.
4. Aplicați migrațiile versionate la baza Supabase: `npm run db:migrate` pentru dezvoltare sau `npm run db:deploy` în CI/deploy.
5. Încărcați rolurile și organizațiile demo: `npm run db:seed`.
6. Configurați Supabase Auth Redirect URL: `http://localhost:3000/auth/callback`.
7. Porniți: `npm run dev`.

Utilizatorii și resetarea parolei sunt create exclusiv în Supabase Auth. După creare, trigger-ul SQL creează profilul; un administrator atribuie membership-ul/rolul potrivit.

## Administrarea produselor

Un utilizator cu rol `ADMIN` sau `SUPER_ADMIN` poate deschide `/admin/products`, unde poate adăuga produse și le poate edita. Produsele marcate „vizibil pe site” sunt afișate automat pe homepage, în ordinea configurată. Imaginea este opțională și poate fi încărcată din calculator sau introdusă ca URL HTTPS.

Toate salvările sunt validate cu Zod, autorizate server-side și înregistrate în audit. Înaintea publicării unei versiuni care include modificări ale catalogului trebuie rulată migrarea versionată cu `npm run db:deploy`.

### Catalog Schneider Electric SpaceLogic KNX 2025-10

Repository-ul include un catalog normalizat cu 342 de referințe comerciale extrase din `LSB02779_EN`. Fiecare produs păstrează codul Schneider, pagina sursă, o denumire și o descriere tehnică în română, categoria N3XO și fotografia reală extrasă din pagina produsului. Variantele prezentate împreună de Schneider folosesc fotografia comună a familiei. Prețurile nu există în documentul sursă și sunt afișate corect ca „Preț la cerere”.

Pentru regenerarea datelor din PDF-ul original:

```bash
npm run catalog:schneider:extract -- "C:\cale\LSB02779_EN_KNX_Catalogue_2025-10.pdf" "data\schneider-knx-products.json"
npm run catalog:schneider:images -- "C:\cale\LSB02779_EN_KNX_Catalogue_2025-10.pdf" "data\schneider-knx-products.json" "public\images\products\schneider-knx" --pdftoppm "C:\cale\pdftoppm.exe"
```

Pentru sincronizarea idempotentă în baza configurată prin `DATABASE_URL`:

```bash
npm run catalog:schneider:import
```

Importul procesează produsele în loturi, folosește slug-uri stabile bazate pe referință, nu dublează produsele la rerulare și scrie evenimentul `SCHNEIDER_KNX_CATALOG_IMPORTED` în audit. Nu folosește service role. La actualizare păstrează prețurile și imaginile introduse ulterior manual în admin. PDF-ul original nu este inclus în repository.

### Catalog ABB i-bus KNX — etapa 1

Prima etapă ABB include 126 de produse din familiile surse de alimentare, infrastructură și interfețe, intrări și ieșiri. Selecția este preluată din API-ul oficial ABB pentru piața din România și exclude produsele retrase, produsele cu înlocuitor declarat și înregistrările fără fotografie reală. Imaginile din `public/images/products/abb-knx` provin din CDN-ul oficial ABB, iar denumirile și descrierile sunt sintetizate tehnic în română. Prețurile sunt afișate ca „Preț la cerere”.

Regenerarea catalogului și a imaginilor oficiale nu necesită credențiale persistente și nu scrie tokenul temporar ABB în fișiere sau loguri:

```bash
npm run catalog:abb:extract
```

Sincronizarea idempotentă în baza configurată prin `DATABASE_URL`:

```bash
npm run catalog:abb:import
```

Importul scrie evenimentul `ABB_KNX_CATALOG_IMPORTED` în audit, folosește Prisma server-side și nu folosește service role. Sursa oficială este [gama ABB i-bus KNX](https://new.abb.com/low-voltage/products/building-automation/product-range/abb-i-bus-knx).

## Configurator comercial de kituri

Homepage-ul prezintă pachetele Essential, Comfort și Premium, fiecare cu interval orientativ de preț și acces direct la `/configurator-kit`. Configuratorul public este un wizard pe categorii pentru camere, iluminat, jaluzele, încălzire, climatizare, securitate, exterior și integrări. Rezumatul sticky recalculează local și instant prețul estimat, numărul de produse, dispozitivele, echipamentele și diferența față de kitul superior.

Calculul este determinist și nu scrie date în bază. Estimarea nu reprezintă ofertă comercială finală; aceasta necesită analiza planului, a tabloului și a instalațiilor. Configuratorul tehnic autentificat pe plan rămâne separat în `/portal/configurator`.

## Configurator pe plan — Etapele 1–3

Membrii unei organizații pot deschide `/portal/configurator`, crea un proiect și încărca un plan PDF, JPG sau PNG de maximum 15 MB. Fișierul ajunge direct din browser în bucketul privat `project-documents`, prin clientul Supabase cu sesiunea utilizatorului; serverul rezervă și finalizează metadatele numai după verificarea membership-ului. Nu este folosit service role în fluxul normal.

Viewerul folosește PDF.js pentru documentele PDF și un strat SVG cu coordonate normalizate pentru geometrie. Sunt funcționale desenarea manuală, selectarea, editarea vârfurilor, proprietățile camerelor, funcțiile smart, confirmarea și sumarul în timp real.

Etapa 2 adaugă analiza asincronă printr-un `PlanAnalysisProvider` modular. Pentru activare, setați numai pe server `OPENAI_API_KEY`; modelul poate fi ales prin `PLAN_ANALYSIS_MODEL` și este implicit `gpt-5.6`. Fișierul este reverificat prin semnătura reală înainte de procesare, rezultatul providerului este constrâns la JSON structurat și validat cu Zod, iar camerele detectate apar neconfirmate cu confidence score. Fără provider configurat sau dacă analiza eșuează, editorul manual rămâne disponibil.

Etapa 3 adaugă opt preseturi de cameră, cantități editabile și estimări orientative după suprafață. Motorul de recomandare agregă cerințele întregului proiect și afișează produse candidate din categoriile active ale catalogului. Rezultatul nu este ofertă, nu include un total financiar și nu confirmă automat compatibilitatea tehnică; selecția finală rămâne în sarcina specialistului.

Pentru E2E live al Etapei 2 setați local `E2E_SUPABASE_ENABLED=1` și `E2E_PLAN_ANALYSIS_ENABLED=1`. Al doilea flag activează un provider deterministic numai în afara producției; nu necesită și nu simulează o cheie AI în repository.

După migrarea Prisma, aplicați politicile Supabase ale configuratorului:

```bash
npm run db:deploy
npx prisma db execute --file supabase/migrations/20260731230000_plan_configurator_security.sql --schema prisma/schema.prisma
```

Arhitectura și delimitarea etapelor sunt documentate în [docs/PLAN_CONFIGURATOR.md](docs/PLAN_CONFIGURATOR.md).

Pentru conturi de test, creați utilizatori în Supabase Auth (fără parole în seed), confirmați e-mailurile într-un mediu de test, verificați apariția profilurilor, apoi creați membership-uri în cele două organizații separate. Puneți adresele/parolele testelor doar în variabile E2E locale/CI, niciodată în Git. Pașii compleți Vercel sunt în [docs/VERCEL_DEPLOYMENT.md](docs/VERCEL_DEPLOYMENT.md).

## Vercel

Importați repository-ul GitHub în Vercel. Configurați în mediile Development, Preview și Production: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, `DIRECT_URL`, `OPENAI_API_KEY` și `PLAN_ANALYSIS_MODEL`. Cheile service role și OpenAI nu se expun în browser. Build command: `npm run build`; `postinstall` rulează `prisma generate`.

## Securitate şi stocare

RLS din `supabase/migrations` protejează datele portalului; serviciile Next.js verifică și RBAC înaintea oricărei operații. Bucket-urile Supabase Storage sunt private: `project-documents`, `product-documents`, `offer-pdfs`, `project-images`; accesul viitor se face prin signed URLs cu expirare. Nu sunt salvate fișiere în `/public` sau disk în producție.

## Verificare

```bash
npm run db:validate
npx prisma generate
npm run lint
npm run typecheck
npm test
npm run test:e2e # setează E2E_SUPABASE_ENABLED=1 într-un proiect Supabase de test
npm run build
```
