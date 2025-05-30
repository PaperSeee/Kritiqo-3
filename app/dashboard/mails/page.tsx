'use client'

import { useState, useEffect } from 'react'
import { Mail, Plus, AlertCircle, Trash2, Filter, Search, Inbox, RefreshCw } from 'lucide-react'
import EmailConnectionModal from '@/components/EmailConnectionModal'

interface ConnectedEmail {
  id: string
  email: string
  provider: 'imap' | 'microsoft'
  created_at: string
  status: 'active' | 'error'
}

interface EmailData {
  id: string
  subject: string
  from_email: string
  sender_name: string
  date: string
  snippet: string
  category: string
  priority: string
  is_spam: boolean
  account_email: string
}

interface EmailStats {
  [category: string]: number
}

export default function MailsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [connectedEmails, setConnectedEmails] = useState<ConnectedEmail[]>([])
  const [emails, setEmails] = useState<EmailData[]>([])
  const [filteredEmails, setFilteredEmails] = useState<EmailData[]>([])
  const [emailStats, setEmailStats] = useState<EmailStats>({})
  const [loading, setLoading] = useState(true)
  const [loadingEmails, setLoadingEmails] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  
  // Filtres
  const [selectedCategory, setSelectedCategory] = useState('Tous')
  const [selectedAccount, setSelectedAccount] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const categories = ['Tous', 'Avis client', 'Facture', 'Spam/Pub', 'Autre']

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

  const fetchEmails = async () => {
    try {
      setLoadingEmails(true)
      const params = new URLSearchParams()
      if (selectedCategory !== 'Tous') params.set('category', selectedCategory)
      if (selectedAccount) params.set('account', selectedAccount)
      
      const response = await fetch(`/api/email/load?${params}`)
      if (response.ok) {
        const data = await response.json()
        setEmails(data.emails)
        setEmailStats(data.stats)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des emails:', error)
    } finally {
      setLoadingEmails(false)
    }
  }

  const refreshEmails = async () => {
    setRefreshing(true)
    await fetchEmails()
    setRefreshing(false)
  }

  // Filtrer les emails par recherche
  useEffect(() => {
    let filtered = emails
    
    if (searchTerm) {
      filtered = emails.filter(email => 
        email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.from_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.snippet.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    setFilteredEmails(filtered)
  }, [emails, searchTerm])

  useEffect(() => {
    fetchConnectedEmails()
  }, [])

  useEffect(() => {
    if (connectedEmails.length > 0) {
      fetchEmails()
    }
  }, [connectedEmails, selectedCategory, selectedAccount])

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffHours < 1) {
      return 'À l\'instant'
    } else if (diffHours < 24) {
      return `Il y a ${diffHours}h`
    } else if (diffHours < 168) {
      return `Il y a ${Math.floor(diffHours / 24)}j`
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short'
      })
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Avis client': return 'bg-green-50 text-green-700 border-green-200'
      case 'Facture': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'Spam/Pub': return 'bg-red-50 text-red-700 border-red-200'
      case 'Autre': return 'bg-gray-50 text-gray-700 border-gray-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'Urgent': return '🔴'
      case 'Moyen': return '🟡'
      case 'Faible': return '🟢'
      default: return '⚪'
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

      {/* Emails Section */}
      {connectedEmails.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Filtres et recherche */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-gray-900">
                  Emails extraits ({filteredEmails.length})
                </h2>
                <button
                  onClick={refreshEmails}
                  disabled={refreshing}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                  title="Actualiser"
                >
                  <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                {/* Recherche */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                  />
                </div>

                {/* Filtre par catégorie */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat} {emailStats[cat] ? `(${emailStats[cat]})` : ''}
                    </option>
                  ))}
                </select>

                {/* Filtre par compte */}
                {connectedEmails.length > 1 && (
                  <select
                    value={selectedAccount}
                    onChange={(e) => setSelectedAccount(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                  >
                    <option value="">Tous les comptes</option>
                    {connectedEmails.map(account => (
                      <option key={account.id} value={account.email}>
                        {account.email}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* Liste des emails */}
          <div className="divide-y divide-gray-200">
            {loadingEmails ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="text-gray-500 mt-2">Chargement des emails...</p>
              </div>
            ) : filteredEmails.length > 0 ? (
              filteredEmails.map((email) => (
                <div key={email.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-gray-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium text-gray-900 truncate">
                          {email.subject}
                        </h3>
                        <span className="text-lg">{getPriorityIcon(email.priority)}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(email.category)}`}>
                          {email.category}
                        </span>
                        {email.is_spam && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                            Spam
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {email.snippet}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>De: {email.sender_name || email.from_email}</span>
                        <span>•</span>
                        <span>{formatDate(email.date)}</span>
                        <span>•</span>
                        <span>{email.account_email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <Inbox className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || selectedCategory !== 'Tous' ? 'Aucun email trouvé' : 'Aucun email extrait'}
                </h3>
                <p className="text-gray-500">
                  {searchTerm || selectedCategory !== 'Tous' 
                    ? 'Essayez de modifier vos filtres de recherche'
                    : 'Les emails seront extraits automatiquement après connexion de vos comptes'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal */}
      <EmailConnectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEmailConnected={handleEmailConnected}
      />
    </div>
  )
}
