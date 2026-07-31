import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <section className="mx-auto max-w-7xl px-5 py-20 sm:py-28">
        <p className="eyebrow">Integrator de sisteme complete</p>
        <h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-tight text-ink sm:text-7xl">
          Automatizare KNX, securitate, energie și control inteligent pentru case și clădiri.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate">
          Proiectare, echipamente, instalare, programare și mentenanță într-o singură platformă.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link className="rounded-lg bg-ink px-5 py-3 font-medium text-white" href="/login">Accesează portalul</Link>
          <a className="rounded-lg border border-slate/20 bg-white px-5 py-3 font-medium text-ink" href="#fundatie">Vezi fundația</a>
        </div>
      </section>
      <section id="fundatie" className="mx-auto grid max-w-7xl gap-5 px-5 pb-20 md:grid-cols-3">
        {[
          ["Acces controlat", "Autentificare, sesiuni persistente și permisiuni server-side."],
          ["Organizații", "Date pregătite pentru clienți individuali, companii și echipe interne."],
          ["Trasabilitate", "Consimțăminte și audit pentru acțiunile importante."],
        ].map(([title, text]) => (
          <article key={title} className="panel">
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="mt-3 leading-7 text-slate">{text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
