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

## Configurator pe plan — Etapa 1

Membrii unei organizații pot deschide `/portal/configurator`, crea un proiect și încărca un plan PDF, JPG sau PNG de maximum 15 MB. Fișierul ajunge direct din browser în bucketul privat `project-documents`, prin clientul Supabase cu sesiunea utilizatorului; serverul rezervă și finalizează metadatele numai după verificarea membership-ului. Nu este folosit service role în fluxul normal.

Viewerul folosește PDF.js pentru documentele PDF și un strat SVG cu coordonate normalizate pentru geometrie. În Etapa 1 sunt funcționale desenarea manuală, selectarea, editarea vârfurilor, proprietățile camerelor, funcțiile smart, confirmarea și sumarul în timp real. Analiza automată este doar pregătită prin contracte neutre de provider și modele de job; nu rulează AI și nu generează produse, prețuri sau ofertă.

După migrarea Prisma, aplicați politicile Supabase ale configuratorului:

```bash
npm run db:deploy
npx prisma db execute --file supabase/migrations/20260731230000_plan_configurator_security.sql --schema prisma/schema.prisma
```

Arhitectura și delimitarea etapelor sunt documentate în [docs/PLAN_CONFIGURATOR.md](docs/PLAN_CONFIGURATOR.md).

Pentru conturi de test, creați utilizatori în Supabase Auth (fără parole în seed), confirmați e-mailurile într-un mediu de test, verificați apariția profilurilor, apoi creați membership-uri în cele două organizații separate. Puneți adresele/parolele testelor doar în variabile E2E locale/CI, niciodată în Git. Pașii compleți Vercel sunt în [docs/VERCEL_DEPLOYMENT.md](docs/VERCEL_DEPLOYMENT.md).

## Vercel

Importați repository-ul GitHub în Vercel. Configurați în mediile Development, Preview și Production: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, `DIRECT_URL`. Cheia service role nu se expune în browser. Build command: `npm run build`; `postinstall` rulează `prisma generate`.

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
