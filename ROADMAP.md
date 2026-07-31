# Roadmap — N3XO Smart Buildings

## 0. Fundaţie — curent

- [x] analiză de scop, ipoteze şi integrare externă
- [x] arhitectură modulară şi model de date
- [x] structură iniţială repository
- [x] fundament Vercel + Supabase: Auth SSR, RLS, Prisma, RBAC, layout, seed şi controale de calitate
- [x] validare infrastructură Supabase/Vercel cu URL-uri PostgreSQL reale, migrații aplicate și E2E live

## MVP

1. **Platformă de bază** — Next.js, Supabase Auth/PostgreSQL/Storage/RLS, Prisma, RBAC, layout, design system, Vercel şi seed. **Finalizat la 31.07.2026.**
2. **Public şi catalog** — pagini publice, SEO, produse, categorii, pachete şi compatibilităţi validate.
3. **Configurare şi estimare** — wizard Casă/Bloc, salvare progres, reguli administrabile şi rezultat orientativ.
4. **Proiecte şi documente** — proiecte, portal client, status history, upload sigur, preview şi plan 2D simplificat.
5. **Admin şi ofertare** — produse, reguli preţ, proiecte, oferte cu versiuni/PDF şi audit.
6. **Calitate şi livrare** — unit/E2E, accesibilitate, securitate şi documentaţie deploy.

## Configurator pe plan

- [x] **Etapa 1 — MVP manual (31.07.2026):** proiecte, documente PDF/JPG/PNG private, viewer PDF.js/imagine, pagini, desenare și editare poligoane normalizate, proprietăți camere, funcții smart, confirmare, sumar live, RLS/RBAC și teste inter-organizații.
- [x] **Etapa 2 — analiză asistată (31.07.2026):** provider modular, procesare asincronă cu job persistent, validarea fișierului înainte de procesare, detecții structurate, camere și geometrii normalizate, scoruri de încredere, progres/retry, confirmare/corectare, fallback manual și teste inter-organizații.
- [x] **Etapa 3 — preseturi și recomandări (31.07.2026):** opt preseturi tehnice, cantități editabile/estimate după suprafață, agregare live a cerințelor și produse candidate din catalog pe categorii, fără preț final sau comandă automată.
- [ ] **Etape ulterioare:** reguli comerciale administrabile, validare tehnică produs-protocol, calcul financiar și ofertare, numai după aprobarea separată a acestora.

## Versiunea 2

- configurator Hotel, comandă/facturare prin adaptoare şi notificări;
- conversie DWG şi plan 2D avansat;
- portal instalator/proiectant, service şi SEO local.

## Versiunea 3

- prototip 3D separat şi validat;
- PMS/BMS/ERP, analitice şi automatizări operaţionale.

## Gate înainte de module complexe

Înainte de CAD, plăţi, PMS/ERP, Storage productiv extins ori 3D se aprobă furnizorul, costul, modelul de date/permisiuni, testele de acceptare şi fallback-ul.
