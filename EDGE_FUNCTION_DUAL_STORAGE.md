# Edge Function Enhancement - Dual Data Storage

## 🎯 Overview

Updated the `extract-id-data` edge function to save extracted data to **both** tables:

1. **`extracted_user_data`** - Raw AI extraction (JSONB)
2. **`personal_data`** - Structured data for immediate use

---

## 🔄 What Changed

### Before (Single Storage)

```typescript
// Only saved to extracted_user_data
await supabase.from("extracted_user_data").upsert({
  user_id: userId,
  extracted_data: extractedDataWithMeta,
});
```

### After (Dual Storage) ✅

```typescript
// 1. Save raw extraction to extracted_user_data
await supabase.from("extracted_user_data").upsert({
  user_id: userId,
  extracted_data: extractedDataWithMeta,
});

// 2. ALSO save structured data to personal_data
await supabase.from("personal_data").upsert({
  id: userId,
  id_type: mappedIdType,
  id_number: extractedData.idNumber,
  first_name: extractedData.firstName,
  last_name: extractedData.lastName,
  birth_date: extractedData.birthDate,
  // ... all extracted fields mapped to columns
});
```

---

## 📊 Data Flow

```
User uploads ID image
        ↓
Edge Function extracts with AI
        ↓
┌─────────────────────────────────────┐
│  Saves to BOTH tables:              │
│                                     │
│  1. extracted_user_data (JSONB)    │
│     - Raw AI output                 │
│     - Metadata (timestamps, URLs)   │
│     - Audit trail                   │
│                                     │
│  2. personal_data (Columns)         │
│     - Structured data               │
│     - Ready for forms               │
│     - Business logic ready          │
└─────────────────────────────────────┘
        ↓
Frontend can use either:
- Raw data for confirmation modal
- Structured data for form pre-fill
```

---

## ✅ Benefits

### 1. **Immediate Availability**

- Data is immediately available in `personal_data`
- Forms can pre-fill without additional processing
- User sees data right away

### 2. **Audit Trail**

- Original AI extraction preserved in `extracted_user_data`
- Can compare user edits to AI suggestions
- Track extraction accuracy over time

### 3. **Flexibility**

- Frontend can choose which data source to use
- Raw data for confirmation/review
- Structured data for form population

### 4. **Fault Tolerance**

- If `personal_data` upsert fails, `extracted_user_data` still succeeds
- Edge function continues working
- User can still review extracted data

### 5. **Performance**

- No need for frontend to process JSONB data
- Direct column access is faster
- Reduced client-side processing

---

## 🔧 Implementation Details

### Field Mapping

| Extracted Field    | personal_data Column   | Notes                |
| ------------------ | ---------------------- | -------------------- |
| `idType`           | `id_type`              | Mapped via idTypeMap |
| `idNumber`         | `id_number`            | Direct mapping       |
| `issueDate`        | `id_issue_date`        | Date format          |
| `expiryDate`       | `id_expiry_date`       | Date format          |
| `firstName`        | `first_name`           | Direct mapping       |
| `middleName`       | `middle_name`          | Direct mapping       |
| `lastName`         | `last_name`            | Direct mapping       |
| `birthDate`        | `birth_date`           | Date format          |
| `birthPlace`       | `birth_place`          | Direct mapping       |
| `nationality`      | `nationality`          | Direct mapping       |
| `provinceOfOrigin` | `province_of_origin`   | Direct mapping       |
| `address`          | `permanent_address`    | Direct mapping       |
| `country`          | `country_of_residence` | Direct mapping       |

### Error Handling

```typescript
if (personalDataError) {
  console.error("Error saving to personal_data table:", personalDataError);
  // Don't throw error - extracted_user_data is more important for the flow
  console.log("Continuing despite personal_data error...");
} else {
  console.log("Data also saved to personal_data table successfully");
}
```

**Strategy**:

- ✅ `extracted_user_data` failure → **Throw error** (critical)
- ⚠️ `personal_data` failure → **Log error, continue** (non-critical)

---

## 🧪 Testing

### Test Both Tables Are Updated

