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
