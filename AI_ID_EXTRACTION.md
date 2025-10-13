# AI-Powered ID Card Data Extraction

## 🎯 Overview

This feature uses **OpenAI's GPT-4 Vision API** to automatically extract data from uploaded identity documents (passport, driver's license, national ID, voter card). The extracted information is used to pre-fill the signup form, significantly improving user experience.

---

## 🏗️ Architecture

### Components:

1. **Supabase Edge Function** (`extract-id-data`)
   - Receives presigned URL of uploaded ID image
   - Calls OpenAI Vision API
   - Parses and structures extracted data
   - Saves to database

2. **Storage Bucket** (`ids`)
   - Secure storage for ID documents
   - Private bucket with RLS policies
   - 10MB file size limit
   - Supports: JPEG, PNG, WebP, PDF

3. **React Hook** (`useIdExtraction`)
   - Manages upload process
   - Handles extraction workflow
   - Provides loading states and error handling

4. **UI Components**
   - `IdCardUploadWithAI` - Main upload component
   - `ExtractionLoadingModal` - Shows progress
   - `ExtractionConfirmationModal` - Displays extracted data

---

## 📋 Files Created

### Backend

1. **`supabase/functions/extract-id-data/index.ts`**
   - Edge function for AI extraction
   - Uses GPT-4 Vision (gpt-4o model)
   - Returns structured JSON data

2. **`supabase/migrations/20251013_create_ids_bucket.sql`**
   - Creates storage bucket
   - Sets up RLS policies
   - Configures access controls

### Frontend

3. **`src/hooks/useIdExtraction.ts`**
   - Custom hook for extraction workflow
   - Handles file upload to Supabase Storage
   - Creates presigned URLs
   - Calls edge function
   - Manages states (uploading, extracting, progress)

4. **`src/components/signup/IdCardUploadWithAI.tsx`**
   - Enhanced ID upload component
   - Drag & drop support
   - File preview
   - AI extraction trigger
   - Manual entry fallback

5. **`src/components/modals/ExtractionLoadingModal.tsx`**
   - Beautiful loading modal
   - Progress bar
   - Animated icon
   - Informative messages

6. **`src/components/modals/ExtractionConfirmationModal.tsx`**
   - Displays extracted data
   - Organized by sections
   - Edit/Confirm options
   - Field validation display

---

## 🔄 Workflow

### Step-by-Step Process:

```
1. User selects ID type (passport, driver-license, etc.)
   ↓
2. User uploads image (drag & drop or click)
   ↓
3. File is uploaded to Supabase Storage bucket 'ids'
   Path: {userId}/{idType}/{timestamp}.{ext}
   ↓
4. Presigned URL is generated (valid for 1 hour)
   ↓
5. Loading modal appears
   ↓
6. Edge function is called with:
   - imageUrl (presigned URL)
   - idType
   - userId
   ↓
7. Edge function calls OpenAI Vision API
   ↓
8. AI analyzes image and extracts:
   - ID information (number, dates)
   - Personal info (name, DOB, etc.)
   - Address information
   ↓
9. Data is saved to personal_data table
   ↓
10. Confirmation modal shows extracted data
    ↓
11. User can:
    - Confirm → Continue to next step
    - Edit → Modify data manually
```

---

## 📊 Data Structure

### Extracted Data Interface:

```typescript
interface ExtractedIdData {
  // ID Card Information
  idType: string;           // passport, driver-license, etc.
  idNumber: string;         // Document number
  issueDate?: string;       // YYYY-MM-DD
  expiryDate?: string;      // YYYY-MM-DD

  // Personal Information
  firstName?: string;
  middleName?: string;      // Postnom for DRC
  lastName?: string;
  birthDate?: string;       // YYYY-MM-DD
  birthPlace?: string;      // City
  nationality?: string;
  gender?: string;          // M or F

  // Address Information
  address?: string;         // Full address
  city?: string;
  province?: string;
  country?: string;

  // Additional
  rawData?: any;            // Extra information found
}
```

---

## 🔐 Security Features

### 1. **Private Storage Bucket**
- Not publicly accessible
- RLS (Row Level Security) enabled
- Users can only access their own files

