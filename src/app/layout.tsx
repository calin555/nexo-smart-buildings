import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: { default: "NEXO Smart Buildings", template: "%s | NEXO Smart Buildings" },
  description: "Automatizare KNX, securitate, energie și control inteligent pentru case și clădiri.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ro">
      <body>{children}</body>
    </html>
  );
}
