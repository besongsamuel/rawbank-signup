-- Create storage bucket for ID documents (only if it doesn't exist)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
SELECT 
  'ids',
  'ids',
  false, -- Private bucket for security
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf']
WHERE NOT EXISTS (
  SELECT 1 FROM storage.buckets WHERE id = 'ids'
);

-- RLS is already enabled on storage.objects by default

-- Policy: Users can upload their own ID documents
DROP POLICY IF EXISTS "Users can upload own ID documents" ON storage.objects;
CREATE POLICY "Users can upload own ID documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'ids' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Users can view their own ID documents
DROP POLICY IF EXISTS "Users can view own ID documents" ON storage.objects;
CREATE POLICY "Users can view own ID documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'ids' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Users can update their own ID documents
DROP POLICY IF EXISTS "Users can update own ID documents" ON storage.objects;
CREATE POLICY "Users can update own ID documents"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'ids' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Users can delete their own ID documents
DROP POLICY IF EXISTS "Users can delete own ID documents" ON storage.objects;
CREATE POLICY "Users can delete own ID documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'ids' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Service role has full access
DROP POLICY IF EXISTS "Service role has full access to IDs" ON storage.objects;
CREATE POLICY "Service role has full access to IDs"
ON storage.objects
FOR ALL
TO service_role
USING (bucket_id = 'ids')
WITH CHECK (bucket_id = 'ids');

-- Note: Storage bucket 'ids' created for user ID documents (passport, driver license, national ID, etc.)

