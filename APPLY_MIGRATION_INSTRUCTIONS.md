# How to Apply the extracted_user_data Migration

## Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project: https://supabase.com/dashboard/project/ygtguyvvzfwcijahjqwy
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of `supabase/migrations/20251013160000_create_extracted_user_data.sql`
5. Click **Run** to execute the migration

## Option 2: Using Supabase CLI

If you have the Supabase CLI configured with access:

```bash
cd /Users/besongsamuel/Documents/Github/rawbank-signup
npx supabase db push
```

## Option 3: Manual SQL Execution

Run the migration SQL directly:

```bash
psql "postgresql://postgres:[YOUR-PASSWORD]@db.ygtguyvvzfwcijahjqwy.supabase.co:5432/postgres" -f supabase/migrations/20251013160000_create_extracted_user_data.sql
```

---

## What This Migration Does

Creates a new table `extracted_user_data` with:

- **id** (UUID) - Primary key
- **user_id** (UUID) - Foreign key to auth.users
- **extracted_data** (JSONB) - The AI-extracted data
- **created_at** (Timestamp) - Creation timestamp
- **updated_at** (Timestamp) - Last update timestamp

### Features:

- ✅ Row Level Security (RLS) enabled
- ✅ Users can only access their own data
- ✅ Unique constraint per user (one extraction per user)
- ✅ Indexes for fast queries
- ✅ Automatic `updated_at` trigger

---

## Verification

After applying, verify the table was created:

```sql
-- Check table exists
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name = 'extracted_user_data';

-- Check columns
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'extracted_user_data';

-- Check RLS policies
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE tablename = 'extracted_user_data';
```

Expected result: Table with 5 columns and 4 RLS policies.

---

## Edge Function Update Status

✅ **Edge function already updated** to use this table:

- File: `supabase/functions/extract-id-data/index.ts`
- Now saves to `extracted_user_data` instead of `personal_data`
- Uses `user_id` as the unique key for upserts

---

## Next Steps

1. Apply this migration
2. Deploy the updated edge function:
   ```bash
   cd /Users/besongsamuel/Documents/Github/rawbank-signup
   npx supabase functions deploy extract-id-data
   ```
3. Test the ID extraction flow
4. Verify data is being saved to `extracted_user_data` table

---

**Important**: The edge function has been updated but won't work until this migration is applied!
