-- Table pour les utilisateurs
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les connexions email multiples
CREATE TABLE IF NOT EXISTS connected_emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  provider VARCHAR(50) NOT NULL, -- 'google', 'azure-ad'
  access_token TEXT,
  refresh_token TEXT,
  expires_at BIGINT,
  token_type VARCHAR(50) DEFAULT 'Bearer',
  scope TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, email, provider)
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_connected_emails_user_id ON connected_emails(user_id);
CREATE INDEX IF NOT EXISTS idx_connected_emails_provider ON connected_emails(provider);
