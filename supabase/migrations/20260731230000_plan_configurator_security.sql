update storage.buckets
set public = false,
    file_size_limit = 15000000,
    allowed_mime_types = array['application/pdf', 'image/jpeg', 'image/png']
where id = 'project-documents';

create or replace function public.is_organization_member(target_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.memberships
    where "organizationId" = target_organization_id
      and "profileId" = auth.uid()
  );
$$;

revoke all on function public.is_organization_member(uuid) from public;
grant execute on function public.is_organization_member(uuid) to authenticated;

alter table public.projects enable row level security;
alter table public.project_documents enable row level security;
alter table public.project_document_pages enable row level security;
alter table public.plan_analyses enable row level security;
alter table public.project_rooms enable row level security;
alter table public.project_room_geometries enable row level security;
alter table public.room_features enable row level security;
alter table public.room_feature_values enable row level security;
alter table public.analysis_jobs enable row level security;
alter table public.analysis_issues enable row level security;

drop policy if exists "projects_select_member" on public.projects;
create policy "projects_select_member" on public.projects for select to authenticated
using (public.is_organization_member("organizationId"));

drop policy if exists "project_documents_select_member" on public.project_documents;
create policy "project_documents_select_member" on public.project_documents for select to authenticated
using (public.is_organization_member("organizationId"));

drop policy if exists "project_pages_select_member" on public.project_document_pages;
create policy "project_pages_select_member" on public.project_document_pages for select to authenticated
using (exists (
  select 1 from public.project_documents d
  where d.id = "documentId" and public.is_organization_member(d."organizationId")
));

drop policy if exists "project_rooms_select_member" on public.project_rooms;
create policy "project_rooms_select_member" on public.project_rooms for select to authenticated
using (public.is_organization_member("organizationId"));

drop policy if exists "room_geometries_select_member" on public.project_room_geometries;
create policy "room_geometries_select_member" on public.project_room_geometries for select to authenticated
using (exists (
  select 1 from public.project_rooms r
  where r.id = "roomId" and public.is_organization_member(r."organizationId")
));

drop policy if exists "room_features_select_member" on public.room_features;
create policy "room_features_select_member" on public.room_features for select to authenticated
using (exists (
  select 1 from public.project_rooms r
  where r.id = "roomId" and public.is_organization_member(r."organizationId")
));

drop policy if exists "room_feature_values_select_member" on public.room_feature_values;
create policy "room_feature_values_select_member" on public.room_feature_values for select to authenticated
using (exists (
  select 1 from public.room_features f
  join public.project_rooms r on r.id = f."roomId"
  where f.id = "featureId" and public.is_organization_member(r."organizationId")
));

drop policy if exists "plan_analyses_select_member" on public.plan_analyses;
create policy "plan_analyses_select_member" on public.plan_analyses for select to authenticated
using (exists (
  select 1 from public.project_documents d
  where d.id = "documentId" and public.is_organization_member(d."organizationId")
));

drop policy if exists "analysis_jobs_select_member" on public.analysis_jobs;
create policy "analysis_jobs_select_member" on public.analysis_jobs for select to authenticated
using (exists (
  select 1 from public.project_documents d
  where d.id = "documentId" and public.is_organization_member(d."organizationId")
));

drop policy if exists "analysis_issues_select_member" on public.analysis_issues;
create policy "analysis_issues_select_member" on public.analysis_issues for select to authenticated
using (exists (
  select 1 from public.analysis_jobs j
  join public.project_documents d on d.id = j."documentId"
  where j.id = "jobId" and public.is_organization_member(d."organizationId")
));

drop policy if exists "project_documents_storage_insert_member" on storage.objects;
create policy "project_documents_storage_insert_member" on storage.objects for insert to authenticated
with check (
  bucket_id = 'project-documents'
  and (storage.foldername(name))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
  and public.is_organization_member(((storage.foldername(name))[1])::uuid)
);

drop policy if exists "project_documents_storage_select_member" on storage.objects;
create policy "project_documents_storage_select_member" on storage.objects for select to authenticated
using (
  bucket_id = 'project-documents'
  and (storage.foldername(name))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
  and public.is_organization_member(((storage.foldername(name))[1])::uuid)
);

drop policy if exists "project_documents_storage_delete_member" on storage.objects;
create policy "project_documents_storage_delete_member" on storage.objects for delete to authenticated
using (
  bucket_id = 'project-documents'
  and (storage.foldername(name))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
  and public.is_organization_member(((storage.foldername(name))[1])::uuid)
);
