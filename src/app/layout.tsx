import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: { default: "N3XO Smart Buildings", template: "%s | N3XO Smart Buildings" },
  description:
    "Automatizare KNX, securitate, energie și control inteligent pentru case și clădiri.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ro">
      <body>{children}</body>
    </html>
  );
}
