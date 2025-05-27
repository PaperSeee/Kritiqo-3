'use client';

import { useState, useEffect } from 'react';
import { TriageResult } from '@/lib/types/triage';

interface EmailTriageDisplayProps {
  subject: string;
  body: string;
  emailId?: string;
  className?: string;
}

export default function EmailTriageDisplay({ subject, body, emailId, className = '' }: EmailTriageDisplayProps) {
  const [triage, setTriage] = useState<TriageResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
        // Set fallback triage
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

  const getPriorityColor = (priorité: string) => {
    switch (priorité) {
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

  const getCategoryColor = (categorie: string) => {
    switch (categorie) {
      case 'Avis client':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Commande':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Juridique':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Facture':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Spam':
      case 'Publicité':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-32 mt-1"></div>
      </div>
    );
  }

  if (!triage) {
    return null;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex gap-2 flex-wrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(triage.categorie)}`}>
          {triage.categorie}
        </span>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(triage.priorité)}`}>
          {triage.priorité}
        </span>
        {error && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
            IA indisponible
          </span>
        )}
      </div>
      <p className="text-sm text-gray-600">
        <span className="font-medium">Action:</span> {triage.action}
      </p>
      {triage.suggestion && (
        <p className="text-sm text-blue-600 bg-blue-50 p-2 rounded border">
          <span className="font-medium">Suggestion:</span> {triage.suggestion}
        </p>
      )}
    </div>
  );
}
