import { describe, expect, it } from "vitest";

import { publicContentCtaPaths } from "@/components/public-content-page";
import {
  blogPages,
  guidePages,
  localPages,
  pillarPages,
  resourceSeoEnhancements,
  serviceSeoEnhancements,
  solutionSeoEnhancements,
} from "@/modules/seo-content";

const fullPages = [
  ...Object.entries(pillarPages),
  ...Object.entries(localPages),
  ...Object.entries(guidePages),
  ...Object.entries(blogPages),
];

const enhancements = [
  ...Object.entries(serviceSeoEnhancements),
  ...Object.entries(resourceSeoEnhancements),
  ...Object.entries(solutionSeoEnhancements),
];

describe("conținutul SEO public", () => {
  it("folosește titluri SEO și descrieri unice", () => {
    const titles = [
      ...fullPages.map(([, page]) => page.seoTitle),
      ...enhancements.map(([, page]) => page.seoTitle),
    ].filter((value): value is string => Boolean(value));
    const descriptions = [
      ...fullPages.map(([, page]) => page.seoDescription),
      ...enhancements.map(([, page]) => page.seoDescription),
    ].filter((value): value is string => Boolean(value));

    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  it("oferă structură editorială și FAQ pe paginile de destinație", () => {
    const targetedPages = [
      ...Object.entries(localPages),
      ...Object.entries(guidePages),
      ...Object.entries(blogPages),
      ...Object.entries(pillarPages)
        .filter(
          ([path]) =>
            !["servicii", "solutii", "resurse", "legal", "automatizari-smart"].includes(path),
        )
        .map(([path, page]) => [path, page] as const),
    ];

    for (const [path, page] of targetedPages) {
      expect(page.title.length).toBeGreaterThan(10);
      expect(
        page.sections.length,
        `${path} are prea puține secțiuni editoriale`,
      ).toBeGreaterThanOrEqual(2);
      expect(
        page.sections.flatMap((section) => section.subsections ?? []).length,
        `${path} nu are structură H3`,
      ).toBeGreaterThanOrEqual(1);
      expect(page.faq?.length, `${path} nu are o secțiune FAQ utilă`).toBeGreaterThanOrEqual(2);
      expect(path.length).toBeGreaterThan(2);
    }
  });

  it("păstrează CTA-urile globale către configurator și cererea de ofertă", () => {
    expect(publicContentCtaPaths).toEqual({
      configurator: "/login?next=%2Fportal%23incarca-planul",
      offer: "/login?next=%2Fportal",
    });
  });
});
