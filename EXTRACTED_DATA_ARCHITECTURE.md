# Extracted Data Architecture

## 🎯 Overview

This document describes the two-table architecture for handling AI-extracted ID data.

---

## 📊 Architecture Design

### Two-Table Approach

```
┌─────────────────────────────────────────────┐
│           User uploads ID image             │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│    Edge Function: extract-id-data           │
│    - Uploads to Supabase Storage            │
│    - Calls OpenAI GPT-4 Vision              │
│    - Extracts structured data               │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│     Table: extracted_user_data (JSONB)      │
│     - Stores raw AI extraction              │
│     - One record per user                   │
│     - Flexible schema                       │
│     - Can be updated/replaced               │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│        User Reviews & Confirms              │
│        - Frontend shows modal               │
│        - User can edit fields               │
│        - User confirms accuracy             │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│    Table: personal_data (Typed Columns)     │
│    - Validated structured data              │
│    - Enforces constraints                   │
│    - Used for account opening               │
│    - Indexed & optimized                    │
└─────────────────────────────────────────────┘
```

---

## 🗄️ Table Schemas

### 1. `extracted_user_data` (Intermediate Storage)

**Purpose**: Store raw AI-extracted data before validation

```sql
CREATE TABLE extracted_user_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  extracted_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT unique_user_extraction UNIQUE (user_id)
);
```

**Features**:

- ✅ **Flexible Schema**: JSONB allows any structure
- ✅ **User Isolation**: One extraction per user (unique constraint)
- ✅ **RLS Protected**: Users can only access their own data
- ✅ **Indexed**: Fast lookups by user_id
- ✅ **GIN Index**: Fast JSON queries
- ✅ **Auto Timestamps**: Tracks creation and updates

**Example Data**:

```json
{
  "idType": "passeport",
  "idNumber": "AB1234567",
  "issueDate": "2020-01-15",
  "expiryDate": "2030-01-15",
  "firstName": "Jean",
  "middleName": "Ngandu",
  "lastName": "Mukendi",
  "birthDate": "1990-05-20",
  "birthPlace": "Kinshasa",
  "nationality": "Congolaise (RDC)",
  "provinceOfOrigin": "Kinshasa",
  "gender": "M",
  "address": "123 Avenue Kasavubu, Gombe, Kinshasa",
  "city": "Kinshasa",
  "province": "Kinshasa",
  "country": "République Démocratique du Congo",
  "uploadedImageUrl": "https://storage.supabase.co/...",
  "extractedAt": "2025-10-13T18:30:00.000Z",
  "originalIdType": "passport"
}
```

### 2. `personal_data` (Final Storage)

**Purpose**: Store validated, structured personal data for account opening

```sql
CREATE TABLE personal_data (
  id UUID PRIMARY KEY,
  application_id UUID REFERENCES applications(id),

  -- Identity
  first_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(100),
  last_name VARCHAR(100) NOT NULL,
  birth_date DATE NOT NULL,
  birth_place VARCHAR(100) NOT NULL,
  nationality VARCHAR(100) NOT NULL,
  province_of_origin VARCHAR(100),

  -- ID Document
  id_type VARCHAR(50) NOT NULL,
  id_number VARCHAR(100) NOT NULL,
  id_issue_date DATE NOT NULL,
  id_expiry_date DATE NOT NULL,

  -- ... many other required fields
);
```

**Features**:

- ✅ **Typed Columns**: Strong typing & validation
- ✅ **Required Fields**: Database constraints
- ✅ **Indexed**: Fast queries on specific fields
- ✅ **Normalized**: Optimized for relational queries
- ✅ **Business Logic**: Supports complex queries

---

## 🔄 Data Flow

### Phase 1: Extraction (Edge Function)

```typescript
// supabase/functions/extract-id-data/index.ts

// 1. Upload image to storage
const { data: uploadData } = await supabase.storage
  .from("ids")
  .upload(`${userId}/${idType}.jpg`, imageFile);

// 2. Extract data with OpenAI
const extractedData = await extractWithOpenAI(imageUrl, idType);

// 3. Save to extracted_user_data
await supabase.from("extracted_user_data").upsert(
  {
    user_id: userId,
    extracted_data: {
      ...extractedData,
      uploadedImageUrl: imageUrl,
      extractedAt: new Date().toISOString(),
    },
  },
  {
    onConflict: "user_id",
  }
);
```

**Why this approach?**

- ✅ Simple upsert (no complex field mapping)
- ✅ Preserves all extracted data (nothing lost)
- ✅ Easy to update/replace extraction
- ✅ No constraint violations on partial data

### Phase 2: Review & Confirm (Frontend)

