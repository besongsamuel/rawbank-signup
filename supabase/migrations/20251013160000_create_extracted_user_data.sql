-- Create extracted_user_data table to store AI-extracted ID data
-- This table serves as an intermediate storage for extracted data before it's validated and moved to personal_data

CREATE TABLE IF NOT EXISTS extracted_user_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  extracted_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one extraction per user (can be updated with new extractions)
  CONSTRAINT unique_user_extraction UNIQUE (user_id)
);

-- Create index for faster user lookups
CREATE INDEX IF NOT EXISTS idx_extracted_user_data_user_id ON extracted_user_data(user_id);

-- Create index for JSON queries
CREATE INDEX IF NOT EXISTS idx_extracted_user_data_extracted_data ON extracted_user_data USING GIN (extracted_data);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_extracted_user_data_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_extracted_user_data_timestamp ON extracted_user_data;
CREATE TRIGGER update_extracted_user_data_timestamp
    BEFORE UPDATE ON extracted_user_data
    FOR EACH ROW
    EXECUTE FUNCTION update_extracted_user_data_updated_at();

-- Add RLS (Row Level Security) policies
ALTER TABLE extracted_user_data ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own extracted data
CREATE POLICY "Users can view their own extracted data"
  ON extracted_user_data
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own extracted data
CREATE POLICY "Users can insert their own extracted data"
  ON extracted_user_data
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own extracted data
CREATE POLICY "Users can update their own extracted data"
  ON extracted_user_data
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own extracted data
CREATE POLICY "Users can delete their own extracted data"
  ON extracted_user_data
  FOR DELETE
  USING (auth.uid() = user_id);

-- Add comments for documentation
COMMENT ON TABLE extracted_user_data IS 'Stores AI-extracted data from user ID documents before validation and transfer to personal_data';
COMMENT ON COLUMN extracted_user_data.id IS 'Primary key';
COMMENT ON COLUMN extracted_user_data.user_id IS 'Reference to auth.users - the user who uploaded the ID';
COMMENT ON COLUMN extracted_user_data.extracted_data IS 'JSONB containing all data extracted from the ID document by AI';
COMMENT ON COLUMN extracted_user_data.created_at IS 'Timestamp of first extraction';
COMMENT ON COLUMN extracted_user_data.updated_at IS 'Timestamp of last update';

/*
Example extracted_data structure:
{
  "idType": "passeport",
  "idNumber": "AB1234567",
  "issueDate": "2020-01-15",
  "expiryDate": "2030-01-15",
  "firstName": "Jean",
  "middleName": "Ngandu",
  "lastName": "Mukendi",
  "birthDate": "1990-05-20",
  "birthPlace": "Kinshasa",
  "nationality": "Congolaise (RDC)",
  "provinceOfOrigin": "Kinshasa",
  "gender": "M",
  "address": "123 Avenue Kasavubu, Gombe, Kinshasa",
  "city": "Kinshasa",
  "province": "Kinshasa",
  "country": "République Démocratique du Congo",
  "uploadedImageUrl": "https://...",
  "extractedAt": "2025-10-13T18:30:00.000Z",
  "confidence": {
    "overall": 0.95,
    "fields": {
      "idNumber": 0.98,
      "firstName": 0.97,
      "lastName": 0.96
    }
  }
}
*/

