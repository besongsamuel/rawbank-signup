-- Create document upload and storage tables for Rawbank account opening application

-- Document uploads table (ID card and other document uploads)
CREATE TABLE document_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  personal_data_id UUID REFERENCES personal_data(id) ON DELETE CASCADE,
  document_type VARCHAR(50) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  upload_status VARCHAR(20) DEFAULT 'uploaded' CHECK (upload_status IN ('uploaded', 'verified', 'rejected')),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_at TIMESTAMP WITH TIME ZONE,
  verification_notes TEXT
);

-- Create indexes for document uploads
CREATE INDEX idx_document_uploads_application_id ON document_uploads(application_id);
CREATE INDEX idx_document_uploads_personal_data_id ON document_uploads(personal_data_id);
CREATE INDEX idx_document_uploads_status ON document_uploads(upload_status);
CREATE INDEX idx_document_uploads_document_type ON document_uploads(document_type);
