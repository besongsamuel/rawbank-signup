# Edge Function Update - Database Schema Alignment

## 🎯 Overview

Updated the `extract-id-data` edge function to properly align with the actual `personal_data` table structure in the database.

---

## 📊 Database Schema

### personal_data Table Structure:

The table has **explicit columns** (not JSONB), as defined in the migrations:

#### Core Columns:

- `id` - UUID (Primary Key)
- `application_id` - UUID (Foreign Key)
- `holder_type` - VARCHAR(20)

#### Identity Information:

- `civility` - VARCHAR(10) - ('Mme', 'Mlle', 'M.')
- `first_name` - VARCHAR(100) - **REQUIRED**
- `middle_name` - VARCHAR(100)
- `last_name` - VARCHAR(100) - **REQUIRED**
- `birth_date` - DATE - **REQUIRED**
- `birth_place` - VARCHAR(100) - **REQUIRED**
- `province_of_origin` - VARCHAR(100)
- `nationality` - VARCHAR(100) - **REQUIRED**
- `country_of_residence` - VARCHAR(100) - **REQUIRED**

#### ID Document:

- `id_type` - VARCHAR(50) - ENUM: ('carte_electeur', 'carte_identite', 'permis_conduire', 'passeport', 'autre')
- `id_type_other` - VARCHAR(100)
- `id_number` - VARCHAR(100) - **REQUIRED**
- `id_issue_date` - DATE - **REQUIRED**
- `id_expiry_date` - DATE - **REQUIRED**

#### Personal Situation:

- `marital_status` - VARCHAR(20)
- `marital_regime` - VARCHAR(50)
- `number_of_children` - INTEGER

#### Housing:

- `housing_status` - VARCHAR(30)
- `permanent_address` - TEXT - **REQUIRED**
- `mailing_address` - TEXT

#### Contact:

- `phone_1` - VARCHAR(20) - **REQUIRED**
- `phone_2` - VARCHAR(20)
- `email_1` - VARCHAR(255) - **REQUIRED**
- `email_2` - VARCHAR(255)

#### Professional:

- `profession` - VARCHAR(100)
- `employer` - VARCHAR(100)
- `monthly_gross_income` - DECIMAL(15,2)
- `income_source` - VARCHAR(100)

#### Emergency Contact:

- `emergency_contact_name` - VARCHAR(100)
- `emergency_contact_phone` - VARCHAR(20)

#### FATCA/PEP (Added Later):

- `fatca_data` - JSONB
- `pep_data` - JSONB
- `fatca_applicable` - BOOLEAN
- `fatca_completed` - BOOLEAN
- `pep_applicable` - BOOLEAN
- `pep_completed` - BOOLEAN
- `profile_completion_percentage` - INTEGER

#### Timestamps:

- `created_at` - TIMESTAMP
- `updated_at` - TIMESTAMP

---

## 🔄 Changes Made

### 1. **Updated Data Mapping**

**Before** (Incorrect - using JSONB):

```typescript
{
  id: userId,
  step2_data: {
    idCard: { ... },
    personalInfo: { ... },
    housingInfo: { ... }
  }
}
```

**After** (Correct - using explicit columns):

```typescript
{
  id: userId,
  id_type: "passeport",
  id_number: "AB1234567",
  id_issue_date: "2020-01-15",
  id_expiry_date: "2030-01-15",
  first_name: "Jean",
  middle_name: "Ngandu",
  last_name: "Mukendi",
  birth_date: "1990-05-20",
  birth_place: "Kinshasa",
  nationality: "Congolaise (RDC)",
  province_of_origin: "Kinshasa",
  permanent_address: "123 Avenue Kasavubu",
  country_of_residence: "République Démocratique du Congo",
  updated_at: "2025-10-13T18:30:00.000Z"
}
```

### 2. **Added ID Type Mapping**

The frontend uses different ID type values than the database:

