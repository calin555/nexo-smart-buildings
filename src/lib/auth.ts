import { UnauthorizedError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { RoleCode } from "@/lib/rbac";

export type AuthenticatedUser = { id: string; email: string; name: string; memberships: { organizationId: string; organizationName: string; role: RoleCode }[] };
export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const profile = await prisma.profile.findUnique({ where: { id: user.id }, include: { memberships: { include: { organization: true } } } });
  if (!profile || profile.status !== "ACTIVE") return null;
  return { id: profile.id, email: profile.email, name: profile.name, memberships: profile.memberships.map((m) => ({ organizationId: m.organizationId, organizationName: m.organization.legalName, role: m.roleCode as RoleCode })) };
}
export async function requireUser(): Promise<AuthenticatedUser> { const user = await getCurrentUser(); if (!user) throw new UnauthorizedError(); return user; }
