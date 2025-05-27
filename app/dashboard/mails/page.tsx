'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { 
  InboxIcon, 
  SparklesIcon, 
  EyeSlashIcon, 
  EyeIcon,
  FunnelIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import EmailAccountSwitcher from '@/components/EmailAccountSwitcher';
import MailCard from '@/components/MailCard';
import { type TriageResult } from '@/lib/types/triage';

// Type Email uniforme avec triage
type Email = {
  id: string | number;
  subject: string;
  sender: string;
  date: string;
  preview: string;
  body?: string;
  read: boolean;
  source?: string;
  accountEmail?: string;
  accountProvider?: string;
  autoCategory?: string;  // Nouvelle propriété pour classification automatique
  triage?: TriageResult;
  triageLoading?: boolean;
  triageError?: boolean;
}

const CATEGORIES = [
  'Tous',
  'Avis client', // Priorisé en premier
  'Facture', 
  'Commande',
  'Commercial',
  'RH',
  'Juridique',
  'Notifications'
];

export default function MailsPage() {
  const { data: session, status } = useSession();
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [allEmails, setAllEmails] = useState<Email[]>([]);
  const [isLoadingEmails, setIsLoadingEmails] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [selectedCategorie, setSelectedCategorie] = useState('Tous');
  const [showHidden, setShowHidden] = useState(false);
  const [showSpamPub, setShowSpamPub] = useState(false);

  // Nouveaux états pour la gestion du cache
  const [hasFetchedGmail, setHasFetchedGmail] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState<number | null>(null);
  const [isManualRefresh, setIsManualRefresh] = useState(false);
  const fetchInProgress = useRef(false);

  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes en milliseconds

  const shouldFetchEmails = () => {
    // Ne pas fetch si une requête est déjà en cours
    if (fetchInProgress.current) return false;
    
    // Fetch si c'est un refresh manuel
    if (isManualRefresh) return true;
    
    // Ne pas fetch si on a déjà des emails et que le cache est encore valide
    if (hasFetchedGmail && lastFetchTime && allEmails.length > 0) {
      const timeSinceLastFetch = Date.now() - lastFetchTime;
      if (timeSinceLastFetch < CACHE_DURATION) {
        return false;
      }
    }
    
    return true;
  };

  const fetchEmails = async (forceRefresh = false) => {
    if (!session) return;
    
    // Vérifier si on doit vraiment faire le fetch
    if (!forceRefresh && !shouldFetchEmails()) {
      console.log('📧 Cache Gmail encore valide, pas de fetch nécessaire');
      return;
    }

    // Marquer qu'une requête est en cours
    fetchInProgress.current = true;
    setIsLoadingEmails(true);
    setEmailError(null);
    
    try {
      const params = new URLSearchParams();
      if (selectedEmail) {
        params.append('email', selectedEmail);
      }
      if (forceRefresh) {
        params.append('refresh', 'true');
      }

      console.log('🚀 Fetch emails from API...');
      const response = await fetch(`/api/emails?${params.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = errorData.error || 'Erreur lors de la récupération des emails';
        
        // Messages d'erreur spécifiques pour les scopes
        if (response.status === 403 && errorMessage.includes('insufficient authentication scopes')) {
          errorMessage = 'Permissions Gmail insuffisantes. Veuillez vous reconnecter en acceptant toutes les permissions.';
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const emails = (data.emails || []).slice(0, 100);
      
      // Marquer le cache comme valide
      setHasFetchedGmail(true);
      setLastFetchTime(Date.now());
      setIsManualRefresh(false);
      
      // Lancer le triage IA seulement pour les nouveaux emails
      const emailsWithTriage = emails.map((email: any) => {
        // Vérifier si cet email a déjà été analysé
        const existingEmail = allEmails.find(e => e.id === email.id);
        if (existingEmail && existingEmail.triage && !existingEmail.triageLoading) {
          return existingEmail; // Garder l'analyse existante
        }
        
        return {
          ...email,
          triageLoading: true,
          triageError: false
        };
      });
      
      setAllEmails(emailsWithTriage);
      
      // Traiter le triage seulement pour les emails qui n'ont pas encore été analysés
      const emailsToAnalyze = emailsWithTriage.filter((email: Email) => email.triageLoading);
      
      console.log(`📊 ${emailsToAnalyze.length} emails à analyser avec l'IA`);
      
      // Traiter le triage par batch pour éviter de surcharger l'API
      for (let i = 0; i < emailsToAnalyze.length; i += 5) {
        const batch = emailsToAnalyze.slice(i, i + 5);
        
        await Promise.all(batch.map(async (email: Email, batchIndex: number) => {
          const globalIndex = emails.findIndex((e: Email) => e.id === email.id);
          if (globalIndex === -1) return;
          
          try {
            const triageResponse = await fetch('/api/triage', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                id: email.id,
                subject: email.subject,
                body: email.body || email.preview,
                sender: email.sender,
              }),
            });

            if (triageResponse.ok) {
              const triageResult = await triageResponse.json();
              
              setAllEmails(prev => prev.map((e, index) => 
                index === globalIndex ? {
                  ...e,
                  triage: {
                    categorie: triageResult.categorie,
                    priorite: triageResult.priorite,
                    action: triageResult.action,
                    suggestion: triageResult.suggestion
                  },
                  triageLoading: false,
                  triageError: false
                } : e
              ));
            } else {
              throw new Error('Triage failed');
            }
          } catch (err) {
            console.error(`❌ Erreur triage pour email ${email.id}:`, err);
            setAllEmails(prev => prev.map((e, index) => 
              index === globalIndex ? {
                ...e,
                triageLoading: false,
                triageError: true,
                triage: {
                  categorie: 'Autre',
                  priorite: 'Moyen' as const,
                  action: 'Examiner manuellement',
                  suggestion: null
                }
              } : e
            ));
          }
        }));
        
        // Pause entre les batches pour éviter le rate limiting
        if (i + 5 < emailsToAnalyze.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setEmailError(errorMessage);
      console.error('❌ Erreur fetch emails:', errorMessage);
      
      // Ne pas marquer comme fetchée en cas d'erreur
      setHasFetchedGmail(false);
    } finally {
      setIsLoadingEmails(false);
      fetchInProgress.current = false;
    }
  };

  // Effet pour le fetch initial
  useEffect(() => {
    if (session && !hasFetchedGmail) {
      fetchEmails();
    }
  }, [session]);

  // Effet pour changement d'email sélectionné
  useEffect(() => {
    if (session && selectedEmail !== null) {
      setHasFetchedGmail(false); // Reset cache pour le nouvel email
      fetchEmails();
    }
  }, [selectedEmail]);

  // Séparer les emails visibles et cachés
  const { visibleEmails, spamPubEmails, regularEmails } = useMemo(() => {
    const spamPub: Email[] = [];
    const regular: Email[] = [];
    
    allEmails.forEach(email => {
      // Classification automatique d'abord
      if (email.autoCategory === 'Spam/Pub') {
        spamPub.push(email);
      } 
      // Puis classification IA
      else if (email.triage?.catégorie === 'Publicité' || email.triage?.catégorie === 'Spam') {
        spamPub.push(email);
      } 
      else {
        regular.push(email);
      }
    });
    
    return { 
      visibleEmails: showSpamPub ? allEmails : regular,
      spamPubEmails: spamPub, 
      regularEmails: regular 
    };
  }, [allEmails, showSpamPub]);

  // Filtrer par catégorie (seulement sur les emails réguliers)
  const filteredEmails = useMemo(() => {
    const emailsToFilter = showSpamPub ? allEmails : regularEmails;
    
    if (selectedCategorie === 'Tous') {
      return emailsToFilter;
    }
    
    // Mapper les catégories d'affichage aux catégories IA
    const categoryMap: Record<string, string> = {
      'Notifications': 'Notification automatique'
    };
    
    const targetCategory = categoryMap[selectedCategorie] || selectedCategorie;
    
    return emailsToFilter.filter(email => 
      email.triage?.categorie === targetCategory
    );
  }, [allEmails, regularEmails, selectedCategorie, showSpamPub]);

  const handleEmailChange = (email: string | null) => {
    setSelectedEmail(email);
  };

  const handleEmailsUpdate = () => {
    setIsManualRefresh(true);
    setHasFetchedGmail(false);
    fetchEmails(true);
  };

  const handleRetryClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    fetchEmails(true);
  };

  const getCategoryStats = (category: string) => {
    const emailsToCount = showSpamPub ? allEmails : regularEmails;
    
    if (category === 'Tous') return emailsToCount.length;
    
    const categoryMap: Record<string, string> = {
      'Notifications': 'Notification automatique'
    };
    
    const targetCategory = categoryMap[category] || category;
    return emailsToCount.filter(email => email.triage?.categorie === targetCategory).length;
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center space-x-2 mb-2">
          <h1 className="text-3xl font-bold text-neutral-900">
            Gestion des Emails
          </h1>
          <div className="flex items-center space-x-1 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
            <SparklesIcon className="h-4 w-4" />
            <span>IA Intégrée</span>
          </div>
        </div>
        <p className="text-neutral-600">
          Vos emails sont automatiquement triés et analysés par l'intelligence artificielle de Kritiqo
        </p>
      </div>

      {/* Email Account Switcher */}
      {status !== 'loading' && (
        <div className="bg-white p-6 rounded-xl border border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-800">
              Comptes Email
            </h3>
            <div className="flex space-x-3">
              {/* Bouton Actualiser existant */}
              <button
                onClick={handleEmailsUpdate}
                disabled={isLoadingEmails}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 disabled:opacity-50"
              >
                {isLoadingEmails ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    Actualisation...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="h-4 w-4 mr-2" />
                    Actualiser
                  </>
                )}
              </button>
            </div>
          </div>

          <EmailAccountSwitcher
            selectedEmail={selectedEmail}
            onEmailChange={handleEmailChange}
            onEmailsUpdate={handleEmailsUpdate}
          />
          
          {/* Indicateur de cache */}
          {lastFetchTime && (
            <div className="mt-2 text-xs text-gray-500">
              Dernière mise à jour: {new Date(lastFetchTime).toLocaleTimeString('fr-FR')}
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {status === 'loading' && (
        <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-neutral-400 rounded-full animate-pulse"></div>
            <span className="text-neutral-600">Chargement...</span>
          </div>
        </div>
      )}

      {/* Error Display */}
      {emailError && (
        <div className="bg-red-50 rounded-xl border border-red-200 p-4">
          <div className="flex items-center space-x-2">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
            <span className="text-red-800 text-sm">Erreur: {emailError}</span>
            <button
              onClick={handleRetryClick}
              className="text-sm text-red-700 hover:text-red-900 underline ml-auto"
            >
              Réessayer
            </button>
          </div>
        </div>
      )}

      {/* Limit Warning */}
      {allEmails.length > 0 && (
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
          <div className="flex items-center space-x-2">
            <InboxIcon className="h-5 w-5 text-blue-600" />
            <span className="text-blue-800 text-sm">
              ⚠️ Vous visualisez les 100 derniers mails uniquement (triés par date de réception)
            </span>
          </div>
        </div>
      )}

      {/* Category Filters */}
      {visibleEmails.length > 0 && (
        <div className="bg-white p-6 rounded-xl border border-neutral-200">
          <div className="flex items-center space-x-2 mb-4">
            <FunnelIcon className="h-5 w-5 text-neutral-600" />
            <h3 className="text-lg font-semibold text-neutral-800">Filtrer par catégorie</h3>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => {
              const count = getCategoryStats(category);
              const isActive = selectedCategorie === category;
              
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategorie(category)}
                  className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  <span>{category}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    isActive ? 'bg-purple-500' : 'bg-neutral-300'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Spam/Pub Toggle */}
      {spamPubEmails.length > 0 && (
        <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="font-medium text-orange-800">
                  {spamPubEmails.length} emails publicitaires/spam détectés automatiquement
                </span>
              </div>
              <span className="text-xs bg-orange-200 text-orange-700 px-2 py-1 rounded-full">
                Filtré sans IA
              </span>
            </div>
            <button
              onClick={() => setShowSpamPub(!showSpamPub)}
              className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                showSpamPub
                  ? 'bg-orange-600 text-white hover:bg-orange-700'
                  : 'bg-white text-orange-700 border border-orange-300 hover:bg-orange-50'
              }`}
            >
              {showSpamPub ? (
                <>
                  <EyeSlashIcon className="h-4 w-4" />
                  <span>Masquer les spams</span>
                </>
              ) : (
                <>
                  <EyeIcon className="h-4 w-4" />
                  <span>Afficher les spams</span>
                </>
              )}
            </button>
          </div>
          <p className="text-sm text-orange-700 mt-2">
            Ces emails ont été automatiquement identifiés comme spam ou publicité grâce à nos filtres intelligents.
          </p>
        </div>
      )}

      {/* Loading emails */}
      {isLoadingEmails && (
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
            <span className="text-neutral-600">Analyse des emails en cours...</span>
          </div>
        </div>
      )}

      {/* Statistiques mises à jour */}
      {session && allEmails.length > 0 && !isLoadingEmails && (
        <div className="grid gap-6 md:grid-cols-4">
          <div className="bg-white p-6 rounded-xl border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-neutral-800 mb-1">Total Emails</h3>
                <p className="text-2xl font-bold text-neutral-900">{allEmails.length}</p>
              </div>
              <InboxIcon className="h-8 w-8 text-neutral-400" />
            </div>
          </div>
          
          <div className="bg-green-50 p-6 rounded-xl border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-green-800 mb-1">Emails Utiles</h3>
                <p className="text-2xl font-bold text-green-600">{regularEmails.length}</p>
              </div>
              <EyeIcon className="h-8 w-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-orange-800 mb-1">Spam/Pub Filtrés</h3>
                <p className="text-2xl font-bold text-orange-600">{spamPubEmails.length}</p>
              </div>
              <EyeSlashIcon className="h-8 w-8 text-orange-400" />
            </div>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-purple-800 mb-1">Temps Économisé</h3>
                <p className="text-2xl font-bold text-purple-600">{Math.round(spamPubEmails.length * 1.5 + regularEmails.length * 0.5)}min</p>
              </div>
              <SparklesIcon className="h-8 w-8 text-purple-400" />
            </div>
          </div>
        </div>
      )}

      {/* Liste des emails filtrés */}
      {session && filteredEmails.length > 0 && !isLoadingEmails && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-neutral-800">
              {showSpamPub 
                ? `Tous les emails (${filteredEmails.length})` 
                : selectedCategorie === 'Tous' 
                  ? `Emails utiles (${filteredEmails.length})` 
                  : `Emails - ${selectedCategorie} (${filteredEmails.length})`
              }
            </h2>
            {showSpamPub && (
              <span className="text-sm bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
                Inclut les emails spam/publicité
              </span>
            )}
          </div>
          
          <div className="grid gap-6">
            {filteredEmails.map((email) => (
              <div 
                key={email.id}
                className={email.autoCategory === 'Spam/Pub' ? 'opacity-60' : ''}
              >
                <MailCard
                  id={String(email.id)}
                  subject={email.subject}
                  from={email.sender}
                  date={email.date}
                  preview={email.preview}
                  source={email.source}
                  triage={email.autoCategory === 'Spam/Pub' ? {
                    categorie: 'Spam/Pub',
                    priorite: 'Faible',
                    action: 'Ignorer',
                    suggestion: null
                  } : email.triage}
                  loading={email.autoCategory === 'Spam/Pub' ? false : email.triageLoading}
                  error={email.triageError}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Show message when no emails and connected */}
      {session && allEmails.length === 0 && !isLoadingEmails && (
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
          <div className="p-12 text-center">
            <InboxIcon className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">Aucun email trouvé</h3>
            <p className="text-neutral-500">
              Connectez vos comptes Gmail ou Outlook pour commencer le tri intelligent
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
