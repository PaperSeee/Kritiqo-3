'use client'

import { useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';

interface DisconnectOutlookButtonProps {
  emailId: string;
  email: string;
  provider: 'google' | 'azure-ad';
  onDisconnected?: () => void;
  className?: string;
}

export default function DisconnectOutlookButton({ 
  emailId, 
  email, 
  provider,
  onDisconnected,
  className = '' 
}: DisconnectOutlookButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDisconnect = async () => {
    if (!confirm(`Êtes-vous sûr de vouloir déconnecter ${email} ?`)) {
      return;
    }

    setLoading(true);
    try {
      // Essayer d'abord avec l'ID dans l'URL (méthode existante)
      let res = await fetch(`/api/connected-emails?id=${emailId}`, {
        method: 'DELETE',
      });

      // Si ça échoue, essayer avec l'ID dans le body
      if (!res.ok) {
        res = await fetch('/api/connected-emails', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: emailId }),
        });
      }

      if (res.ok) {
        console.log(`✅ Compte ${email} déconnecté avec succès`);
        onDisconnected?.();
      } else {
        const error = await res.json();
        console.error('❌ Erreur lors de la déconnexion:', error);
        alert(`Erreur lors de la déconnexion: ${error.error || 'Erreur inconnue'}`);
      }
    } catch (err) {
      console.error('❌ Erreur réseau:', err);
      alert('Erreur réseau lors de la déconnexion.');
    } finally {
      setLoading(false);
    }
  };

  const providerName = provider === 'google' ? 'Gmail' : 'Outlook';
  const providerColor = provider === 'google' ? 'text-red-600' : 'text-orange-600';

  return (
    <button
      onClick={handleDisconnect}
      disabled={loading}
      className={`inline-flex items-center space-x-1 px-2 py-1 text-sm text-gray-500 hover:text-red-600 transition-colors disabled:opacity-50 ${className}`}
      title={`Déconnecter ${providerName}`}
    >
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-3 w-3 border-b border-gray-400"></div>
          <span>Déconnexion...</span>
        </>
      ) : (
        <>
          <TrashIcon className="h-3 w-3" />
          <span>Déconnecter {providerName}</span>
        </>
      )}
    </button>
  );
}
