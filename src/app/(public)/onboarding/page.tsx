import type { Metadata } from "next";
import type { Route } from "next";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { onboardingClientTypeOptions, safeAuthNext } from "@/modules/auth/onboarding";

type OnboardingPageProps = {
  searchParams: Promise<{ error?: string; next?: string }>;
};

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Configurarea profilului",
  robots: { index: false, follow: false },
};

export default async function OnboardingPage({ searchParams }: OnboardingPageProps) {
  const { error, next } = await searchParams;
  const requestedNext = safeAuthNext(next ?? null);
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) redirect("/login");

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    select: { name: true, _count: { select: { memberships: true } } },
  });
  if ((profile?._count.memberships ?? 0) > 0) redirect(requestedNext as Route);

  const metadata = user.user_metadata as Record<string, unknown>;
  const metadataName =
    typeof metadata.full_name === "string"
      ? metadata.full_name
      : typeof metadata.name === "string"
        ? metadata.name
        : "";
  const suggestedName = profile?.name || metadataName;

  return (
    <main className="mx-auto min-h-[calc(100vh-8rem)] max-w-2xl px-5 py-12 lg:py-20">
      <section className="panel p-6 sm:p-9">
        <p className="eyebrow">Prima autentificare</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
          Completează profilul N3XO
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-slate">
          Aceste informații ne ajută să pregătim spațiul potrivit pentru proiectele, planurile și
          ofertele tale.
        </p>

        {error ? (
          <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-800">
            Datele nu au putut fi salvate. Verifică formularul și încearcă din nou.
          </p>
        ) : null}

        <form action="/api/auth/onboarding" method="post" className="mt-8 grid gap-5">
          <input type="hidden" name="next" value={requestedNext} />
          <label className="block text-sm font-medium">
            Nume complet
            <input
              className="mt-1.5 w-full rounded-lg border bg-white px-3 py-3"
              type="text"
              name="name"
              defaultValue={suggestedName}
              autoComplete="name"
              minLength={2}
              maxLength={100}
              required
            />
          </label>

          <label className="block text-sm font-medium">
            Telefon
            <input
              className="mt-1.5 w-full rounded-lg border bg-white px-3 py-3"
              type="tel"
              name="phone"
              placeholder="+40 7xx xxx xxx"
              autoComplete="tel"
              minLength={7}
              maxLength={24}
              required
            />
          </label>

          <label className="block text-sm font-medium">
            Tip client
            <select
              className="mt-1.5 w-full rounded-lg border bg-white px-3 py-3"
              name="clientType"
              defaultValue="INDIVIDUAL"
              required
            >
              {onboardingClientTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <div className="rounded-lg bg-cloud px-4 py-3 text-sm text-slate">
            Cont conectat: <span className="font-medium text-ink">{user.email}</span>
          </div>

          <button
            className="mt-2 w-full rounded-lg bg-ink px-4 py-3 font-semibold text-white transition hover:bg-emerald-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
            type="submit"
          >
            Creează spațiul meu
          </button>
        </form>
      </section>
    </main>
  );
}
