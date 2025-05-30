-- Drop all existing tables to start fresh
DROP TABLE IF EXISTS emails CASCADE;
DROP TABLE IF EXISTS cvs CASCADE;
DROP TABLE IF EXISTS connected_emails CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS businesses CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users table - Base user management
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name VARCHAR(255),
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Businesses table - Restaurant/business management
CREATE TABLE businesses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100),
  place_id VARCHAR(255) UNIQUE,
  google_link TEXT,
  ubereats_link TEXT,
  deliveroo_link TEXT,
  takeaway_link TEXT,
  review_page_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- URL validation constraints
  CONSTRAINT valid_google_link CHECK (google_link IS NULL OR google_link ~* '^https?://'),
  CONSTRAINT valid_ubereats_link CHECK (ubereats_link IS NULL OR ubereats_link ~* '^https?://'),
  CONSTRAINT valid_deliveroo_link CHECK (deliveroo_link IS NULL OR deliveroo_link ~* '^https?://'),
  CONSTRAINT valid_takeaway_link CHECK (takeaway_link IS NULL OR takeaway_link ~* '^https?://')
);

-- 3. Reviews table - Customer reviews
CREATE TABLE reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  platform VARCHAR(50) NOT NULL DEFAULT 'kritiqo',
  responded BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Connected emails table - Email provider integrations
CREATE TABLE connected_emails (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  provider VARCHAR(50) NOT NULL CHECK (provider IN ('google', 'azure-ad', 'microsoft', 'imap')),
  access_token TEXT,
  refresh_token TEXT,
  expires_at BIGINT,
  token_type VARCHAR(50) DEFAULT 'Bearer',
  scope TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Enforce foreign key constraint
  CONSTRAINT fk_connected_emails_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT unique_user_email UNIQUE (user_id, email)
);

-- 5. Emails table - Email management and AI triage
CREATE TABLE emails (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  sender TEXT NOT NULL,
  body TEXT,
  preview TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  source VARCHAR(50) NOT NULL,
  account_email TEXT,
  account_provider VARCHAR(50),
  gpt_categorie VARCHAR(100),
  gpt_priorite VARCHAR(50),
  gpt_action VARCHAR(100),
  gpt_suggestion TEXT,
  analyzed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. CVs table - File management
CREATE TABLE cvs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance optimization

-- Users indexes
CREATE INDEX idx_users_email ON users(email);

-- Businesses indexes
CREATE INDEX idx_businesses_user_id ON businesses(user_id);
CREATE INDEX idx_businesses_slug ON businesses(slug);
CREATE INDEX idx_businesses_city ON businesses(city);
CREATE INDEX idx_businesses_country ON businesses(country);
CREATE INDEX idx_businesses_place_id ON businesses(place_id);

-- Reviews indexes
CREATE INDEX idx_reviews_business_id ON reviews(business_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_created_at ON reviews(created_at);
CREATE INDEX idx_reviews_platform ON reviews(platform);

-- Connected emails indexes
CREATE INDEX idx_connected_emails_user_id ON connected_emails(user_id);
CREATE INDEX idx_connected_emails_provider ON connected_emails(provider);
CREATE INDEX idx_connected_emails_email ON connected_emails(email);

-- Emails indexes
CREATE INDEX idx_emails_user_id ON emails(user_id);
CREATE INDEX idx_emails_date ON emails(date);
CREATE INDEX idx_emails_analyzed_at ON emails(analyzed_at);
CREATE INDEX idx_emails_source ON emails(source);
CREATE INDEX idx_emails_account_email ON emails(account_email);
CREATE INDEX idx_emails_gpt_categorie ON emails(gpt_categorie);
CREATE INDEX idx_emails_gpt_priorite ON emails(gpt_priorite);

-- CVs indexes
CREATE INDEX idx_cvs_user_id ON cvs(user_id);
CREATE INDEX idx_cvs_is_primary ON cvs(is_primary);
CREATE INDEX idx_cvs_user_primary ON cvs(user_id, is_primary);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON businesses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_connected_emails_updated_at BEFORE UPDATE ON connected_emails FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_emails_updated_at BEFORE UPDATE ON emails FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cvs_updated_at BEFORE UPDATE ON cvs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
