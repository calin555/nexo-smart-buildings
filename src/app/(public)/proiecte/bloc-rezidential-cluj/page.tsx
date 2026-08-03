import type { Metadata } from "next";

import { InteractiveProjectPage } from "@/components/interactive-project-page";

export const metadata: Metadata = {
  title: "Bloc rezidențial inteligent Cluj — proiect interactiv | N3XO",
  description:
    "Explorează interactiv automatizarea BMS, accesul, energia, HVAC și încărcarea electrică într-un bloc rezidențial demonstrativ din Cluj.",
};

export default function ClujResidentialProjectPage() {
  return (
    <InteractiveProjectPage
      location="Cluj-Napoca"
      title="Un bloc rezidențial care își gestionează inteligent infrastructura."
      description="Selectează accesul, parcarea, iluminatul, producția fotovoltaică sau instalațiile HVAC. Fiecare punct explică echipamentul, protocolul și circuitul orientativ."
      stats={["8 sisteme comune", "BMS și contorizare", "Configurație multi-rezidențială"]}
      project="cluj-block"
      ctaTitle="Clădirea se proiectează ca un singur sistem coerent."
    />
  );
}
