import Link from "next/link";

export function Brand() {
  return (
    <Link
      className="inline-flex shrink-0 items-center gap-2 font-semibold tracking-tight text-ink"
      href="/"
    >
      <span className="grid size-8 place-items-center rounded-lg bg-emerald-700 text-xs text-white">
        N3
      </span>
      <span>
        N3XO <span className="font-normal text-slate">Smart Buildings</span>
      </span>
    </Link>
  );
}
