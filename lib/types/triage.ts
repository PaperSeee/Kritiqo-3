export type TriageCategorie = 
  | 'Avis client'
  | 'Commande' 
  | 'Juridique'
  | 'RH'
  | 'Facture'
  | 'Notification automatique'
  | 'Commercial'
  | 'Publicité'
  | 'Spam'
  | 'Spam/Pub'
  | 'Autre';

export type TriagePriorite = 'Urgent' | 'Moyen' | 'Faible';

export type TriageAction = 
  | 'Répondre'
  | 'Répondre avec excuse'
  | 'Transférer au support'
  | 'Transférer à la comptabilité'
  | 'Ignorer'
  | 'Examiner manuellement';

export interface TriageResult {
  categorie: TriageCategorie;
  priorite: TriagePriorite;
  action: TriageAction;
  suggestion: string | null;
  fromCache?: boolean;
}

export interface EmailTriage extends TriageResult {
  id: string;
  email_id: string;
  user_id: string;
  created_at: string;
}

// Fonction helper pour obtenir la couleur de la catégorie
export function getCategorieColor(categorie: TriageCategorie): string {
  switch (categorie) {
    case 'Avis client': return 'bg-blue-100 text-blue-800';
    case 'Commande': return 'bg-green-100 text-green-800';
    case 'Facture': return 'bg-purple-100 text-purple-800';
    case 'RH': return 'bg-orange-100 text-orange-800';
    case 'Commercial': return 'bg-cyan-100 text-cyan-800';
    case 'Juridique': return 'bg-red-100 text-red-800';
    case 'Notification automatique': return 'bg-gray-100 text-gray-800';
    case 'Publicité': return 'bg-yellow-100 text-yellow-800';
    case 'Spam': return 'bg-red-100 text-red-800';
    case 'Spam/Pub': return 'bg-red-50 text-red-600';  // Nouvelle couleur pour spam/pub
    default: return 'bg-neutral-100 text-neutral-800';
  }
}

// Fonction helper pour obtenir la couleur de la priorité
export function getPrioriteColor(priorite: TriagePriorite): string {
  switch (priorite) {
    case 'Urgent': return 'bg-red-100 text-red-800';
    case 'Moyen': return 'bg-yellow-100 text-yellow-800';
    case 'Faible': return 'bg-green-100 text-green-800';
    default: return 'bg-neutral-100 text-neutral-800';
  }
}

// Nouvelle fonction pour classification automatique sans GPT
export function classifyEmailAutomatically(sender: string, subject: string, body?: string): TriageCategorie | null {
  const spamKeywords = [
    "promotion", "offre", "newsletter", "vente", "réduction", "remise", 
    "solde", "code promo", "black friday", "cyber monday", "déstockage",
    "liquidation", "gratuit", "cadeau", "gagnez", "tirage au sort",
    "concours", "publicité", "marketing", "unsubscribe", "désabonnement",
    "deal", "flash sale", "limited time", "act now", "urgent", "winner",
    "félicitations", "congratulations", "opportunity", "special offer",
    "discount", "save money", "économisez", "offre spéciale", "prix cassé",
    "dernière chance", "exclusif", "vip", "membre premium", "cashback"
  ];
  
  const noreplyKeywords = ["noreply", "no-reply", "donotreply", "do-not-reply"];
  
  const senderLower = sender.toLowerCase();
  const subjectLower = (subject || "").toLowerCase();
  const bodyLower = (body || "").toLowerCase();

  // Vérifier les expéditeurs noreply
  const isNoreply = noreplyKeywords.some(keyword => senderLower.includes(keyword));
  
  // Vérifier les mots-clés promo dans le sujet ou le corps
  const isPromo = spamKeywords.some(keyword => 
    subjectLower.includes(keyword) || bodyLower.includes(keyword)
  );
  
  // Vérifier les domaines suspects
  const suspiciousDomains = [
    "mailchimp.com", "constantcontact.com", "mailgun.net", 
    "sendgrid.net", "marketing", "promo", "newsletter",
    "campaign-archive.com", "e.", "info@", "sales@"
  ];
  const isSuspiciousDomain = suspiciousDomains.some(domain => senderLower.includes(domain));

  if (isNoreply || isPromo || isSuspiciousDomain) {
    return "Spam/Pub";
  }

  return null; // Pas de classification automatique, nécessite GPT ou classification manuelle
}
