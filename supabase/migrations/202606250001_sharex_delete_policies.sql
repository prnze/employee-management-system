-- =============================================================================
-- ShareX: Add delete policies for shares and share_files
-- Required for burn-after-read and share management
-- Migration: 202606250001_sharex_delete_policies.sql
-- =============================================================================

-- Allow anonymous deletion of shares (needed for burn-after-read)
CREATE POLICY "sharex_anyone_delete_shares"
  ON public.shares FOR DELETE
  USING (true);

-- Allow anonymous deletion of share_files (cascades from share deletion)
CREATE POLICY "sharex_anyone_delete_share_files"
  ON public.share_files FOR DELETE
  USING (true);
