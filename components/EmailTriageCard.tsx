'use client';

import { useState } from 'react';
import { ClipboardDocumentIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface TriageResult {
  categorie: string;
  priorite: 'Urgent' | 'Moyen' | 'Faible';
  action: string;
  suggestion?: string | null;
  fromCache?: boolean;
}

interface EmailTriageCardProps {
  email: {
    id: string;
    subject: string;
    body: string;
    sender: string;
  };
  triage?: TriageResult;
  onTriageUpdate?: (result: TriageResult) => void;
}

export default function EmailTriageCard({ email, triage, onTriageUpdate }: EmailTriageCardProps) {
  const [loading, setLoading] = useState(false);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [showSuggestion, setShowSuggestion] = useState(false);

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

  const performTriage = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: email.id,
          subject: email.subject,
          body: email.body,
          sender: email.sender
        }),
      });

      if (response.ok) {
        const result = await response.json();
        onTriageUpdate?.(result);
      }
    } catch (error) {
      console.error('Triage error:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSuggestion = async () => {
    setSuggestLoading(true);
    try {
      const response = await fetch('/api/triage/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: email.subject,
          body: email.body
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuggestion(data.suggestion);
        setShowSuggestion(true);
      }
    } catch (error) {
      console.error('Suggestion error:', error);
    } finally {
      setSuggestLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (suggestion) {
      await navigator.clipboard.writeText(suggestion);
    }
  };

  const canGenerateReply = triage && 
    triage.categorie !== 'Publicité' && 
    triage.categorie !== 'Autre' &&
    triage.action !== 'Ignorer';

  return (
    <div className="bg-white rounded-lg border p-4 space-y-3">
      {/* Email info */}
      <div>
        <h3 className="font-medium text-gray-900 truncate">{email.subject}</h3>
        <p className="text-sm text-gray-600">De: {email.sender}</p>
      </div>

      {/* Triage results */}
      {triage ? (
        <div className="space-y-3">
          <div className="flex gap-2 flex-wrap">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
              {triage.categorie}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(triage.priorite)}`}>
              {triage.priorite}
            </span>
            {triage.fromCache && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                Cache
              </span>
            )}
          </div>
          
          <p className="text-sm text-gray-600">
            <span className="font-medium">Action:</span> {triage.action}
          </p>

          {/* AI Reply button */}
          {canGenerateReply && (
            <button
              onClick={generateSuggestion}
              disabled={suggestLoading}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 disabled:opacity-50"
            >
              <SparklesIcon className="h-4 w-4" />
              {suggestLoading ? 'Génération...' : 'Répondre avec l\'IA'}
            </button>
          )}
        </div>
      ) : (
        <button
          onClick={performTriage}
          disabled={loading}
          className="w-full px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 disabled:opacity-50"
        >
          {loading ? 'Analyse en cours...' : 'Analyser avec l\'IA'}
        </button>
      )}

      {/* Suggestion modal */}
      {showSuggestion && suggestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">Suggestion de réponse IA</h3>
            </div>
            <div className="p-4 overflow-y-auto max-h-64">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                {suggestion}
              </pre>
            </div>
            <div className="p-4 border-t flex gap-2 justify-end">
              <button
                onClick={() => setShowSuggestion(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Fermer
              </button>
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                <ClipboardDocumentIcon className="h-4 w-4" />
                Copier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
