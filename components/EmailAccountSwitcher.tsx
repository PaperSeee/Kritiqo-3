'use client'

import { useState, useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { ChevronDownIcon, TrashIcon } from '@heroicons/react/24/outline'
import { ConnectedEmail } from '@/lib/supabase'
import DisconnectOutlookButton from './DisconnectOutlookButton'

interface EmailAccountSwitcherProps {
  selectedEmail: string | null
  onEmailChange: (email: string | null) => void
  onEmailsUpdate: () => void
}

export default function EmailAccountSwitcher({ 
  selectedEmail, 
  onEmailChange, 
  onEmailsUpdate 
}: EmailAccountSwitcherProps) {
  const { data: session } = useSession()
  const [connectedEmails, setConnectedEmails] = useState<ConnectedEmail[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const fetchConnectedEmails = async () => {
    try {
      const response = await fetch('/api/connected-emails')
      if (response.ok) {
        const data = await response.json()
        setConnectedEmails(data.connectedEmails)
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error('Erreur lors de la récupération des emails connectés:', err.message, err.name)
      } else {
        console.error('Erreur inconnue lors de la récupération des emails connectés:', JSON.stringify(err))
      }
    }
  }

  useEffect(() => {
    if (session) {
      fetchConnectedEmails()
    }
  }, [session])

  const handleAddAccount = async (provider: 'google' | 'azure-ad') => {
    setIsLoading(true)
    try {
      // Log de debug
      console.log('🔍 OAuth Debug - Connexion provider:', provider)
      console.log('🔍 OAuth Debug - Current URL:', window.location.href)
      console.log('🔍 OAuth Debug - Callback URL:', window.location.href)
      
      // Utiliser les bons provider IDs pour NextAuth
      const providerMap = {
        'google': 'google',
        'azure-ad': 'azure-ad'
      }
      
      await signIn(providerMap[provider], { 
        callbackUrl: window.location.href 
      })
    } catch (err) {
      if (err instanceof Error) {
        console.error('Erreur lors de l\'ajout du compte:', err.message, err.name)
      } else {
        console.error('Erreur inconnue lors de l\'ajout du compte:', JSON.stringify(err))
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveAccount = async (emailId: string) => {
    try {
      const response = await fetch(`/api/connected-emails?id=${emailId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        await fetchConnectedEmails()
        onEmailsUpdate()
        
        // Si l'email supprimé était sélectionné, désélectionner
        const removedEmail = connectedEmails.find(e => e.id === emailId)
        if (removedEmail && selectedEmail === removedEmail.email) {
          onEmailChange(null)
        }
      } else {
        const error = await response.json()
        console.error('❌ Erreur lors de la suppression:', error)
        alert(`Erreur: ${error.error || 'Impossible de supprimer le compte'}`)
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error('Erreur lors de la suppression du compte:', err.message, err.name)
      } else {
        console.error('Erreur inconnue lors de la suppression du compte:', JSON.stringify(err))
      }
      alert('Erreur réseau lors de la suppression')
    }
  }

  const handleAccountDisconnected = () => {
    fetchConnectedEmails()
    onEmailsUpdate()
  }

  const selectedEmailData = connectedEmails.find(e => e.email === selectedEmail)

  return (
    <div className="relative">
      <div className="flex items-center space-x-3">
        {/* Dropdown pour sélectionner l'email */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-2 bg-white border border-neutral-300 rounded-lg px-4 py-2 hover:bg-neutral-50 transition-colors min-w-64"
          >
            <div className="flex items-center space-x-2">
              {selectedEmailData ? (
                <>
                  <div className={`w-3 h-3 rounded-full ${
                    selectedEmailData.provider === 'google' ? 'bg-red-500' : 'bg-orange-500'
                  }`}></div>
                  <span className="text-sm font-medium">{selectedEmailData.email}</span>
                  <span className="text-xs text-neutral-500">
                    ({selectedEmailData.provider === 'google' ? 'Gmail' : 'Outlook'})
                  </span>
                </>
              ) : (
                <span className="text-sm text-neutral-600">
                  {connectedEmails.length > 0 ? 'Tous les comptes' : 'Aucun compte connecté'}
                </span>
              )}
            </div>
            <ChevronDownIcon className="h-4 w-4 text-neutral-500" />
          </button>

          {isOpen && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white border border-neutral-200 rounded-lg shadow-lg z-10">
              <div className="py-1">
                {connectedEmails.length > 1 && (
                  <button
                    onClick={() => {
                      onEmailChange(null)
                      setIsOpen(false)
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 ${
                      !selectedEmail ? 'bg-blue-50 text-blue-700' : 'text-neutral-700'
                    }`}
                  >
                    Tous les comptes ({connectedEmails.length})
                  </button>
                )}
                
                {connectedEmails.map((email) => (
                  <div key={email.id} className="flex items-center justify-between hover:bg-neutral-50">
                    <button
                      onClick={() => {
                        onEmailChange(email.email)
                        setIsOpen(false)
                      }}
                      className={`flex-1 text-left px-4 py-2 text-sm ${
                        selectedEmail === email.email ? 'bg-blue-50 text-blue-700' : 'text-neutral-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          email.provider === 'google' ? 'bg-red-500' : 'bg-orange-500'
                        }`}></div>
                        <span>{email.email}</span>
                        <span className="text-xs text-neutral-500">
                          ({email.provider === 'google' ? 'Gmail' : 'Outlook'})
                        </span>
                      </div>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveAccount(email.id)
                      }}
                      className="px-2 py-2 text-red-500 hover:text-red-700"
                      title="Supprimer ce compte"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {connectedEmails.length > 0 && (
        <>
          <div className="mt-2 text-xs text-neutral-500">
            {connectedEmails.length} compte{connectedEmails.length > 1 ? 's' : ''} connecté{connectedEmails.length > 1 ? 's' : ''}
          </div>
          
          {/* Liste des comptes connectés avec boutons de déconnexion */}
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium text-neutral-700">Comptes connectés:</h4>
            {connectedEmails.map((email) => (
              <div key={email.id} className="flex items-center justify-between bg-neutral-50 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    email.provider === 'google' ? 'bg-red-500' : 'bg-orange-500'
                  }`}></div>
                  <span className="text-sm font-medium">{email.email}</span>
                  <span className="text-xs text-neutral-500">
                    ({email.provider === 'google' ? 'Gmail' : 'Outlook'})
                  </span>
                </div>
                <DisconnectOutlookButton
                  emailId={email.id}
                  email={email.email}
                  provider={email.provider}
                  onDisconnected={handleAccountDisconnected}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
