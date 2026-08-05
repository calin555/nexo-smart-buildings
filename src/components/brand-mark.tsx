const brandColors: Record<string, string> = {
  ABB: "text-[#e21b22]",
  "Schneider Electric": "text-[#2aa64a]",
  MDT: "text-[#1467a7]",
  Gira: "text-[#111111]",
  JUNG: "text-[#d56524]",
  Basalte: "text-[#222222]",
  Zennio: "text-[#e16b27]",
  Theben: "text-[#1267a5]",
};

export function BrandMark({
  name,
  logoUrl,
  compact = false,
  prominent = false,
}: Readonly<{
  name: string;
  logoUrl?: string | null;
  compact?: boolean;
  prominent?: boolean;
}>) {
  const imageSize = compact ? "h-8 w-20" : prominent ? "h-24 w-72 sm:h-28 sm:w-80" : "h-12 w-36";
  const fallbackSize = compact
    ? "min-h-8 min-w-16 px-2 text-xs"
    : prominent
      ? "min-h-20 min-w-64 px-8 text-2xl sm:min-h-24 sm:min-w-72 sm:text-3xl"
      : "min-h-12 min-w-32 px-4 text-base";

  if (logoUrl)
    return (
      <span
        role="img"
        aria-label={`Logo ${name}`}
        className={`${imageSize} block bg-contain bg-center bg-no-repeat`}
        style={{ backgroundImage: `url(${JSON.stringify(logoUrl).slice(1, -1)})` }}
      />
    );
  return (
    <span
      aria-label={`Logo ${name}`}
      className={`${fallbackSize} ${brandColors[name] ?? "text-ink"} inline-flex items-center justify-center rounded-lg border border-[#d3ded9] bg-white font-bold tracking-[-.03em] shadow-[0_4px_12px_rgba(19,39,31,.05)]`}
    >
      {name}
    </span>
  );
}