```typescript
const idTypeMap: Record<string, string> = {
  passport: "passeport",
  "driver-license": "permis_conduire",
  "national-id": "carte_identite",
  "voter-card": "carte_electeur",
  // Also handle if already in correct format
  passeport: "passeport",
  permis_conduire: "permis_conduire",
  carte_identite: "carte_identite",
  carte_electeur: "carte_electeur",
};
```

### 3. **Conditional Field Insertion**

Only insert fields that have values:

```typescript
const upsertData: any = {
  id: userId,
  updated_at: new Date().toISOString(),
};

// Only add fields if they exist
if (extractedData.firstName) upsertData.first_name = extractedData.firstName;
if (extractedData.middleName) upsertData.middle_name = extractedData.middleName;
// ... etc
```

This prevents:

- Overwriting existing data with null
- Database constraint violations
- Unnecessary updates

### 4. **Added Province of Origin**

Updated `ExtractedData` interface:

```typescript
interface ExtractedData {
  // ... other fields
  nationality?: string;
  provinceOfOrigin?: string; // NEW
  gender?: string;
  // ...
}
```

### 5. **Enhanced AI Prompt**

Updated system prompt to extract province of origin:

```typescript
{
  // ...
  "nationality": "nationality or nationalité",
  "provinceOfOrigin": "province of origin (for DRC documents)", // NEW
  "gender": "M or F or Masculin/Féminin",
  // ...
}

Important:
- For DRC documents, look for French text (e.g., "Province d'origine")
- For gender, convert to M or F (Masculin=M, Féminin=F)
```

---

## 📋 Field Mapping Table

| Extracted Field    | Database Column        | Type         | Required | Notes                |
| ------------------ | ---------------------- | ------------ | -------- | -------------------- |
| `idType`           | `id_type`              | VARCHAR(50)  | Yes      | Mapped via idTypeMap |
| `idNumber`         | `id_number`            | VARCHAR(100) | Yes      |                      |
| `issueDate`        | `id_issue_date`        | DATE         | Yes      | YYYY-MM-DD           |
| `expiryDate`       | `id_expiry_date`       | DATE         | Yes      | YYYY-MM-DD           |
| `firstName`        | `first_name`           | VARCHAR(100) | Yes      |                      |
| `middleName`       | `middle_name`          | VARCHAR(100) | No       | Postnom for DRC      |
| `lastName`         | `last_name`            | VARCHAR(100) | Yes      |                      |
| `birthDate`        | `birth_date`           | DATE         | Yes      | YYYY-MM-DD           |
| `birthPlace`       | `birth_place`          | VARCHAR(100) | Yes      | City                 |
| `nationality`      | `nationality`          | VARCHAR(100) | Yes      |                      |
| `provinceOfOrigin` | `province_of_origin`   | VARCHAR(100) | No       | DRC specific         |
| `address`          | `permanent_address`    | TEXT         | Yes      |                      |
| `country`          | `country_of_residence` | VARCHAR(100) | Yes      |                      |

---

## 🔐 Upsert Behavior

The edge function uses `upsert` with `onConflict: "id"`:

```typescript
await supabase.from("personal_data").upsert(upsertData, {
  onConflict: "id",
  ignoreDuplicates: false,
});
```

**Behavior:**

- If record with `id` exists → **UPDATE** existing fields
- If record doesn't exist → **INSERT** new record
- Only updates fields that are in `upsertData`
- Preserves other fields not in the upsert

---

## ⚠️ Important Notes

### Required Fields Handling

The database has several **REQUIRED** fields. The edge function only inserts extracted fields, so:

1. **First Upload**: May fail if required fields are missing

   - Frontend should handle this by requiring manual entry
   - Or ensure all required fields are extracted

2. **Subsequent Updates**: Will succeed if record exists
   - Upsert will only update provided fields
   - Required fields from first insert remain

### Recommended Flow:

