import { legalPages, resourcePages, rootPages, servicePages } from "../src/modules/public-content";
import { publicSolutions } from "../src/modules/public-solutions";
import {
  blogPages,
  guidePages,
  localPages,
  pillarPages,
  resourceSeoEnhancements,
  serviceSeoEnhancements,
  solutionSeoEnhancements,
} from "../src/modules/seo-content";

type SeoRow = Readonly<{ path: string; title: string; description: string }>;
type PageLike = Readonly<{
  title: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
}>;

const rows: SeoRow[] = [
  {
    path: "/",
    title: "Casă smart și automatizări KNX | N3XO Smart Buildings",
    description:
      "Configurează o casă inteligentă cu KNX, Matter, Google Home, Apple Home sau Home Assistant. Proiectare și implementare completă.",
  },
  {
    path: "/kituri",
    title: "Kituri smart orientative | N3XO Smart Buildings",
    description:
      "Nouă kituri orientative pentru apartamente, case, blocuri, pensiuni și hoteluri.",
  },
  {
    path: "/configurator-kit",
    title: "Configurator casă smart | N3XO Smart Buildings",
    description:
      "Configurează un kit smart pentru locuință, bloc, pensiune sau hotel și primește o estimare orientativă.",
  },
  {
    path: "/proiecte/casa-inteligenta-cluj",
    title: "Casă inteligentă Cluj — proiect tehnic interactiv | N3XO",
    description:
      "Explorează circuitele, automatizările și echipamentele propuse într-un studiu tehnic pentru o casă inteligentă N3XO.",
  },
  {
    path: "/proiecte/casa-inteligenta-brasov",
    title: "Casă inteligentă Brașov — proiect interactiv | N3XO",
    description:
      "Explorează interactiv climatizarea, umbrirea, energia, securitatea și ventilația într-un studiu tehnic pentru o casă inteligentă din Brașov.",
  },
  {
    path: "/proiecte/bloc-rezidential-cluj",
    title: "Bloc rezidențial inteligent Cluj — proiect interactiv | N3XO",
    description:
      "Explorează interactiv automatizarea BMS, accesul, energia, HVAC și încărcarea electrică într-un studiu tehnic pentru un bloc rezidențial din Cluj.",
  },
];

function add(path: string, page: PageLike): void {
  rows.push({
    path,
    title: page.seoTitle ?? page.title,
    description: page.seoDescription ?? page.description,
  });
}

for (const [slug, page] of Object.entries(rootPages)) add(`/${slug}`, page);
for (const [slug, page] of Object.entries(pillarPages)) add(`/${slug}`, page);
for (const [slug, page] of Object.entries(servicePages)) {
  add(`/servicii/${slug}`, { ...page, ...serviceSeoEnhancements[slug] });
}
for (const [slug, page] of Object.entries(resourcePages)) {
  add(`/resurse/${slug}`, { ...page, ...resourceSeoEnhancements[slug] });
}
for (const [slug, page] of Object.entries(legalPages)) add(`/legal/${slug}`, page);
for (const [slug, page] of Object.entries(localPages)) add(`/automatizari-smart/${slug}`, page);
for (const [slug, page] of Object.entries(guidePages)) add(`/ghiduri/${slug}`, page);
for (const [slug, page] of Object.entries(blogPages)) add(`/blog/${slug}`, page);
for (const solution of publicSolutions) {
  add(`/solutii/${solution.slug}`, {
    ...solution,
    description: solution.summary,
    ...solutionSeoEnhancements[solution.slug],
  });
}

const brandNames: Record<string, string> = {
  abb: "ABB",
  "schneider-electric": "Schneider Electric",
  mdt: "MDT",
  gira: "Gira",
  jung: "JUNG",
  basalte: "Basalte",
  zennio: "Zennio",
  theben: "Theben",
};
for (const [slug, name] of Object.entries(brandNames)) {
  rows.push({
    path: `/branduri/${slug}`,
    title: `${name}: integrare KNX și smart building | N3XO`,
    description: `Roluri, kituri și exemple de integrare ${name} în proiecte smart și KNX N3XO.`,
  });
}

const uniqueRows = [...new Map(rows.map((row) => [row.path, row])).values()].sort((a, b) =>
  a.path.localeCompare(b.path, "ro"),
);

console.log("# Inventar SEO public N3XO\n");
console.log(`URL-uri indexabile inventariate: **${uniqueRows.length}**\n`);
console.log("| URL | Title | Meta description |");
console.log("| --- | --- | --- |");
for (const row of uniqueRows) {
  console.log(
    `| https://www.nexcore.ro${row.path === "/" ? "" : row.path} | ${row.title.replaceAll("|", "\\|")} | ${row.description.replaceAll("|", "\\|")} |`,
  );
}
