# Arhitectură N3XO Smart Buildings

## Principii

- Next.js App Router, TypeScript strict și verificări server-side.
- Supabase Auth SSR pentru identitate; RLS și RBAC nu sunt substituite de UI.
- Prisma este folosit server-side numai pentru operații interne controlate și scoping explicit pe organizație.
- Echipamentele rămân modele tehnice interne; nu sunt expuse ca magazin public.
- Soluțiile și kiturile sunt suprafața comercială publică.

## Module

- `public-solutions`: pagini pe tip de clădire și domeniu tehnic.
- `kits`: pachete orientative și configurator comercial.
- `plan-configurator`: plan, camere, funcții, recomandări și estimare.
- `equipment`: echipamente, producători, compatibilități și prețuri, exclusiv intern/admin.
- `projects`: proiecte și izolare pe organizație.
- `estimates-offers`: estimări, liste orientative și oferte; nu checkout.
- `portal`: proiecte, planuri, configurări, documente, etape, mesaje și service.
- `admin`: reguli, kituri, echipamente, proiecte și oferte.
- `audit`: operații administrative și schimbări relevante.

## Separarea accesului

- Browser public: conținut de soluții, kituri și proiecte demonstrative; fără acces la tabelele interne de echipamente.
- Browser autentificat: Supabase client cu sesiunea utilizatorului și politici RLS.
- Server: Prisma cu RBAC și `organizationId` obligatoriu pentru date client.
- Service role: numai operații administrative justificate și auditate; niciodată în fluxurile normale de autentificare sau portal.

## Infrastructură neschimbată

Supabase Auth, PostgreSQL, RLS, RBAC, izolarea organizațiilor, Vercel și fluxul de deployment rămân conform fundației validate.
