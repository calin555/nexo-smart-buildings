import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";

import { CommercialKitCards } from "@/components/commercial-kit-cards";

export const metadata: Metadata = {
  title: "Kituri smart orientative | N3XO Smart Buildings",
  description: "Nouă kituri orientative pentru apartamente, case, blocuri, pensiuni și hoteluri.",
};

export default function KitsPage() {
  return (
    <main className="bg-[#f6f9f7]">
      <section className="border-b border-[#dfe7e3] bg-white">
        <div className="mx-auto max-w-[1500px] px-5 py-14 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-emerald-700">
            Kituri N3XO
          </p>
          <h1 className="mt-4 max-w-4xl text-5xl font-medium tracking-[-.055em] text-ink sm:text-6xl">
            Un punct de plecare clar pentru fiecare tip de clădire.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate">
            Kiturile sunt estimări orientative, nu produse la raft. Configurația și prețul final se
            stabilesc după plan, instalații și obiectivele proiectului.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white"
            >
              Încarcă planul
            </Link>
            <Link
              href={"/solicita-oferta" as Route}
              className="rounded-lg border border-[#b8c9c1] px-5 py-3 text-sm font-semibold text-ink"
            >
              Solicită ofertă
            </Link>
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-[1500px] px-5 py-16 lg:px-8">
        <CommercialKitCards detailed />
      </div>
    </main>
  );
}
