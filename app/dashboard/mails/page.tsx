'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { FunnelIcon, InboxIcon } from '@heroicons/react/24/outline'
import { ExclamationTriangleIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/solid'
import EmailAccountSwitcher from '@/components/EmailAccountSwitcher'

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
  accountEmail?: string;
  accountProvider?: string;
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
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null)
  const [allEmails, setAllEmails] = useState<Email[]>([])
  const [isLoadingEmails, setIsLoadingEmails] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)

  const fetchEmails = async () => {
    if (!session) return

    setIsLoadingEmails(true)
    setEmailError(null)
    
    try {
      const params = new URLSearchParams()
      if (selectedEmail) {
        params.append('email', selectedEmail)
      }

      const response = await fetch(`/api/emails?${params.toString()}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la récupération des emails')
      }

      const data = await response.json()
      
      // Formatter les emails
      const formattedEmails: Email[] = data.emails.map((email: any) => ({
        id: email.id,
        category: categorizeEmail(email.subject, email.sender),
        subject: email.subject,
        sender: email.sender,
        date: email.date,
        priority: assignPriority(email.subject),
        tags: extractTags(email.subject, categorizeEmail(email.subject, email.sender)),
        preview: email.preview,
        read: false,
        source: email.source,
        accountEmail: email.accountEmail,
        accountProvider: email.accountProvider
      }))

      setAllEmails(formattedEmails)
    } catch (error) {
      console.error('Erreur lors de la récupération des emails:', error)
      setEmailError(error instanceof Error ? error.message : 'Erreur inconnue')
    } finally {
      setIsLoadingEmails(false)
    }
  }

  useEffect(() => {
    if (session) {
      fetchEmails()
    }
  }, [session, selectedEmail])

  const handleEmailChange = (email: string | null) => {
    setSelectedEmail(email)
  }

  const handleEmailsUpdate = () => {
    fetchEmails()
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

      {/* Email Account Switcher */}
      {status !== 'loading' && (
        <div className="bg-white p-6 rounded-xl border border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-800 mb-4">
            Comptes Email
          </h3>
          <EmailAccountSwitcher
            selectedEmail={selectedEmail}
            onEmailChange={handleEmailChange}
            onEmailsUpdate={handleEmailsUpdate}
          />
        </div>
      )}

      {/* Loading State */}
      {status === 'loading' && (
        <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-neutral-400 rounded-full animate-pulse"></div>
            <span className="text-neutral-600">Chargement...</span>
          </div>
        </div>
      )}

      {/* Error Display */}
      {emailError && (
        <div className="bg-red-50 rounded-xl border border-red-200 p-4">
          <div className="flex items-center space-x-2">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
            <span className="text-red-800 text-sm">Erreur: {emailError}</span>
            <button
              onClick={fetchEmails}
              className="text-sm text-red-700 hover:text-red-900 underline ml-auto"
            >
              Réessayer
            </button>
          </div>
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
            <p className="text-neutral-500">
              Aucun email trouvé dans votre boîte {session.provider === 'google' ? 'Gmail' : 'Outlook'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
