import "server-only";

import { hasValidPlanSignature } from "@/modules/plan-analysis/file-signature";

const maxPlanBytes = 15_000_000;

export async function verifyPlanBeforeAnalysis(
  signedUrl: string,
  mimeType: string,
  fileSize: number,
): Promise<void> {
  if (fileSize <= 0 || fileSize > maxPlanBytes) throw new Error("UNSAFE_FILE_SIZE");
  const response = await fetch(signedUrl, {
    headers: { range: "bytes=0-31" },
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error("FILE_UNAVAILABLE");
  const bytes = new Uint8Array(await response.arrayBuffer()).slice(0, 32);
  if (!hasValidPlanSignature(bytes, mimeType)) throw new Error("INVALID_FILE_SIGNATURE");
}
