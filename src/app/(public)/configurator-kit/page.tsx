import type { Metadata } from "next";

import { CommercialKitConfigurator } from "@/components/commercial-kit-configurator";
import { isKitId } from "@/modules/commercial-configurator/config";

export const metadata: Metadata = {
  title: "Configurator casă smart | N3XO Smart Buildings",
  description:
    "Configurează un pachet Essential, Comfort sau Premium și primește instant o estimare orientativă de preț și echipamente.",
};

export default async function CommercialConfiguratorPage({
  searchParams,
}: Readonly<{ searchParams: Promise<{ kit?: string }> }>) {
  const { kit } = await searchParams;
  return <CommercialKitConfigurator initialKit={isKitId(kit) ? kit : "comfort"} />;
}