```typescript
// Frontend: ExtractionConfirmationModal

// 1. Show extracted data to user
<ConfirmationModal
  extractedData={extractedData}
  onConfirm={handleConfirm}
  onEdit={handleEdit}
/>

// 2. User reviews and can edit
// 3. User confirms data is correct
```

### Phase 3: Validation & Save (Frontend)

```typescript
// Frontend: PersonalInfoForm or similar

// 1. Load extracted data
const { data } = await supabase
  .from("extracted_user_data")
  .select("extracted_data")
  .eq("user_id", userId)
  .single();

// 2. Pre-fill form with extracted data
setFormData(data.extracted_data);

// 3. User completes missing fields
// 4. Validate all required fields
// 5. Save to personal_data
await supabase.from("personal_data").upsert({
  id: userId,
  first_name: formData.firstName,
  last_name: formData.lastName,
  // ... all required fields mapped correctly
});
```

---

## ✅ Benefits of This Architecture

### 1. **Separation of Concerns**

| Table                 | Purpose        | Schema         | Validation       |
| --------------------- | -------------- | -------------- | ---------------- |
| `extracted_user_data` | Raw AI output  | Flexible JSONB | Minimal          |
| `personal_data`       | Validated data | Strict columns | Full constraints |

### 2. **Fault Tolerance**

- ✅ Edge function can't fail on missing fields
- ✅ Partial extraction is OK
- ✅ Can re-extract without losing other data
- ✅ User can manually complete missing data

### 3. **Audit Trail**

- ✅ Keep original AI extraction
- ✅ Compare user edits to AI suggestions
- ✅ Track extraction timestamps
- ✅ Analyze AI accuracy over time

### 4. **Flexibility**

- ✅ Add new extraction fields without migrations
- ✅ Support different ID types with different fields
- ✅ Store confidence scores and metadata
- ✅ Easy to update extraction logic

### 5. **Data Integrity**

- ✅ `personal_data` enforces all business rules
- ✅ Strong typing prevents data corruption
- ✅ Foreign key constraints maintained
- ✅ Indexed for performance

---

## 🔍 Query Patterns

### Load Extracted Data for Review

```typescript
const { data, error } = await supabase
  .from("extracted_user_data")
  .select("extracted_data")
  .eq("user_id", userId)
  .single();

if (data) {
  const extracted = data.extracted_data;
  // Show confirmation modal
}
```

### Check if User Has Extracted Data

```typescript
const { data, error } = await supabase
  .from("extracted_user_data")
  .select("id")
  .eq("user_id", userId)
  .maybeSingle();

const hasExtracted = !!data;
```

### Get Extraction Timestamp

```typescript
const { data } = await supabase
  .from("extracted_user_data")
  .select("created_at, updated_at")
  .eq("user_id", userId)
  .single();

console.log("First extraction:", data.created_at);
console.log("Last update:", data.updated_at);
```

### Transfer to Personal Data

```typescript
// 1. Load extracted data
const { data: extracted } = await supabase
  .from("extracted_user_data")
  .select("extracted_data")
  .eq("user_id", userId)
  .single();

// 2. Map and validate
const personalData = mapExtractedToPersonal(extracted.extracted_data);

// 3. Save to personal_data
const { error } = await supabase.from("personal_data").upsert({
  id: userId,
  ...personalData,
});

// 4. Optionally delete extracted data (or keep for audit)
// await supabase
//   .from('extracted_user_data')
//   .delete()
//   .eq('user_id', userId);
```

---

## 🔐 Security (RLS Policies)

All policies ensure users can only access their own data:

```sql
-- View own data
CREATE POLICY "Users can view their own extracted data"
  ON extracted_user_data FOR SELECT
  USING (auth.uid() = user_id);

-- Insert own data
CREATE POLICY "Users can insert their own extracted data"
  ON extracted_user_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Update own data
CREATE POLICY "Users can update their own extracted data"
  ON extracted_user_data FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Delete own data
CREATE POLICY "Users can delete their own extracted data"
  ON extracted_user_data FOR DELETE
  USING (auth.uid() = user_id);
```

---

## 🧪 Testing Strategy

### 1. Test Edge Function

```bash
# Test with sample ID image
curl -X POST \
  https://ygtguyvvzfwcijahjqwy.supabase.co/functions/v1/extract-id-data \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "https://storage.supabase.co/...",
    "idType": "passport"
  }'
```

### 2. Verify Extraction Saved

```sql
SELECT
  user_id,
  extracted_data->>'firstName' as first_name,
  extracted_data->>'lastName' as last_name,
  extracted_data->>'idNumber' as id_number,
  created_at,
  updated_at
FROM extracted_user_data
WHERE user_id = 'USER_UUID';
```

### 3. Test Data Transfer

