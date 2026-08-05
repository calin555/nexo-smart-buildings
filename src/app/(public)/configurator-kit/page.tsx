import type { Metadata } from "next";

import { CommercialKitConfigurator } from "@/components/commercial-kit-configurator";
import { BasicPageSchemas, buildPageMetadata } from "@/lib/seo";
import { normalizeKitId } from "@/modules/commercial-configurator/config";

export const metadata: Metadata = buildPageMetadata({
  title: "Configurator casă smart | N3XO Smart Buildings",
  description:
    "Configurează un kit smart pentru locuință, bloc, pensiune sau hotel și primește o estimare orientativă.",
  path: "/configurator-kit",
  keywords: ["configurator casă smart", "estimare automatizare casă"],
});

export default async function CommercialConfiguratorPage({
  searchParams,
}: Readonly<{ searchParams: Promise<{ kit?: string }> }>) {
  const { kit } = await searchParams;
  return (
    <>
      <BasicPageSchemas
        title="Configurator casă smart | N3XO Smart Buildings"
        description="Configurează un kit smart pentru locuință, bloc, pensiune sau hotel și primește o estimare orientativă."
        path="/configurator-kit"
        breadcrumbs={[
          { label: "Acasă", href: "/" },
          { label: "Kituri", href: "/kituri" },
          { label: "Configurator", href: "/configurator-kit" },
        ]}
      />
      <CommercialKitConfigurator initialKit={normalizeKitId(kit)} />
    </>
  );
}
