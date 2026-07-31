# Database Schema — NEXO Smart Buildings

## Convenţii

- PostgreSQL; toate cheile folosesc UUID, iar tabelele au `createdAt`/`updatedAt` când este relevant.
- sumele sunt `integer` în bani; procentele sunt `decimal`; moneda este cod ISO 4217.
- câmpurile flexibile au JSON validat la limita aplicaţiei, nu în UI.
- documentele fizice sunt în storage; baza de date păstrează metadate, versiuni şi permisiuni.

## Identitate şi GDPR

| Entitate | Câmpuri esenţiale | Relaţii |
| --- | --- | --- |
| `User` | id, email, passwordHash, name, status | memberships, sessions, consents |
| `Organization` | id, type, legalName, cui, billingData | memberships, projects |
| `Membership` | userId, organizationId, role | rol per organizaţie |
| `Session` | userId, tokenHash, expiresAt | autentificare |
| `Consent` | userId, type, granted, capturedAt, source | consimţăminte GDPR |
| `DataRequest` | userId, type, status, requestedAt | export/ştergere |
| `AuditLog` | actorId, action, entityType, entityId, metadata | jurnal de acţiuni |

## Catalog şi compatibilităţi

| Entitate | Câmpuri esenţiale | Relaţii |
| --- | --- | --- |
| `Manufacturer` | name, slug, website | products |
| `Category` | name, slug, parentId | products, arbore categorii |
| `Product` | sku, name, status, priceNet, vatRate, stock, deliveryDays | manufacturer, categories, attributes |
| `ProductAttributeDefinition` | code, label, dataType, unit, filterable | attribute values |
| `ProductAttributeValue` | productId, definitionId, valueJson | atribute extensibile |
| `ProductDocument` | productId, type, documentId | fişă, manual |
| `ProductRelation` | sourceProductId, targetProductId, relationType, validationStatus, note | graf de compatibilitate |
| `Package` / `PackageItem` | segment, name, pricing | pachete demo/comerciale |

`relationType`: `COMPATIBLE`, `INCOMPATIBLE`, `REQUIRES_GATEWAY`, `REQUIRES_POWER_SUPPLY`, `REQUIRES_LICENSE`, `REQUIRES_PROGRAMMING`, `RECOMMENDED_WITH`, `REPLACEMENT`, `ACCESSORY`. `validationStatus`: `DRAFT`, `VALIDATED`, `UNVERIFIED`, `RETIRED`.

## Configuratoare şi preţuri

| Entitate | Câmpuri esenţiale | Relaţii |
| --- | --- | --- |
| `ConfiguratorSession` | type, status, ownerId, organizationId, currentStep, answersJson | project, estimate |
| `ConfiguratorAnswer` | sessionId, key, valueJson, step | auditabilitate/răspunsuri |
| `PricingRule` | code, scope, applicationType, conditionsJson, activeFrom, activeTo, status | versions |
| `PricingRuleVersion` | ruleId, version, parametersJson, approvedBy | reguli istorice |
| `Estimate` | sessionId, currency, lowTotal, highTotal, disclaimerVersion | lines |
| `EstimateLine` | estimateId, category, lowAmount, highAmount, explanation | regulă sursă |

`PricingRule` suportă preţ fix, pe unitate/cameră/circuit/apartament, coeficient, interval, minim, rezervă, montaj şi programare. Rezultatele salvează versiunea regulii pentru reproductibilitate.

## Proiecte şi documente

| Entitate | Câmpuri esenţiale | Relaţii |
| --- | --- | --- |
| `Project` | code, name, type, status, organizationId, location | participants, timeline, documents |
| `ProjectParticipant` | projectId, userId, role | acces la proiect |
| `ProjectStatusHistory` | projectId, fromStatus, toStatus, actorId, note | timeline |
| `Document` | storageKey, filename, mimeType, sizeBytes, checksum | versions/comments |
| `ProjectDocument` | projectId, documentId, type, version, visibility | document asociat |
| `DocumentComment` | projectDocumentId, authorId, body | colaborare |
| `PlanElement` | projectId, planDocumentId, type, x, y, metadataJson | plan 2D MVP |

Statusurile proiectului sunt cele furnizate în brief şi se aplică printr-o tranziţie validată, care creează mereu istoric.

## Oferte, comenzi şi service

| Entitate | Câmpuri esenţiale | Relaţii |
| --- | --- | --- |
| `Offer` | projectId, number, status, validUntil, currency | versions |
| `OfferVersion` | offerId, version, totals, notes, pdfDocumentId | lines |
| `OfferLine` | versionId, type, description, quantity, unitPrice, vatRate, discount | produs/serviciu |
| `Order` | projectId, status, totals | order lines, payment records |
| `ServiceRequest` | projectId, status, priority, description | istoric |
| `Message` | projectId, authorId, body, visibility | comunicare portal |

## Indecşi şi constrângeri critice

- `User.email`, `Product.sku`, `Project.code`, `Offer.number` unice;
- indecşi pe `Project.organizationId`, `ProjectParticipant.userId`, `Document.storageKey`, `ProductRelation.sourceProductId`, `ConfiguratorSession.ownerId`;
- constrângere unică pentru relaţia produs-sursă/ţintă/tip;
- toate interogările portalului filtrează organizaţia şi/sau participarea înainte de returnare;
- ştergerea documentelor este soft-delete până la expirarea retenţiei configurate.
