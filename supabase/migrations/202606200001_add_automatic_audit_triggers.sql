create extension if not exists pgcrypto;

create or replace function public.log_audit_event()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_actor_id uuid := auth.uid();
  v_actor_name text := 'System';
  v_old jsonb := case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) else '{}'::jsonb end;
  v_new jsonb := case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) else '{}'::jsonb end;
  v_row jsonb := case when tg_op = 'DELETE' then to_jsonb(old) else to_jsonb(new) end;
  v_entity_id text := coalesce(v_row ->> 'id', 'unknown');
  v_entity_label text;
  v_changed_fields jsonb := '[]'::jsonb;
  v_action text;
  v_category text;
  v_severity text := 'Info';
begin
  if v_actor_id is not null then
    select coalesce(
      nullif(trim(concat_ws(' ', u.first_name, u.last_name)), ''),
      u.email,
      v_actor_id::text
    )
    into v_actor_name
    from public.users u
    where u.id = v_actor_id;

    v_actor_name := coalesce(v_actor_name, v_actor_id::text);
  end if;

  if tg_op = 'UPDATE' then
    select coalesce(jsonb_agg(changed.key order by changed.key), '[]'::jsonb)
    into v_changed_fields
    from (
      select keys.key
      from jsonb_object_keys(v_new) as keys(key)
      where (v_old -> keys.key) is distinct from (v_new -> keys.key)
        and keys.key not in ('updated_at')
    ) as changed;

    if jsonb_array_length(v_changed_fields) = 0 then
      return new;
    end if;
  end if;

  v_entity_label := case tg_table_name
    when 'employees' then coalesce(v_row ->> 'employee_code', v_entity_id)
    when 'tasks' then coalesce(v_row ->> 'title', v_entity_id)
    when 'attendance' then concat_ws(' / ', coalesce(v_row ->> 'employee_id', v_entity_id), v_row ->> 'date')
    when 'users' then coalesce(v_row ->> 'email', v_entity_id)
    else v_entity_id
  end;

  v_category := case tg_table_name
    when 'employees' then 'Employee'
    when 'users' then 'Permissions'
    else 'System'
  end;

  v_action := case tg_op
    when 'INSERT' then 'CREATE'
    when 'UPDATE' then 'UPDATE'
    when 'DELETE' then 'DELETE'
  end;

  if tg_table_name = 'tasks'
     and tg_op = 'UPDATE'
     and lower(coalesce(v_new ->> 'status', '')) in ('completed', 'complete', 'done')
     and lower(coalesce(v_old ->> 'status', '')) not in ('completed', 'complete', 'done') then
    v_action := 'COMPLETE';
  elsif tg_table_name = 'attendance' and tg_op = 'INSERT' and nullif(v_new ->> 'clock_in', '') is not null then
    v_action := 'CHECK_IN';
  end if;

  if tg_op = 'DELETE' then
    v_severity := 'Warning';
  end if;

  insert into public.audit_logs (
    id,
    user_id,
    action,
    entity_type,
    description,
    metadata
  )
  values (
    gen_random_uuid(),
    v_actor_id,
    v_action,
    initcap(tg_table_name),
    format('%s %s: %s', initcap(tg_table_name), lower(replace(v_action, '_', ' ')), v_entity_label),
    jsonb_strip_nulls(jsonb_build_object(
      'actor_name', v_actor_name,
      'severity', v_severity,
      'category', v_category,
      'table_name', tg_table_name,
      'operation', tg_op,
      'entity_id', v_entity_id,
      'changed_fields', case when tg_op = 'UPDATE' then v_changed_fields else null end
    ))
  );

  if tg_op = 'UPDATE' and tg_table_name = 'attendance' then
    if (v_old -> 'clock_out') is distinct from (v_new -> 'clock_out')
       and nullif(v_new ->> 'clock_out', '') is not null
       and v_action <> 'CHECK_OUT' then
      insert into public.audit_logs (id, user_id, action, entity_type, description, metadata)
      values (
        gen_random_uuid(), v_actor_id, 'CHECK_OUT', 'Attendance',
        format('Attendance check-out: %s', v_entity_label),
        jsonb_build_object(
          'actor_name', v_actor_name, 'severity', 'Info', 'category', 'System',
          'table_name', tg_table_name, 'operation', tg_op, 'entity_id', v_entity_id,
          'changed_fields', jsonb_build_array('clock_out')
        )
      );
    end if;

    if (v_old -> 'status') is distinct from (v_new -> 'status') then
      insert into public.audit_logs (id, user_id, action, entity_type, description, metadata)
      values (
        gen_random_uuid(), v_actor_id, 'STATUS_CHANGE', 'Attendance',
        format(
          'Attendance status changed from %s to %s: %s',
          coalesce(v_old ->> 'status', 'unset'),
          coalesce(v_new ->> 'status', 'unset'),
          v_entity_label
        ),
        jsonb_build_object(
          'actor_name', v_actor_name, 'severity', 'Info', 'category', 'System',
          'table_name', tg_table_name, 'operation', tg_op, 'entity_id', v_entity_id,
          'changed_fields', jsonb_build_array('status'),
          'old_value', v_old -> 'status', 'new_value', v_new -> 'status'
        )
      );
    end if;
  end if;

  if tg_op = 'UPDATE' and tg_table_name = 'users' then
    if (v_old -> 'role') is distinct from (v_new -> 'role') then
      insert into public.audit_logs (id, user_id, action, entity_type, description, metadata)
      values (
        gen_random_uuid(), v_actor_id, 'ROLE_CHANGE', 'Users',
        format(
          'Role changed from %s to %s: %s',
          coalesce(v_old ->> 'role', 'unset'),
          coalesce(v_new ->> 'role', 'unset'),
          v_entity_label
        ),
        jsonb_build_object(
          'actor_name', v_actor_name, 'severity', 'Warning', 'category', 'Permissions',
          'table_name', tg_table_name, 'operation', tg_op, 'entity_id', v_entity_id,
          'changed_fields', jsonb_build_array('role'),
          'old_value', v_old -> 'role', 'new_value', v_new -> 'role'
        )
      );
    end if;

    if (v_old -> 'extra_permissions') is distinct from (v_new -> 'extra_permissions') then
      insert into public.audit_logs (id, user_id, action, entity_type, description, metadata)
      values (
        gen_random_uuid(), v_actor_id, 'PERMISSION_CHANGE', 'Users',
        format('Permissions changed: %s', v_entity_label),
        jsonb_build_object(
          'actor_name', v_actor_name, 'severity', 'Warning', 'category', 'Permissions',
          'table_name', tg_table_name, 'operation', tg_op, 'entity_id', v_entity_id,
          'changed_fields', jsonb_build_array('extra_permissions'),
          'old_value', v_old -> 'extra_permissions', 'new_value', v_new -> 'extra_permissions'
        )
      );
    end if;
  end if;

  if tg_op = 'UPDATE'
     and tg_table_name in ('employees', 'users')
     and (v_old -> 'avatar_url') is distinct from (v_new -> 'avatar_url') then
    insert into public.audit_logs (id, user_id, action, entity_type, description, metadata)
    values (
      gen_random_uuid(), v_actor_id, 'AVATAR_CHANGE', initcap(tg_table_name),
      format('Avatar changed: %s', v_entity_label),
      jsonb_build_object(
        'actor_name', v_actor_name, 'severity', 'Info',
        'category', case when tg_table_name = 'employees' then 'Employee' else 'System' end,
        'table_name', tg_table_name, 'operation', tg_op, 'entity_id', v_entity_id,
        'changed_fields', jsonb_build_array('avatar_url')
      )
    );
  end if;

  return case when tg_op = 'DELETE' then old else new end;
end;
$$;

revoke all on function public.log_audit_event() from public;

drop trigger if exists audit_employees_changes on public.employees;
create trigger audit_employees_changes
after insert or update or delete on public.employees
for each row execute function public.log_audit_event();

drop trigger if exists audit_tasks_changes on public.tasks;
create trigger audit_tasks_changes
after insert or update or delete on public.tasks
for each row execute function public.log_audit_event();

drop trigger if exists audit_attendance_changes on public.attendance;
create trigger audit_attendance_changes
after insert or update or delete on public.attendance
for each row execute function public.log_audit_event();

drop trigger if exists audit_users_changes on public.users;
create trigger audit_users_changes
after insert or update or delete on public.users
for each row execute function public.log_audit_event();
