"use client";

import { FileImage, FileUp, LoaderCircle, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";

import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

const allowedTypes = new Set(["application/pdf", "image/jpeg", "image/png"]);
const maxBytes = 15_000_000;

type ReservationResponse = { documentId: string; storagePath: string };

function isReservation(value: unknown): value is ReservationResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "documentId" in value &&
    typeof value.documentId === "string" &&
    "storagePath" in value &&
    typeof value.storagePath === "string"
  );
}

function errorMessage(value: unknown): string {
  if (
    typeof value === "object" &&
    value !== null &&
    "error" in value &&
    typeof value.error === "string"
  ) {
    return value.error;
  }
  return "Planul nu a putut fi încărcat.";
}

export function PlanUpload({ projectId }: Readonly<{ projectId: string }>) {
  const inputId = useId();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "reserving" | "uploading" | "finalizing">("idle");
  const [error, setError] = useState("");
  const busy = status !== "idle";

  async function startUpload(): Promise<void> {
    if (!file) {
      setError("Selectează un plan PDF, JPG sau PNG.");
      return;
    }
    if (!allowedTypes.has(file.type)) {
      setError("Sunt acceptate numai fișiere PDF, JPG și PNG.");
      return;
    }
    if (file.size > maxBytes) {
      setError("Fișierul nu poate depăși 15 MB.");
      return;
    }

    setError("");
    setStatus("reserving");
    try {
      const reservationResponse = await fetch(`/api/portal/projects/${projectId}/documents`, {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ fileName: file.name, mimeType: file.type, fileSize: file.size }),
      });
      const reservation: unknown = await reservationResponse.json();
      if (!reservationResponse.ok || !isReservation(reservation)) {
        throw new Error(errorMessage(reservation));
      }

      setStatus("uploading");
      const supabase = createBrowserSupabaseClient();
      const { error: uploadError } = await supabase.storage
        .from("project-documents")
        .upload(reservation.storagePath, file, {
          contentType: file.type,
          cacheControl: "3600",
          upsert: false,
        });
      if (uploadError) throw new Error(uploadError.message);

      setStatus("finalizing");
      const completeResponse = await fetch(
        `/api/portal/projects/${projectId}/documents/${reservation.documentId}/complete`,
        { method: "POST", credentials: "include" },
      );
      const completed: unknown = await completeResponse.json();
      if (!completeResponse.ok) throw new Error(errorMessage(completed));

      router.push(`/portal/configurator/${projectId}?document=${reservation.documentId}`);
      router.refresh();
    } catch (uploadError: unknown) {
      setError(
        uploadError instanceof Error ? uploadError.message : "Planul nu a putut fi încărcat.",
      );
      setStatus("idle");
    }
  }

  const statusLabel = {
    idle: "Încarcă planul",
    reserving: "Pregătim spațiul securizat…",
    uploading: "Încărcăm planul…",
    finalizing: "Pregătim configuratorul…",
  }[status];

  return (
    <section className="rounded-2xl border border-slate/15 bg-white p-6 shadow-[0_12px_30px_rgba(20,40,33,.05)] sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="eyebrow">Pasul 1</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-.03em]">
            Încarcă planul proiectului
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate">
            Documentul este păstrat privat și poate fi accesat numai de membrii organizației tale.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800">
          <ShieldCheck className="size-4" /> Storage privat
        </span>
      </div>

      <label
        htmlFor={inputId}
        className="mt-7 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate/25 bg-cloud px-5 py-10 text-center transition hover:border-emerald-300 hover:bg-emerald-50/40"
      >
        <span className="grid size-12 place-items-center rounded-xl bg-white text-emerald-700 shadow-sm">
          {file ? <FileImage className="size-6" /> : <FileUp className="size-6" />}
        </span>
        <span className="mt-4 font-semibold">{file ? file.name : "Alege PDF, JPG sau PNG"}</span>
        <span className="mt-1 text-xs text-slate">
          {file ? `${(file.size / 1_000_000).toFixed(2)} MB` : "Maximum 15 MB"}
        </span>
      </label>
      <input
        id={inputId}
        type="file"
        accept="application/pdf,image/jpeg,image/png"
        className="sr-only"
        disabled={busy}
        onChange={(event) => {
          setFile(event.target.files?.[0] ?? null);
          setError("");
        }}
      />
      {error && <p className="mt-3 text-sm font-medium text-red-700">{error}</p>}
      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={() => void startUpload()}
          disabled={!file || busy}
          className="button-primary min-w-44 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy && <LoaderCircle className="mr-2 size-4 animate-spin" />}
          {statusLabel}
        </button>
      </div>
    </section>
  );
}
