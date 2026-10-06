-- Add account type and agency columns to applications table
-- Remove the automatic trigger - applications will be created manually at account selection step

-- Add new columns to applications table
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS account_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS agency_id VARCHAR(50);

-- Add constraints for account type
ALTER TABLE applications 
ADD CONSTRAINT applications_account_type_check 
CHECK (account_type IN ('individual', 'joint', 'business', 'corporate'));

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_applications_account_type ON applications(account_type);
CREATE INDEX IF NOT EXISTS idx_applications_agency_id ON applications(agency_id);

-- Add comments for documentation
COMMENT ON COLUMN applications.account_type IS 'Type of account: individual, joint, business, or corporate';
COMMENT ON COLUMN applications.agency_id IS 'ID of the selected agency/branch for account opening';

-- Note: The trigger for automatic application creation has been removed
-- Applications will now be created manually when user selects account type and agency
