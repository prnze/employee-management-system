-- ============================================================================
-- ShareX Storage Bucket & Policies
-- Creates the 'sharex-files' bucket and configures anonymous access policies
-- ============================================================================

-- Create the bucket (public for download, restricted upload)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'sharex-files',
  'sharex-files',
  true,
  52428800,  -- 50 MB
  NULL       -- Allow all MIME types
)
ON CONFLICT (id) DO NOTHING;

-- ── Upload policy ───────────────────────────────────────────────────────────
-- Allow anonymous uploads (anon key) to the sharex-files bucket
CREATE POLICY "sharex_files_insert"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'sharex-files');

-- ── Read policy ─────────────────────────────────────────────────────────────
-- Allow anyone to read/download files from the sharex-files bucket
CREATE POLICY "sharex_files_select"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'sharex-files');

-- ── Delete policy ───────────────────────────────────────────────────────────
-- Allow deletion (for cleanup / expiry) from the sharex-files bucket
CREATE POLICY "sharex_files_delete"
ON storage.objects
FOR DELETE
TO anon, authenticated
USING (bucket_id = 'sharex-files');
