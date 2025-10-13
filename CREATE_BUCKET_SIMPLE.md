# Create IDs Storage Bucket - Simplified Version

## 🚨 Migration Error Fixed

The previous migration failed because we tried to add comments to system tables. Here's the corrected version.

---

## 📦 Simplified Bucket Migration

Apply this SQL via Supabase Dashboard:

### Step 1: Access SQL Editor

1. Go to: https://supabase.com/dashboard/project/ygtguyvvzfwcijahjqwy
2. Click **SQL Editor** → **New Query**

### Step 2: Apply This SQL

```sql
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

-- Success message
SELECT 'IDs storage bucket created successfully!' as status;
```

### Step 3: Run the Query

Click **Run** to execute the migration.

---

## 🔍 Verify Bucket Creation

After applying, verify with this query:

```sql
-- Check bucket exists
SELECT id, name, public, file_size_limit, allowed_mime_types
FROM storage.buckets
WHERE id = 'ids';

-- Check policies exist
SELECT policyname, cmd
FROM pg_policies
WHERE tablename = 'objects'
AND policyname LIKE '%ID images%';
```

Expected results:

- **Bucket**: `ids` with `public = false`, `file_size_limit = 10485760`
- **Policies**: 4 policies for upload, view, update, delete

---

## 🧪 Test the Bucket

Once created, test with the edge function:

```bash
curl -X POST \
  http://127.0.0.1:54321/functions/v1/extract-id-data \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "https://example.com/sample-id.jpg",
    "idType": "passport"
  }'
```

---

## ✅ What This Creates

### Storage Bucket

- **Name**: `ids`
- **Privacy**: Private (users can only access their own files)
- **File Size**: 10MB limit
- **Types**: JPEG, JPG, PNG, WebP, PDF

### Security Policies

- ✅ Users can upload their own ID images
- ✅ Users can view their own ID images
- ✅ Users can update their own ID images
- ✅ Users can delete their own ID images

### File Structure

```
{user_id}/{id_type}.{extension}
```

Examples:

- `550e8400-e29b-41d4-a716-446655440000/passport.jpg`
- `550e8400-e29b-41d4-a716-446655440000/driver-license.png`

---

## 🎯 Current Status

| Component                     | Status                 |
| ----------------------------- | ---------------------- |
| **extracted_user_data table** | ✅ Applied             |
| **ids storage bucket**        | ⏳ Apply via Dashboard |
| **Edge function**             | ✅ Running             |
| **Frontend components**       | ✅ Ready               |

**Next**: Apply the bucket migration via Supabase Dashboard! 🚀

---

## 🚀 After Bucket Creation

Once the bucket is created:

1. **Test edge function** with real ID images
2. **Add OpenAI API key** to `.env` file
3. **Test full user flow** (upload → extract → confirm)
4. **Deploy to production** when ready

The system will be fully operational! 🎉
