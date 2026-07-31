# NEXO Smart Buildings

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
