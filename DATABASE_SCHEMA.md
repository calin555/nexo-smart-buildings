# Database Schema — NEXO Smart Buildings

## Convenţii

- Supabase PostgreSQL; UUID pentru identităţi şi `createdAt`/`updatedAt` unde este relevant.
- Sumele viitoare se păstrează în bani (`integer`), procentele `decimal`, iar datele flexibile JSON validate la limita aplicaţiei.
- Documentele fizice nu sunt în PostgreSQL şi nici pe disk Vercel; Storage păstrează binarul, baza de date păstrează metadatele/permisiunile.

## Identitate şi GDPR

| Entitate | Câmpuri esenţiale | Relaţii |
| --- | --- | --- |
| `auth.users` | gestionat de Supabase Auth | parole şi sesiuni; neadministrat de Prisma |
| `profiles` | id UUID FK `auth.users.id`, email, name, status | memberships, consents |
| `organizations` | id UUID, type, legalName, cui, billingData | memberships, proiecte |
| `memberships` | profileId, organizationId, role | rol pe organizaţie |
| `roles` | code, label, scope | catalog extensibil roluri |
| `consents` | profileId, type, granted, source, capturedAt | consimţământ GDPR |
| `data_requests` | profileId, type, status, requestedAt | export/ştergere |
| `audit_logs` | actorId, action, entityType, entityId, metadata | jurnal de acţiuni |

Prisma modelează profilele şi business data. Foreign key-ul către `auth.users` şi trigger-ul de creare profil sunt SQL Supabase versionat, deoarece `auth` este un schema extern Prisma.

## Extensii business prevăzute

| Arie | Entităţi planificate |
| --- | --- |
| Catalog | manufacturers, categories, products, product_attributes, product_relations |
| Configurare | configurator_sessions, answers, pricing_rules, estimates |
| Proiecte | projects, project_participants, project_documents, status_history, plan_elements |
| Oferte | offers, offer_versions, offer_lines |
| Portal | messages, service_requests, orders |

## Indecşi şi constrângeri

- `profiles.id` este UUID şi FK către `auth.users(id)`; `profiles.email` este unic;
- `memberships(profileId, organizationId)` este unic;
- indecşi pe `memberships.profileId`, `memberships.organizationId`, `audit_logs.actorId` şi `audit_logs.createdAt`;
- serviciile server-side filtrează organizaţia înainte de returnarea datelor.

## RLS şi Storage

RLS este activ pentru `profiles`, `organizations`, `memberships`, `projects`, `project_participants`, `project_documents`, `configurator_sessions`, `estimates`, `offers` şi `messages`. Politicile verifică `auth.uid()` faţă de profil, membership sau participant proiect. Astfel un client nu poate citi ori modifica datele altui client prin apel direct API.

Bucket-urile `project-documents`, `product-documents`, `offer-pdfs` şi `project-images` sunt private. Politicile Storage urmează participaţia proiectului/organizaţiei, iar aplicaţia emite doar signed URLs cu expirare.
