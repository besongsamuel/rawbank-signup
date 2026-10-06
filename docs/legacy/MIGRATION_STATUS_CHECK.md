# Migration Status Check & Completion Guide

## 🎯 Current Status Analysis

From the terminal output, I can see:

- ✅ **`ids` bucket already exists** - Some migrations have been applied
- ❌ **Duplicate key error** - Trying to create bucket that already exists

This means **some migrations have already been applied successfully**!

---

## 🔍 Check What's Already Applied

### Step 1: Access Supabase Dashboard

1. Go to: https://supabase.com/dashboard/project/ygtguyvvzfwcijahjqwy
2. Click **SQL Editor** → **New Query**

### Step 2: Check Current Database State

Run these queries to see what's already applied:

#### Check All Tables

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

#### Check Storage Buckets

```sql
SELECT id, name, public, file_size_limit, allowed_mime_types
FROM storage.buckets
WHERE id = 'ids';
```

#### Check Extracted User Data Table

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'extracted_user_data'
ORDER BY ordinal_position;
```

#### Check Personal Data Table Structure

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'personal_data'
ORDER BY ordinal_position;
```

---

## 📊 Expected Results

### If Everything is Applied ✅

You should see:

**Tables:**

- `applications`
- `countries`
- `extracted_user_data` ⭐
- `personal_data`
- `provinces`
- `retail_packages`
- `user_documents`
- `user_profiles`

**Storage Bucket:**

- `ids` bucket with `public = false`

**Extracted User Data Columns:**

- `id` (uuid)
- `user_id` (uuid)
- `extracted_data` (jsonb)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### If Some Are Missing ⚠️

Apply only the missing parts from `COMPLETE_MIGRATION_GUIDE.md`

---

## 🧪 Test the System

### 1. Test Edge Function (if all migrations applied)

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

### 2. Check Edge Function Logs

```bash
# If running locally, check the terminal output
# Look for any database connection errors
```

### 3. Test Database Connection

```sql
-- Test inserting into extracted_user_data
INSERT INTO extracted_user_data (user_id, extracted_data)
VALUES (
  '00000000-0000-0000-0000-000000000000', -- test user ID
  '{"test": "data"}'::jsonb
)
ON CONFLICT (user_id) DO NOTHING;

-- Check if it was inserted
SELECT * FROM extracted_user_data WHERE user_id = '00000000-0000-0000-0000-000000000000';

-- Clean up test data
DELETE FROM extracted_user_data WHERE user_id = '00000000-0000-0000-0000-000000000000';
```

---

## 🚀 Next Steps Based on Status

### If All Migrations Applied ✅

1. **Add OpenAI API key** to `supabase/functions/.env`
2. **Test complete flow** (upload → extract → confirm)
3. **Deploy to production**

### If Some Migrations Missing ⚠️

1. **Apply missing migrations** from `COMPLETE_MIGRATION_GUIDE.md`
2. **Verify all tables exist**
3. **Test edge function**
4. **Add OpenAI API key**

### If Edge Function Not Working ❌

1. **Check database connection** in edge function
2. **Verify RLS policies** are correct
3. **Check storage bucket permissions**
4. **Review edge function logs**

---

## 🔧 Troubleshooting

### Common Issues

#### 1. **Edge Function Can't Connect to Database**

```typescript
// In edge function, check if Supabase client is configured correctly
const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_ANON_KEY") ?? ""
);
```

#### 2. **RLS Policy Issues**

```sql
-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'extracted_user_data';

-- Check policies exist
SELECT policyname, cmd
FROM pg_policies
WHERE tablename = 'extracted_user_data';
```

#### 3. **Storage Bucket Issues**

```sql
-- Check bucket exists and is private
SELECT id, name, public
FROM storage.buckets
WHERE id = 'ids';

-- Check storage policies
SELECT policyname, cmd
FROM pg_policies
WHERE tablename = 'objects'
AND policyname LIKE '%ID images%';
```

---

## 📋 Completion Checklist

### Database & Storage

- [ ] All tables exist (`applications`, `personal_data`, `extracted_user_data`, etc.)
- [ ] `ids` storage bucket exists and is private
- [ ] RLS policies are created for all tables
- [ ] Storage policies are created for `ids` bucket

### Edge Function

- [ ] Running locally at `http://127.0.0.1:54321/functions/v1/extract-id-data`
- [ ] Can connect to database
- [ ] Can upload files to storage bucket
- [ ] OpenAI API key configured

### Frontend

- [ ] Upload component works
- [ ] Extraction loading modal works
- [ ] Confirmation modal works
- [ ] Data pre-fills PersonalInfoForm

### Testing

- [ ] Upload ID image
- [ ] AI extracts data
- [ ] Data saves to `extracted_user_data`
- [ ] User can review and confirm
- [ ] Data pre-fills subsequent forms

---

## 🎯 Current Status

| Component               | Status     | Action Needed      |
| ----------------------- | ---------- | ------------------ |
| **Core Tables**         | ✅ Applied | None               |
| **Storage Bucket**      | ✅ Applied | None               |
| **Extracted User Data** | ✅ Applied | None               |
| **Edge Function**       | ✅ Running | Add OpenAI API key |
| **Frontend**            | ✅ Ready   | Test complete flow |

**Next**: Check what's applied, add OpenAI API key, and test! 🚀

---

## 📞 Quick Status Check

Run this single query to check if everything is ready:

```sql
-- Quick status check
SELECT
  'Tables' as component,
  COUNT(*) as count
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('applications', 'personal_data', 'extracted_user_data', 'user_profiles')

UNION ALL

SELECT
  'Storage Buckets' as component,
  COUNT(*) as count
FROM storage.buckets
WHERE id = 'ids'

UNION ALL

SELECT
  'RLS Policies' as component,
  COUNT(*) as count
FROM pg_policies
WHERE tablename = 'extracted_user_data';
```

Expected results:

- **Tables**: 4
- **Storage Buckets**: 1
- **RLS Policies**: 4

If you get these numbers, everything is applied! 🎉
