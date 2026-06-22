-- =============================================================================
-- ShareX: Temporary text and file sharing tables
-- Migration: 202606220001_sharex_tables.sql
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS moddatetime;

-- ---------------------------------------------------------------------------
-- shares — core table for all shared content
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.shares (
  id            UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  share_code    TEXT            UNIQUE NOT NULL,
  title         TEXT,
  content       TEXT,
  content_type  TEXT            NOT NULL DEFAULT 'text'
                                CHECK (content_type IN ('text', 'code', 'markdown', 'json')),
  language      TEXT,
  password_hash TEXT,
  expiry_at     TIMESTAMPTZ,
  view_limit    INT             CHECK (view_limit IS NULL OR view_limit > 0),
  view_count    INT             NOT NULL DEFAULT 0,
  download_count INT            NOT NULL DEFAULT 0,
  is_burn_after_read BOOLEAN    NOT NULL DEFAULT FALSE,
  is_public     BOOLEAN         NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ     NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ     NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.shares IS 'ShareX — temporary content shares with auto-expiry';

-- ---------------------------------------------------------------------------
-- share_files — files attached to a share
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.share_files (
  id            UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  share_id      UUID            NOT NULL REFERENCES public.shares(id) ON DELETE CASCADE,
  file_name     TEXT            NOT NULL,
  storage_path  TEXT            NOT NULL,
  mime_type     TEXT            NOT NULL,
  size          BIGINT          NOT NULL CHECK (size > 0),
  created_at    TIMESTAMPTZ     NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.share_files IS 'Files attached to a ShareX share';

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_shares_share_code   ON public.shares(share_code);
CREATE INDEX IF NOT EXISTS idx_shares_expiry       ON public.shares(expiry_at) WHERE expiry_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_share_files_share   ON public.share_files(share_id);

-- ---------------------------------------------------------------------------
-- Auto-update updated_at
-- ---------------------------------------------------------------------------
DROP TRIGGER IF EXISTS sharex_shares_updated_at ON public.shares;
CREATE TRIGGER sharex_shares_updated_at
  BEFORE UPDATE ON public.shares
  FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

-- ---------------------------------------------------------------------------
-- Row-Level Security — anonymous access (no auth required)
-- ---------------------------------------------------------------------------
ALTER TABLE public.shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.share_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sharex_anyone_insert_shares"
  ON public.shares FOR INSERT
  WITH CHECK (true);

CREATE POLICY "sharex_anyone_select_shares"
  ON public.shares FOR SELECT
  USING (expiry_at IS NULL OR expiry_at > now());

CREATE POLICY "sharex_anyone_update_shares"
  ON public.shares FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "sharex_anyone_insert_share_files"
  ON public.share_files FOR INSERT
  WITH CHECK (true);

CREATE POLICY "sharex_anyone_select_share_files"
  ON public.share_files FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.shares s
      WHERE s.id = share_files.share_id
        AND (s.expiry_at IS NULL OR s.expiry_at > now())
    )
  );

-- ---------------------------------------------------------------------------
-- Storage bucket (run via Supabase dashboard or admin API)
-- ---------------------------------------------------------------------------
-- INSERT INTO storage.buckets (id, name, public)
--   VALUES ('sharex-files', 'sharex-files', true)
--   ON CONFLICT (id) DO NOTHING;
