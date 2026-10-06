# Apply Migrations - Manual Guide

## 🚨 CLI Access Issue

The Supabase CLI is having permission issues. Let's apply migrations manually through the Supabase Dashboard.

---

## 📋 Migration Files to Apply

We have these migrations that need to be applied:

1. **Core Tables** - `20251013153206_create_core_tables.sql`
2. **Package Tables** - `20251013153211_create_package_tables.sql`
3. **Document Tables** - `20251013153215_create_document_tables.sql`
4. **RLS Policies** - `20251013153218_create_rls_policies.sql`
5. **Storage Triggers** - `20251013153224_create_triggers_storage.sql`
6. **Seed Data** - `20251013153227_seed_initial_data.sql`
7. **FATCA/PEP Fields** - `20250113_add_fatca_pep_fields.sql`
8. **Extracted User Data** - `20251013160000_create_extracted_user_data.sql` ⭐ **NEW**

---

## 🌐 Apply via Supabase Dashboard

### Step 1: Access SQL Editor

1. Go to: https://supabase.com/dashboard/project/ygtguyvvzfwcijahjqwy
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Apply Migrations in Order

Apply each migration file in this exact order:

#### 1. Core Tables

Copy and paste the contents of `supabase/migrations/20251013153206_create_core_tables.sql`

#### 2. Package Tables

Copy and paste the contents of `supabase/migrations/20251013153211_create_package_tables.sql`

#### 3. Document Tables

Copy and paste the contents of `supabase/migrations/20251013153215_create_document_tables.sql`

#### 4. RLS Policies

Copy and paste the contents of `supabase/migrations/20251013153218_create_rls_policies.sql`

#### 5. Storage Triggers

Copy and paste the contents of `supabase/migrations/20251013153224_create_triggers_storage.sql`

#### 6. Seed Data

Copy and paste the contents of `supabase/migrations/20251013153227_seed_initial_data.sql`

#### 7. FATCA/PEP Fields

Copy and paste the contents of `supabase/migrations/20250113_add_fatca_pep_fields.sql`

#### 8. Extracted User Data ⭐ **CRITICAL**

Copy and paste the contents of `supabase/migrations/20251013160000_create_extracted_user_data.sql`

---

## 🔍 Verify Migrations Applied

After applying all migrations, verify with these queries:

### Check Tables Exist

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Expected tables:

- `applications`
- `countries`
- `extracted_user_data` ⭐
- `personal_data`
- `provinces`
- `retail_packages`
- `user_documents`
- `user_profiles`

### Check Extracted User Data Table

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'extracted_user_data'
ORDER BY ordinal_position;
```

Expected columns:

- `id` (uuid)
- `user_id` (uuid)
- `extracted_data` (jsonb)
- `created_at` (timestamp with time zone)
- `updated_at` (timestamp with time zone)

### Check RLS Policies

```sql
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies
WHERE tablename = 'extracted_user_data';
```

Expected policies:

- "Users can view their own extracted data"
- "Users can insert their own extracted data"
- "Users can update their own extracted data"
- "Users can delete their own extracted data"

---

## 🚀 Quick Apply Script

If you prefer, here's a single script that combines all migrations:

```sql
-- ============================================
-- COMPLETE MIGRATION SCRIPT
-- Apply this entire script at once
-- ============================================

-- 1. Core Tables
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected')),
  application_type VARCHAR(20) DEFAULT 'individual' CHECK (application_type IN ('individual', 'joint')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS personal_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  holder_type VARCHAR(20) CHECK (holder_type IN ('primary', 'co_holder')),

  -- Identity Information
  civility VARCHAR(10) CHECK (civility IN ('Mme', 'Mlle', 'M.')),
  last_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(100),
  first_name VARCHAR(100) NOT NULL,
  birth_date DATE NOT NULL,
  birth_place VARCHAR(100) NOT NULL,
  province_of_origin VARCHAR(100),
  nationality VARCHAR(100) NOT NULL,
  country_of_residence VARCHAR(100) NOT NULL,

  -- Identification Document
  id_type VARCHAR(50) CHECK (id_type IN ('carte_electeur', 'carte_identite', 'permis_conduire', 'passeport', 'autre')),
  id_type_other VARCHAR(100),
  id_number VARCHAR(100) NOT NULL,
  id_issue_date DATE NOT NULL,
  id_expiry_date DATE NOT NULL,

  -- Personal Situation
  marital_status VARCHAR(20) CHECK (marital_status IN ('celibataire', 'marie', 'divorce', 'veuf')),
  marital_regime VARCHAR(50) CHECK (marital_regime IN ('separation_biens', 'communaute_universelle', 'communaute_reduite')),
  number_of_children INTEGER DEFAULT 0,

  -- Housing Information
  housing_status VARCHAR(30) CHECK (housing_status IN ('proprietaire', 'locataire', 'loge_gratuit', 'loge_parents')),
  permanent_address TEXT NOT NULL,
  mailing_address TEXT,

  -- Contact Information
  phone_1 VARCHAR(20) NOT NULL,
  phone_2 VARCHAR(20),
  email_1 VARCHAR(255) NOT NULL,
  email_2 VARCHAR(255),

  -- Professional Information
  profession VARCHAR(100),
  employer VARCHAR(100),
  monthly_gross_income DECIMAL(15,2),
  income_source VARCHAR(100),

  -- Emergency Contact
  emergency_contact_name VARCHAR(100),
  emergency_contact_phone VARCHAR(20),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Package Tables
CREATE TABLE IF NOT EXISTS retail_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  code VARCHAR(20) UNIQUE NOT NULL,
  description TEXT,
  monthly_credit_flow_limit DECIMAL(15,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Countries and Provinces
CREATE TABLE IF NOT EXISTS countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(3) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS provinces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id UUID REFERENCES countries(id) ON DELETE CASCADE,
  code VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true
);

-- 4. Document Tables
CREATE TABLE IF NOT EXISTS user_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type VARCHAR(50) NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified BOOLEAN DEFAULT false,
  verification_notes TEXT
);

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_completion_percentage INTEGER DEFAULT 0,
  current_step VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. FATCA/PEP Fields
