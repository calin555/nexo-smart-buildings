# Roadmap — NEXO Smart Buildings

## 0. Fundaţie — curent

- [x] analiză de scop, ipoteze şi integrare externă
- [x] arhitectură modulară şi model de date
- [x] structură iniţială repository şi Docker local
- [x] iniţializare Next.js, dependenţe şi controale de calitate

## MVP

1. **Platformă de bază** — Next.js, Prisma/PostgreSQL, autentificare, RBAC, layout, design system, i18n-ready, Docker, seed. **Finalizat la 31.07.2026.**
2. **Public şi catalog** — pagini publice, SEO, produse, categorii, pachete, produs individual, compatibilităţi validate.
3. **Configurare şi estimare** — wizard Casă/Bloc, salvare progres, reguli administrabile, rezultat orientativ, PDF.
4. **Proiecte şi documente** — creare proiect, portal client, status history, upload sigur, preview PDF/imagine, DWG mock, plan 2D simplificat.
5. **Admin şi ofertare** — produse, reguli preţ, proiecte, oferte cu versiuni/PDF, audit.
6. **Calitate şi livrare** — unit/E2E, accesibilitate, securitate, documentaţie de deploy şi verificare de acceptare.

## Versiunea 2

- configurator Hotel complet şi extinderea BMS;
- coş, comandă, plăţi prin adapter şi facturare/ERP prin adapter;
- notificări e-mail/SMS şi programări;
- integrare reală conversie DWG, plan 2D avansat şi selecţie echipamente;
- portal instalator/proiectant, service şi flux operaţional extins;
- pagini locale SEO şi conţinut editorial gestionabil.

## Versiunea 3

- prototip 3D separat, validat cu utilizatori înainte de integrare;
- PMS pentru hoteluri, BMS/monitorizare şi integrări furnizori;
- analitice, SLA/mentenanţă predictivă şi recomandări asistate;
- semnătură electronică, automatizări de ofertare şi procurement avansat.

## Riscuri şi măsuri

| Risc | Măsură |
| --- | --- |
| Date de compatibilitate incomplete | stări de validare, sursă, avertismente şi aprobare tehnică |
| Estimări percepute ca ofertă fermă | disclaimer persistent, versiuni şi aprobare internă |
| Documente CAD complexe | upload separat + adapter mock, fără promisiune de preview |
| GDPR/documente sensibile | storage privat, URLs semnate, retenţie şi audit |
| Domeniu prea larg | milestone-uri demonstrabile şi evitarea integrărilor live în MVP |

## Gate înainte de module complexe

Înainte de plan 2D avansat, conversie CAD, plăţi, integrare PMS/ERP sau 3D, se aprobă separat: furnizorul, costul, contractul de date, modelul de permisiuni, testele de acceptare şi planul de fallback.
