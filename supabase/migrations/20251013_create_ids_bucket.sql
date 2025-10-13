-- Create storage bucket for ID documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'ids',
  'ids',
  false, -- Private bucket for security
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf']
);

-- Enable RLS for the ids bucket
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Users can upload their own ID documents
CREATE POLICY "Users can upload own ID documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'ids' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Users can view their own ID documents
CREATE POLICY "Users can view own ID documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'ids' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Users can update their own ID documents
CREATE POLICY "Users can update own ID documents"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'ids' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Users can delete their own ID documents
CREATE POLICY "Users can delete own ID documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'ids' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Service role has full access
CREATE POLICY "Service role has full access to IDs"
ON storage.objects
FOR ALL
TO service_role
USING (bucket_id = 'ids')
WITH CHECK (bucket_id = 'ids');

-- Add comment for documentation
COMMENT ON TABLE storage.buckets IS 'Storage bucket for user ID documents (passport, driver license, national ID, etc.)';

