-- Create package-related tables for Rawbank account opening application

-- Package components table (accounts, cards, digital products within packages)
CREATE TABLE package_components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID REFERENCES retail_packages(id) ON DELETE CASCADE,
  component_type VARCHAR(20) CHECK (component_type IN ('account', 'card', 'digital_product')),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  currency VARCHAR(3) CHECK (currency IN ('USD', 'CDF')),
  is_required BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Application packages table (selected packages by applicants)
CREATE TABLE application_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  package_id UUID REFERENCES retail_packages(id) ON DELETE CASCADE,
  selected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(application_id, package_id)
);

-- Application package components table (selected components within packages)
CREATE TABLE application_package_components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_package_id UUID REFERENCES application_packages(id) ON DELETE CASCADE,
  component_id UUID REFERENCES package_components(id) ON DELETE CASCADE,
  currency VARCHAR(3) CHECK (currency IN ('USD', 'CDF')),
  selected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(application_package_id, component_id, currency)
);

-- Create indexes for package tables
CREATE INDEX idx_package_components_package_id ON package_components(package_id);
CREATE INDEX idx_package_components_type ON package_components(component_type);
CREATE INDEX idx_application_packages_application_id ON application_packages(application_id);
CREATE INDEX idx_application_packages_package_id ON application_packages(package_id);
CREATE INDEX idx_application_package_components_application_package_id ON application_package_components(application_package_id);
CREATE INDEX idx_application_package_components_component_id ON application_package_components(component_id);
