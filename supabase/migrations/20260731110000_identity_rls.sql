-- Run in Supabase SQL migration runner after Prisma identity migration.
alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.memberships enable row level security;
alter table public.consents enable row level security;
alter table public.data_requests enable row level security;
alter table public.audit_logs enable row level security;

create policy "profiles_select_own" on public.profiles for select using (id = auth.uid());
create policy "profiles_update_own" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "memberships_select_own" on public.memberships for select using ("profileId" = auth.uid());
create policy "organizations_select_member" on public.organizations for select using (exists (select 1 from public.memberships m where m."organizationId" = id and m."profileId" = auth.uid()));
create policy "consents_manage_own" on public.consents for all using ("profileId" = auth.uid()) with check ("profileId" = auth.uid());
create policy "data_requests_manage_own" on public.data_requests for all using ("profileId" = auth.uid()) with check ("profileId" = auth.uid());

insert into storage.buckets (id, name, public) values
  ('project-documents', 'project-documents', false),
  ('product-documents', 'product-documents', false),
  ('offer-pdfs', 'offer-pdfs', false),
  ('project-images', 'project-images', false)
on conflict (id) do update set public = false;

-- Future project/document policies are versioned with their tables. They must check
-- auth.uid() against project_participants or the owning organization membership.
