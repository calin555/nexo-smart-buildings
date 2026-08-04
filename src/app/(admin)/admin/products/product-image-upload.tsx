"use client";

import { ImagePlus, LoaderCircle, Trash2, Upload } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import { validateProductImageMetadata } from "@/modules/products/image";

type UploadResponse = { url: string };

function isUploadResponse(value: unknown): value is UploadResponse {
  return (
    typeof value === "object" && value !== null && "url" in value && typeof value.url === "string"
  );
}

function readError(value: unknown): string {
  if (
    typeof value === "object" &&
    value !== null &&
    "error" in value &&
    typeof value.error === "string"
  ) {
    return value.error;
  }
  return "Imaginea nu a putut fi încărcată.";
}

export function ProductImageUpload({
  defaultUrl,
  onUploadingChange,
}: Readonly<{ defaultUrl?: string; onUploadingChange: (uploading: boolean) => void }>) {
  const inputId = useId();
  const fileInput = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState(defaultUrl ?? "");
  const [localPreview, setLocalPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  async function upload(file: File): Promise<void> {
    const validationError = validateProductImageMetadata(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    const preview = URL.createObjectURL(file);
    setLocalPreview(preview);
    setError("");
    setUploading(true);
    onUploadingChange(true);

    try {
      const body = new FormData();
      body.set("file", file);
      const response = await fetch("/api/admin/products/image", {
        method: "POST",
        credentials: "include",
        body,
      });
      const payload: unknown = await response.json();
      if (!response.ok || !isUploadResponse(payload)) {
        throw new Error(readError(payload));
      }
      setImageUrl(payload.url);
    } catch (uploadError: unknown) {
      setError(
        uploadError instanceof Error ? uploadError.message : "Imaginea nu a putut fi încărcată.",
      );
    } finally {
      setUploading(false);
      onUploadingChange(false);
    }
  }

  function clearImage(): void {
    setImageUrl("");
    setLocalPreview("");
    setError("");
    if (fileInput.current) fileInput.current.value = "";
  }

  const previewUrl = localPreview || imageUrl;

  return (
    <div>
      <p className="text-sm font-medium">Imagine echipament</p>
      <div className="mt-2 grid gap-4 rounded-xl border border-slate/20 bg-[#f7faf8] p-4 sm:grid-cols-[11rem_1fr]">
        <div
          role="img"
          aria-label={
            previewUrl ? "Previzualizare imagine echipament" : "Nu este selectată nicio imagine"
          }
          className="grid aspect-[4/3] place-items-center rounded-lg border border-dashed border-slate/25 bg-white bg-contain bg-center bg-no-repeat text-slate"
          style={previewUrl ? { backgroundImage: `url(${JSON.stringify(previewUrl)})` } : undefined}
        >
          {!previewUrl && <ImagePlus className="size-8 stroke-[1.4]" />}
        </div>

        <div className="flex min-w-0 flex-col justify-center">
          <div className="flex flex-wrap gap-2">
            <label
              htmlFor={inputId}
              className={`inline-flex cursor-pointer items-center justify-center rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 ${uploading ? "pointer-events-none opacity-60" : ""}`}
            >
              {uploading ? (
                <LoaderCircle className="mr-2 size-4 animate-spin" />
              ) : (
                <Upload className="mr-2 size-4" />
              )}
              {uploading ? "Se încarcă…" : "Încarcă din calculator"}
            </label>
            {previewUrl && (
              <button
                type="button"
                onClick={clearImage}
                disabled={uploading}
                className="inline-flex items-center rounded-lg border border-slate/20 bg-white px-3 py-2 text-sm font-medium text-slate transition hover:border-red-200 hover:text-red-700 disabled:opacity-50"
              >
                <Trash2 className="mr-2 size-4" /> Elimină
              </button>
            )}
          </div>
          <input
            ref={fileInput}
            id={inputId}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void upload(file);
            }}
          />
          <p className="mt-3 text-xs leading-5 text-slate">JPG, PNG sau WebP · maximum 4 MB.</p>
          {error && <p className="mt-2 text-xs font-medium text-red-700">{error}</p>}
        </div>
      </div>

      <label className="mt-3 block text-xs font-medium text-slate">
        URL imagine
        <input
          name="imageUrl"
          type="url"
          maxLength={500}
          value={imageUrl}
          onChange={(event) => {
            setImageUrl(event.target.value);
            setLocalPreview("");
          }}
          className="mt-1.5 w-full rounded-lg border border-slate/20 bg-white px-3 py-2.5 text-sm text-ink outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
          placeholder="Se completează automat după încărcare"
        />
      </label>
    </div>
  );
}
