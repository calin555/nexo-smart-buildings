import type { Metadata } from "next";

import { InteractiveProjectPage } from "@/components/interactive-project-page";

export const metadata: Metadata = {
  title: "Casă inteligentă Cluj — proiect tehnic interactiv | N3XO",
  description:
    "Explorează circuitele, automatizările și produsele folosite într-o casă inteligentă demonstrativă N3XO.",
};

export default function SmartHomeClujProjectPage() {
  return (
    <InteractiveProjectPage
      location="Cluj-Napoca"
      title="Interiorul tehnic al unei case inteligente."
      description="Apasă pe prize, jaluzele, iluminat sau instalații. Vezi ce echipament le controlează, pe ce circuit sunt conectate și cum comunică întregul sistem."
      stats={["8 sisteme interactive", "Circuite vizibile", "Configurație demonstrativă"]}
      project="cluj-house"
      ctaTitle="Fiecare casă primește propria schemă tehnică."
    />
  );
}
