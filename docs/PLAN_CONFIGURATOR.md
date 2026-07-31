# Configurator pe plan — arhitectură Etapele 1–2

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

## Funcțional în Etapa 2

`PlanAnalysisProvider` este independent de UI și expune operații pentru document, camere, etichete, dimensiuni, goluri și confidence. Implementarea implicită folosește OpenAI Responses API numai pe server. PDF-urile sunt trimise ca fișiere, iar imaginile ca intrări vizuale; răspunsul este constrâns de o schemă JSON strictă și validat din nou cu Zod înainte de salvare.

Fluxul este asincron din perspectiva requestului HTTP:

1. API-ul creează `PlanAnalysis` și `AnalysisJob` în starea `QUEUED` și răspunde cu `202`.
2. Procesarea continuă prin `after()`, validează semnătura reală și dimensiunea fișierului, apoi marchează jobul `PROCESSING`.
3. Providerul returnează camere, etichete, dimensiuni, uși/ferestre și pereți într-un JSON structurat. Coordonatele sunt validate în intervalul `0..1`.
4. Camerele sunt create cu `source=AI`, `detectionStatus=DETECTED` și `isConfirmed=false`; rezultatul brut validat rămâne în `PlanAnalysis.rawResult`.
5. Jobul trece în `NEEDS_REVIEW`. UI-ul afișează progresul, numărul camerelor, erorile sigure și butonul de reluare.
6. Utilizatorul poate corecta numele, tipul, suprafața sau poligonul. Orice corecție AI devine `MODIFIED` și rămâne neconfirmată până la acțiunea explicită de confirmare.
7. După confirmarea tuturor camerelor AI ale documentului, analiza și documentul trec în `COMPLETED`.

Etichetele de încredere sunt:

- peste `0.85`: „Detectat cu încredere ridicată”;
- între `0.60` și `0.85`: „Verificare recomandată”;
- sub `0.60`: „Necesită corectare”.

O eroare de provider, timeout, semnătură invalidă sau rezultat invalid trece jobul în `FAILED`, creează un `AnalysisIssue` fără date sensibile și lasă editorul manual complet funcțional. Nu sunt confirmate automat camerele și detecțiile AI neconfirmate pot fi înlocuite în siguranță la retry.

## Configurare provider

- `OPENAI_API_KEY`: secret exclusiv server-side; nu folosiți prefixul `NEXT_PUBLIC_`.
- `PLAN_ANALYSIS_MODEL`: implicit `gpt-5.6`.
- fără cheie, analiza automată răspunde controlat cu `503`, iar desenarea manuală rămâne disponibilă;
- providerul deterministic este disponibil numai cu `E2E_PLAN_ANALYSIS_ENABLED=1` și este blocat explicit în producție.

URL-ul semnat al planului expiră după zece minute. Cheia Supabase service role nu este folosită la analiză; signed URL-ul este creat cu sesiunea utilizatorului după verificarea membership-ului și a `organizationId`. Cererile de analiză sunt limitate la patru pe oră pentru fiecare utilizator și sunt auditate.

Etapa 2 nu selectează produse, nu calculează prețuri și nu generează oferte. Preseturile, cantitățile comerciale și motorul de recomandare rămân pentru Etapa 3.