```
1. User uploads ID
2. AI extracts available data
3. Edge function upserts extracted fields
4. Frontend shows confirmation modal
5. User reviews and can edit
6. Frontend shows PersonalInfoForm
7. User fills missing required fields
8. Frontend saves complete record
```

---

## 🧪 Testing Recommendations

### Test Cases:

1. **Complete Extraction**

   - ID with all fields visible
   - Verify all fields saved correctly

2. **Partial Extraction**

   - ID with some fields missing
   - Verify only extracted fields saved
   - Verify no overwrite of existing data

3. **ID Type Mapping**

   - Test all ID types: passport, driver-license, national-id, voter-card
   - Verify correct mapping to database enums

4. **Date Format**

   - Various date formats in images
   - Verify conversion to YYYY-MM-DD

5. **French Text Recognition**

   - DRC documents with French labels
   - Verify province_of_origin extraction

6. **Gender Conversion**
   - Documents with "Masculin"/"Féminin"
   - Verify conversion to M/F

---

## 🚀 Deployment Checklist

- [x] Update edge function code
- [ ] Test locally with `supabase functions serve`
- [ ] Deploy with `supabase functions deploy extract-id-data`
- [ ] Test with real ID images
- [ ] Verify database updates
- [ ] Check error handling
- [ ] Monitor logs for issues

---

## 📝 Example Data Flow

### Input (Presigned URL of ID Image):

- DRC Carte d'Identité Nationale

### OpenAI Extraction:

```json
{
  "idType": "national-id",
  "idNumber": "1-234-N56789-12",
  "issueDate": "2020-05-15",
  "expiryDate": "2030-05-15",
  "firstName": "Jean",
  "middleName": "Ngandu",
  "lastName": "Mukendi",
  "birthDate": "1990-03-20",
  "birthPlace": "Kinshasa",
  "nationality": "Congolaise (RDC)",
  "provinceOfOrigin": "Kinshasa",
  "gender": "Masculin",
  "address": "123 Avenue Kasavubu, Gombe"
}
```

### Database Upsert:

```sql
INSERT INTO personal_data (
  id,
  id_type,
  id_number,
  id_issue_date,
  id_expiry_date,
  first_name,
  middle_name,
  last_name,
  birth_date,
  birth_place,
  nationality,
  province_of_origin,
  permanent_address,
  country_of_residence,
  updated_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'carte_identite',
  '1-234-N56789-12',
  '2020-05-15',
  '2030-05-15',
  'Jean',
  'Ngandu',
  'Mukendi',
  '1990-03-20',
  'Kinshasa',
  'Congolaise (RDC)',
  'Kinshasa',
  '123 Avenue Kasavubu, Gombe',
  'République Démocratique du Congo',
  '2025-10-13 18:30:00+00'
)
ON CONFLICT (id) DO UPDATE SET
  id_type = EXCLUDED.id_type,
  id_number = EXCLUDED.id_number,
  -- ... etc
```

---

## ✅ Benefits of This Approach

1. **Type Safety**: Explicit columns provide better type checking
2. **Performance**: Indexed columns faster than JSONB queries
3. **Validation**: Database constraints ensure data integrity
4. **Clarity**: Clear schema visible in migrations
5. **Compatibility**: Works with existing table structure

---

## 🔧 Future Improvements

1. **Required Field Validation**

   - Add pre-save validation in edge function
   - Return list of missing required fields
   - Frontend can prompt for missing data

2. **Gender Normalization**

   - Handle more gender variations
   - Support multiple languages

3. **Address Parsing**

   - Split address into components
   - Extract city, province from address string

4. **Confidence Scores**

   - Add field-level confidence from OpenAI
   - Highlight low-confidence fields for review

5. **Data Validation**
   - Validate date formats
   - Validate ID number patterns
   - Cross-check nationality with country

---

**Status**: ✅ Updated and Aligned with Database Schema
**Version**: 2.0
**Last Updated**: October 13, 2025
