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
  user_id TEXT NOT NULL,
  email TEXT NOT NULL,
  provider TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  expires_at BIGINT,
  token_type VARCHAR(50) DEFAULT 'Bearer',
  scope TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_connected_emails_user_id ON connected_emails(user_id);
CREATE INDEX IF NOT EXISTS idx_connected_emails_provider ON connected_emails(provider);
CREATE INDEX IF NOT EXISTS idx_connected_emails_user_provider ON connected_emails(user_id, provider);

-- Ajouter la nouvelle contrainte unique
ALTER TABLE connected_emails 
ADD CONSTRAINT unique_user_provider UNIQUE (user_id, provider);

-- Supprimer l'ancienne contrainte si elle existe
ALTER TABLE connected_emails 
DROP CONSTRAINT IF EXISTS unique_email_provider;

-- Supprimer la contrainte de clé étrangère existante
ALTER TABLE connected_emails 
DROP CONSTRAINT IF EXISTS fk_connected_emails_user_id;

-- Table pour les CVs
CREATE TABLE IF NOT EXISTS cvs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
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

-- Index pour optimiser les requêtes sur les CVs
CREATE INDEX IF NOT EXISTS idx_cvs_user_id ON cvs(user_id);
CREATE INDEX IF NOT EXISTS idx_cvs_is_primary ON cvs(is_primary);
CREATE INDEX IF NOT EXISTS idx_cvs_user_primary ON cvs(user_id, is_primary);

-- Table pour les emails et leur triage IA
CREATE TABLE IF NOT EXISTS emails (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
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
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les requêtes sur les emails
CREATE INDEX IF NOT EXISTS idx_emails_user_id ON emails(user_id);
CREATE INDEX IF NOT EXISTS idx_emails_date ON emails(date);
CREATE INDEX IF NOT EXISTS idx_emails_analyzed ON emails(analyzed_at);
CREATE INDEX IF NOT EXISTS idx_emails_user_analyzed ON emails(user_id, analyzed_at);
