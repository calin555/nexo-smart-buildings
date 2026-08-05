"use client";

import { FileUp, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";

import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

type Reservation = { documentId: string; storagePath: string; token: string };

function isReservation(value: unknown): value is Reservation {
  return (
    typeof value === "object" &&
    value !== null &&
    "documentId" in value &&
    typeof value.documentId === "string" &&
    "storagePath" in value &&
    typeof value.storagePath === "string" &&
    "token" in value &&
    typeof value.token === "string"
  );
}

export function OfferUpload({ projectId }: Readonly<{ projectId: string }>) {
  const id = useId();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function publish(): Promise<void> {
    if (!file) return;
    if (file.type !== "application/pdf" || file.size > 15_000_000) {
      setMessage("Oferta trebuie să fie PDF și să nu depășească 15 MB.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(`/api/admin/projects/${projectId}/offers`, {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ fileName: file.name, mimeType: file.type, fileSize: file.size }),
      });
      const reservation: unknown = await response.json();
      if (!response.ok || !isReservation(reservation))
        throw new Error("Oferta nu a putut fi pregătită.");
      const supabase = createBrowserSupabaseClient();
      const { error: uploadError } = await supabase.storage
        .from("project-documents")
        .uploadToSignedUrl(reservation.storagePath, reservation.token, file, {
          contentType: file.type,
        });
      if (uploadError) throw uploadError;
      const complete = await fetch(
        `/api/admin/projects/${projectId}/offers/${reservation.documentId}/complete`,
        {
          method: "POST",
          credentials: "include",
        },
      );
      if (!complete.ok) throw new Error("Oferta nu a putut fi publicată.");
      setFile(null);
      setMessage("Oferta a fost publicată în portalul clientului.");
      router.refresh();
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : "Oferta nu a putut fi publicată.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-4 border-t border-slate/10 pt-4">
      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor={id} className="button-secondary cursor-pointer">
          <FileUp className="mr-2 size-4" /> {file ? file.name : "Alege oferta PDF"}
        </label>
        <input
          id={id}
          type="file"
          accept="application/pdf"
          className="sr-only"
          disabled={busy}
          onChange={(event) => {
            setFile(event.target.files?.[0] ?? null);
            setMessage("");
          }}
        />
        <button
          type="button"
          className="button-primary disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!file || busy}
          onClick={() => void publish()}
        >
          {busy && <LoaderCircle className="mr-2 size-4 animate-spin" />}
          Publică oferta
        </button>
      </div>
      {message && <p className="mt-2 text-sm text-slate">{message}</p>}
    </div>
  );
}
