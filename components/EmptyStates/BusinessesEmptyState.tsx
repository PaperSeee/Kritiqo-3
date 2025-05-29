'use client'

import Link from 'next/link'
import { BuildingStorefrontIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

export default function BusinessesEmptyState() {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div className="text-center py-20 max-w-md mx-auto">
      <BuildingStorefrontIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      
      <div className="flex items-center justify-center space-x-2 mb-2">
        <h2 className="text-xl font-semibold text-gray-800">
          Aucune source d'avis connectée
        </h2>
        <div className="relative">
          <button
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <QuestionMarkCircleIcon className="w-4 h-4" />
          </button>
          
          {showTooltip && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-10">
              Centralisez vos avis pour mieux gérer votre réputation
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
            </div>
          )}
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-6">
        Connectez un établissement ou une plateforme comme Google, Facebook ou Trustpilot pour centraliser vos retours clients.
      </p>
      
      <Link 
        href="/dashboard/businesses/new"
        className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <BuildingStorefrontIcon className="w-4 h-4" />
        <span>Connecter une source</span>
      </Link>
    </div>
  )
}
