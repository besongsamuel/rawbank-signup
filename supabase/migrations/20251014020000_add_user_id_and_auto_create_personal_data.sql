-- Create trigger to auto-create personal_data record when user signs up
-- This migration creates a default personal_data record when users sign up, using the existing id structure

-- First, make application_id nullable in personal_data table to allow standalone records
ALTER TABLE personal_data ALTER COLUMN application_id DROP NOT NULL;
ALTER TABLE personal_data ALTER COLUMN email_1 DROP NOT NULL;

-- Function to create default personal_data record when user signs up
CREATE OR REPLACE FUNCTION public.create_default_personal_data()
RETURNS TRIGGER AS $$
BEGIN
  
    -- Insert a default personal_data record for the new user
    INSERT INTO public.personal_data (
      id,  -- Use the same ID as the auth.users.id
      application_id,  -- NULL for standalone personal_data records
      holder_type,
      civility,
      last_name,
      middle_name,
      first_name,
      birth_date,
      birth_place,
      province_of_origin,
      nationality,
      country_of_residence,
      id_type,
      id_type_other,
      id_number,
      id_issue_date,
      id_expiry_date,
      marital_status,
      marital_regime,
      number_of_children,
      housing_status,
      permanent_address,
      mailing_address,
      phone_1,
      phone_2,
      email_1,
      email_2,
      profession,
      employer,
      monthly_gross_income,
      income_source,
      emergency_contact_name,
      emergency_contact_phone,
      fatca_applicable,
      fatca_completed,
      pep_applicable,
      pep_completed,
      profile_completion_percentage
    ) VALUES (
      NEW.id,  -- Use the user's ID from auth.users
      NULL,  -- application_id (NULL for standalone personal_data records)
      'primary',  -- holder_type
      'monsieur',  -- civility (default to monsieur)
      '',  -- last_name (placeholder)
      NULL,  -- middle_name
      '',  -- first_name (placeholder)
      '1990-01-01'::date,  -- birth_date (placeholder)
      '',  -- birth_place (placeholder)
      NULL,  -- province_of_origin
      'Congolaise (RDC)',  -- nationality (default to DRC)
      'République Démocratique du Congo',  -- country_of_residence (default to DRC)
      'carte_identite',  -- id_type (default to identity card)
      NULL,  -- id_type_other
      '',  -- id_number (placeholder)
      '2020-01-01'::date,  -- id_issue_date (placeholder)
      '2030-01-01'::date,  -- id_expiry_date (placeholder)
      'celibataire',  -- marital_status (default to single)
      NULL,  -- marital_regime
      0,  -- number_of_children (default to 0)
      'locataire',  -- housing_status (default to tenant)
      '',  -- permanent_address (placeholder)
      NULL,  -- mailing_address
      COALESCE(NEW.phone, ''),  -- phone_1 (use phone if available, otherwise empty string)
      NULL,  -- phone_2
      COALESCE(NEW.email, ''),  -- email_1 (use email if available, otherwise empty string)
      NULL,  -- email_2
      NULL,  -- profession
      NULL,  -- employer
      NULL,  -- monthly_gross_income
      NULL,  -- income_source
      NULL,  -- emergency_contact_name
      NULL,  -- emergency_contact_phone
      FALSE,  -- fatca_applicable
      FALSE,  -- fatca_completed
      FALSE,  -- pep_applicable
      FALSE,  -- pep_completed
      5  -- profile_completion_percentage (5% for having basic structure)
    );
  
  
  RETURN NEW;
END;
$$ language plpgsql security definer;

-- Create trigger to automatically create personal_data record when user signs up
DROP TRIGGER IF EXISTS create_personal_data_on_signup ON auth.users;
CREATE TRIGGER create_personal_data_on_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_default_personal_data();

-- Update RLS policies to work with the existing id structure
-- Drop existing policies that reference the old structure
DROP POLICY IF EXISTS "Users can view own personal data" ON personal_data;
DROP POLICY IF EXISTS "Users can insert own personal data" ON personal_data;
DROP POLICY IF EXISTS "Users can update own personal data" ON personal_data;
DROP POLICY IF EXISTS "Users can delete own personal data" ON personal_data;

-- Create new simplified RLS policies using direct id relationship
CREATE POLICY "Users can view own personal data" ON personal_data
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own personal data" ON personal_data
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own personal data" ON personal_data
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own personal data" ON personal_data
  FOR DELETE USING (auth.uid() = id);

-- Add comments for documentation
COMMENT ON FUNCTION public.create_default_personal_data() IS 'Creates a default personal_data record with placeholder values when a new user signs up';

-- Add helpful comments for the default values
COMMENT ON COLUMN personal_data.last_name IS 'Default: "À compléter" - placeholder text indicating user needs to complete this field';
COMMENT ON COLUMN personal_data.first_name IS 'Default: "À compléter" - placeholder text indicating user needs to complete this field';
COMMENT ON COLUMN personal_data.birth_date IS 'Default: 1990-01-01 - placeholder date, user must update with actual birth date';
COMMENT ON COLUMN personal_data.birth_place IS 'Default: "À compléter" - placeholder text indicating user needs to complete this field';
COMMENT ON COLUMN personal_data.nationality IS 'Default: "Congolaise (RDC)" - most common nationality for Rawbank users';
COMMENT ON COLUMN personal_data.country_of_residence IS 'Default: "République Démocratique du Congo" - most common residence for Rawbank users';
COMMENT ON COLUMN personal_data.id_number IS 'Default: "À compléter" - placeholder text indicating user needs to complete this field';
COMMENT ON COLUMN personal_data.id_issue_date IS 'Default: 2020-01-01 - placeholder date, user must update with actual issue date';
COMMENT ON COLUMN personal_data.id_expiry_date IS 'Default: 2030-01-01 - placeholder date, user must update with actual expiry date';
COMMENT ON COLUMN personal_data.permanent_address IS 'Default: "À compléter" - placeholder text indicating user needs to complete this field';
COMMENT ON COLUMN personal_data.phone_1 IS 'Automatically populated from auth.users.phone if available, otherwise empty string';
COMMENT ON COLUMN personal_data.email_1 IS 'Automatically populated from auth.users.email if available, otherwise empty string';
COMMENT ON COLUMN personal_data.profile_completion_percentage IS 'Default: 5 - indicates basic structure exists, user needs to complete actual data';