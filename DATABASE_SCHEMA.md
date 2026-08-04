# Schema de date — direcție funcțională

Schema Prisma existentă rămâne sursa tehnică actuală. Această schimbare de direcție nu elimină și nu migrează modelele existente.

## Identitate și organizații

- `User` / `profiles`: identitate și stare profil.
- `Organization`: client individual sau organizațional.
- `Membership`: rol și apartenență; toate operațiile client sunt izolate pe organizație.
- `Session`, `Consent`, `AuditLog`: sesiune, consimțământ și trasabilitate.

## Proiectare și configurare

- Proiecte, planuri, camere și funcții configurate.
- Joburi de analiză și confirmarea camerelor.
- Estimări, versiuni de configurație și liste orientative de materiale.
- Oferte și documente asociate proiectului.

## Echipamente interne

Modelul tehnic de produs/echipament se păstrează pentru:

- reguli de kit;
- compatibilități și protocoale;
- prețuri orientative;
- recomandări pe cameră;
- liste de materiale;
- generarea ofertelor;
- administrare internă.

Câmpul de activare indică disponibilitatea pentru calculele interne, nu publicarea într-un magazin. Nu există cerință publică pentru stoc, coș, checkout sau comandă clasică.

## Evoluții planificate

Modelele dedicate pentru kituri, reguli, compatibilități, estimări, oferte, mesaje, intervenții și mentenanță vor fi introduse numai în milestone-urile aprobate, cu migrații, RLS și audit adecvate.
