'use client'

import { useState } from 'react'
import { MagnifyingGlassIcon, FunnelIcon, InboxIcon } from '@heroicons/react/24/outline'
import { ExclamationTriangleIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/solid'

// Types d'emails simulés
const mockEmails = [
  {
    id: 1,
    category: 'Facture',
    subject: 'Facture #2024-001 - Règlement en attente',
    sender: 'comptabilite@exemple.fr',
    date: '2024-01-15',
    priority: 'high',
    tags: ['facture', 'urgent'],
    preview: 'Votre facture du 10 janvier est en attente de règlement...',
    read: false
  },
  {
    id: 2,
    category: 'RH',
    subject: 'Demande de congés - Marie Dupont',
    sender: 'marie.dupont@entreprise.fr',
    date: '2024-01-14',
    priority: 'medium',
    tags: ['congés', 'rh'],
    preview: 'Je souhaiterais poser mes congés du 1er au 15 février...',
    read: true
  },
  {
    id: 3,
    category: 'Client',
    subject: 'Question sur votre service - Satisfaction client',
    sender: 'client@exemple.com',
    date: '2024-01-13',
    priority: 'medium',
    tags: ['support', 'question'],
    preview: 'Bonjour, j\'aurais quelques questions concernant...',
    read: false
  },
  {
    id: 4,
    category: 'Admin',
    subject: 'Mise à jour système prévue ce weekend',
    sender: 'admin@kritiqo.fr',
    date: '2024-01-12',
    priority: 'low',
    tags: ['système', 'maintenance'],
    preview: 'Une maintenance système est prévue samedi...',
    read: true
  },
  {
    id: 5,
    category: 'Facture',
    subject: 'Facture #2024-002 - Payée',
    sender: 'comptabilite@exemple.fr',
    date: '2024-01-11',
    priority: 'low',
    tags: ['facture', 'payée'],
    preview: 'Nous accusons réception de votre paiement...',
    read: true
  },
  {
    id: 6,
    category: 'Client',
    subject: 'Réclamation - Commande #12345',
    sender: 'client2@exemple.com',
    date: '2024-01-10',
    priority: 'high',
    tags: ['réclamation', 'urgent'],
    preview: 'Ma commande n\'est pas conforme à ce qui était prévu...',
    read: false
  }
]

const categories = ['Tous', 'Facture', 'RH', 'Client', 'Admin']
const priorities = ['Tous', 'high', 'medium', 'low']

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
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Tous')
  const [selectedPriority, setSelectedPriority] = useState('Tous')

  const filteredEmails = mockEmails.filter(email => {
    const matchesSearch = email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'Tous' || email.category === selectedCategory
    const matchesPriority = selectedPriority === 'Tous' || email.priority === selectedPriority
    
    return matchesSearch && matchesCategory && matchesPriority
  })

  const emailsByCategory = categories.slice(1).map(category => ({
    category,
    count: mockEmails.filter(email => email.category === category).length
  }))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Gestion des Emails
        </h1>
        <p className="text-neutral-600">
          Organisez et gérez vos emails par catégorie automatiquement
        </p>
      </div>

      {/* Statistiques par catégorie */}
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

      {/* Filtres et recherche */}
      <div className="bg-white p-6 rounded-xl border border-neutral-200">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Recherche */}
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Rechercher par sujet, expéditeur ou tag..."
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Filtres */}
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
      </div>

      {/* Liste des emails */}
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
    </div>
  )
}
