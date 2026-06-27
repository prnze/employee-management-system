-- =============================================================================
-- ShareX: Secure protected payload access behind RPCs
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION public.sharex_hash_password(p_password TEXT, p_share_code TEXT)
RETURNS TEXT
LANGUAGE SQL
IMMUTABLE
AS $$
  SELECT encode(extensions.digest(convert_to(trim(p_password) || ':' || trim(p_share_code) || ':sharex-v1', 'UTF8'), 'sha256'), 'hex');
$$;

CREATE OR REPLACE FUNCTION public.sharex_create_share(
  p_share_code TEXT,
  p_title TEXT,
  p_content TEXT,
  p_content_type TEXT,
  p_language TEXT,
  p_password TEXT,
  p_expiry_at TIMESTAMPTZ,
  p_view_limit INT,
  p_is_burn_after_read BOOLEAN
)
RETURNS public.shares
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_share public.shares;
  v_password_hash TEXT := NULL;
BEGIN
  IF NULLIF(trim(COALESCE(p_password, '')), '') IS NOT NULL THEN
    v_password_hash := public.sharex_hash_password(p_password, p_share_code);
  END IF;

  INSERT INTO public.shares (
    share_code,
    title,
    content,
    content_type,
    language,
    password_hash,
    expiry_at,
    view_limit,
    is_burn_after_read
  )
  VALUES (
    p_share_code,
    NULLIF(p_title, ''),
    NULLIF(p_content, ''),
    COALESCE(p_content_type, 'text'),
    NULLIF(p_language, ''),
    v_password_hash,
    p_expiry_at,
    p_view_limit,
    COALESCE(p_is_burn_after_read, FALSE)
  )
  RETURNING * INTO v_share;

  RETURN v_share;
END;
$$;

CREATE OR REPLACE FUNCTION public.sharex_check_code_available(p_code TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT NOT EXISTS (
    SELECT 1
    FROM public.shares s
    WHERE s.share_code = p_code
  );
$$;

CREATE OR REPLACE FUNCTION public.sharex_get_metadata(p_code TEXT)
RETURNS TABLE (
  id UUID,
  share_code TEXT,
  title TEXT,
  content_type TEXT,
  password_hash TEXT,
  expiry_at TIMESTAMPTZ,
  view_limit INT,
  view_count INT,
  is_burn_after_read BOOLEAN
)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    s.id,
    s.share_code,
    s.title,
    s.content_type,
    s.password_hash,
    s.expiry_at,
    s.view_limit,
    s.view_count,
    s.is_burn_after_read
  FROM public.shares s
  WHERE s.share_code = p_code
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.sharex_get_full_share(p_share_id UUID, p_password TEXT DEFAULT NULL)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_share public.shares;
  v_files JSONB;
BEGIN
  SELECT *
  INTO v_share
  FROM public.shares
  WHERE id = p_share_id;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  IF v_share.expiry_at IS NOT NULL AND v_share.expiry_at < now() THEN
    RETURN NULL;
  END IF;

  IF v_share.view_limit IS NOT NULL AND v_share.view_count >= v_share.view_limit THEN
    RETURN NULL;
  END IF;

  IF v_share.is_burn_after_read AND v_share.view_count > 0 THEN
    RETURN NULL;
  END IF;

  IF v_share.password_hash IS NOT NULL THEN
    IF NULLIF(trim(COALESCE(p_password, '')), '') IS NULL THEN
      RETURN NULL;
    END IF;

    IF public.sharex_hash_password(p_password, v_share.share_code) <> v_share.password_hash THEN
      RETURN NULL;
    END IF;
  END IF;

  SELECT COALESCE(jsonb_agg(to_jsonb(sf) ORDER BY sf.created_at), '[]'::jsonb)
  INTO v_files
  FROM public.share_files sf
  WHERE sf.share_id = v_share.id;

  RETURN jsonb_build_object(
    'share', to_jsonb(v_share),
    'files', v_files
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.sharex_add_file(
  p_share_id UUID,
  p_file_name TEXT,
  p_storage_path TEXT,
  p_mime_type TEXT,
  p_size BIGINT
)
RETURNS public.share_files
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_file public.share_files;
BEGIN
  INSERT INTO public.share_files (
    share_id,
    file_name,
    storage_path,
    mime_type,
    size
  )
  VALUES (
    p_share_id,
    p_file_name,
    p_storage_path,
    COALESCE(NULLIF(p_mime_type, ''), 'application/octet-stream'),
    p_size
  )
  RETURNING * INTO v_file;

  RETURN v_file;
END;
$$;

CREATE OR REPLACE FUNCTION public.sharex_get_dashboard_shares(p_ids UUID[])
RETURNS TABLE (
  id UUID,
  view_count INT,
  view_limit INT,
  expiry_at TIMESTAMPTZ,
  is_burn_after_read BOOLEAN
)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    s.id,
    s.view_count,
    s.view_limit,
    s.expiry_at,
    s.is_burn_after_read
  FROM public.shares s
  WHERE s.id = ANY(p_ids);
$$;

CREATE OR REPLACE FUNCTION public.sharex_record_view(p_share_id UUID, p_current_count INT)
RETURNS VOID
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.shares
  SET view_count = GREATEST(view_count, p_current_count + 1)
  WHERE id = p_share_id;
$$;

CREATE OR REPLACE FUNCTION public.sharex_record_download(p_share_id UUID)
RETURNS VOID
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.shares
  SET download_count = download_count + 1
  WHERE id = p_share_id;
$$;

REVOKE SELECT ON public.shares FROM anon, authenticated;
REVOKE SELECT ON public.share_files FROM anon, authenticated;

GRANT EXECUTE ON FUNCTION public.sharex_hash_password(TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.sharex_create_share(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TIMESTAMPTZ, INT, BOOLEAN) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.sharex_check_code_available(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.sharex_get_metadata(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.sharex_get_full_share(UUID, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.sharex_add_file(UUID, TEXT, TEXT, TEXT, BIGINT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.sharex_get_dashboard_shares(UUID[]) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.sharex_record_view(UUID, INT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.sharex_record_download(UUID) TO anon, authenticated;
