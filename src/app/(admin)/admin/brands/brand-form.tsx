"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import type { BrandActionState } from "@/app/(admin)/admin/brands/actions";
import { kitDefinitions, kitIds } from "@/modules/commercial-configurator/config";
import { brandLevels, brandUsageCategories } from "@/modules/brands/schema";

export type BrandDefaults = {
  name: string;
  slug: string;
  logoUrl: string;
  description: string;
  usageCategories: string[];
  level: (typeof brandLevels)[number];
  kitIds: string[];
  sortOrder: number;
  active: boolean;
  officialUrl: string;
  partnershipVerified: boolean;
  verificationDocumentUrl: string;
};
type Props = {
  action: (state: BrandActionState, formData: FormData) => Promise<BrandActionState>;
  defaults?: BrandDefaults;
  submitLabel: string;
};
const fieldClass =
  "mt-2 w-full rounded-lg border border-slate/20 bg-white px-3 py-2.5 text-sm text-ink outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15";

function ErrorText({ messages }: Readonly<{ messages?: string[] }>) {
  return messages?.[0] ? <p className="mt-1 text-xs text-red-700">{messages[0]}</p> : null;
}
function Submit({ label }: Readonly<{ label: string }>) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="button-primary disabled:opacity-60">
      {pending ? "Se salvează…" : label}
    </button>
  );
}

export function BrandForm({ action, defaults, submitLabel }: Readonly<Props>) {
  const [state, formAction] = useActionState(action, {});
  return (
    <form action={formAction} className="panel space-y-7">
      {state.message ? (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {state.message}
        </div>
      ) : null}
      <div className="grid gap-5 md:grid-cols-2">
        <label className="text-sm font-medium">
          Nume brand
          <input
            name="name"
            required
            maxLength={100}
            defaultValue={defaults?.name}
            className={fieldClass}
          />
          <ErrorText messages={state.errors?.name} />
        </label>
        <label className="text-sm font-medium">
          Slug
          <input
            name="slug"
            required
            maxLength={100}
            defaultValue={defaults?.slug}
            className={fieldClass}
            placeholder="schneider-electric"
          />
          <ErrorText messages={state.errors?.slug} />
        </label>
        <label className="text-sm font-medium">
          URL logo
          <input
            name="logoUrl"
            type="url"
            defaultValue={defaults?.logoUrl}
            className={fieldClass}
            placeholder="https://..."
          />
          <ErrorText messages={state.errors?.logoUrl} />
        </label>
        <label className="text-sm font-medium">
          Nivel
          <select
            name="level"
            defaultValue={defaults?.level ?? "PROFESSIONAL"}
            className={fieldClass}
          >
            {brandLevels.map((level) => (
              <option key={level} value={level}>
                {level === "STANDARD"
                  ? "Standard"
                  : level === "PROFESSIONAL"
                    ? "Professional"
                    : "Luxury"}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium">
          Ordine afișare
          <input
            name="sortOrder"
            type="number"
            min="0"
            max="100000"
            defaultValue={defaults?.sortOrder ?? 100}
            className={fieldClass}
          />
        </label>
        <label className="text-sm font-medium">
          Link oficial extern
          <input
            name="officialUrl"
            type="url"
            defaultValue={defaults?.officialUrl}
            className={fieldClass}
            placeholder="https://..."
          />
          <ErrorText messages={state.errors?.officialUrl} />
        </label>
      </div>
      <label className="block text-sm font-medium">
        Descriere
        <textarea
          name="description"
          required
          rows={4}
          maxLength={700}
          defaultValue={defaults?.description}
          className={fieldClass}
        />
        <ErrorText messages={state.errors?.description} />
      </label>
      <fieldset>
        <legend className="text-sm font-semibold">Categorii de utilizare</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {brandUsageCategories.map((category) => (
            <label
              key={category}
              className="flex items-center gap-2 rounded-lg border border-slate/15 p-3 text-sm"
            >
              <input
                name="usageCategories"
                type="checkbox"
                value={category}
                defaultChecked={defaults?.usageCategories.includes(category)}
              />
              {category}
            </label>
          ))}
        </div>
        <ErrorText messages={state.errors?.usageCategories} />
      </fieldset>
      <fieldset>
        <legend className="text-sm font-semibold">Kituri asociate</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {kitIds.map((kitId) => (
            <label
              key={kitId}
              className="flex items-center gap-2 rounded-lg border border-slate/15 p-3 text-sm"
            >
              <input
                name="kitIds"
                type="checkbox"
                value={kitId}
                defaultChecked={defaults?.kitIds.includes(kitId)}
              />
              {kitDefinitions[kitId].name}
            </label>
          ))}
        </div>
        <ErrorText messages={state.errors?.kitIds} />
      </fieldset>
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
        <label className="flex items-center gap-3 text-sm font-semibold">
          <input
            name="partnershipVerified"
            type="checkbox"
            defaultChecked={defaults?.partnershipVerified}
          />
          Statut de parteneriat verificat intern
        </label>
        <label className="mt-4 block text-sm font-medium">
          URL document justificativ
          <input
            name="verificationDocumentUrl"
            type="url"
            defaultValue={defaults?.verificationDocumentUrl}
            className={fieldClass}
          />
          <ErrorText messages={state.errors?.verificationDocumentUrl} />
        </label>
        <p className="mt-3 text-xs leading-5 text-amber-900">
          Fără document justificativ nu se pot folosi formulări precum „partener oficial”,
          „distribuitor autorizat” sau „certificat de producător”.
        </p>
      </div>
      <label className="flex items-center gap-3 text-sm font-medium">
        <input name="active" type="checkbox" defaultChecked={defaults?.active ?? true} />
        Brand activ pe site
      </label>
      <div className="flex justify-end">
        <Submit label={submitLabel} />
      </div>
    </form>
  );
}
