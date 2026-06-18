alter table public.users
add column if not exists avatar_url text;

alter table public.employees
add column if not exists avatar_url text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('employee-avatars', 'employee-avatars', true, 2097152, array['image/png', 'image/jpeg', 'image/webp']),
  ('attachments', 'attachments', false, 10485760, array['application/pdf', 'image/png', 'image/jpeg']),
  (
    'documents',
    'documents',
    false,
    10485760,
    array[
      'application/pdf',
      'text/csv',
      'application/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]
  )
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public avatar read access" on storage.objects;
create policy "Public avatar read access"
on storage.objects for select
using (bucket_id = 'employee-avatars');

drop policy if exists "Authenticated avatar upload access" on storage.objects;
create policy "Authenticated avatar upload access"
on storage.objects for insert to authenticated
with check (bucket_id = 'employee-avatars');

drop policy if exists "Authenticated avatar update access" on storage.objects;
create policy "Authenticated avatar update access"
on storage.objects for update to authenticated
using (bucket_id = 'employee-avatars')
with check (bucket_id = 'employee-avatars');

drop policy if exists "Authenticated avatar delete access" on storage.objects;
create policy "Authenticated avatar delete access"
on storage.objects for delete to authenticated
using (bucket_id = 'employee-avatars');

drop policy if exists "Authenticated private file read access" on storage.objects;
create policy "Authenticated private file read access"
on storage.objects for select to authenticated
using (bucket_id in ('attachments', 'documents'));

drop policy if exists "Authenticated private file upload access" on storage.objects;
create policy "Authenticated private file upload access"
on storage.objects for insert to authenticated
with check (bucket_id in ('attachments', 'documents'));

drop policy if exists "Authenticated private file update access" on storage.objects;
create policy "Authenticated private file update access"
on storage.objects for update to authenticated
using (bucket_id in ('attachments', 'documents'))
with check (bucket_id in ('attachments', 'documents'));

drop policy if exists "Authenticated private file delete access" on storage.objects;
create policy "Authenticated private file delete access"
on storage.objects for delete to authenticated
using (bucket_id in ('attachments', 'documents'));
