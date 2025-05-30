-- Drop all existing tables to start fresh
DROP TABLE IF EXISTS emails CASCADE;
DROP TABLE IF EXISTS connected_emails CASCADE;
DROP TABLE IF EXISTS cvs CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;

-- 1. Users table - Main user data
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Reviews table - Customer reviews and feedback
CREATE TABLE reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  customer_email VARCHAR(255),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  platform VARCHAR(50) NOT NULL DEFAULT 'kritiqo',
  responded BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Connected emails table - Email provider integrations
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
  CONSTRAINT unique_user_provider UNIQUE (user_id, provider)
);

-- 4. Emails table - Email management and AI triage
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

-- 5. CVs table - File management
CREATE TABLE cvs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  file_size INTEGER,
  file_type VARCHAR(100),
  storage_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_connected_emails_user_id ON connected_emails(user_id);
CREATE INDEX idx_connected_emails_provider ON connected_emails(provider);
CREATE INDEX idx_emails_user_id ON emails(user_id);
CREATE INDEX idx_emails_date ON emails(date);
CREATE INDEX idx_emails_analyzed ON emails(analyzed_at);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_cvs_user_id ON cvs(user_id);
