'use client'

import { useState, useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { FunnelIcon, InboxIcon, EnvelopeIcon } from '@heroicons/react/24/outline'
import { ExclamationTriangleIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/solid'

// Type Email uniforme
type Email = {
  id: string | number;
  category: string;
  subject: string;
  sender: string;
  date: string;
  priority: string;
  tags: string[];
  preview: string;
  read: boolean;
  source?: string;
}

const categories = ['Tous', 'Facture', 'RH', 'Client', 'Admin']
const priorities = ['Tous', 'high', 'medium', 'low']

// Auto-categorization function
const categorizeEmail = (subject: string, sender: string): string => {
  const subjectLower = subject.toLowerCase()
  const senderLower = sender.toLowerCase()
  
  // Facture keywords
  if (subjectLower.includes('facture') || subjectLower.includes('invoice') || 
      subjectLower.includes('payment') || subjectLower.includes('billing') ||
      senderLower.includes('billing') || senderLower.includes('invoice')) {
    return 'Facture'
  }
  
  // RH keywords
  if (subjectLower.includes('candidature') || subjectLower.includes('cv') ||
      subjectLower.includes('recrutement') || subjectLower.includes('congés') ||
      subjectLower.includes('rh') || senderLower.includes('rh')) {
    return 'RH'
  }
  
  // Client keywords
  if (subjectLower.includes('question') || subjectLower.includes('support') ||
      subjectLower.includes('aide') || subjectLower.includes('problème') ||
      subjectLower.includes('réclamation') || subjectLower.includes('commande')) {
    return 'Client'
  }
  
  // Admin keywords
  if (subjectLower.includes('sécurité') || subjectLower.includes('notification') ||
      subjectLower.includes('mise à jour') || subjectLower.includes('système') ||
      senderLower.includes('admin') || senderLower.includes('noreply')) {
    return 'Admin'
  }
  
  return 'Client' // Default category
}

const assignPriority = (subject: string): string => {
  const subjectLower = subject.toLowerCase()
  
  if (subjectLower.includes('urgent') || subjectLower.includes('important') || 
      subjectLower.includes('asap') || subjectLower.includes('immédiat')) {
    return 'high'
  }
  
  if (subjectLower.includes('facture') || subjectLower.includes('réclamation')) {
    return 'medium'
  }
  
  return 'low'
}

const extractTags = (subject: string, category: string): string[] => {
  const tags = [category.toLowerCase()]
  const subjectLower = subject.toLowerCase()
  
  if (subjectLower.includes('urgent')) tags.push('urgent')
  if (subjectLower.includes('facture')) tags.push('facture')
  if (subjectLower.includes('commande')) tags.push('commande')
  if (subjectLower.includes('support')) tags.push('support')
  
  return tags
}

function PriorityBadge({ priority }: { priority: string }) {
  const config = {
    high: { icon: ExclamationTriangleIcon, color: 'text-red-600 bg-red-100' },
    medium: { icon: ClockIcon, color: 'text-yellow-600 bg-yellow-100' },
    low: { icon: CheckCircleIcon, color: 'text-green-600 bg-green-100' }
  }
  
  const { icon: Icon, color } = config[priority as keyof typeof config]
  
  return (
    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${color}`}>
      <Icon className="h-3 w-3 mr-1" />
      {priority === 'high' ? 'Urgent' : priority === 'medium' ? 'Normal' : 'Faible'}
    </div>
  )
}

function CategoryBadge({ category }: { category: string }) {
  const colors = {
    Facture: 'bg-blue-100 text-blue-800',
    RH: 'bg-purple-100 text-purple-800',
    Client: 'bg-green-100 text-green-800',
    Admin: 'bg-gray-100 text-gray-800'
  }
  
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[category as keyof typeof colors]}`}>
      {category}
    </span>
  )
}

export default function MailsPage() {
  const { data: session, status } = useSession()
  const [selectedCategory, setSelectedCategory] = useState('Tous')
  const [selectedPriority, setSelectedPriority] = useState('Tous')
  const [allEmails, setAllEmails] = useState<Email[]>([])
  const [isLoadingEmails, setIsLoadingEmails] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [connectedServices, setConnectedServices] = useState<{gmail: boolean, microsoft: boolean}>({
    gmail: false,
    microsoft: false
  })

  const fetchGmailEmails = async () => {
    if (!session?.accessToken) return

    setIsLoadingEmails(true)
    setEmailError(null)
    
    try {
      const response = await fetch('/api/gmail/emails', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la récupération des emails')
      }

      const data = await response.json()
      
      // Convertir les emails Gmail au format Email
      const formattedGmailEmails: Email[] = data.emails.map((email: any) => ({
        id: `gmail_${email.id}`,
        category: categorizeEmail(email.subject, email.sender),
        subject: email.subject,
        sender: email.sender,
        date: email.date,
        priority: assignPriority(email.subject),
        tags: extractTags(email.subject, categorizeEmail(email.subject, email.sender)),
        preview: email.preview,
        read: false,
        source: 'gmail'
      }))

      setAllEmails(formattedGmailEmails)
      setConnectedServices(prev => ({ ...prev, gmail: true }))
    } catch (error) {
      console.error('Erreur lors de la récupération des emails Gmail:', error)
      setEmailError(error instanceof Error ? error.message : 'Erreur inconnue')
    } finally {
      setIsLoadingEmails(false)
    }
  }

  const fetchMicrosoftEmails = async () => {
    if (!session?.accessToken || session?.provider !== 'azure-ad') return

    setIsLoadingEmails(true)
    setEmailError(null)
    
    try {
      const response = await fetch('/api/microsoft/emails', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la récupération des emails Microsoft')
      }

      const data = await response.json()
      
      // Convertir les emails Microsoft au format Email
      const formattedMicrosoftEmails: Email[] = data.emails.map((email: any) => ({
        id: `microsoft_${email.id}`,
        category: categorizeEmail(email.subject, email.sender),
        subject: email.subject,
        sender: email.sender,
        date: email.date,
        priority: assignPriority(email.subject),
        tags: extractTags(email.subject, categorizeEmail(email.subject, email.sender)),
        preview: email.preview,
        read: false,
        source: 'microsoft'
      }))

      setAllEmails(prev => [...prev.filter(e => e.source !== 'microsoft'), ...formattedMicrosoftEmails])
      setConnectedServices(prev => ({ ...prev, microsoft: true }))
    } catch (error) {
      console.error('Erreur lors de la récupération des emails Microsoft:', error)
      setEmailError(error instanceof Error ? error.message : 'Erreur inconnue')
    } finally {
      setIsLoadingEmails(false)
    }
  }

  useEffect(() => {
    if (session?.accessToken) {
      if (session?.provider === 'google') {
        fetchGmailEmails()
        setConnectedServices(prev => ({ ...prev, gmail: true }))
      } else if (session?.provider === 'azure-ad') {
        fetchMicrosoftEmails()
        setConnectedServices(prev => ({ ...prev, microsoft: true }))
      }
    }
  }, [session])

  const handleGmailConnect = () => {
    signIn('google')
  }

  const handleMicrosoftConnect = () => {
    signIn('azure-ad')
  }

  const handleDisconnect = () => {
    signOut()
    setAllEmails([])
    setConnectedServices({ gmail: false, microsoft: false })
  }

  const refreshEmails = () => {
    if (session?.provider === 'google') {
      fetchGmailEmails()
    } else if (session?.provider === 'azure-ad') {
      fetchMicrosoftEmails()
    }
  }

  const filteredEmails = allEmails.filter(email => {
    const matchesCategory = selectedCategory === 'Tous' || email.category === selectedCategory
    const matchesPriority = selectedPriority === 'Tous' || email.priority === selectedPriority
    
    return matchesCategory && matchesPriority
  })

  const emailsByCategory = categories.slice(1).map(category => ({
    category,
    count: allEmails.filter(email => email.category === category).length
  }))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Gestion des Emails
        </h1>
        <p className="text-neutral-600">
          Organisez et gérez vos emails Gmail et Outlook par catégorie automatiquement
        </p>
      </div>

      {/* Connection Status */}
      {status === 'loading' ? (
        <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-neutral-400 rounded-full animate-pulse"></div>
            <span className="text-neutral-600">Vérification des connexions...</span>
          </div>
        </div>
      ) : !session ? (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  📩 Connecter votre boîte Gmail
                </h3>
                <p className="text-blue-700">
                  Synchronisez automatiquement vos emails Gmail et catégorisez-les intelligemment
                </p>
              </div>
              <button
                onClick={handleGmailConnect}
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <EnvelopeIcon className="h-5 w-5" />
                <span>Connecter Gmail</span>
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-orange-900 mb-2">
                  📧 Connecter votre boîte Outlook/Hotmail
                </h3>
                <p className="text-orange-700">
                  Synchronisez vos emails Microsoft Outlook, Hotmail et Office 365
                </p>
              </div>
              <button
                onClick={handleMicrosoftConnect}
                className="inline-flex items-center space-x-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
              >
                <span className="text-xl font-bold">O</span>
                <span>Connecter Outlook</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {session.provider === 'google' && (
            <div className="bg-green-50 rounded-xl border border-green-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-800 font-medium">Gmail connecté</span>
                  <span className="text-green-600 text-sm">
                    • {session.user?.email}
                  </span>
                  <span className="text-green-600 text-sm">
                    • {allEmails.filter(e => e.source === 'gmail').length} emails synchronisés
                  </span>
                  {isLoadingEmails && (
                    <span className="text-green-600 text-sm">• Synchronisation en cours...</span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={refreshEmails}
                    disabled={isLoadingEmails}
                    className="text-sm text-green-700 hover:text-green-900 underline disabled:opacity-50"
                  >
                    {isLoadingEmails ? 'Synchronisation...' : 'Actualiser'}
                  </button>
                  <button
                    onClick={handleDisconnect}
                    className="text-sm text-green-700 hover:text-green-900 underline"
                  >
                    Déconnecter
                  </button>
                </div>
              </div>
            </div>
          )}

          {session.provider === 'azure-ad' && (
            <div className="bg-orange-50 rounded-xl border border-orange-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-orange-800 font-medium">Outlook connecté</span>
                  <span className="text-orange-600 text-sm">
                    • {session.user?.email}
                  </span>
                  <span className="text-orange-600 text-sm">
                    • {allEmails.filter(e => e.source === 'microsoft').length} emails synchronisés
                  </span>
                  {isLoadingEmails && (
                    <span className="text-orange-600 text-sm">• Synchronisation en cours...</span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={refreshEmails}
                    disabled={isLoadingEmails}
                    className="text-sm text-orange-700 hover:text-orange-900 underline disabled:opacity-50"
                  >
                    {isLoadingEmails ? 'Synchronisation...' : 'Actualiser'}
                  </button>
                  <button
                    onClick={handleDisconnect}
                    className="text-sm text-orange-700 hover:text-orange-900 underline"
                  >
                    Déconnecter
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {emailError && (
            <div className="bg-red-50 rounded-xl border border-red-200 p-4">
              <div className="flex items-center space-x-2">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                <span className="text-red-800 text-sm">Erreur: {emailError}</span>
                <button
                  onClick={refreshEmails}
                  className="text-sm text-red-700 hover:text-red-900 underline ml-auto"
                >
                  Réessayer
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Statistiques par catégorie - Only show when connected */}
      {session && allEmails.length > 0 && (
        <div className="grid gap-6 md:grid-cols-4">
          {emailsByCategory.map(({ category, count }) => (
            <div key={category} className="bg-white p-6 rounded-xl border border-neutral-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-neutral-800 mb-1">{category}</h3>
                  <p className="text-2xl font-bold text-neutral-900">{count}</p>
                </div>
                <InboxIcon className="h-8 w-8 text-neutral-400" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filtres - Only show when emails are available */}
      {session && allEmails.length > 0 && (
        <div className="bg-white p-6 rounded-xl border border-neutral-200">
          <div className="flex gap-4">
            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-5 w-5 text-neutral-500" />
              <select
                className="border border-neutral-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <select
              className="border border-neutral-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
            >
              {priorities.map(priority => (
                <option key={priority} value={priority}>
                  {priority === 'Tous' ? 'Toutes priorités' : 
                   priority === 'high' ? 'Urgent' :
                   priority === 'medium' ? 'Normal' : 'Faible'}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Liste des emails - Only show when emails are available */}
      {session && allEmails.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
          <div className="p-6 border-b border-neutral-200">
            <h2 className="text-xl font-semibold text-neutral-800">
              Emails ({filteredEmails.length})
            </h2>
          </div>
          
          <div className="divide-y divide-neutral-200">
            {filteredEmails.map((email) => (
              <div key={email.id} className={`p-6 hover:bg-neutral-50 cursor-pointer transition-colors ${!email.read ? 'bg-blue-50/30' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <CategoryBadge category={email.category} />
                      <PriorityBadge priority={email.priority} />
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        email.source === 'gmail' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {email.source === 'gmail' ? 'Gmail' : 'Outlook'}
                      </span>
                      {!email.read && (
                        <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                      )}
                    </div>
                    
                    <h3 className={`text-lg font-medium text-neutral-900 mb-1 ${!email.read ? 'font-semibold' : ''}`}>
                      {email.subject}
                    </h3>
                    
                    <p className="text-sm text-neutral-600 mb-2">
                      De: {email.sender}
                    </p>
                    
                    <p className="text-neutral-700 text-sm leading-relaxed mb-3">
                      {email.preview}
                    </p>
                    
                    <div className="flex items-center space-x-2">
                      {email.tags.map(tag => (
                        <span key={tag} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-neutral-100 text-neutral-800">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="ml-4 text-right">
                    <p className="text-sm text-neutral-500">
                      {new Date(email.date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredEmails.length === 0 && (
            <div className="p-12 text-center">
              <InboxIcon className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-500">Aucun email trouvé avec ces critères</p>
            </div>
          )}
        </div>
      )}

      {/* Show message when no emails and connected */}
      {session && allEmails.length === 0 && !isLoadingEmails && (
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
          <div className="p-12 text-center">
            <InboxIcon className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500">Aucun email trouvé dans votre boîte Gmail</p>
          </div>
        </div>
      )}
    </div>
  )
}
