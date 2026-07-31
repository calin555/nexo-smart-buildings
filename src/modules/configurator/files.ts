export function sanitizePlanFileName(fileName: string): string {
  const normalized = fileName.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
  const safe = normalized.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/-+/g, "-");
  return safe.replace(/^[-.]+|[-.]+$/g, "").slice(0, 120) || "plan";
}
