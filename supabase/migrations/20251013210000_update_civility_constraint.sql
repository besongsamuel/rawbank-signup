-- Update civility check constraint to accept form values
-- This migration updates the civility constraint to accept the values sent by the form

-- Drop the existing constraint
ALTER TABLE personal_data DROP CONSTRAINT IF EXISTS personal_data_civility_check;

-- Add the new constraint with form-friendly values
ALTER TABLE personal_data ADD CONSTRAINT personal_data_civility_check 
CHECK (civility IN ('madame', 'mademoiselle', 'monsieur'));

-- Add comment for documentation
COMMENT ON COLUMN personal_data.civility IS 'Civilité: madame, mademoiselle, or monsieur';
