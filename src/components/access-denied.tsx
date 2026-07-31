import Link from "next/link";

export function AccessDenied() {
  return (
    <main className="mx-auto max-w-xl px-5 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-electric">Acces restricționat</p>
      <h1 className="mt-3 text-3xl font-semibold text-ink">Nu aveți acces la această zonă.</h1>
      <p className="mt-4 text-slate">Permisiunile sunt verificate pe server pentru fiecare spațiu protejat.</p>
      <Link className="mt-8 inline-flex rounded-lg bg-ink px-4 py-2 font-medium text-white" href="/portal">
        Înapoi în portal
      </Link>
    </main>
  );
}
