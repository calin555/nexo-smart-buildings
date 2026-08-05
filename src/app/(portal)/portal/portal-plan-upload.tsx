"use client";

import { FileUp, LoaderCircle, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";

import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import {
  buildingLabels,
  functionLabels,
  kitLabels,
  type ProjectRequest,
} from "@/modules/portal/project-request";

type Membership = { organizationId: string; organizationName: string };
type ProjectResponse = { projectId: string };
type ReservationResponse = { documentId: string; storagePath: string };

function isProjectResponse(value: unknown): value is ProjectResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "projectId" in value &&
    typeof value.projectId === "string"
  );
}

function isReservationResponse(value: unknown): value is ReservationResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "documentId" in value &&
    typeof value.documentId === "string" &&
    "storagePath" in value &&
    typeof value.storagePath === "string"
  );
}

export function PortalPlanUpload({ memberships }: Readonly<{ memberships: Membership[] }>) {
  const inputId = useId();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [organizationId, setOrganizationId] = useState(memberships[0]?.organizationId ?? "");
  const [buildingType, setBuildingType] = useState<ProjectRequest["buildingType"]>("CASA");
  const [kit, setKit] = useState<ProjectRequest["kit"]>("FARA_KIT");
  const [functions, setFunctions] = useState<ProjectRequest["functions"]>(["ILUMINAT", "PRIZE"]);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function uploadPlan(): Promise<void> {
    if (!file || !organizationId) return;
    if (!["application/pdf", "image/jpeg", "image/png"].includes(file.type)) {
      setError("Sunt acceptate numai fișiere PDF, JPG și PNG.");
      return;
    }
    if (file.size > 15_000_000) {
      setError("Planul nu poate depăși 15 MB.");
      return;
    }
    setBusy(true);
    setError("");
    setSuccess(false);
    try {
      const projectResponse = await fetch("/api/portal/projects", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ organizationId, buildingType, kit, functions, notes }),
      });
      const project: unknown = await projectResponse.json();
      if (!projectResponse.ok || !isProjectResponse(project))
        throw new Error("Proiectul nu a putut fi creat.");

      const reservationResponse = await fetch(
        `/api/portal/projects/${project.projectId}/documents`,
        {
          method: "POST",
          credentials: "include",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ fileName: file.name, mimeType: file.type, fileSize: file.size }),
        },
      );
      const reservation: unknown = await reservationResponse.json();
      if (!reservationResponse.ok || !isReservationResponse(reservation)) {
        throw new Error("Planul nu a putut fi pregătit pentru încărcare.");
      }

      const supabase = createBrowserSupabaseClient();
      const { error: uploadError } = await supabase.storage
        .from("project-documents")
        .upload(reservation.storagePath, file, { contentType: file.type, upsert: false });
      if (uploadError) throw uploadError;

      const completeResponse = await fetch(
        `/api/portal/projects/${project.projectId}/documents/${reservation.documentId}/complete`,
        { method: "POST", credentials: "include" },
      );
      if (!completeResponse.ok) throw new Error("Încărcarea nu a putut fi confirmată.");

      setFile(null);
      setSuccess(true);
      router.refresh();
    } catch (uploadError: unknown) {
      setError(
        uploadError instanceof Error ? uploadError.message : "Planul nu a putut fi încărcat.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section id="incarca-planul" className="rounded-2xl bg-ink p-6 text-white shadow-sm sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="text-sm font-medium text-mint">Începe proiectul</p>
          <h2 className="mt-2 text-2xl font-semibold">Încarcă planul clădirii</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/65">
            Acceptăm PDF, JPG sau PNG, maximum 15 MB. Administratorul este notificat după încărcare.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs text-white/75">
          <ShieldCheck className="size-4 text-mint" /> Document privat
        </span>
      </div>
      {memberships.length > 1 && (
        <select
          value={organizationId}
          onChange={(event) => setOrganizationId(event.target.value)}
          className="mt-5 w-full rounded-lg border border-white/15 bg-white/10 px-3 py-2.5 text-sm text-white"
        >
          {memberships.map((membership) => (
            <option
              key={membership.organizationId}
              value={membership.organizationId}
              className="text-ink"
            >
              {membership.organizationName}
            </option>
          ))}
        </select>
      )}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm text-white/75">
          Tipul clădirii
          <select
            value={buildingType}
            onChange={(event) =>
              setBuildingType(event.target.value as ProjectRequest["buildingType"])
            }
            className="rounded-lg border border-white/15 bg-white px-3 py-2.5 text-ink"
          >
            {Object.entries(buildingLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm text-white/75">
          Kit orientativ
          <select
            value={kit}
            onChange={(event) => setKit(event.target.value as ProjectRequest["kit"])}
            className="rounded-lg border border-white/15 bg-white px-3 py-2.5 text-ink"
          >
            {Object.entries(kitLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <fieldset className="mt-5">
        <legend className="text-sm font-medium text-white/75">Ce dorești să automatizezi?</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(functionLabels).map(([value, label]) => {
            const code = value as ProjectRequest["functions"][number];
            return (
              <label
                key={code}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm"
              >
                <input
                  type="checkbox"
                  checked={functions.includes(code)}
                  onChange={(event) =>
                    setFunctions((current) =>
                      event.target.checked
                        ? [...current, code]
                        : current.filter((item) => item !== code),
                    )
                  }
                />
                {label}
              </label>
            );
          })}
        </div>
      </fieldset>
      <label className="mt-5 grid gap-2 text-sm text-white/75">
        Detalii pentru ofertă (opțional)
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          maxLength={1000}
          rows={3}
          placeholder="Suprafață, număr de camere, preferințe sau alte cerințe"
          className="rounded-lg border border-white/15 bg-white px-3 py-2.5 text-ink"
        />
      </label>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <label htmlFor={inputId} className="button-secondary cursor-pointer">
          <FileUp className="mr-2 size-4" /> {file ? file.name : "Alege planul"}
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
            setSuccess(false);
          }}
        />
        <button
          type="button"
          className="button-primary disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!file || busy}
          onClick={() => void uploadPlan()}
        >
          {busy && <LoaderCircle className="mr-2 size-4 animate-spin" />}
          {busy ? "Se încarcă…" : "Trimite planul"}
        </button>
      </div>
      {error && <p className="mt-4 text-sm text-red-200">{error}</p>}
      {success && (
        <p className="mt-4 text-sm font-medium text-mint">
          Plan trimis. Echipa N3XO a fost notificată.
        </p>
      )}
    </section>
  );
}
