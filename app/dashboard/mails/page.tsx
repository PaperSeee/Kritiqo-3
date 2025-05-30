'use client'

import { useState, useEffect } from 'react'
import { Mail, Plus, AlertCircle, Trash2 } from 'lucide-react'
import EmailConnectionModal from '@/components/EmailConnectionModal'

interface ConnectedEmail {
  id: string
  email: string
  provider: 'imap' | 'microsoft'
  created_at: string
  status: 'active' | 'error'
}

export default function MailsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [connectedEmails, setConnectedEmails] = useState<ConnectedEmail[]>([])
  const [loading, setLoading] = useState(true)

  const fetchConnectedEmails = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/email/connected')
      if (response.ok) {
        const data = await response.json()
        setConnectedEmails(data.emails || [])
      }
    } catch (error) {
      console.error('Erreur lors du chargement des emails connectés:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConnectedEmails()
  }, [])

  const handleEmailConnected = () => {
    setIsModalOpen(false)
    fetchConnectedEmails()
  }

  const handleDeleteEmail = async (emailId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette connexion email ?')) {
      return
    }

    try {
      const response = await fetch(`/api/email/connected?id=${emailId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        fetchConnectedEmails()
      } else {
        alert('Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      alert('Erreur réseau lors de la suppression')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Emails</h1>
          <p className="text-gray-600 mt-1">
            Connectez vos boîtes mail pour centraliser et trier automatiquement vos emails
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Ajouter un compte
        </button>
      </div>

      {/* Connected Emails List */}
      {connectedEmails.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Comptes connectés ({connectedEmails.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {connectedEmails.map((email) => (
              <div key={email.id} className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Mail className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{email.email}</div>
                    <div className="text-sm text-gray-500">
                      {email.provider === 'imap' ? 'Gmail (IMAP)' : 'Microsoft Outlook'}
                      {' • '}
                      Connecté le {new Date(email.created_at).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    email.status === 'active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {email.status === 'active' ? 'Actif' : 'Erreur'}
                  </div>
                  <button
                    onClick={() => handleDeleteEmail(email.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Supprimer cette connexion"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Empty State
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun email connecté
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Connectez votre première boîte mail pour commencer à trier et analyser vos emails automatiquement.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Connecter un compte email
          </button>
        </div>
      )}

      {/* Features Preview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Tri automatique par IA</h3>
          <p className="text-sm text-gray-600">
            Classification intelligente des emails par catégorie et priorité
          </p>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Filtrage des spams</h3>
          <p className="text-sm text-gray-600">
            Élimination automatique des emails publicitaires et indésirables
          </p>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Actions suggérées</h3>
          <p className="text-sm text-gray-600">
            Recommandations personnalisées pour traiter vos emails efficacement
          </p>
        </div>
      </div>

      {/* Modal */}
      <EmailConnectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEmailConnected={handleEmailConnected}
      />
    </div>
  )
}
