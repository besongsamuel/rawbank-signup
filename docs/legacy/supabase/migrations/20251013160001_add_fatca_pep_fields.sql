-- Create enhanced personal_data table with FATCA and PEP support
-- This migration adds FATCA and Politically Exposed Person (PEP) fields

-- Add FATCA information fields
ALTER TABLE personal_data 
ADD COLUMN IF NOT EXISTS fatca_data JSONB DEFAULT NULL;

-- Add PEP (Politically Exposed Person) information fields  
ALTER TABLE personal_data
ADD COLUMN IF NOT EXISTS pep_data JSONB DEFAULT NULL;

-- Add completion status fields
ALTER TABLE personal_data
ADD COLUMN IF NOT EXISTS fatca_applicable BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS fatca_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS pep_applicable BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS pep_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS profile_completion_percentage INTEGER DEFAULT 0;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_personal_data_fatca_applicable ON personal_data(fatca_applicable);
CREATE INDEX IF NOT EXISTS idx_personal_data_pep_applicable ON personal_data(pep_applicable);
CREATE INDEX IF NOT EXISTS idx_personal_data_completion ON personal_data(profile_completion_percentage);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_personal_data_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_personal_data_timestamp ON personal_data;
CREATE TRIGGER update_personal_data_timestamp
    BEFORE UPDATE ON personal_data
    FOR EACH ROW
    EXECUTE FUNCTION update_personal_data_updated_at();

-- Comments for documentation
COMMENT ON COLUMN personal_data.fatca_data IS 'JSONB containing FATCA (Foreign Account Tax Compliance Act) declaration data';
COMMENT ON COLUMN personal_data.pep_data IS 'JSONB containing PEP (Politically Exposed Person) declaration and related information';
COMMENT ON COLUMN personal_data.fatca_applicable IS 'Whether FATCA declaration is required for this user';
COMMENT ON COLUMN personal_data.pep_applicable IS 'Whether PEP declaration is required for this user';
COMMENT ON COLUMN personal_data.profile_completion_percentage IS 'Percentage of profile completion (0-100)';

/*
FATCA Data Structure (example):
{
  "is_us_person": boolean,
  "us_citizenship": boolean,
  "us_birth_place": boolean,
  "us_residence": boolean,
  "us_address": boolean,
  "us_phone": boolean,
  "us_power_of_attorney": boolean,
  "us_tin": string (Tax Identification Number),
  "declaration_date": timestamp,
  "signature": string (digital signature reference)
}

PEP Data Structure (example):
{
  "is_pep": boolean,
  "pep_category": string, // "government_official", "political_party_leader", "military_officer", "judicial_official", "state_enterprise_executive", "family_member", "close_associate"
  "position": string,
  "organization": string,
  "country": string,
  "start_date": date,
  "end_date": date (nullable if currently serving),
  "relationship_to_pep": string (if family member or close associate),
  "pep_name": string (if family member or close associate),
  "declaration_date": timestamp,
  "signature": string (digital signature reference)
}
*/
