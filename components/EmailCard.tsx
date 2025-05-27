'use client';

import { useState, useEffect } from 'react';
import { SparklesIcon, EnvelopeIcon, ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface TriageResult {
  categorie: string;
  priorité: 'Urgent' | 'Moyen' | 'Faible';
  action: string;
  suggestion: string | null;
  fromCache?: boolean;
}

interface EmailCardProps {
  id: string;
  subject: string;
  from: string;
  date: string;
  body: string;
  source?: string;
}

export default function EmailCard({ id, subject, from, date, body, source }: EmailCardProps) {
  const [triage, setTriage] = useState<TriageResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    async function performTriage() {
      try {
        setLoading(true);
        setError(false);

        const response = await fetch('/api/triage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ subject, body }),
        });

        if (!response.ok) {
          throw new Error('Triage failed');
        }

        const result: TriageResult = await response.json();
        setTriage(result);
      } catch (err) {
        console.error('Triage error:', err);
        setError(true);
        setTriage({
          categorie: 'Autre',
          priorité: 'Moyen',
          action: 'Examiner manuellement',
          suggestion: null
        });
      } finally {
        setLoading(false);
      }
    }

    if (subject && body) {
      performTriage();
    }
  }, [subject, body]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Moyen':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Faible':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Avis client':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Commande':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Facture':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Juridique':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'RH':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Commercial':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Publicité':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'Spam':
        return 'bg-red-50 text-red-600 border-red-200';
      case 'Notification automatique':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'Répondre':
        return 'bg-blue-500 text-white';
      case 'Répondre avec excuse':
        return 'bg-orange-500 text-white';
      case 'Transférer à la comptabilité':
        return 'bg-purple-500 text-white';
      case 'Transférer au support':
        return 'bg-indigo-500 text-white';
      case 'Ignorer':
        return 'bg-gray-400 text-white';
      default:
        return 'bg-neutral-500 text-white';
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <EnvelopeIcon className="h-4 w-4 text-neutral-400" />
            <h3 className="font-medium text-neutral-900 truncate">{subject}</h3>
            {source && (
              <span className={`text-xs px-2 py-1 rounded-full ${
                source === 'gmail' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {source === 'gmail' ? 'Gmail' : 'Outlook'}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-4 text-sm text-neutral-600">
            <span className="truncate">{from}</span>
            <div className="flex items-center space-x-1">
              <ClockIcon className="h-3 w-3" />
              <span>{formatDate(date)}</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => setExpanded(!expanded)}
          className="ml-4 text-neutral-500 hover:text-neutral-700 text-sm"
        >
          {expanded ? 'Réduire' : 'Détails'}
        </button>
      </div>

      {/* AI Triage Results */}
      {loading ? (
        <div className="flex items-center space-x-2 mb-4">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
          <span className="text-sm text-neutral-600">Analyse IA en cours...</span>
        </div>
      ) : (
        <div className="space-y-3 mb-4">
          {/* Tags Row */}
          <div className="flex flex-wrap gap-2">
            {triage && (
              <>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(triage.categorie)}`}>
                  {triage.categorie}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(triage.priorité)}`}>
                  {triage.priorité}
                </span>
                {error && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                    <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                    IA indisponible
                  </span>
                )}
              </>
            )}
          </div>

          {/* Action Button */}
          {triage && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <SparklesIcon className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium text-neutral-700">Action recommandée:</span>
              </div>
              <button 
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${getActionColor(triage.action)} ${
                  triage.action === 'Ignorer' ? 'opacity-60' : 'hover:opacity-80'
                }`}
                disabled={triage.action === 'Ignorer'}
              >
                {triage.action}
              </button>
            </div>
          )}

          {/* AI Suggestion */}
          {triage?.suggestion && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <SparklesIcon className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-purple-800 mb-1">Suggestion de réponse IA</p>
                  <p className="text-sm text-purple-700 italic">"{triage.suggestion}"</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Email Preview */}
      <div className={`text-sm text-neutral-600 ${expanded ? '' : 'line-clamp-2'}`}>
        {body}
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-neutral-200">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="font-medium text-neutral-700">ID Email:</span>
              <span className="ml-2 text-neutral-500">{id}</span>
            </div>
            <div>
              <span className="font-medium text-neutral-700">Source:</span>
              <span className="ml-2 text-neutral-500">{source || 'Inconnue'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
