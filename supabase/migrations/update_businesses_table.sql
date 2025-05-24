-- Mise à jour de la table businesses avec les nouveaux champs
ALTER TABLE businesses 
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS place_id TEXT,
DROP COLUMN IF EXISTS country,
DROP COLUMN IF EXISTS platform,
DROP COLUMN IF EXISTS original_url,
DROP COLUMN IF EXISTS custom_url;

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_businesses_place_id ON businesses(place_id);
CREATE INDEX IF NOT EXISTS idx_businesses_slug ON businesses(slug);
