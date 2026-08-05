import type { Metadata } from "next";

import { InteractiveProjectPage } from "@/components/interactive-project-page";

export const metadata: Metadata = {
  title: "Casă inteligentă Brașov — proiect interactiv | N3XO",
  description:
    "Explorează interactiv climatizarea, umbrirea, energia, securitatea și ventilația într-un studiu tehnic pentru o casă inteligentă din Brașov.",
};

export default function BrasovSmartHomeProjectPage() {
  return (
    <InteractiveProjectPage
      location="Brașov"
      title="Confort, energie și siguranță adaptate climatului de munte."
      description="Selectează pompa de căldură, jaluzelele, iluminatul, energia solară sau ventilația. Vezi cum sunt legate într-o arhitectură hibridă, robustă și ușor de folosit."
      stats={["8 funcții interactive", "KNX, Matter și Modbus", "Configurație hibridă"]}
      project="brasov-house"
      ctaTitle="Tehnologia potrivită se alege după casă și stilul de viață."
    />
  );
}