### 2. **Access Policies**
```sql
-- Users can only upload to their own folder
bucket_id = 'ids' AND auth.uid()::text = (storage.foldername(name))[1]

-- Users can only view their own files
bucket_id = 'ids' AND auth.uid()::text = (storage.foldername(name))[1]
```

### 3. **Presigned URLs**
- Temporary access (1 hour expiry)
- No direct file URLs exposed
- Secure token-based access

### 4. **Authentication Required**
- All operations require valid auth token
- Edge function validates user session
- Database operations use service role key

---

## 🎨 UI/UX Features

### 1. **Upload Area**
- ✅ Drag & drop support
- ✅ Click to browse
- ✅ File type validation
- ✅ Size limit (10MB)
- ✅ Visual feedback

### 2. **Loading States**
- **Uploading Phase**:
  - Progress: 0-50%
  - Message: "Téléchargement de votre document..."
  
- **Extracting Phase**:
  - Progress: 60-100%
  - Message: "Extraction des données en cours..."
  - AI icon with pulse animation

### 3. **Confirmation Modal**
Organized sections:
- 📄 Document Information
- 👤 Personal Information
- 📍 Address (if available)

Features:
- Clear data display
- Missing fields shown as "Non détecté"
- Edit button for manual correction
- Confirm button to proceed

### 4. **Error Handling**
- File type validation
- File size validation
- Network error handling
- API error messages
- Extraction failures

---

## ⚙️ Configuration

### Environment Variables Required:

```env
# Supabase
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key
```

### Edge Function Secrets:

```bash
# Set OpenAI API key
supabase secrets set OPENAI_API_KEY=sk-...

# Set Supabase keys (auto-set in hosted environment)
supabase secrets set SUPABASE_URL=https://...
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=...
```

---

## 🚀 Deployment

### 1. **Deploy Edge Function**

```bash
cd supabase
supabase functions deploy extract-id-data
```

### 2. **Run Migrations**

```bash
supabase db push
```

Or manually:
```sql
-- Run the migration file
\i supabase/migrations/20251013_create_ids_bucket.sql
```

### 3. **Set Environment Variables**

In Supabase Dashboard:
- Settings → Edge Functions → Secrets
- Add `OPENAI_API_KEY`

### 4. **Test the Function**

```bash
# Local testing
supabase functions serve extract-id-data

# Test with curl
curl -i --location --request POST 'http://localhost:54321/functions/v1/extract-id-data' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"imageUrl":"URL","idType":"passport","userId":"USER_ID"}'
```

---

## 📱 Supported ID Types

1. **Passport** (`passport`)
   - International travel document
   - Standard MRZ (Machine Readable Zone)

2. **Driver's License** (`driver-license`)
   - DRC driving permit
   - Various national formats

3. **National ID Card** (`national-id`)
   - DRC carte d'identité nationale
   - Contains full citizen information

4. **Voter Card** (`voter-card`)
   - DRC carte d'électeur
   - Electoral registration document

---

## 🎯 AI Prompt Engineering

### System Prompt:

The AI is instructed to:
- Extract ALL visible text
- Return structured JSON
- Use YYYY-MM-DD date format
- Handle French text (DRC documents)
- Return null for missing fields
- Be accurate and thorough

### Image Analysis:

- Model: **GPT-4o** (optimized for vision)
- Detail level: **High** (for better accuracy)
- Temperature: **0.1** (for consistency)
- Max tokens: **1500** (sufficient for detailed extraction)

---

## 🔍 Data Validation

### Frontend Validation:
- File type check
- File size check
- ID type selection required

### Backend Validation:
- Required parameters check
- Image URL validation
- User authentication
- Response format validation

### Post-Extraction:
- User review in confirmation modal
- Manual edit option
- Data sanitization before save

---

## 📊 Database Schema

### Storage Structure:

```
ids/
├── {userId}/
│   ├── passport/
│   │   ├── 1697123456789.jpg
│   │   └── 1697123789012.jpg
│   ├── driver-license/
│   │   └── 1697124567890.jpg
│   └── national-id/
│       └── 1697125678901.jpg
```

