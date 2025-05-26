'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import CVUploadForm from '@/components/forms/CVUploadForm'
import { UserIcon, DocumentTextIcon } from '@heroicons/react/24/outline'

export default function ProfilePage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('personal')

  // Helper function to get display name safely
  const getDisplayName = () => {
    if (!user) return ''
    
    // Check user metadata first
    const fullName = user.user_metadata?.full_name || user.user_metadata?.name
    if (fullName) return fullName
    
    // Fallback to email prefix
    if (user.email) {
      return user.email.split('@')[0]
    }
    
    return 'Utilisateur'
  }

  const tabs = [
    {
      id: 'personal',
      name: 'Informations personnelles',
      icon: UserIcon
    },
    {
      id: 'cvs',
      name: 'Mes CVs',
      icon: DocumentTextIcon
    }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Mon Profil
        </h1>
        <p className="text-neutral-600">
          Gérez vos informations personnelles et vos CVs
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-neutral-900 text-neutral-900'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        {activeTab === 'personal' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-neutral-900">
              Informations personnelles
            </h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Nom complet
                </label>
                <input
                  type="text"
                  value={getDisplayName()}
                  readOnly
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-neutral-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  readOnly
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-neutral-50"
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> Pour modifier vos informations personnelles, 
                veuillez nous contacter à{' '}
                <a href="mailto:support@kritiqo.com" className="underline">
                  support@kritiqo.com
                </a>
              </p>
            </div>
          </div>
        )}

        {activeTab === 'cvs' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-neutral-900">
              Gestion des CVs
            </h2>
            
            <CVUploadForm />
          </div>
        )}
      </div>
    </div>
  )
}
