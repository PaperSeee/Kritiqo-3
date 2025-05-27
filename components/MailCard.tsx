'use client';

import { useState } from 'react';
import { 
  Sparkles, 
  Reply, 
  Trash2, 
  Forward, 
  Eye, 
  Clock,
  Mail,
  User,
  AlertCircle
} from 'lucide-react';
import AIResponseModal from './AIResponseModal';
import { getCategorieColor, getPrioriteColor, type TriageResult } from '@/lib/types/triage';

interface TriageData {
  catégorie: string;
  priorité: 'Urgent' | 'Moyen' | 'Faible';
  action: string;
  suggestion: string | null;
  fromCache?: boolean;
}

interface MailCardProps {
  id: string;
  subject: string;
  from: string;
  date: string;
  preview: string;
  fullBody?: string; // Add full body content for AI suggestions
  source?: string;
  triage?: TriageData;
  loading?: boolean;
  error?: boolean;
}

export default function MailCard({
  id,
  subject,
  from,
  date,
  preview,
  fullBody,
  source,
  triage,
  loading = false,
  error = false
}: MailCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);

  // Extraire le nom de l'expéditeur depuis l'email
  const extractSenderName = (email: string) => {
    const match = email.match(/^(.+?)\s*<.*>$/);
    return match ? match[1].replace(/['"]/g, '') : email.split('@')[0];
  };

  // Icônes de catégorie
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Avis client': return '⭐';
      case 'Commande': return '📦';
      case 'Facture': return '💳';
      case 'Juridique': return '⚖️';
      case 'RH': return '💼';
      case 'Commercial': return '💰';
      case 'Notification automatique': return '🔔';
      case 'Publicité': return '📢';
      case 'Spam': return '🛑';
      default: return '📧';
    }
  };

  // Couleurs de priorité
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Moyen':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Faible':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Couleurs de catégorie
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'Avis client': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Commande': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Facture': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Juridique': return 'bg-red-100 text-red-800 border-red-300';
      case 'RH': return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'Commercial': return 'bg-green-100 text-green-800 border-green-300';
      case 'Notification automatique': return 'bg-cyan-100 text-cyan-800 border-cyan-300';
      case 'Publicité': return 'bg-gray-100 text-gray-600 border-gray-300';
      case 'Spam': return 'bg-red-50 text-red-600 border-red-200';
      case 'Spam/Pub': return 'bg-orange-50 text-orange-600 border-orange-200'; // Nouvelle couleur
      default: return 'bg-neutral-100 text-neutral-800 border-neutral-300';
    }
  };

  // Icône d'action
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'Répondre':
      case 'Répondre avec excuse':
        return <Reply className="h-4 w-4" />;
      case 'Transférer à la comptabilité':
      case 'Transférer au support':
        return <Forward className="h-4 w-4" />;
      case 'Ignorer':
        return <Trash2 className="h-4 w-4" />;
      case 'Examiner manuellement':
        return <Eye className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const shouldShowAiButton = () => {
    return triage?.action !== 'Ignorer' && 
           triage?.catégorie !== 'Publicité' && 
           triage?.catégorie !== 'Spam' &&
           triage?.catégorie !== 'Spam/Pub';  };

  const handleAiReply = () => {
    setShowAIModal(true);
  };

  return (
    <>
      <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg border border-neutral-200 p-6 transition-all duration-300 hover:border-neutral-300">
        {/* Badge automatique pour Spam/Pub */}
        <div className="absolute top-4 right-4 flex items-center space-x-1 text-xs text-neutral-500">
          {triage?.catégorie === 'Spam/Pub' ? (
            <>
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="hidden sm:inline text-orange-600">Filtré automatiquement</span>
            </>
          ) : (
            <>
              <Sparkles className="h-3 w-3 text-yellow-500" />
              <span className="hidden sm:inline">Analysé automatiquement</span>
            </>
          )}
        </div>

        {/* Header avec icône de catégorie et priorité */}
        <div className="flex items-start space-x-4 mb-4">
          {/* Icône de catégorie */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center text-xl">
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-neutral-600"></div>
              ) : (
                getCategoryIcon(triage?.catégorie || 'Autre')
              )}
            </div>
          </div>

          {/* Contenu principal */}
          <div className="flex-1 min-w-0 pr-16">
            {/* Sujet de l'email */}
            <h3 className="text-xl font-bold text-neutral-900 mb-2 leading-tight group-hover:text-neutral-700 transition-colors">
              {subject}
            </h3>

            {/* Expéditeur */}
            <div className="flex items-center space-x-2 mb-3">
              <User className="h-4 w-4 text-neutral-400" />
              <span className="text-sm font-medium text-neutral-600">
                {extractSenderName(from)}
              </span>
              <span className="text-xs text-neutral-400">•</span>
              <span className="text-xs text-neutral-400">{date}</span>
              {source && (
                <>
                  <span className="text-xs text-neutral-400">•</span>
                  <span className="text-xs text-neutral-400 capitalize">{source}</span>
                </>
              )}
            </div>

            {/* Badges catégorie et priorité */}
            {(triage || loading) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {loading ? (
                  <>
                    <div className="animate-pulse bg-gray-200 h-6 w-20 rounded-full"></div>
                    <div className="animate-pulse bg-gray-200 h-6 w-16 rounded-full"></div>
                  </>
                ) : triage ? (
                  <>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getCategorieColor(triage.catégorie)}`}>
                      {triage.catégorie}
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPrioriteColor(triage.priorité)}`}>
                      {triage.priorité}
                    </div>
                    <div className="flex items-center space-x-1 text-sm font-medium text-neutral-700">
                      {getActionIcon(triage.action)}
                      <span>{triage.action}</span>
                    </div>
                  </>
                ) : null}

                {error && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-300">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    IA indisponible
                  </span>
                )}
              </div>
            )}

            {/* Aperçu du contenu */}
            <p className="text-sm text-neutral-600 leading-relaxed mb-4 line-clamp-2">
              {preview}
            </p>

            {/* Action recommandée */}
            {triage && !loading && (
              <div className="flex items-center space-x-3 mb-4">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getCategorieColor(triage.catégorie)}`}>
                  {triage.catégorie}
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPrioriteColor(triage.priorité)}`}>
                  {triage.priorité}
                </div>
                <div className="flex items-center space-x-1 text-sm font-medium text-neutral-700">
                  {getActionIcon(triage.action)}
                  <span>{triage.action}</span>
                </div>
              </div>
            )}

            {/* Boutons d'action */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {/* Bouton Répondre avec l'IA - Optimisé pour les avis clients */}
                {shouldShowAiButton() && !loading && (
                  <button
                    onClick={handleAiReply}
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>
                      {triage?.catégorie === 'Avis client' ? 'Répondre à l\'avis' : 'Répondre avec IA'}
                    </span>
                  </button>
                )}

                {/* Bouton développer/réduire */}
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
                >
                  {isExpanded ? 'Réduire' : 'Voir plus'}
                </button>
              </div>

              {/* ID de l'email (discret) */}
              <div className="text-xs text-neutral-400 opacity-50">
                #{id.toString().slice(-6)}
              </div>
            </div>

            {/* Contenu étendu */}
            {isExpanded && (
              <div className="mt-4 pt-4 border-t border-neutral-100">
                <div className="bg-neutral-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-neutral-700 mb-2">Contenu complet:</h4>
                  <p className="text-sm text-neutral-600 whitespace-pre-line leading-relaxed">
                    {preview}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Response Modal */}
      <AIResponseModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        emailId={id}
        subject={subject}
        sender={from}
        body={fullBody || preview}
      />
    </>
  );
}
