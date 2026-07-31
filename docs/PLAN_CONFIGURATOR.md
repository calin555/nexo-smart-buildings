# Configurator pe plan — arhitectură Etapa 1

## Flux funcțional

1. Utilizatorul autentificat creează un proiect pentru una dintre organizațiile în care are membership.
2. Serverul validează fișierul (PDF/JPEG/PNG, maximum 15 MB), sanitizează numele și rezervă un `ProjectDocument` cu o cale prefixată de `organizationId/projectId`.
3. Browserul încarcă fișierul direct în bucketul privat `project-documents` folosind clientul Supabase și sesiunea utilizatorului. Politica Storage verifică membership-ul pentru primul segment al căii.
4. Serverul finalizează documentul și generează un URL semnat, temporar, numai după o nouă verificare a proiectului și organizației.
5. PDF.js randează pagina pe canvas; pentru imaginile JPG/PNG se folosește URL-ul semnat. Un strat SVG păstrează poligoanele camerelor în coordonate normalizate `0..1`, independente de rezoluție și zoom.
6. API-urile server-side pentru camere filtrează întotdeauna după `projectId` și `organizationId`, verifică RBAC, validează datele cu Zod și scriu audit log.

## Model de date

- `Project`: proiectul unei organizații.
- `ProjectDocument`: fișier privat și starea procesării.
- `ProjectDocumentPage`: paginile documentului.
- `ProjectRoom`: cameră detectată sau desenată manual.
- `ProjectRoomGeometry`: versiuni ale poligonului normalizat.
- `RoomFeature` / `RoomFeatureValue`: funcții smart și parametri extensibili.
- `PlanAnalysis`, `AnalysisJob`, `AnalysisIssue`: infrastructură pentru procesare asincronă ulterioară.

Toate entitățile operaționale poartă sau moștenesc organizația proiectului. RLS protejează citirile cu sesiunea utilizatorului, iar mutațiile Prisma sunt protejate server-side prin membership și `organizationId`.

## Securitate și clienți de date

- **Supabase cu sesiunea utilizatorului:** upload în Storage privat și generarea URL-urilor semnate pentru documentele propriei organizații.
- **Prisma server-side:** proiecte, metadate, camere, geometrii, funcții și audit, mereu după verificarea membership-ului și cu filtre de organizație.
- **Service role:** nu este folosit de fluxul aplicației. Suita E2E îl poate folosi exclusiv în teardown pentru ștergerea obiectului temporar încărcat; cheia rămâne server-side și nu este logată.

Bucketul acceptă doar `application/pdf`, `image/jpeg` și `image/png`, cu limită de 15 MB. Numele original este sanitizat, iar calea reală este generată de server din UUID-uri. Fișierele nu sunt publice și nu sunt copiate în `/public`.

## Funcțional în Etapa 1

- creare și listare proiecte;
- upload securizat PDF/JPG/PNG;
- documente multi-pagină PDF;
- zoom, pan, selectare, desenare manuală și editarea vârfurilor;
- tip, nume, suprafață, nivel și observații pentru cameră;
- funcții smart pe categorii și cantități;
- confirmare, ștergere și sumar în timp real;
- fallback manual complet, chiar dacă analiza automată nu există;
- izolare între organizații în UI, API și Storage.

## Pregătit pentru Etapa 2, dar neimplementat

`PlanAnalysisProvider` definește contracte neutre pentru pornirea analizei, citirea statusului și rezultatele cu geometrii normalizate. Modelele suportă stările `QUEUED`, `PROCESSING`, `COMPLETED`, `FAILED`, progres, retry și probleme de analiză. Butonul „Analizează planul” informează utilizatorul că funcția nu este încă activă.

Nu există provider AI, detectare automată, OCR, selecție de produse, calcul de preț sau generare de ofertă în Etapa 1.