### personal_data Table Update:

```json
{
  "step2_data": {
    "idCard": {
      "idType": "passport",
      "idNumber": "AB1234567",
      "issueDate": "2020-01-15",
      "expiryDate": "2030-01-15",
      "uploadedImageUrl": "presigned_url"
    },
    "personalInfo": {
      "firstName": "Jean",
      "middleName": "Ngandu",
      "lastName": "Mukendi",
      "birthDate": "1990-05-20",
      "birthPlace": "Kinshasa",
      "nationality": "Congolaise (RDC)",
      "gender": "M"
    },
    "housingInfo": {
      "permanentAddress": "123 Avenue Kasavubu, Kinshasa"
    },
    "extractedAt": "2025-10-13T18:30:00.000Z"
  }
}
```

---

## 🎨 Styling & Brand

### Colors:
- **Primary**: Black (#000000)
- **Accent**: Yellow (#FFCC00)
- **Success**: Green (#34C759)
- **Background**: White (#FFFFFF)

### Components Match:
- ✅ Rawbank brand colors
- ✅ Apple-like simplicity
- ✅ Clean, modern design
- ✅ Responsive layout
- ✅ Smooth animations

---

## 🔧 Troubleshooting

### Common Issues:

#### 1. **"Failed to create signed URL"**
- **Cause**: Bucket not created or RLS policy issue
- **Fix**: Run migration, check RLS policies

#### 2. **"OpenAI API error"**
- **Cause**: Invalid API key or quota exceeded
- **Fix**: Check OpenAI dashboard, verify API key

#### 3. **"Extraction failed"**
- **Cause**: Poor image quality, unsupported format
- **Fix**: Use high-quality image, ensure good lighting

#### 4. **"User not authenticated"**
- **Cause**: No valid session token
- **Fix**: Re-login, check auth state

#### 5. **"Upload failed"**
- **Cause**: File too large, unsupported type
- **Fix**: Compress image, use supported format

---

## 📈 Future Enhancements

### Planned Features:

1. **Multi-page Document Support**
   - Handle documents with multiple pages
   - Automatic page stitching

2. **Image Quality Enhancement**
   - Automatic brightness/contrast adjustment
   - Blur detection and warning

3. **Multiple Language Support**
   - English, French, Lingala
   - Auto-detect document language

4. **Confidence Scores**
   - Show extraction confidence per field
   - Highlight low-confidence fields

5. **Document Verification**
   - Cross-check with government databases
   - Fraud detection

6. **Batch Upload**
   - Upload multiple documents at once
   - Process in parallel

7. **OCR Fallback**
   - Use Tesseract OCR if AI fails
   - Hybrid approach for better accuracy

---

## 📝 Testing Checklist

- [ ] Upload valid passport image
- [ ] Upload valid driver's license
- [ ] Upload valid national ID
- [ ] Upload valid voter card
- [ ] Test file type validation
- [ ] Test file size validation
- [ ] Test drag & drop
- [ ] Test loading states
- [ ] Test confirmation modal
- [ ] Test manual edit
- [ ] Test error handling
- [ ] Test with poor quality image
- [ ] Test with non-ID image
- [ ] Test network errors
- [ ] Test authentication errors
- [ ] Test data persistence
- [ ] Test form pre-filling
- [ ] Test responsive design
- [ ] Test on mobile devices

---

## 🎉 Benefits

### For Users:
- ⚡ **Faster signup** - No manual typing
- ✅ **Fewer errors** - AI accuracy
- 📱 **Mobile-friendly** - Easy upload
- 🔒 **Secure** - Private storage

### For Rawbank:
- 📊 **Higher conversion** - Less friction
- 🎯 **Better data quality** - Structured extraction
- 💰 **Cost savings** - Reduced manual entry
- 🚀 **Modern experience** - AI-powered

---

## 📚 Resources

- [OpenAI Vision API Docs](https://platform.openai.com/docs/guides/vision)
- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Material-UI Components](https://mui.com/material-ui/)

---

**Status**: ✅ Complete and Ready for Testing
**Version**: 1.0
**Last Updated**: October 13, 2025

