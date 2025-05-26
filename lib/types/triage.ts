export interface TriageResult {
  catégorie: 'Avis client' | 'Commande' | 'Juridique' | 'Facture' | 'RH' | 'Commercial' | 'Notification automatique' | 'Publicité' | 'Spam' | 'Autre';
  priorité: 'Urgent' | 'Moyen' | 'Faible';
  action: 'Répondre' | 'Répondre avec excuse' | 'Transférer à la comptabilité' | 'Transférer au support' | 'Examiner manuellement' | 'Ignorer';
  suggestion: string | null;
  created_at?: string;
  email_id?: string;
}

export interface EmailTriageData {
  subject: string;
  body: string;
  sender?: string;
  timestamp?: string;
}

export interface EmailWithTriage {
  id: string;
  subject: string;
  sender: string;
  date: string;
  preview: string;
  source?: string;
  triage?: TriageResult;
}
