# NEXO Smart Buildings — Project Plan

## Scop şi obiective

NEXO Smart Buildings este o platformă B2C/B2B pentru proiectarea, ofertarea, vânzarea şi livrarea soluţiilor de automatizare pentru case, ansambluri rezidenţiale, hoteluri şi clădiri comerciale. Platforma poziţionează compania ca integrator: proiectare, echipamente, instalare, programare şi mentenanţă.

MVP-ul validează fluxul vizitator → configurare → proiect → documente → estimare/ofertă → portal client → administrare. În fundaţia curentă se implementează doar identitatea, organizaţiile, RBAC, layout-urile şi infrastructura de deploy; catalogul, configuratoarele, upload-ul final, plăţile şi 3D rămân în milestone-uri ulterioare.

## Arhitectură aprobată

- Next.js App Router, React şi TypeScript strict;
- Vercel pentru toate mediile de producţie şi preview;
- Supabase PostgreSQL, Supabase Auth, Supabase Storage şi Row Level Security;
- Prisma ORM pentru date de business complexe, cu migraţii versionate;
- GitHub ca sursă a repository-ului şi trigger de deploy Vercel.

Nu se folosesc microservicii în MVP. MinIO/Docker nu sunt componente de producţie; Docker Compose poate rămâne doar un ajutor local opţional.

## Identitate, acces şi date

- Supabase Auth deţine `auth.users`, parolele, resetarea parolelor şi sesiunile.
- Tabelul public `profiles` are un UUID care referă `auth.users.id`; aplicaţia nu are tabele de parole sau sesiuni.
- `organizations`, `memberships`, `roles`, `consents`, `data_requests` şi `audit_logs` aparţin schemei publice.
- RLS protejează apelurile directe Supabase; serviciile Next.js aplică suplimentar RBAC server-side.
- Service role este strict server-side şi nu este importat în bundle-ul browser.

## Servicii şi stocare

| Capacitate | Soluţie | Stare fundaţie |
| --- | --- | --- |
| Auth | Supabase Auth prin `@supabase/ssr` | login, logout, resetare |
| Date | Supabase Postgres + Prisma | schemă/migraţii versionate |
| Documente | Supabase Storage | bucket-uri private şi politici pregătite |
| Preview document | signed URL cu expirare | contract de infrastructură |
| CAD, e-mail, plăţi, ERP | adaptoare externe | neimplementate |

Bucket-urile private aprobate sunt `project-documents`, `product-documents`, `offer-pdfs` şi `project-images`.

## Presupuneri explicite

1. Proiectul Supabase şi proiectul Vercel sunt administrate de organizaţie; cheile nu se introduc în Git.
2. `DATABASE_URL` este URL pooled pentru runtime, iar `DIRECT_URL` este URL direct pentru Prisma migrate.
3. Produsul nu depinde de filesystem persistent în Vercel; orice fişier viitor merge în Supabase Storage.
4. Compatibilităţile, estimările şi datele demo viitoare sunt validate/administrate înainte de a fi prezentate ca certe.
5. UI-ul este în română, cu structură pregătită pentru engleză.

## Etape

| Versiune | Accent | Rezultat |
| --- | --- | --- |
| MVP | Flux comercial şi operaţional | identitate, configurare, proiect, estimare, ofertare, documente şi portal |
| V2 | Scalare operaţională | Hotel, comenzi, notificări, CAD 2D şi integrări administrative |
| V3 | Integrare avansată | 3D separat, PMS/BMS/ERP, analitice şi automatizări |

## Criterii de calitate

- TypeScript strict, Zod la graniţele server-side, acces RBAC şi RLS;
- fără secrete în repository; `.env.example` conţine numai nume de variabile;
- audit pentru mutaţii administrative, izolare per organizaţie şi rate limiting de bază;
- lint, typecheck, teste unitare/E2E şi build înaintea fiecărui milestone;
- deploy Vercel repetabil din GitHub, fără `prisma db push` în producţie.
