import { ChevronRight } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

import type { BreadcrumbItem } from "@/lib/seo";

export function Breadcrumbs({ items }: Readonly<{ items: readonly BreadcrumbItem[] }>) {
  return (
    <nav aria-label="Breadcrumb" className="border-b border-[#dfe7e3] bg-white">
      <ol className="mx-auto flex max-w-[1500px] flex-wrap items-center gap-2 px-5 py-3 text-xs text-slate lg:px-8">
        {items.map((item, index) => {
          const current = index === items.length - 1;
          return (
            <li key={`${item.href}-${item.label}`} className="flex items-center gap-2">
              {index > 0 ? <ChevronRight className="size-3.5 text-slate/55" /> : null}
              {current ? (
                <span aria-current="page" className="font-medium text-ink">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href as Route} className="transition hover:text-emerald-700">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
