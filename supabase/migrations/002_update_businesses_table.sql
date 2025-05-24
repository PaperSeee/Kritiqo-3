-- Update businesses table to include new fields
ALTER TABLE businesses 
ADD COLUMN IF NOT EXISTS city VARCHAR(100),
ADD COLUMN IF NOT EXISTS country VARCHAR(100),
ADD COLUMN IF NOT EXISTS place_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS google_link TEXT,
ADD COLUMN IF NOT EXISTS ubereats_link TEXT,
ADD COLUMN IF NOT EXISTS deliveroo_link TEXT,
ADD COLUMN IF NOT EXISTS takeaway_link TEXT;

-- Add URL validation constraints
ALTER TABLE businesses 
ADD CONSTRAINT IF NOT EXISTS valid_google_link CHECK (google_link IS NULL OR google_link ~* '^https?://'),
ADD CONSTRAINT IF NOT EXISTS valid_ubereats_link CHECK (ubereats_link IS NULL OR ubereats_link ~* '^https?://'),
ADD CONSTRAINT IF NOT EXISTS valid_deliveroo_link CHECK (deliveroo_link IS NULL OR deliveroo_link ~* '^https?://'),
ADD CONSTRAINT IF NOT EXISTS valid_takeaway_link CHECK (takeaway_link IS NULL OR takeaway_link ~* '^https?://');

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_businesses_city ON businesses(city);
CREATE INDEX IF NOT EXISTS idx_businesses_country ON businesses(country);
CREATE INDEX IF NOT EXISTS idx_businesses_place_id ON businesses(place_id);

-- Update existing records to have google_link if they don't have one
UPDATE businesses 
SET google_link = original_url 
WHERE google_link IS NULL AND platform = 'google';

-- Remove columns that are no longer needed
ALTER TABLE businesses 
DROP COLUMN IF EXISTS platform,
DROP COLUMN IF EXISTS original_url;
