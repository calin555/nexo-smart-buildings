import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterAll, describe, expect, it, vi } from "vitest";

import { Brand } from "@/components/brand";

vi.stubGlobal("React", React);
afterAll(() => vi.unstubAllGlobals());

describe("componenta Brand", () => {
  it("afișează o singură denumire N3XO, fără prefixul N3 duplicat", () => {
    const html = renderToStaticMarkup(React.createElement(Brand));
    const visibleText = html.replace(/<[^>]+>/g, "").replaceAll(/\s+/g, " ").trim();

    expect(visibleText).toBe("N3XO Smart Buildings");
    expect(visibleText).not.toContain("N3N3XO");
    expect(html).toContain('aria-hidden="true"');
  });
});
