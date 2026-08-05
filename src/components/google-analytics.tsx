"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import Link from "next/link";
import { useEffect, useState } from "react";

const consentStorageKey = "n3xo-analytics-consent";
const measurementId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID ?? "G-W7L7YD6PYF";

type AnalyticsConsent = "granted" | "denied";

declare global {
  interface Window {
    dataLayer: unknown[][];
    gtag: (...arguments_: unknown[]) => void;
  }
}

function GoogleTag() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window.gtag === "function") {
      window.gtag("config", measurementId, {
        page_path: `${pathname}${window.location.search}`,
      });
    }
  }, [pathname]);

  return (
    <>
      <Script
        id="n3xo-google-tag-library"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="n3xo-google-tag-config" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${measurementId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}

export function GoogleAnalytics() {
  const [consent, setConsent] = useState<AnalyticsConsent | null>(null);

  useEffect(() => {
    const storedConsent = window.localStorage.getItem(consentStorageKey);
    setConsent(storedConsent === "granted" || storedConsent === "denied" ? storedConsent : null);
  }, []);

  function saveConsent(value: AnalyticsConsent) {
    window.localStorage.setItem(consentStorageKey, value);
    setConsent(value);
  }

  return (
    <>
      {consent === "granted" ? <GoogleTag /> : null}
      {consent === null ? (
        <section
          role="dialog"
          aria-label="Preferințe cookies"
          aria-live="polite"
          className="fixed inset-x-4 bottom-4 z-[200] mx-auto max-w-3xl rounded-2xl border border-white/15 bg-[#102720] p-5 text-white shadow-[0_24px_70px_rgba(7,21,29,.3)] sm:p-6"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold">Cookies pentru analiză</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-white/70">
                Folosim Google Analytics numai cu acordul tău pentru a înțelege ce pagini sunt
                utile. Cookie-urile necesare autentificării funcționează separat.
              </p>
              <Link
                href="/legal/politica-cookies"
                className="mt-2 inline-block text-xs font-semibold text-emerald-300 underline underline-offset-4"
              >
                Vezi politica Cookies
              </Link>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <button
                type="button"
                onClick={() => saveConsent("denied")}
                className="rounded-lg border border-white/25 px-4 py-2.5 text-sm font-semibold transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Doar necesare
              </button>
              <button
                type="button"
                onClick={() => saveConsent("granted")}
                className="rounded-lg bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-[#102720] transition hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Acceptă analiza
              </button>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
