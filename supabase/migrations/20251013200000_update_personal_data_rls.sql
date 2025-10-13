-- Update RLS policies for personal_data to allow users to access their data without applications
-- This migration updates the personal_data policies to work with the new architecture

-- Drop existing personal_data policies
DROP POLICY IF EXISTS "Users can view personal data for own applications" ON personal_data;
DROP POLICY IF EXISTS "Users can insert personal data for own applications" ON personal_data;
DROP POLICY IF EXISTS "Users can update personal data for own applications" ON personal_data;

-- Create new personal_data policies that work with direct user_id relationship
-- Users can view their own personal data (with or without application)
CREATE POLICY "Users can view own personal data" ON personal_data
  FOR SELECT USING (
    -- Allow if user_id matches auth.uid() (direct relationship)
    id = auth.uid()::text::uuid
    OR
    -- Allow if linked to user's application (legacy support)
    EXISTS (
      SELECT 1 FROM applications 
      WHERE applications.id = personal_data.application_id 
      AND applications.user_id = auth.uid()
    )
  );

-- Users can insert their own personal data
CREATE POLICY "Users can insert own personal data" ON personal_data
  FOR INSERT WITH CHECK (
    -- Allow if user_id matches auth.uid() (direct relationship)
    id = auth.uid()::text::uuid
    OR
    -- Allow if linked to user's application (legacy support)
    EXISTS (
      SELECT 1 FROM applications 
      WHERE applications.id = personal_data.application_id 
      AND applications.user_id = auth.uid()
    )
  );

-- Users can update their own personal data
CREATE POLICY "Users can update own personal data" ON personal_data
  FOR UPDATE USING (
    -- Allow if user_id matches auth.uid() (direct relationship)
    id = auth.uid()::text::uuid
    OR
    -- Allow if linked to user's application (legacy support)
    EXISTS (
      SELECT 1 FROM applications 
      WHERE applications.id = personal_data.application_id 
      AND applications.user_id = auth.uid()
    )
  );

-- Add comment for documentation
COMMENT ON POLICY "Users can view own personal data" ON personal_data IS 
'Allows users to view their personal data either through direct user_id relationship or through linked application';

COMMENT ON POLICY "Users can insert own personal data" ON personal_data IS 
'Allows users to insert their personal data either through direct user_id relationship or through linked application';

COMMENT ON POLICY "Users can update own personal data" ON personal_data IS 
'Allows users to update their personal data either through direct user_id relationship or through linked application';
