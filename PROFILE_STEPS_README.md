# Profile Completion Steps - Implementation Summary

## Overview

The profile completion process has been restructured into separate routes for better UX and modularity.

## Routes Structure

### Authentication Routes

- `/login` - Sign in form
- `/signup` - Email/password registration

### Profile Completion Routes (Requires Authentication)

Each step is now a separate route:

1. **`/profile/id-card`** - ID Card Upload Step

   - First step of profile completion
   - User uploads ID card based on type (carte d'électeur, carte d'identité, permis de conduire, passeport, autre)
   - Future: OpenAI integration to extract data from uploaded ID

2. **`/profile/personal-info`** - Personal Information Step

   - Collect personal details (name, birth date, nationality, etc.)
   - To be implemented

3. **`/profile/fatca`** - FATCA Declaration Step

   - Only shown if applicable based on user's nationality/tax residency
   - Collects FATCA (Foreign Account Tax Compliance Act) information
   - To be implemented

4. **`/profile/pep`** - Politically Exposed Person Declaration Step
   - PEP (Personne Politiquement Exposée) declaration
   - Required for all users
   - To be implemented

### Other Routes

- `/app` - User Dashboard (requires complete profile)
- `/complete-profile` - Legacy route, redirects to `/profile/id-card`

## Database Schema

### Supabase Migration: `20250113_add_fatca_pep_fields.sql`

Added the following fields to `personal_data` table:

#### New JSONB Columns:

- `fatca_data` - Stores FATCA declaration information
- `pep_data` - Stores PEP declaration information

#### New Boolean Columns:

- `fatca_applicable` - Whether FATCA declaration is required
- `fatca_completed` - Whether FATCA step is completed
- `pep_applicable` - Whether PEP declaration is required (always true)
- `pep_completed` - Whether PEP step is completed
- `profile_completion_percentage` - Overall completion (0-100)

#### FATCA Data Structure (JSON):

```json
{
  "is_us_person": boolean,
  "us_citizenship": boolean,
  "us_birth_place": boolean,
  "us_residence": boolean,
  "us_address": boolean,
  "us_phone": boolean,
  "us_power_of_attorney": boolean,
  "us_tin": string,  // Tax Identification Number
  "declaration_date": timestamp,
  "signature": string
}
```

#### PEP Data Structure (JSON):

```json
{
  "is_pep": boolean,
  "pep_category": string,  // "government_official", "political_party_leader", etc.
  "position": string,
  "organization": string,
  "country": string,
  "start_date": date,
  "end_date": date,  // nullable if currently serving
  "relationship_to_pep": string,  // if family member/close associate
  "pep_name": string,  // if family member/close associate
  "declaration_date": timestamp,
  "signature": string
}
```

## TypeScript Types

### New Interfaces in `src/types/signup.ts`:

```typescript
export interface FatcaInfo {
  isUSPerson: boolean;
  usCitizenship: boolean;
  usBirthPlace: boolean;
  usResidence: boolean;
  usAddress: boolean;
  usPhone: boolean;
  usPowerOfAttorney: boolean;
  usTin?: string;
  declarationDate?: string;
  signature?: string;
}

export interface PepInfo {
  isPep: boolean;
  pepCategory?:
    | "government_official"
    | "political_party_leader"
    | "military_officer"
    | "judicial_official"
    | "state_enterprise_executive"
    | "family_member"
    | "close_associate";
  position?: string;
  organization?: string;
  country?: string;
  startDate?: string;
  endDate?: string;
  relationshipToPep?: string;
  pepName?: string;
  declarationDate?: string;
  signature?: string;
}
```

### Updated SignupStep Type:

```typescript
export type SignupStep =
  | "step1"
  | "step2_id"
  | "step2_personal"
  | "step2_fatca" // NEW
  | "step2_pep" // NEW
  | "step2_marital"
  | "step2_housing"
  | "step2_contact"
  | "step2_professional"
  | "step2_emergency"
  | "step2_bank"
  | "step2_package"
  | "complete";
```

## Navigation Flow

### For New Users:

1. `/signup` → Register with email/password
2. Auto redirect to `/profile/id-card`
3. Upload ID → Navigate to `/profile/personal-info`
4. Fill personal info → Check if FATCA applicable
   - If yes: Navigate to `/profile/fatca`
   - If no: Skip to `/profile/pep`
5. Complete FATCA (if applicable) → Navigate to `/profile/pep`
6. Complete PEP → Save to database → Redirect to `/app`

### For Returning Users (Incomplete Profile):

- Login → Auto redirect to `/profile/id-card` (or last incomplete step)
- Continue from where they left off

### For Users with Complete Profile:

- Login → Auto redirect to `/app`

## FATCA Applicability Logic

FATCA declaration is required if user meets ANY of these criteria:

- US citizenship
- Born in the United States
- US tax residence
- US address or US phone number
- US power of attorney

Implementation in `CompleteProfile.tsx`:

```typescript
const checkFatcaApplicable = (personalInfo: any): boolean => {
  // Logic to determine FATCA applicability
  // Based on nationality, birthplace, and other factors
  return false; // Will be determined by actual data
};
```

## PEP Categories

Politically Exposed Persons include:

1. **Government Officials** - Ministers, senior government officials
2. **Political Party Leaders** - Party leaders and senior members
3. **Military Officers** - Senior military officials
4. **Judicial Officials** - Judges and senior judicial officials
5. **State Enterprise Executives** - Senior executives of state-owned enterprises
6. **Family Members** - Immediate family of PEPs
7. **Close Associates** - Known close business associates of PEPs

## Component Structure

### CompleteProfile Component

- Accepts `step` prop to determine which step to render
- Handles navigation between steps
- Manages form state via `useSignupForm` hook
- Shows appropriate UI for each step

### Protected Routes

All profile routes are wrapped in `<ProtectedRoute>`:

- Checks user authentication
- Redirects to `/login` if not authenticated
- Redirects to `/app` if profile is already complete

## Next Steps (To Be Implemented)

1. ✅ Supabase migration created
2. ✅ TypeScript types updated
3. ✅ Routing structure implemented
4. ⏳ Create PersonalInfo step component
5. ⏳ Create FATCA step component
6. ⏳ Create PEP step component
7. ⏳ Implement OpenAI integration for ID card extraction
8. ⏳ Add form validation for each step
9. ⏳ Add progress indicator across all steps
10. ⏳ Add translation keys for new steps

## Migration Instructions

### To Apply the Migration:

1. **Using Supabase CLI:**

   ```bash
   supabase db push
   ```

2. **Using Supabase Dashboard:**

   - Navigate to SQL Editor
   - Copy contents of `supabase/migrations/20250113_add_fatca_pep_fields.sql`
   - Execute the SQL

3. **Verify Migration:**
   ```sql
   -- Check if columns were added
   SELECT column_name, data_type
   FROM information_schema.columns
   WHERE table_name = 'personal_data';
   ```

## Notes

- FATCA and PEP steps are conditionally shown based on applicability
- All profile data is stored in `personal_data.step2_data` JSONB field
- Profile completion percentage helps track user progress
- The system is designed to be extensible for future compliance requirements
