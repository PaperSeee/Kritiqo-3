-- Drop all existing tables to start fresh
DROP TABLE IF EXISTS emails CASCADE;
DROP TABLE IF EXISTS connected_emails CASCADE;
DROP TABLE IF EXISTS cvs CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;

-- 1. Users table - Main user data
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
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
CREATE TABLE IF NOT EXISTS connected_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('imap', 'microsoft', 'google', 'azure-ad')),
  access_token TEXT,
  refresh_token TEXT,
  expires_at BIGINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, email)
);

-- 4. Emails table - Email management and AI triage
CREATE TABLE IF NOT EXISTS emails (
  id TEXT PRIMARY KEY, -- Gmail/Outlook message ID
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  account_email TEXT NOT NULL,
  subject TEXT,
  from_email TEXT,
  sender_name TEXT,
  date TIMESTAMP WITH TIME ZONE,
  snippet TEXT,
  full_text TEXT,
  category TEXT DEFAULT 'Autre',
  priority TEXT DEFAULT 'Moyen',
  is_spam BOOLEAN DEFAULT FALSE,
  analyzed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les requêtes sur les emails
CREATE INDEX IF NOT EXISTS idx_emails_user_id ON emails(user_id);
CREATE INDEX IF NOT EXISTS idx_emails_date ON emails(date);
CREATE INDEX IF NOT EXISTS idx_emails_analyzed ON emails(analyzed_at);
CREATE INDEX IF NOT EXISTS idx_emails_user_analyzed ON emails(user_id, analyzed_at);
CREATE INDEX IF NOT EXISTS idx_emails_category ON emails(category);
CREATE INDEX IF NOT EXISTS idx_emails_account ON emails(account_email);

-- RLS policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE connected_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;

-- Policies pour users
DROP POLICY IF EXISTS "Users can read own data" ON users;
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

-- Policies pour connected_emails
DROP POLICY IF EXISTS "Users can manage own connected emails" ON connected_emails;
CREATE POLICY "Users can manage own connected emails" ON connected_emails
  FOR ALL USING (auth.uid()::text = user_id::text);

-- Policies pour emails
DROP POLICY IF EXISTS "Users can read own emails" ON emails;
CREATE POLICY "Users can read own emails" ON emails
  FOR SELECT USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can insert own emails" ON emails;
CREATE POLICY "Users can insert own emails" ON emails
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can update own emails" ON emails;
CREATE POLICY "Users can update own emails" ON emails
  FOR UPDATE USING (auth.uid()::text = user_id::text);
