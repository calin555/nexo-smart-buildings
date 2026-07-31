import Link from "next/link";

export function Brand() {
  return (
    <Link className="inline-flex items-center gap-2 font-semibold tracking-tight text-ink" href="/">
      <span className="grid size-8 place-items-center rounded-lg bg-ink text-sm text-mint">N</span>
      <span>NEXO <span className="font-normal text-slate">Smart Buildings</span></span>
    </Link>
  );
}
