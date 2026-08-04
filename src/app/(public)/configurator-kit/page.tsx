import type { Metadata } from "next";

import { CommercialKitConfigurator } from "@/components/commercial-kit-configurator";
import { normalizeKitId } from "@/modules/commercial-configurator/config";

export const metadata: Metadata = {
  title: "Configurator casă smart | N3XO Smart Buildings",
  description:
    "Configurează un kit smart pentru locuință, bloc, pensiune sau hotel și primește o estimare orientativă.",
};

export default async function CommercialConfiguratorPage({
  searchParams,
}: Readonly<{ searchParams: Promise<{ kit?: string }> }>) {
  const { kit } = await searchParams;
  return <CommercialKitConfigurator initialKit={normalizeKitId(kit)} />;
}
