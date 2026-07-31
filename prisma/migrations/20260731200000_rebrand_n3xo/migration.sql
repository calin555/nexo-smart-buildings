UPDATE "products"
SET "brand" = regexp_replace("brand", '^NEXO', 'N3XO'),
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "brand" LIKE 'NEXO%';

UPDATE "organizations"
SET "legalName" = 'N3XO Smart Buildings (Demo)',
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "legalName" = 'NEXO Smart Buildings (Demo)'
  AND NOT EXISTS (
    SELECT 1
    FROM "organizations"
    WHERE "legalName" = 'N3XO Smart Buildings (Demo)'
  );
