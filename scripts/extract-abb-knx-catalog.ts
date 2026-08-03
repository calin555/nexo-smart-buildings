import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

import { productCategories, type ProductCategory } from "../src/modules/products/categories";

const tokenSchema = z.object({
  Token: z.string().min(20),
  AppCode: z.string().min(1),
});

const imageSchema = z
  .object({
    url: z.string().url().optional(),
    thumbnailUrl: z.string().url().optional(),
    masterUrl: z.string().url().optional(),
    noImage: z.boolean().optional(),
  })
  .passthrough();

const attributeSchema = z
  .object({
    values: z.array(z.object({ text: z.string().optional() }).passthrough()).optional(),
  })
  .passthrough();

const productSchema = z
  .object({
    productId: z.string().min(3),
    inactive: z.boolean().optional(),
    published: z.boolean().optional(),
    replacements: z.unknown().optional(),
    images: z.array(imageSchema).optional(),
    attributes: z.record(attributeSchema).optional(),
    classifications: z
      .object({
        breadcrumbs: z
          .object({ Products: z.array(z.unknown()).optional() })
          .passthrough()
          .optional(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough();

const searchResponseSchema = z.object({
  products: z.object({
    totalCount: z.number().int().nonnegative(),
    items: z.array(productSchema),
  }),
});

const sourceCategories = [
  { cid: "9AAC189143", key: "power", label: "Surse de alimentare" },
  {
    cid: "9AAC189147",
    key: "infrastructure",
    label: "Infrastructură și interfețe",
  },
  { cid: "9AAC189160", key: "inputs", label: "Intrări" },
  { cid: "9AAC189166", key: "outputs", label: "Ieșiri" },
] as const;

type SourceCategory = (typeof sourceCategories)[number];
type AbbProduct = z.infer<typeof productSchema>;
type Illustration = "CUSTOM" | "BLINDS" | "CLIMATE" | "ENERGY";

type NormalizedProduct = {
  reference: string;
  sourceCategory: SourceCategory["label"];
  sourceCategoryId: string;
  displayNameOriginal: string;
  catalogueDescriptionOriginal: string;
  name: string;
  description: string;
  category: ProductCategory;
  imagePath: string;
  officialImageUrl: string;
  illustration: Illustration;
  sortOrder: number;
  breadcrumbs: string[];
};

const apiBaseUrl = "https://external.productinformation.abb.com/PisWebApi/v1";
const tokenUrl = "https://new.abb.com/api/PisSearchApi/Token";
const outputDirectory = path.resolve(process.cwd(), "public", "images", "products", "abb-knx");
const outputFile = path.resolve(process.cwd(), "data", "abb-knx-products.json");

function attributeText(product: AbbProduct, attribute: string): string {
  return product.attributes?.[attribute]?.values?.[0]?.text?.trim() ?? "";
}

function replacementCount(product: AbbProduct): number {
  const replacements = product.replacements;
  if (Array.isArray(replacements)) return replacements.length;
  if (!replacements || typeof replacements !== "object") return 0;
  const record = replacements as Record<string, unknown>;
  if (typeof record.Count === "number") return record.Count;
  if (typeof record.count === "number") return record.count;
  return Array.isArray(record.items) ? record.items.length : 0;
}

function breadcrumbNames(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap(breadcrumbNames);
  if (!value || typeof value !== "object") return [];
  const name = (value as Record<string, unknown>).name;
  return typeof name === "string" ? [name] : [];
}

function officialImage(product: AbbProduct): string | null {
  const image = product.images?.find((candidate) => candidate.noImage !== true);
  const url = image?.url ?? image?.masterUrl ?? image?.thumbnailUrl;
  if (!url || /no[-_]?image/i.test(url)) return null;
  return url;
}

function isCurrentProduct(product: AbbProduct): boolean {
  return (
    product.inactive !== true &&
    product.published === true &&
    replacementCount(product) === 0 &&
    officialImage(product) !== null
  );
}

const translations: ReadonlyArray<readonly [RegExp, string]> = [
  [/Uninterruptible KNX Power Supply/gi, "Sursă de alimentare KNX neîntreruptibilă"],
  [/Uninterruptible Power Supply/gi, "Sursă de alimentare neîntreruptibilă"],
  [/Commissioning Power Supply/gi, "Sursă de alimentare pentru punere în funcțiune"],
  [/Power Supply with Diagnostics/gi, "Sursă de alimentare cu diagnoză"],
  [/EIB Power Supply/gi, "Sursă de alimentare EIB"],
  [/Power Supply/gi, "Sursă de alimentare"],
  [/Analogue Actuator Module/gi, "Modul actuator analogic"],
  [/Analogue Actuator/gi, "Actuator analogic"],
  [/Analogue Input/gi, "Intrare analogică"],
  [/Binary Input/gi, "Intrare binară"],
  [/Binary Output/gi, "Ieșire binară"],
  [/Universal Interface/gi, "Interfață universală"],
  [/Optical Fibre Interface/gi, "Interfață cu fibră optică"],
  [/Interface RS232/gi, "Interfață RS232"],
  [/IP Router/gi, "Router IP"],
  [/IP Interface/gi, "Interfață IP"],
  [/USB Interface/gi, "Interfață USB"],
  [/IP Gateway/gi, "Gateway IP"],
  [/KNX\/EnOcean Gateway/gi, "Gateway KNX/EnOcean"],
  [/Modbus RTU-KNX TP Gateway/gi, "Gateway Modbus RTU–KNX TP"],
  [/Line Coupler/gi, "Cuplor de linie"],
  [/Area Coupler/gi, "Cuplor de zonă"],
  [/Switch\/Shutter Actuator/gi, "Actuator de comutare și jaluzele"],
  [/Switch\/Dim Actuator/gi, "Actuator de comutare și dimare"],
  [/Dimming Actuator/gi, "Actuator de dimare"],
  [/Dim Actuator/gi, "Actuator de dimare"],
  [/Combi Switch Actuator/gi, "Actuator combinat de comutare"],
  [/Switch Actuator/gi, "Actuator de comutare"],
  [/Switchactuator/gi, "Actuator de comutare"],
  [/Blind\/Roller Shutter Actuator/gi, "Actuator pentru jaluzele și rulouri"],
  [/Blind Actuator/gi, "Actuator pentru jaluzele"],
  [/Heating Actuator/gi, "Actuator pentru încălzire"],
  [/Fan Coil Actuator/gi, "Actuator pentru ventiloconvector"],
  [/Valve Drive Actuator/gi, "Actuator pentru vane"],
  [/Room Master/gi, "Controler de cameră"],
  [/Logic Controller/gi, "Controler logic"],
  [/Energy Analyzer/gi, "Analizor de energie"],
  [/Energy Meter/gi, "Contor de energie"],
  [/Light Controller/gi, "Controler de iluminat"],
  [/Combi Actuator/gi, "Actuator combinat"],
  [/I\/O Actuator/gi, "Actuator de intrări/ieșiri"],
  [/Battery Module/gi, "Modul de baterii"],
  [/Sealed Lead Acid Battery/gi, "Baterie etanșă cu plumb-acid"],
  [/Choke/gi, "Bobină de șoc"],
  [/Weather Station/gi, "Stație meteo"],
  [/Weather Sensor Basic/gi, "Senzor meteo de bază"],
  [/Weather Sensor/gi, "Senzor meteo"],
  [/Weather Unit/gi, "Unitate meteo"],
  [/Wall Mounting Adapter/gi, "Adaptor pentru montaj pe perete"],
  [/Wall mounting/gi, "Suport pentru montaj pe perete"],
  [/Mast Mounting Adapter/gi, "Adaptor pentru montaj pe catarg"],
  [/Magnetic Contact/gi, "Contact magnetic"],
  [/Cable Set, Extension/gi, "Set de cabluri pentru extensie"],
  [/Cable Set, Basic/gi, "Set de cabluri de bază"],
  [/Hotel IP Link, Bundle/gi, "Interfață IP pentru hotel, pachet"],
  [/IP Patch Module/gi, "Modul de interconectare IP"],
  [/IP Switch Master/gi, "Switch IP principal"],
  [/IP Switch Slave/gi, "Switch IP secundar"],
  [/IP Switch PoE/gi, "Switch IP PoE"],
  [/IP Switch/gi, "Switch IP"],
  [/KNX\/MP-Bus Controller/gi, "Controler KNX/MP-Bus"],
  [/Interface/gi, "Interfață"],
  [/(\d+)-fold/gi, "$1 canale"],
  [/(\d+)fold/gi, "$1 canale"],
  [/(\d+)fach/gi, "$1 canale"],
  [/(\d+)-f\b/gi, "$1 canale"],
  [/(\d+)f\.\b/gi, "$1 canale"],
  [/Contact Scanning/gi, "scanare contacte"],
  [/Manual Operation/gi, "operare manuală"],
  [/manual operation/gi, "operare manuală"],
  [/C-Load with Current Detection/gi, "sarcină capacitivă cu măsurarea curentului"],
  [/C-Load/gi, "sarcină capacitivă"],
  [/Energy Function/gi, "funcție de măsurare a energiei"],
  [/Secure/gi, "securizat"],
  [/8 Ports/gi, "8 porturi"],
  [/5 Port/gi, "5 porturi"],
  [/100 Points/gi, "100 puncte"],
  [/Fast Ethernet/gi, "Fast Ethernet"],
  [/for Weather Sensor/gi, "pentru senzor meteo"],
  [/for WES\/A4\.1\.1/gi, "pentru WES/A4.1.1"],
  [/Bundle/gi, "pachet"],
  [/surface mounted/gi, "montaj aparent"],
  [/flush mounted/gi, "montaj încastrat"],
  [/\bSM\b/g, "montaj aparent"],
  [/\bFM\b/g, "montaj încastrat"],
  [/\bMDRC\b/g, "pentru șină DIN"],
];

function translateTechnicalName(value: string): string {
  let translated = value.replace(/\s+/g, " ").trim();
  for (const [pattern, replacement] of translations) {
    translated = translated.replace(pattern, replacement);
  }
  return translated.replace(/\s+,/g, ",").replace(/,\s*,/g, ",").trim();
}

function productCategory(source: SourceCategory, text: string): ProductCategory {
  if (source.key === "power" || source.key === "infrastructure") {
    return "Gateway-uri & telecomenzi";
  }
  if (source.key === "inputs") return "Accesorii & senzori";

  const normalized = text.toLowerCase();
  if (/blind|shutter|jaluz|rulou/.test(normalized)) return "Întrerupătoare & umbrire";
  if (/dim|dali|light|ilumin/.test(normalized)) return "Iluminat inteligent";
  if (/heating|fan coil|valve|hvac|încălz|ventilo|van[ea]/.test(normalized)) {
    return "Confortul casei";
  }
  return "Prize / relee smart";
}

function illustration(category: ProductCategory, text: string): Illustration {
  if (category === "Întrerupătoare & umbrire") return "BLINDS";
  if (category === "Confortul casei") return "CLIMATE";
  if (/energy|meter|energie|contor/i.test(text)) return "ENERGY";
  return "CUSTOM";
}

function descriptionFor(source: SourceCategory, translated: string, reference: string): string {
  const introduction: Record<SourceCategory["key"], string> = {
    power:
      "Echipament ABB i-bus KNX pentru alimentarea magistralei și integrarea într-o instalație profesională.",
    infrastructure:
      "Componentă de infrastructură ABB i-bus KNX pentru conectarea, segmentarea sau integrarea magistralei.",
    inputs:
      "Modul de intrare ABB i-bus KNX pentru preluarea semnalelor și transmiterea comenzilor în sistemul de automatizare.",
    outputs:
      "Actuator ABB i-bus KNX pentru comanda sigură și configurabilă a circuitelor clădirii.",
  };
  return `${introduction[source.key]} Configurație: ${translated}. Cod comercial ABB: ${reference}. Parametrizarea se realizează în ETS, conform documentației oficiale a produsului.`;
}

function safeFileStem(reference: string): string {
  return reference
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function imageExtension(url: string, contentType: string | null): string {
  if (contentType?.includes("webp")) return ".webp";
  if (contentType?.includes("jpeg")) return ".jpg";
  if (contentType?.includes("png")) return ".png";
  const extension = path.extname(new URL(url).pathname).toLowerCase();
  return [".png", ".jpg", ".jpeg", ".webp"].includes(extension) ? extension : ".png";
}

async function fetchToken(): Promise<z.infer<typeof tokenSchema>> {
  const response = await fetch(tokenUrl, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Tokenul ABB nu a putut fi obținut (${response.status}).`);
  return tokenSchema.parse(await response.json());
}

async function fetchCategory(
  category: SourceCategory,
  token: z.infer<typeof tokenSchema>,
): Promise<AbbProduct[]> {
  const response = await fetch(`${apiBaseUrl}/Products/Search`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token.Token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      appSettings: {
        countryCode: "RO",
        treeType: "Products",
        appCode: token.AppCode,
        langCode: "en",
        client: { userAgent: "N3XO ABB catalogue importer" },
        variant: { clustering: true },
      },
      dataTypes: ["Products"],
      pager: { page: 1, pageSize: 500 },
      search: {
        cid: category.cid,
        partType: "All",
        searchType: "WithAllWords",
        filterSettings: [],
      },
      sort: { field: "Product", direction: "Ascending" },
      maxProductImages: 1,
      includeProductClassifications: true,
    }),
  });
  if (!response.ok) {
    throw new Error(`Categoria ABB ${category.label} nu a putut fi citită (${response.status}).`);
  }
  const result = searchResponseSchema.parse(await response.json());
  if (result.products.items.length !== result.products.totalCount) {
    throw new Error(
      `Răspuns incomplet pentru ${category.label}: ${result.products.items.length}/${result.products.totalCount}.`,
    );
  }
  return result.products.items;
}

async function downloadImage(reference: string, url: string): Promise<string> {
  const response = await fetch(url, { headers: { Accept: "image/*" } });
  if (!response.ok) throw new Error(`Imaginea ABB pentru ${reference} nu poate fi descărcată.`);
  const contentType = response.headers.get("content-type");
  if (!contentType?.startsWith("image/")) {
    throw new Error(`Resursa ABB pentru ${reference} nu este o imagine.`);
  }
  const extension = imageExtension(url, contentType);
  const filename = `${safeFileStem(reference)}${extension}`;
  await writeFile(path.join(outputDirectory, filename), Buffer.from(await response.arrayBuffer()));
  return `/images/products/abb-knx/${filename}`;
}

async function mapWithConcurrency<T, R>(
  values: readonly T[],
  concurrency: number,
  mapper: (value: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(values.length);
  let cursor = 0;
  async function worker(): Promise<void> {
    while (cursor < values.length) {
      const index = cursor;
      cursor += 1;
      const value = values[index];
      if (value === undefined) continue;
      results[index] = await mapper(value, index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, values.length) }, () => worker()));
  return results;
}

async function main(): Promise<void> {
  await mkdir(outputDirectory, { recursive: true });
  const token = await fetchToken();
  const productsByReference = new Map<string, { product: AbbProduct; source: SourceCategory }>();
  const sourceSummary: Array<{ id: string; name: string; total: number; selected: number }> = [];

  for (const source of sourceCategories) {
    const products = await fetchCategory(source, token);
    const selected = products.filter(isCurrentProduct);
    sourceSummary.push({
      id: source.cid,
      name: source.label,
      total: products.length,
      selected: selected.length,
    });
    for (const product of selected) {
      if (!productsByReference.has(product.productId)) {
        productsByReference.set(product.productId, { product, source });
      }
    }
  }

  const selectedProducts = [...productsByReference.values()].sort((left, right) =>
    left.product.productId.localeCompare(right.product.productId),
  );
  const normalized = await mapWithConcurrency(
    selectedProducts,
    8,
    async ({ product, source }, index) => {
      const officialImageUrl = officialImage(product);
      if (!officialImageUrl)
        throw new Error(`Produsul ${product.productId} nu are imagine oficială.`);
      const displayName = attributeText(product, "#DisplayName");
      const catalogueDescription = attributeText(product, "CatalogDescription") || displayName;
      const translated = translateTechnicalName(catalogueDescription);
      const prefix =
        displayName && !translated.toLowerCase().startsWith(displayName.toLowerCase())
          ? `${displayName} – `
          : "";
      const referenceSuffix = ` - ${product.productId}`;
      const title = `${prefix}${translated}`.slice(0, 140 - referenceSuffix.length).trim();
      const category = productCategory(source, `${catalogueDescription} ${translated}`);
      const imagePath = await downloadImage(product.productId, officialImageUrl);
      return {
        reference: product.productId,
        sourceCategory: source.label,
        sourceCategoryId: source.cid,
        displayNameOriginal: displayName,
        catalogueDescriptionOriginal: catalogueDescription,
        name: `${title}${referenceSuffix}`,
        description: descriptionFor(source, translated, product.productId),
        category,
        imagePath,
        officialImageUrl,
        illustration: illustration(category, `${catalogueDescription} ${translated}`),
        sortOrder: 2100 + index,
        breadcrumbs: breadcrumbNames(product.classifications?.breadcrumbs?.Products),
      } satisfies NormalizedProduct;
    },
  );

  for (const category of normalized.map(({ category }) => category)) {
    if (!productCategories.includes(category))
      throw new Error(`Categorie N3XO invalidă: ${category}`);
  }

  const output = {
    source: "ABB official product information API",
    sourceUrl:
      "https://new.abb.com/low-voltage/products/building-automation/product-range/abb-i-bus-knx",
    catalogueCode: "ABB_I_BUS_KNX_RO_PHASE_1",
    market: "RO",
    language: "ro",
    selectionPolicy: "published, active, without replacement, with official product image",
    productCount: normalized.length,
    imageCount: normalized.length,
    sourceCategories: sourceSummary,
    products: normalized,
  };
  await writeFile(outputFile, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  console.log(`Catalogul ABB KNX etapa 1: ${normalized.length} produse și imagini oficiale.`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Extragerea ABB KNX a eșuat.");
  process.exitCode = 1;
});