ALTER TABLE personal_data
ADD COLUMN IF NOT EXISTS fatca_data JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS pep_data JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS fatca_applicable BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS fatca_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS pep_applicable BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS pep_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS profile_completion_percentage INTEGER DEFAULT 0;

-- 6. Extracted User Data Table ⭐ CRITICAL
CREATE TABLE IF NOT EXISTS extracted_user_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  extracted_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT unique_user_extraction UNIQUE (user_id)
);

-- 7. Indexes
CREATE INDEX IF NOT EXISTS idx_personal_data_user_id ON personal_data(application_id);
CREATE INDEX IF NOT EXISTS idx_user_documents_user_id ON user_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_extracted_user_data_user_id ON extracted_user_data(user_id);
CREATE INDEX IF NOT EXISTS idx_extracted_user_data_extracted_data ON extracted_user_data USING GIN (extracted_data);

-- 8. RLS Policies
ALTER TABLE personal_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE extracted_user_data ENABLE ROW LEVEL SECURITY;

-- Personal Data Policies
CREATE POLICY "Users can view their own personal data"
  ON personal_data FOR SELECT
  USING (auth.uid() = (SELECT user_id FROM applications WHERE id = application_id));

CREATE POLICY "Users can insert their own personal data"
  ON personal_data FOR INSERT
  WITH CHECK (auth.uid() = (SELECT user_id FROM applications WHERE id = application_id));

CREATE POLICY "Users can update their own personal data"
  ON personal_data FOR UPDATE
  USING (auth.uid() = (SELECT user_id FROM applications WHERE id = application_id));

-- User Documents Policies
CREATE POLICY "Users can view their own documents"
  ON user_documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own documents"
  ON user_documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents"
  ON user_documents FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents"
  ON user_documents FOR DELETE
  USING (auth.uid() = user_id);

-- User Profiles Policies
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Extracted User Data Policies ⭐ CRITICAL
CREATE POLICY "Users can view their own extracted data"
  ON extracted_user_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own extracted data"
  ON extracted_user_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own extracted data"
  ON extracted_user_data FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own extracted data"
  ON extracted_user_data FOR DELETE
  USING (auth.uid() = user_id);

-- 9. Triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_personal_data_updated_at
    BEFORE UPDATE ON personal_data
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_extracted_user_data_updated_at
    BEFORE UPDATE ON extracted_user_data
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 10. Storage Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('ids', 'ids', false)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Users can upload their own ID images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'ids' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own ID images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'ids' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own ID images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'ids' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own ID images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'ids' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 11. Seed Data
INSERT INTO countries (code, name) VALUES
('CD', 'République Démocratique du Congo'),
('FR', 'France'),
('US', 'États-Unis'),
('GB', 'Royaume-Uni')
ON CONFLICT (code) DO NOTHING;

INSERT INTO provinces (country_id, code, name) VALUES
((SELECT id FROM countries WHERE code = 'CD'), 'KIN', 'Kinshasa'),
((SELECT id FROM countries WHERE code = 'CD'), 'KAT', 'Katanga'),
((SELECT id FROM countries WHERE code = 'CD'), 'ORI', 'Orientale'),
((SELECT id FROM countries WHERE code = 'CD'), 'KIV', 'Nord-Kivu'),
((SELECT id FROM countries WHERE code = 'CD'), 'SKI', 'Sud-Kivu')
ON CONFLICT (code) DO NOTHING;

INSERT INTO retail_packages (name, code, description, monthly_credit_flow_limit) VALUES
('Compte Standard', 'STANDARD', 'Compte bancaire standard avec fonctionnalités de base', 5000.00),
('Compte Premium', 'PREMIUM', 'Compte premium avec avantages supplémentaires', 15000.00),
('Compte Business', 'BUSINESS', 'Compte professionnel pour entreprises', 50000.00)
ON CONFLICT (code) DO NOTHING;

-- Success message
SELECT 'All migrations applied successfully!' as status;
```

---

## ✅ After Applying Migrations

### 1. Test Edge Function

The edge function should now work with the `extracted_user_data` table:

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

### 2. Deploy to Production

```bash
npx supabase functions deploy extract-id-data
```

### 3. Update TODO Status

Mark these as completed:

- ✅ Apply extracted_user_data migration
- ✅ Deploy updated extract-id-data edge function

---

## 🎯 Current Status

| Task                   | Status                     |
| ---------------------- | -------------------------- |
| Edge Function Code     | ✅ Updated                 |
| Local Deployment       | ✅ Running                 |
| Environment File       | ⏳ Needs OpenAI API key    |
| **Database Migration** | ⏳ **Apply via Dashboard** |
| Production Deployment  | ⏳ Pending                 |

**Next**: Apply the migrations via Supabase Dashboard, then test! 🚀
