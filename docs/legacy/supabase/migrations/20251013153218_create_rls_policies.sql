-- Enable Row Level Security and create policies for Rawbank account opening application

-- Enable RLS on all tables
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_package_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_uploads ENABLE ROW LEVEL SECURITY;

-- Applications policies
CREATE POLICY "Users can view own applications" ON applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own applications" ON applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications" ON applications
  FOR UPDATE USING (auth.uid() = user_id);

-- Personal data policies
CREATE POLICY "Users can view personal data for own applications" ON personal_data
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM applications 
      WHERE applications.id = personal_data.application_id 
      AND applications.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert personal data for own applications" ON personal_data
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM applications 
      WHERE applications.id = personal_data.application_id 
      AND applications.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update personal data for own applications" ON personal_data
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM applications 
      WHERE applications.id = personal_data.application_id 
      AND applications.user_id = auth.uid()
    )
  );

-- Application packages policies
CREATE POLICY "Users can view application packages for own applications" ON application_packages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM applications 
      WHERE applications.id = application_packages.application_id 
      AND applications.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert application packages for own applications" ON application_packages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM applications 
      WHERE applications.id = application_packages.application_id 
      AND applications.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update application packages for own applications" ON application_packages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM applications 
      WHERE applications.id = application_packages.application_id 
      AND applications.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete application packages for own applications" ON application_packages
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM applications 
      WHERE applications.id = application_packages.application_id 
      AND applications.user_id = auth.uid()
    )
  );

-- Application package components policies
CREATE POLICY "Users can view application package components for own applications" ON application_package_components
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM application_packages ap
      JOIN applications a ON a.id = ap.application_id
      WHERE ap.id = application_package_components.application_package_id 
      AND a.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert application package components for own applications" ON application_package_components
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM application_packages ap
      JOIN applications a ON a.id = ap.application_id
      WHERE ap.id = application_package_components.application_package_id 
      AND a.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update application package components for own applications" ON application_package_components
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM application_packages ap
      JOIN applications a ON a.id = ap.application_id
      WHERE ap.id = application_package_components.application_package_id 
      AND a.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete application package components for own applications" ON application_package_components
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM application_packages ap
      JOIN applications a ON a.id = ap.application_id
      WHERE ap.id = application_package_components.application_package_id 
      AND a.user_id = auth.uid()
    )
  );

-- Document uploads policies
CREATE POLICY "Users can view document uploads for own applications" ON document_uploads
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM applications 
      WHERE applications.id = document_uploads.application_id 
      AND applications.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert document uploads for own applications" ON document_uploads
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM applications 
      WHERE applications.id = document_uploads.application_id 
      AND applications.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update document uploads for own applications" ON document_uploads
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM applications 
      WHERE applications.id = document_uploads.application_id 
      AND applications.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete document uploads for own applications" ON document_uploads
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM applications 
      WHERE applications.id = document_uploads.application_id 
      AND applications.user_id = auth.uid()
    )
  );

-- Public read access for lookup tables
CREATE POLICY "Anyone can view countries" ON countries FOR SELECT USING (true);
CREATE POLICY "Anyone can view provinces" ON provinces FOR SELECT USING (true);
CREATE POLICY "Anyone can view retail packages" ON retail_packages FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view package components" ON package_components FOR SELECT USING (true);
