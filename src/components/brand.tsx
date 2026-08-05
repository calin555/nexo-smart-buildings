import Link from "next/link";

export function Brand() {
  return (
    <Link
      className="inline-flex shrink-0 items-center gap-2 font-semibold tracking-tight text-ink"
      href="/"
    >
      <span
        aria-hidden="true"
        className="grid size-8 place-items-center rounded-lg bg-emerald-700 text-white"
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor">
          <path d="M4 19V9l8-5 8 5v10" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M8 19v-6h8v6M3 19h18" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </span>
      <span>
        N3XO <span className="font-normal text-slate">Smart Buildings</span>
      </span>
    </Link>
  );
}
