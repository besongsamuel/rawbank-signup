# Create IDs Storage Bucket - Manual Guide

## 🚨 CLI Permission Issue

The Supabase CLI is having permission issues. Let's create the storage bucket manually through the Supabase Dashboard.

---

## 📦 Storage Bucket Migration

I've created the migration file: `supabase/migrations/20251013190708_create_ids_bucket.sql`

### What This Migration Does:

1. **Creates the `ids` bucket** for storing ID document images
2. **Sets up RLS policies** so users can only access their own files
3. **Configures file limits** (10MB max, specific MIME types)
4. **Documents the structure** for future reference

---

## 🌐 Apply via Supabase Dashboard

### Step 1: Access SQL Editor

1. Go to: https://supabase.com/dashboard/project/ygtguyvvzfwcijahjqwy
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Apply the Bucket Migration

Copy and paste this SQL:

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
```

### Step 3: Run the Query

Click **Run** to execute the migration.

---

## 🔍 Verify Bucket Creation

After applying, verify with these queries:

### Check Bucket Exists

```sql
SELECT id, name, public, file_size_limit, allowed_mime_types
FROM storage.buckets
WHERE id = 'ids';
```

Expected result:

```
id  | name | public | file_size_limit | allowed_mime_types
----|------|--------|-----------------|-------------------
ids | ids  | false  | 10485760        | {image/jpeg,image/jpg,image/png,image/webp,application/pdf}
```

### Check RLS Policies

```sql
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies
WHERE tablename = 'objects'
AND policyname LIKE '%ID images%';
```

Expected policies:

- "Users can upload their own ID images"
- "Users can view their own ID images"
- "Users can update their own ID images"
- "Users can delete their own ID images"

---

## 📁 Bucket Structure

### File Path Format

```
{user_id}/{id_type}.{extension}
```

### Examples

```
550e8400-e29b-41d4-a716-446655440000/passport.jpg
550e8400-e29b-41d4-a716-446655440000/driver-license.png
550e8400-e29b-41d4-a716-446655440000/national-id.pdf
```

### Supported File Types

- **JPEG** (.jpg, .jpeg)
- **PNG** (.png)
- **WebP** (.webp)
- **PDF** (.pdf)

### File Size Limit

- **Maximum**: 10MB per file

---

## 🔐 Security Features

### Row Level Security (RLS)

- ✅ **Private bucket** - not publicly accessible
- ✅ **User isolation** - users can only access their own files
- ✅ **Folder-based access** - files organized by user ID
- ✅ **Full CRUD policies** - upload, view, update, delete

### Access Control

```typescript
// ✅ This works - user accessing their own file
const { data } = await supabase.storage
  .from("ids")
  .upload("550e8400-e29b-41d4-a716-446655440000/passport.jpg", file);

// ❌ This fails - user trying to access another user's file
const { data } = await supabase.storage
  .from("ids")
  .upload("other-user-id/passport.jpg", file);
```

---

## 🧪 Test the Bucket

### 1. Test Upload (via Edge Function)

The edge function will automatically use this bucket:

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

### 2. Test Direct Upload (Frontend)

```typescript
// In your React component
const uploadIdImage = async (file: File, userId: string, idType: string) => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}/${idType}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from("ids")
    .upload(fileName, file);

  if (error) {
    console.error("Upload error:", error);
    return;
  }

  console.log("Upload successful:", data);
};
```

### 3. Test File Access

```typescript
// Get presigned URL for private access
const getImageUrl = async (userId: string, idType: string) => {
  const { data, error } = await supabase.storage
    .from("ids")
    .createSignedUrl(`${userId}/${idType}.jpg`, 3600); // 1 hour expiry

  if (error) {
    console.error("Error getting URL:", error);
    return null;
  }

  return data.signedUrl;
};
```

---

## 🔄 Integration with Edge Function

The edge function is already configured to use this bucket:

```typescript
// In supabase/functions/extract-id-data/index.ts

// Upload file to bucket
const { data: uploadData, error: uploadError } = await supabase.storage
  .from("ids")
  .upload(`${userId}/${idType}.jpg`, imageFile);

// Get presigned URL for OpenAI
const {
  data: { signedUrl },
} = await supabase.storage
  .from("ids")
  .createSignedUrl(`${userId}/${idType}.jpg`, 3600);
```

---

## 📊 Storage Usage

### Monitor Storage Usage

```sql
-- Check total storage used by ids bucket
SELECT
  bucket_id,
  COUNT(*) as file_count,
  SUM(metadata->>'size')::bigint as total_size_bytes,
  ROUND(SUM(metadata->>'size')::bigint / 1024.0 / 1024.0, 2) as total_size_mb
FROM storage.objects
WHERE bucket_id = 'ids'
GROUP BY bucket_id;
```

### Check User Storage

```sql
-- Check storage per user
SELECT
  (storage.foldername(name))[1] as user_id,
  COUNT(*) as file_count,
  SUM(metadata->>'size')::bigint as total_size_bytes
FROM storage.objects
WHERE bucket_id = 'ids'
GROUP BY (storage.foldername(name))[1]
ORDER BY total_size_bytes DESC;
```

---

## 🚀 Next Steps

After creating the bucket:

### 1. Test Edge Function

```bash
# The edge function should now be able to upload files
curl -X POST \
  http://127.0.0.1:54321/functions/v1/extract-id-data \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "https://example.com/sample-id.jpg",
    "idType": "passport"
  }'
```

### 2. Update Frontend

The frontend can now upload ID images directly to the bucket.

### 3. Deploy to Production

```bash
npx supabase functions deploy extract-id-data
```

---

## ✅ Verification Checklist

After applying the migration:

- [ ] Bucket `ids` exists in storage
- [ ] Bucket is private (public = false)
- [ ] File size limit is 10MB
- [ ] Allowed MIME types include JPEG, PNG, WebP, PDF
- [ ] RLS policies are created (4 policies)
- [ ] Edge function can upload files
- [ ] Users can only access their own files
- [ ] File paths follow `{user_id}/{id_type}.{ext}` format

---

## 🎯 Current Status

| Component                 | Status                 |
| ------------------------- | ---------------------- |
| Migration File            | ✅ Created             |
| Bucket Creation           | ⏳ Apply via Dashboard |
| RLS Policies              | ⏳ Apply via Dashboard |
| Edge Function Integration | ✅ Ready               |
| Frontend Integration      | ✅ Ready               |

**Next**: Apply the bucket migration via Supabase Dashboard! 🚀

---

## 📝 File Structure

```
supabase/migrations/
├── 20251013153206_create_core_tables.sql
├── 20251013153211_create_package_tables.sql
├── 20251013153215_create_document_tables.sql
├── 20251013153218_create_rls_policies.sql
├── 20251013153224_create_triggers_storage.sql
├── 20251013153227_seed_initial_data.sql
├── 20250113_add_fatca_pep_fields.sql
├── 20251013160000_create_extracted_user_data.sql
└── 20251013190708_create_ids_bucket.sql ⭐ NEW
```

All migrations are ready to be applied! 🎉
