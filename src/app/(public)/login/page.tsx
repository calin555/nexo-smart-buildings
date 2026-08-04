import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";

type LoginPageProps = { searchParams: Promise<{ error?: string }> };

export const metadata: Metadata = {
  title: "Autentificare portal client",
  robots: { index: false, follow: false },
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const currentUser = await getCurrentUser();
  if (currentUser) redirect("/portal");
  const { error } = await searchParams;

  return (
    <main className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md items-center px-5 py-12">
      <section className="panel w-full">
        <p className="eyebrow">Portal N3XO</p>
        <h1 className="mt-3 text-3xl font-semibold">Autentificare</h1>
        <p className="mt-2 text-sm text-slate">
          Folosiți un cont demonstrativ din README pentru testare locală.
        </p>
        {error ? (
          <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">
            Datele de autentificare nu sunt valide.
          </p>
        ) : null}
        <form action="/api/auth/login" method="post" className="mt-6 space-y-4">
          <label className="block text-sm font-medium">
            E-mail
            <input
              className="mt-1 w-full rounded-lg border bg-white px-3 py-2"
              type="email"
              name="email"
              autoComplete="email"
              required
            />
          </label>
          <label className="block text-sm font-medium">
            Parolă
            <input
              className="mt-1 w-full rounded-lg border bg-white px-3 py-2"
              type="password"
              name="password"
              autoComplete="current-password"
              required
            />
          </label>
          <button
            className="w-full rounded-lg bg-ink px-4 py-3 font-medium text-white"
            type="submit"
          >
            Intră în cont
          </button>
        </form>
      </section>
    </main>
  );
}
