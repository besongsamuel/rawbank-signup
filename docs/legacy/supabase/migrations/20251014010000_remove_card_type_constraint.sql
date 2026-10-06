-- Migration: Remove card_type check constraint from applications table
-- Description: Removes the check constraint to allow any card type value
-- Date: 2025-10-14

-- Drop the existing check constraint
ALTER TABLE applications
DROP CONSTRAINT IF EXISTS applications_card_type_check;

-- Add comment explaining the change
COMMENT ON COLUMN applications.card_type IS 'Type of card requested by the user - no constraint to allow flexibility';

