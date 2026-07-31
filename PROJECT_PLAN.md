# NEXO Smart Buildings — Project Plan

## Scop

NEXO Smart Buildings este o platformă B2C/B2B pentru proiectarea, ofertarea, vânzarea şi livrarea soluţiilor de automatizare pentru case, ansambluri rezidenţiale, hoteluri şi clădiri comerciale. Platforma poziţionează compania ca integrator: proiectare, echipamente, instalare, programare şi mentenanţă.

## Obiective de produs

- prezentare clară a serviciilor şi generare de cereri calificate;
- configuratoare orientative pentru Casă, Bloc şi Hotel;
- catalog tehnic extensibil şi motor de compatibilitate bazat pe reguli validate;
- portal separat pentru client şi pentru echipa NEXO;
- trasabilitate a proiectelor, documentelor, ofertelor şi etapelor;
- estimări transparente, configurabile administrativ şi explicit necontractuale.

## Domeniu MVP

MVP-ul va valida fluxul complet: vizitator → configurator → proiect → documente → estimare/ofertă → portal client → administrare internă.

Include:

- site public, pagini de servicii, SEO de bază şi consimţământ cookie;
- catalog demonstrativ, categorii, produs, pachete şi compatibilităţi marcate după nivelul de validare;
- configuratoare Casă Smart şi Bloc Smart cu salvare progres şi estimare bazată pe reguli din baza de date;
- autentificare, RBAC verificat server-side şi portal client;
- proiecte, documente PDF/PNG/JPG/DWG, istoric de status şi comentarii;
- administrare produse, reguli de preţ şi proiecte;
- ofertă orientativă cu versiuni şi export PDF;
- seed demo, Docker Compose, testare critică şi documentaţie de instalare/deploy.

## În afara MVP

- configurator Hotel complet (se păstrează modelul de date şi traseul de extensie);
- plată online, facturare fiscală şi semnătură electronică calificată;
- interpretare/reconstrucţie automată PDF/DWG şi 3D productiv;
- integrări live PMS, ERP, curieri, furnizori, e-mail transactional, SMS şi servicii CAD;
- recomandări bazate pe AI fără catalog şi reguli tehnice validate.

## Etape

| Versiune | Accent | Rezultat |
| --- | --- | --- |
| MVP | Validarea fluxului comercial şi operaţional | configurare, proiect, estimare, ofertare internă, documente şi portal |
| V2 | Scalare operaţională | Hotel, coş/comenzi complete, integrare plăţi/facturare, notificări şi plan 2D |
| V3 | Integrare avansată | adaptori CAD, 3D separat, PMS/BMS/ERP, optimizări şi analitice |

## Presupuneri explicite

1. Moneda MVP este RON, iar preţurile se afişează cu TVA configurabil; motorul păstrează valori monetare în bani (`integer`).
2. Estimările sunt orientative şi afişează obligatoriu avertismentul necontractual; un angajat autorizează oferta finală.
3. Compatibilităţile comerciale/tehnice sunt introduse şi validate de administrator; regulile neverificate nu produc recomandări certe.
4. Datele demo sunt exemple fictive sau descriptive şi nu afirmă certificări, stocuri ori compatibilităţi reale.
5. Pentru dezvoltare, fişierele sunt stocate local printr-un adaptor; producţia va folosi un bucket S3 compatibil privat.
6. Nu se efectuează calcule de protecţii electrice finale şi nici proiectare executabilă a tabloului KNX fără proiectant autorizat.
7. Interfaţa iniţială este în română; textele sunt organizate pentru introducerea `ro`/`en` ulterior.

## Servicii externe necesare ulterior

| Capacitate | Adapter propus | MVP |
| --- | --- | --- |
| Stocare documente | S3-compatible (MinIO local) | adaptor + MinIO |
| Conversie DWG | serviciu CAD către DXF/SVG/PDF | mock, fără preview DWG |
| E-mail/SMS | provider transactional | interfaţă, fără expediere live |
| PDF | renderer server-side | implementare locală |
| Plăţi | procesator licenţiat | neimplementat |
| Facturare | provider fiscal/ERP | neimplementat |
| Hărţi/geocodare | provider extern | neimplementat |
| PMS/BMS/ERP | adaptoare per furnizor | neimplementat |

## Criterii de calitate

- TypeScript strict, validare Zod la toate intrările server-side şi acces controlat prin politici RBAC;
- fără secrete în repository; `.env.example` documentează doar numele variabilelor;
- audit pentru mutaţii administrative, izolare de date per organizaţie/client şi upload validat;
- componente accesibile, responsive şi metadate SEO;
- lint, typecheck şi teste unitare/E2E pentru fluxurile critice înaintea fiecărui milestone.

## Decizii de lucru

- Monolit modular Next.js, nu microservicii, pentru a reduce complexitatea MVP.
- Prisma/PostgreSQL rămân sursa de adevăr pentru datele de business.
- Reguli de estimare şi compatibilitate sunt date administrabile, evaluate de servicii de domeniu, nu condiţii în componente React.
- API-ul este implementat cu Route Handlers/server actions validate; UI-ul nu este autoritate pentru permisiuni.