```typescript
// In PersonalInfoForm component
useEffect(() => {
  const loadExtractedData = async () => {
    const { data } = await supabase
      .from("extracted_user_data")
      .select("extracted_data")
      .eq("user_id", user.id)
      .single();

    if (data) {
      // Pre-fill form
      onDataChange({
        personalInfo: {
          firstName: data.extracted_data.firstName,
          lastName: data.extracted_data.lastName,
          // ... etc
        },
      });
    }
  };

  loadExtractedData();
}, [user.id]);
```

---

## 🚀 Migration Path

### Current State ❌

- Edge function tries to write directly to `personal_data`
- Fails on missing required fields
- Complex field mapping in edge function

### New State ✅

- Edge function writes to `extracted_user_data`
- Frontend loads extracted data
- Frontend validates and writes to `personal_data`

### Migration Steps

1. ✅ Create `extracted_user_data` table
2. ✅ Update edge function to use new table
3. ⏳ Deploy migration to Supabase
4. ⏳ Deploy updated edge function
5. ⏳ Update frontend to load extracted data
6. ⏳ Test full flow
7. ⏳ Monitor and iterate

---

## 📝 Frontend Integration

### Hook: `useExtractedData`

Create a custom hook to manage extracted data:

```typescript
// src/hooks/useExtractedData.ts

export const useExtractedData = (userId: string) => {
  const [extractedData, setExtractedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadExtracted = async () => {
      try {
        const { data, error } = await supabase
          .from("extracted_user_data")
          .select("extracted_data, created_at, updated_at")
          .eq("user_id", userId)
          .maybeSingle();

        if (error) throw error;
        setExtractedData(data?.extracted_data || null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) loadExtracted();
  }, [userId]);

  return { extractedData, loading, error };
};
```

### Component: Pre-fill Forms

```typescript
// In PersonalInfoForm or similar
const { extractedData } = useExtractedData(user.id);

useEffect(() => {
  if (extractedData) {
    // Pre-fill form with extracted data
    onDataChange({
      personalInfo: {
        firstName: extractedData.firstName,
        middleName: extractedData.middleName,
        lastName: extractedData.lastName,
        birthDate: extractedData.birthDate,
        birthPlace: extractedData.birthPlace,
        nationality: extractedData.nationality,
        provinceOfOrigin: extractedData.provinceOfOrigin,
      },
      idCard: {
        type: extractedData.idType,
        number: extractedData.idNumber,
        issueDate: extractedData.issueDate,
        expiryDate: extractedData.expiryDate,
      },
      housingInfo: {
        permanentAddress: extractedData.address,
      },
    });
  }
}, [extractedData]);
```

---

## 🎯 Future Enhancements

### 1. Confidence Scores

Store AI confidence for each field:

```json
{
  "firstName": "Jean",
  "lastName": "Mukendi",
  "confidence": {
    "firstName": 0.98,
    "lastName": 0.95,
    "idNumber": 0.88
  }
}
```

Frontend highlights low-confidence fields for review.

### 2. Multiple Extractions

Allow multiple ID uploads:

```sql
ALTER TABLE extracted_user_data
DROP CONSTRAINT unique_user_extraction;

ALTER TABLE extracted_user_data
ADD COLUMN extraction_type VARCHAR(50); -- 'front', 'back', 'passport_page_1', etc.

ALTER TABLE extracted_user_data
ADD CONSTRAINT unique_user_extraction_type UNIQUE (user_id, extraction_type);
```

### 3. Extraction History

Track all extractions for audit:

```sql
CREATE TABLE extraction_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  extracted_data JSONB,
  extraction_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 4. AI Model Versioning

Track which AI model was used:

```json
{
  "extractedData": {...},
  "metadata": {
    "model": "gpt-4o",
    "version": "2025-10-13",
    "processingTime": 2.3,
    "cost": 0.045
  }
}
```

---

## ✅ Summary

| Aspect         | extracted_user_data       | personal_data           |
| -------------- | ------------------------- | ----------------------- |
| **Purpose**    | Raw AI extraction         | Validated final data    |
| **Schema**     | JSONB (flexible)          | Typed columns (strict)  |
| **Validation** | Minimal                   | Full constraints        |
| **Updates**    | Frequent (re-extractions) | Infrequent (user edits) |
| **Source**     | AI Edge Function          | User forms              |
| **Access**     | Edge function + Frontend  | Frontend only           |

**This architecture provides**:

- ✅ Clear separation of concerns
- ✅ Flexible AI extraction
- ✅ Strong data validation
- ✅ Better error handling
- ✅ Audit trail
- ✅ Scalable and maintainable

---

**Status**: ✅ Design Complete, Migration Ready
**Version**: 1.0
**Last Updated**: October 13, 2025