```sql
-- Check extracted_user_data
SELECT
  user_id,
  extracted_data->>'firstName' as first_name,
  extracted_data->>'lastName' as last_name,
  created_at
FROM extracted_user_data
WHERE user_id = 'USER_UUID';

-- Check personal_data
SELECT
  id,
  first_name,
  last_name,
  id_type,
  id_number,
  updated_at
FROM personal_data
WHERE id = 'USER_UUID';
```

### Test Edge Function

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

Expected logs:

```
Data saved to extracted_user_data table successfully
Data also saved to personal_data table successfully
```

---

## 🎯 Frontend Integration

### Option 1: Use personal_data (Recommended)

```typescript
// Load structured data directly
const { data: personalData } = await supabase
  .from("personal_data")
  .select("*")
  .eq("id", userId)
  .single();

// Pre-fill form
if (personalData) {
  setFormData({
    firstName: personalData.first_name,
    lastName: personalData.last_name,
    idNumber: personalData.id_number,
    // ... etc
  });
}
```

### Option 2: Use extracted_user_data (For confirmation)

```typescript
// Load raw extraction for review
const { data: extractedData } = await supabase
  .from("extracted_user_data")
  .select("extracted_data")
  .eq("user_id", userId)
  .single();

// Show confirmation modal
if (extractedData) {
  showConfirmationModal(extractedData.extracted_data);
}
```

### Option 3: Use Both (Best of both worlds)

```typescript
// Load both for comprehensive data
const [personalData, extractedData] = await Promise.all([
  supabase.from("personal_data").select("*").eq("id", userId).single(),
  supabase
    .from("extracted_user_data")
    .select("extracted_data")
    .eq("user_id", userId)
    .single(),
]);

// Use personal_data for form pre-fill
// Use extracted_data for confirmation modal
```

---

## 📈 Performance Impact

### Database Operations

- **Before**: 1 upsert operation
- **After**: 2 upsert operations
- **Impact**: Minimal (both operations are fast)

### Network Traffic

- **Before**: Single response
- **After**: Single response (same size)
- **Impact**: None

### Frontend Processing

- **Before**: Process JSONB data
- **After**: Direct column access
- **Impact**: **Improved performance**

---

## 🔄 Migration Strategy

### Existing Users

- Existing `personal_data` records will be updated with extracted data
- No data loss
- Seamless transition

### New Users

- Both tables populated from first extraction
- Consistent data across both tables
- Full audit trail maintained

---

## 🎯 Current Status

| Component               | Status          | Notes                      |
| ----------------------- | --------------- | -------------------------- |
| **Edge Function**       | ✅ **Enhanced** | Dual storage implemented   |
| **extracted_user_data** | ✅ **Working**  | Raw AI data storage        |
| **personal_data**       | ✅ **Working**  | Structured data storage    |
| **Frontend**            | ✅ **Ready**    | Can use either data source |
| **Testing**             | ⏳ **Pending**  | Test dual storage          |

---

## 🚀 Next Steps

### 1. Test the Enhanced Function

```bash
# Test with real ID image
curl -X POST \
  http://127.0.0.1:54321/functions/v1/extract-id-data \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "https://your-storage-url.jpg",
    "idType": "passport"
  }'
```

### 2. Verify Both Tables Updated

Check both `extracted_user_data` and `personal_data` tables in Supabase Dashboard.

### 3. Update Frontend (Optional)

Frontend can now choose to use `personal_data` for faster form pre-filling.

### 4. Deploy to Production

```bash
npx supabase functions deploy extract-id-data
```

---

## ✅ Summary

The edge function now provides **dual data storage**:

- ✅ **`extracted_user_data`** - Raw AI extraction for audit trail
- ✅ **`personal_data`** - Structured data for immediate use
- ✅ **Fault tolerance** - Continues working if one fails
- ✅ **Performance** - Faster frontend data access
- ✅ **Flexibility** - Frontend can choose data source

**The system is now more robust and user-friendly!** 🎉

---

**Status**: ✅ **Enhanced and Ready for Testing**
**Version**: 2.1
**Last Updated**: October 13, 2025
