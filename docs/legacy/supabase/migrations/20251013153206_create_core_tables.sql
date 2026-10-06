-- Create core tables for Rawbank account opening application

-- Applications table (main application tracking)
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  application_number VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  submitted_at TIMESTAMP WITH TIME ZONE,
  rawbank_choice_reason TEXT,
  rawbank_choice_other TEXT
);

-- Personal data table (account holder information)
CREATE TABLE personal_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  holder_type VARCHAR(20) CHECK (holder_type IN ('primary', 'co_holder')),
  
  -- Identity Information
  civility VARCHAR(10) CHECK (civility IN ('Mme', 'Mlle', 'M.')),
  last_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(100),
  first_name VARCHAR(100) NOT NULL,
  birth_date DATE NOT NULL,
  birth_place VARCHAR(100) NOT NULL,
  province_of_origin VARCHAR(100),
  nationality VARCHAR(100) NOT NULL,
  country_of_residence VARCHAR(100) NOT NULL,
  
  -- Identification Document
  id_type VARCHAR(50) CHECK (id_type IN ('carte_electeur', 'carte_identite', 'permis_conduire', 'passeport', 'autre')),
  id_type_other VARCHAR(100),
  id_number VARCHAR(100) NOT NULL,
  id_issue_date DATE NOT NULL,
  id_expiry_date DATE NOT NULL,
  
  -- Personal Situation
  marital_status VARCHAR(20) CHECK (marital_status IN ('celibataire', 'marie', 'divorce', 'veuf')),
  marital_regime VARCHAR(50) CHECK (marital_regime IN ('separation_biens', 'communaute_universelle', 'communaute_reduite')),
  number_of_children INTEGER DEFAULT 0,
  
  -- Housing Information
  housing_status VARCHAR(30) CHECK (housing_status IN ('proprietaire', 'locataire', 'loge_gratuit', 'loge_parents')),
  permanent_address TEXT NOT NULL,
  mailing_address TEXT,
  
  -- Contact Information
  phone_1 VARCHAR(20) NOT NULL,
  phone_2 VARCHAR(20),
  email_1 VARCHAR(255) NOT NULL,
  email_2 VARCHAR(255),
  
  -- Professional Information
  profession VARCHAR(100),
  employer VARCHAR(100),
  monthly_gross_income DECIMAL(15,2),
  income_source VARCHAR(100),
  
  -- Emergency Contact
  emergency_contact_name VARCHAR(100),
  emergency_contact_phone VARCHAR(20),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Retail packages table (available banking packages)
CREATE TABLE retail_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  code VARCHAR(20) UNIQUE NOT NULL,
  description TEXT,
  monthly_credit_flow_limit DECIMAL(15,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Countries lookup table
CREATE TABLE countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(3) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true
);

-- Provinces lookup table
CREATE TABLE provinces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id UUID REFERENCES countries(id) ON DELETE CASCADE,
  code VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true
);

-- Create indexes for performance
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_created_at ON applications(created_at);
CREATE INDEX idx_personal_data_application_id ON personal_data(application_id);
CREATE INDEX idx_personal_data_holder_type ON personal_data(holder_type);
CREATE INDEX idx_personal_data_email_1 ON personal_data(email_1);
CREATE INDEX idx_personal_data_phone_1 ON personal_data(phone_1);
