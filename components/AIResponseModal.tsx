'use client';

import { useState, useEffect } from 'react';
import { X, Copy, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

interface AIResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  emailId: string;
  subject: string;
  sender: string;
  body: string;
}

interface SuggestionResponse {
  suggestion: string;
}

export default function AIResponseModal({
  isOpen,
  onClose,
  emailId,
  subject,
  sender,
  body
}: AIResponseModalProps) {
  const [suggestion, setSuggestion] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && !suggestion) {
      generateSuggestion();
    }
  }, [isOpen]);

  const generateSuggestion = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/triage/suggest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          body
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la génération de la réponse');
      }

      const data: SuggestionResponse = await response.json();
      setSuggestion(data.suggestion);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(suggestion);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erreur copie:', err);
    }
  };

  const handleClose = () => {
    setSuggestion('');
    setError(null);
    setCopied(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Réponse générée par l'IA</h2>
              </div>
              <button
                onClick={handleClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Email Info */}
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-gray-500">Sujet:</span>
                <p className="font-semibold text-gray-900">{subject}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Expéditeur:</span>
                <p className="text-gray-700">{sender}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4 flex-1 overflow-hidden">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                  <span className="text-gray-600">Génération de la réponse...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {suggestion && !loading && (
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-500 mb-2 block">
                    💡 Réponse suggérée:
                  </span>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-64 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm text-gray-800 font-normal leading-relaxed">
                      {suggestion}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {suggestion && !loading && (
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500">
                  Cette réponse a été générée automatiquement. Veuillez la relire avant envoi.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={handleCopy}
                    disabled={copied}
                    className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      copied
                        ? 'bg-green-100 text-green-800 border border-green-300'
                        : 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm hover:shadow-md'
                    }`}
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        <span>Copié!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Copier la réponse</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
