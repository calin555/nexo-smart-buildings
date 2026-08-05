import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { Brand } from "@/components/brand";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function PortalLayout({ children }: Readonly<{ children: ReactNode }>) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.memberships.length === 0) redirect("/onboarding");
  return (
    <div className="min-h-screen bg-cloud">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Brand />
          <div className="text-right text-sm">
            <p className="font-medium">{user.name}</p>
            <p className="text-slate">Portal client</p>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-8 md:grid-cols-[11rem_1fr]">
        <aside className="panel h-fit p-3">
          <nav aria-label="Portal client" className="grid gap-1 text-sm">
            <Link className="rounded-md px-3 py-2 hover:bg-cloud" href="/portal">
              Acasă
            </Link>
            <Link className="rounded-md px-3 py-2 hover:bg-cloud" href="/portal#incarca-planul">
              Încarcă planul
            </Link>
            <Link className="rounded-md px-3 py-2 hover:bg-cloud" href="/portal#oferte">
              Ofertele mele
            </Link>
            <form action="/api/auth/logout" method="post">
              <button
                className="w-full rounded-md px-3 py-2 text-left hover:bg-cloud"
                type="submit"
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
