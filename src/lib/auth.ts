import { UnauthorizedError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { RoleCode } from "@/lib/rbac";

export type AuthenticatedUser = { id: string; email: string; name: string; memberships: { organizationId: string; organizationName: string; role: RoleCode }[] };

export type SessionIdentity = {
  id: string;
  email: string;
  name: string;
  provider: string | null;
  isAdmin: boolean;
};

export async function getSessionIdentity(): Promise<SessionIdentity | null> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return null;

  const metadata = user.user_metadata as Record<string, unknown>;
  const metadataName =
    typeof metadata.full_name === "string"
      ? metadata.full_name
      : typeof metadata.name === "string"
        ? metadata.name
        : (user.email.split("@")[0] ?? user.email);
  const adminMembership = await prisma.membership.findFirst({
    where: { profileId: user.id, roleCode: { in: ["ADMIN", "SUPER_ADMIN"] } },
    select: { id: true },
  });

  return {
    id: user.id,
    email: user.email,
    name: metadataName,
    provider: typeof user.app_metadata.provider === "string" ? user.app_metadata.provider : null,
    isAdmin: Boolean(adminMembership),
  };
}

export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const profile = await prisma.profile.findUnique({ where: { id: user.id }, include: { memberships: { include: { organization: true } } } });
  if (!profile || profile.status !== "ACTIVE") return null;
  return { id: profile.id, email: profile.email, name: profile.name, memberships: profile.memberships.map((m) => ({ organizationId: m.organizationId, organizationName: m.organization.legalName, role: m.roleCode as RoleCode })) };
}
export async function requireUser(): Promise<AuthenticatedUser> { const user = await getCurrentUser(); if (!user) throw new UnauthorizedError(); return user; }
