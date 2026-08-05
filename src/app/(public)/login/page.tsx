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
  if (currentUser) redirect(currentUser.memberships.length > 0 ? "/portal" : "/onboarding");
  const { error } = await searchParams;

  const errorMessage =
    error === "google" || error === "oauth-callback"
      ? "Autentificarea cu Google nu a putut fi finalizată. Încearcă din nou."
      : error === "access"
        ? "Accesul acestui cont este suspendat."
        : "Datele de autentificare nu sunt valide.";

  return (
    <main className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md items-center px-5 py-12">
      <section className="panel w-full">
        <p className="eyebrow">Portal N3XO</p>
        <h1 className="mt-3 text-3xl font-semibold">Autentificare</h1>
        <p className="mt-2 text-sm text-slate">
          Accesează proiectele, planurile și ofertele tale într-un spațiu securizat.
        </p>
        {error ? (
          <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">
            {errorMessage}
          </p>
        ) : null}
        <form action="/api/auth/google" method="get" className="mt-6">
          <button
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-[#cfd8d4] bg-white px-4 py-3 font-medium text-ink transition hover:border-[#9fb3aa] hover:bg-cloud focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
            type="submit"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
              <path
                fill="#4285F4"
                d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.92h5.38a4.6 4.6 0 0 1-2 3.02v2.54h3.24c1.9-1.75 2.98-4.33 2.98-7.41Z"
              />
              <path
                fill="#34A853"
                d="M12 22c2.7 0 4.97-.9 6.62-2.36l-3.24-2.54c-.9.6-2.05.96-3.38.96-2.6 0-4.81-1.76-5.6-4.13H3.06v2.62A10 10 0 0 0 12 22Z"
              />
              <path
                fill="#FBBC05"
                d="M6.4 13.93A6.02 6.02 0 0 1 6.08 12c0-.67.12-1.32.32-1.93V7.45H3.06A10 10 0 0 0 2 12c0 1.61.39 3.14 1.06 4.55l3.34-2.62Z"
              />
              <path
                fill="#EA4335"
                d="M12 5.94c1.47 0 2.79.5 3.82 1.49l2.87-2.87A9.62 9.62 0 0 0 12 2a10 10 0 0 0-8.94 5.45l3.34 2.62C7.19 7.7 9.4 5.94 12 5.94Z"
              />
            </svg>
            Continuă cu Google
          </button>
        </form>
        <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.14em] text-slate">
          <span className="h-px flex-1 bg-[#dfe7e3]" />
          sau cu email
          <span className="h-px flex-1 bg-[#dfe7e3]" />
        </div>
        <form action="/api/auth/login" method="post" className="space-y-4">
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
