export function confidenceLabel(confidence: number | null): string {
  if (confidence === null) return "Desenată manual";
  if (confidence > 0.85) return "Detectat cu încredere ridicată";
  if (confidence >= 0.6) return "Verificare recomandată";
  return "Necesită corectare";
}
