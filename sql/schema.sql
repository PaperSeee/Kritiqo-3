-- Table pour les utilisateurs
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name VARCHAR(255),
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les connexions email multiples
DROP TABLE IF EXISTS connected_emails CASCADE;

CREATE TABLE connected_emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('imap', 'microsoft', 'google', 'azure-ad')),
  access_token TEXT,
  refresh_token TEXT,
  expires_at BIGINT,
  token_type VARCHAR(50) DEFAULT 'Bearer',
  scope TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_connected_emails_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT unique_user_email UNIQUE (user_id, email)
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_connected_emails_user_id ON connected_emails(user_id);
CREATE INDEX IF NOT EXISTS idx_connected_emails_provider ON connected_emails(provider);

-- Table pour les CVs (corrected)
DROP TABLE IF EXISTS cvs CASCADE;
CREATE TABLE IF NOT EXISTS cvs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_cvs_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Index pour optimiser les requêtes sur les CVs
CREATE INDEX IF NOT EXISTS idx_cvs_user_id ON cvs(user_id);
CREATE INDEX IF NOT EXISTS idx_cvs_is_primary ON cvs(is_primary);
CREATE INDEX IF NOT EXISTS idx_cvs_user_primary ON cvs(user_id, is_primary);

-- Table pour les emails (corrected)
DROP TABLE IF EXISTS emails CASCADE;
CREATE TABLE IF NOT EXISTS emails (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL,
  subject TEXT NOT NULL,
  sender TEXT NOT NULL,
  body TEXT,
  preview TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  source TEXT NOT NULL, -- 'gmail' ou 'microsoft'
  account_email TEXT,
  account_provider TEXT,
  gpt_categorie TEXT,
  gpt_priorite TEXT,
  gpt_action TEXT,
  gpt_suggestion TEXT,
  analyzed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_emails_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Index pour optimiser les requêtes sur les emails
CREATE INDEX IF NOT EXISTS idx_emails_user_id ON emails(user_id);
CREATE INDEX IF NOT EXISTS idx_emails_date ON emails(date);
CREATE INDEX IF NOT EXISTS idx_emails_analyzed ON emails(analyzed_at);
CREATE INDEX IF NOT EXISTS idx_emails_user_analyzed ON emails(user_id, analyzed_at);
