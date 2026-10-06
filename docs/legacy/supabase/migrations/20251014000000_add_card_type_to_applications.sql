-- Migration: Add card_type field to applications table
-- Description: Adds a new field to store the type of card the user wants to apply for
-- Date: 2025-10-14

-- Add card_type column to applications table
ALTER TABLE applications
ADD COLUMN card_type TEXT;

-- Add comment to the column
COMMENT ON COLUMN applications.card_type IS 'Type of card requested by the user (e.g., standard, gold, platinum, premium)';

-- Add check constraint for valid card types (based on actual Rawbank cards from https://rawbank.com/cartes/)
ALTER TABLE applications
ADD CONSTRAINT applications_card_type_check
CHECK (card_type IS NULL OR card_type IN (
  'carte_fidelite_usd',
  'carte_mosolo_cdf',
  'visa_debit_cdf',
  'visa_infinite',
  'visa_academia',
  'visa_debit_euro',
  'mastercard_travelers',
  'carte_virtuelle',
  'visa_debit_upi'
));

-- Create index for better query performance
CREATE INDEX idx_applications_card_type ON applications(card_type);

-- Update existing applications to have a default card_type (optional)
-- Uncomment the line below if you want to set a default for existing records
-- UPDATE applications SET card_type = 'standard' WHERE card_type IS NULL;

