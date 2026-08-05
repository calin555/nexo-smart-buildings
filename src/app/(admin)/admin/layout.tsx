import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { AccessDenied } from "@/components/access-denied";
import { Brand } from "@/components/brand";
import { getCurrentUser } from "@/lib/auth";
import { adminRoles } from "@/lib/rbac";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.memberships.length === 0) redirect("/onboarding");
  if (!user.memberships.some(({ role }) => adminRoles.has(role))) return <AccessDenied />;
  return (
    <div className="min-h-screen bg-cloud">
      <header className="border-b bg-ink text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Brand />
          <span className="text-sm">Administrare N3XO</span>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 md:grid-cols-[13rem_1fr]">
        <aside className="rounded-2xl bg-ink p-3 text-white">
          <nav aria-label="Administrare" className="grid gap-1 text-sm">
            <Link className="rounded-md px-3 py-2 hover:bg-white/10" href="/admin">
              Prezentare
            </Link>
            <Link className="rounded-md px-3 py-2 hover:bg-white/10" href={"/admin/projects" as Route}>
              Planuri și oferte
            </Link>
            <Link className="rounded-md px-3 py-2 hover:bg-white/10" href={"/admin/clients" as Route}>
              Clienți
            </Link>
            <Link className="rounded-md px-3 py-2 hover:bg-white/10" href="/admin/products">
              Echipamente interne
            </Link>
            <Link className="rounded-md px-3 py-2 hover:bg-white/10" href="/admin/brands">
              Branduri
            </Link>
            <form action="/api/auth/logout" method="post">
              <button
                type="submit"
                className="w-full rounded-md px-3 py-2 text-left hover:bg-white/10"
              >
                Deconectare
              </button>
            </form>
          </nav>
        </aside>
        {children}
      </div>
    </div>
  );
}
