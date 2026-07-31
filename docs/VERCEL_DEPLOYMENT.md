# Deploy Vercel + Supabase

## Conectarea repository-ului

1. Publicați acest repository Git în organizația GitHub aprobată.
2. În Vercel, importați repository-ul, păstrați framework-ul Next.js și nu configurați un filesystem persistent.
3. Vercel rulează `npm ci` (care execută `postinstall` → `prisma generate`) și `npm run build` prin [vercel.json](../vercel.json).

## Variabile de mediu

Configurați aceleași nume în Development, Preview și Production: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, `DIRECT_URL`.

`DATABASE_URL` este URL-ul pooled Supabase (port 6543, `pgbouncer=true`) folosit numai în runtime. `DIRECT_URL` este URL-ul direct (port 5432) folosit de Prisma migrate. Cheia service role este numai server-side, nu începe cu `NEXT_PUBLIC_` și nu este folosită de codul browser.

Pentru Preview, `NEXT_PUBLIC_SITE_URL` este URL-ul preview Vercel; pentru Production este domeniul final HTTPS. În Supabase Auth → URL Configuration adăugați ambele valori ca Redirect URLs, inclusiv `/auth/callback`.

## Înainte de release

1. Rulați `npm run db:deploy` într-un job CI protejat, cu `DIRECT_URL` Production.
2. Rulați migrația SQL din `supabase/migrations` în Supabase SQL migration runner.
3. Rulați `npm run db:seed` doar pentru roluri/organizații demo aprobate.
4. Verificați `npm run lint`, `npm run typecheck`, `npm test`, E2E și `npm run build`.

Nu rulați `prisma db push` în producție și nu rulați migrații în timpul buildului Vercel.

## Rollback

Reveniți în Vercel la ultimul deployment sănătos. Migrațiile SQL/Prisma sunt additive; pentru o migrație distructivă se pregătește în prealabil o migrație de rollback și backup Supabase. Nu restaurați schema manual fără aprobarea responsabilului de date.

## Matrice de acces

| Operație | Mecanism |
| --- | --- |
| Login/logout/reset/callback | Supabase SSR client cu sesiunea utilizatorului |
| Portal client | Supabase session + RLS, apoi RBAC server-side |
| Business server-side | Prisma numai după verificare RBAC; nu se expune browserului |
| Administrare excepțională | service role server-side, cu audit obligatoriu |

În fundația curentă service role nu este apelată. Orice utilizare viitoare necesită caz de utilizare explicit, audit și test de autorizare.
