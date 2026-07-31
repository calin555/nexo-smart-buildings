"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import type { ProductActionState } from "@/app/(admin)/admin/products/actions";
import { productIllustrations } from "@/modules/products/schema";

type ProductDefaults = {
  name: string;
  brand: string;
  category: string;
  description: string;
  priceLei: string;
  badge: string;
  imageUrl: string;
  illustration: (typeof productIllustrations)[number];
  sortOrder: number;
  active: boolean;
};

type ProductFormProps = {
  action: (state: ProductActionState, formData: FormData) => Promise<ProductActionState>;
  defaults?: ProductDefaults;
  submitLabel: string;
};

const fieldClass =
  "mt-2 w-full rounded-lg border border-slate/20 bg-white px-3 py-2.5 text-sm text-ink outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15";

function FieldError({ messages }: Readonly<{ messages?: string[] }>) {
  if (!messages?.[0]) return null;
  return <p className="mt-1 text-xs text-red-700">{messages[0]}</p>;
}

function SubmitButton({ label }: Readonly<{ label: string }>) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="button-primary disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Se salvează…" : label}
    </button>
  );
}

export function ProductForm({ action, defaults, submitLabel }: Readonly<ProductFormProps>) {
  const [state, formAction] = useActionState(action, {});

  return (
    <form action={formAction} className="panel space-y-6">
      {state.message && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {state.message}
        </div>
      )}
      <div className="grid gap-5 md:grid-cols-2">
        <label className="text-sm font-medium">
          Nume produs
          <input
            name="name"
            required
            maxLength={140}
            defaultValue={defaults?.name}
            className={fieldClass}
          />
          <FieldError messages={state.errors?.name} />
        </label>
        <label className="text-sm font-medium">
          Brand
          <input
            name="brand"
            required
            maxLength={80}
            defaultValue={defaults?.brand}
            className={fieldClass}
            placeholder="ex. N3XO Home"
          />
          <FieldError messages={state.errors?.brand} />
        </label>
        <label className="text-sm font-medium">
          Categorie
          <input
            name="category"
            required
            maxLength={100}
            defaultValue={defaults?.category}
            className={fieldClass}
            placeholder="ex. Iluminat inteligent"
          />
          <FieldError messages={state.errors?.category} />
        </label>
        <label className="text-sm font-medium">
          Preț de la (lei)
          <input
            name="priceLei"
            required
            type="number"
            min="0"
            max="10000000"
            step="0.01"
            defaultValue={defaults?.priceLei}
            className={fieldClass}
          />
          <FieldError messages={state.errors?.priceLei} />
        </label>
        <label className="text-sm font-medium">
          Etichetă
          <input
            name="badge"
            maxLength={24}
            defaultValue={defaults?.badge}
            className={fieldClass}
            placeholder="ex. NOU sau RECOMANDAT"
          />
          <FieldError messages={state.errors?.badge} />
        </label>
        <label className="text-sm font-medium">
          Ordine afișare
          <input
            name="sortOrder"
            required
            type="number"
            min="0"
            max="100000"
            defaultValue={defaults?.sortOrder ?? 100}
            className={fieldClass}
          />
          <FieldError messages={state.errors?.sortOrder} />
        </label>
        <label className="text-sm font-medium">
          Ilustrație implicită
          <select
            name="illustration"
            defaultValue={defaults?.illustration ?? "CUSTOM"}
            className={fieldClass}
          >
            {productIllustrations.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          <FieldError messages={state.errors?.illustration} />
        </label>
        <label className="text-sm font-medium">
          URL imagine (opțional)
          <input
            name="imageUrl"
            type="url"
            maxLength={500}
            defaultValue={defaults?.imageUrl}
            className={fieldClass}
            placeholder="https://…"
          />
          <FieldError messages={state.errors?.imageUrl} />
        </label>
      </div>
      <label className="block text-sm font-medium">
        Descriere scurtă
        <textarea
          name="description"
          rows={4}
          maxLength={500}
          defaultValue={defaults?.description}
          className={fieldClass}
        />
        <FieldError messages={state.errors?.description} />
      </label>
      <label className="flex items-center gap-3 text-sm font-medium">
        <input
          name="active"
          type="checkbox"
          defaultChecked={defaults?.active ?? true}
          className="size-4 rounded border-slate/30 text-emerald-700 focus:ring-emerald-600"
        />
        Produs vizibil pe site
      </label>
      <div className="flex justify-end">
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}
