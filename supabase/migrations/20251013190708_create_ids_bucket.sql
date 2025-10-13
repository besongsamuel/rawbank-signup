-- Create storage bucket for ID document uploads
-- This bucket will store user ID images for AI extraction

-- Create the 'ids' bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'ids',
  'ids',
  false, -- Private bucket - users can only access their own files
  10485760, -- 10MB file size limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for the ids bucket
-- Users can only upload, view, update, and delete their own ID images

-- Policy: Users can upload their own ID images
CREATE POLICY "Users can upload their own ID images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'ids' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Users can view their own ID images
CREATE POLICY "Users can view their own ID images"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'ids' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Users can update their own ID images
CREATE POLICY "Users can update their own ID images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'ids' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Users can delete their own ID images
CREATE POLICY "Users can delete their own ID images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'ids' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Note: Comments on storage.buckets table require owner permissions
-- The bucket and policies are created successfully without comments

/*
Bucket Structure:
- Bucket ID: 'ids'
- Purpose: Store user ID document images for AI extraction
- Privacy: Private (users can only access their own files)
- File size limit: 10MB
- Allowed types: JPEG, JPG, PNG, WebP, PDF

File Path Structure:
- Format: {user_id}/{id_type}.{extension}
- Example: 550e8400-e29b-41d4-a716-446655440000/passport.jpg
- Example: 550e8400-e29b-41d4-a716-446655440000/driver-license.png

RLS Policies:
- Users can only upload files to their own folder
- Users can only view files in their own folder
- Users can only update files in their own folder
- Users can only delete files in their own folder

Usage in Edge Function:
```typescript
// Upload file
const { data, error } = await supabase.storage
  .from('ids')
  .upload(`${userId}/${idType}.jpg`, file);

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('ids')
  .getPublicUrl(`${userId}/${idType}.jpg`);

// Get presigned URL (for private access)
const { data, error } = await supabase.storage
  .from('ids')
  .createSignedUrl(`${userId}/${idType}.jpg`, 3600); // 1 hour expiry
```
*/
