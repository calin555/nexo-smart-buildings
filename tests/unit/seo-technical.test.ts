import { afterEach, beforeEach, describe, expect, it } from "vitest";

import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { buildPageMetadata, productionSiteUrl } from "@/lib/seo";
import { publicSolutions } from "@/modules/public-solutions";
import { guidePages, pillarPages, solutionSeoEnhancements } from "@/modules/seo-content";

const previousSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

beforeEach(() => {
  process.env.NEXT_PUBLIC_SITE_URL = productionSiteUrl;
});

afterEach(() => {
  if (previousSiteUrl === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
  else process.env.NEXT_PUBLIC_SITE_URL = previousSiteUrl;
});

describe("infrastructura SEO tehnică", () => {
  it("generează canonical, Open Graph și Twitter cu URL-uri absolute", () => {
    const metadata = buildPageMetadata({
      title: "Pagină SEO de verificare | N3XO",
      description: "Descriere unică pentru verificarea metadatelor tehnice.",
      path: "/verificare-seo",
    });

    expect(metadata.alternates?.canonical).toBe(`${productionSiteUrl}/verificare-seo`);
    expect(metadata.openGraph && "url" in metadata.openGraph ? metadata.openGraph.url : null).toBe(
      `${productionSiteUrl}/verificare-seo`,
    );
    expect(metadata.twitter && "card" in metadata.twitter ? metadata.twitter.card : null).toBe(
      "summary_large_image",
    );
    expect(metadata.robots).toMatchObject({ index: true, follow: true });
  });

  it("publică rutele importante și exclude zonele private din sitemap", () => {
    const urls = sitemap().map(({ url }) => url);

    expect(urls).toContain(`${productionSiteUrl}/automatizari-case-cluj`);
    expect(urls).toContain(`${productionSiteUrl}/solutii/case-smart`);
    expect(urls).toContain(`${productionSiteUrl}/solutii/automatizare-knx`);
    expect(urls).toContain(`${productionSiteUrl}/ghiduri/wifi-matter-sau-knx`);
    expect(urls.some((url) => /\/(admin|portal|login|onboarding)(\/|$)/.test(url))).toBe(false);
  });

  it("permite crawl-ul public și blochează rutele private sau de autentificare", () => {
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules : [result.rules];
    const disallowed = rules.flatMap((rule) => rule.disallow ?? []);

    expect(rules[0]?.allow).toBe("/");
    expect(disallowed).toEqual(
      expect.arrayContaining(["/admin/", "/portal/", "/api/", "/auth/", "/login", "/onboarding"]),
    );
    expect(result.sitemap).toBe(`${productionSiteUrl}/sitemap.xml`);
  });

  it("păstrează conținut distinct și complet pe paginile prioritare", () => {
    const cluj = pillarPages["automatizari-case-cluj"];
    const guide = guidePages["wifi-matter-sau-knx"];

    expect(cluj?.seoTitle).toBe("Automatizări case și sisteme KNX în Cluj-Napoca | N3XO");
    expect(cluj?.faq?.length).toBeGreaterThanOrEqual(6);
    expect(guide?.comparison?.rows).toHaveLength(6);
    expect(solutionSeoEnhancements["case-smart"]?.faq?.length).toBeGreaterThanOrEqual(6);
    expect(solutionSeoEnhancements["automatizare-knx"]?.faq?.length).toBeGreaterThanOrEqual(6);
  });

  it("definește alternative descriptive pentru toate imaginile soluțiilor", () => {
    for (const solution of publicSolutions) {
      expect(solution.imageAlt).not.toBe("");
      expect(solution.imageAlt.toLowerCase()).not.toBe("image");
    }
  });
});
