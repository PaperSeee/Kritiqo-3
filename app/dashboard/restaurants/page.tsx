'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { 
  PlusIcon,
  MapPinIcon,
  PhoneIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  StarIcon,
  ExclamationCircleIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline'
import { useGoogleBusinessData } from '@/lib/hooks/useGoogleBusinessData'

// Nouveau composant pour l'état vide
function EmptyState() {
  return (
    <div className="text-center py-24 px-6 max-w-xl mx-auto">
      <BuildingStorefrontIcon className="w-12 h-12 text-gray-400 mb-6 mx-auto" />
      
      <h2 className="text-2xl font-semibold text-gray-800 mb-3">
        Connectez un établissement
      </h2>
      
      <p className="text-sm text-gray-600 mb-6 leading-relaxed">
        Commencez à centraliser vos avis Google, Facebook et Trustpilot à un seul endroit 
        pour améliorer votre visibilité en ligne.
      </p>
      
      <Link
        href="/dashboard/restaurants/add"
        className="inline-flex items-center space-x-2 bg-neutral-900 text-white px-6 py-3 rounded-lg hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 sm:w-auto w-full justify-center"
        aria-label="Ajouter votre premier établissement"
      >
        <PlusIcon className="h-4 w-4" />
        <span>Ajouter un établissement</span>
      </Link>

      <div className="mt-10">
        <h3 className="text-sm font-medium text-gray-700 mb-4">
          Voici ce que vous allez débloquer :
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-700">
          <div className="rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow">
            <StarIcon className="w-5 h-5 text-gray-400 mb-2 mx-auto" />
            <p className="font-medium text-gray-800 mb-1">Collecte d'avis</p>
            <p className="text-xs text-gray-500">
              QR codes personnalisés à afficher ou imprimer
            </p>
          </div>
          
          <div className="rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow">
            <CheckCircleIcon className="w-5 h-5 text-gray-400 mb-2 mx-auto" />
            <p className="font-medium text-gray-800 mb-1">Centralisation</p>
            <p className="text-xs text-gray-500">
              Tous vos avis dans un tableau unique
            </p>
          </div>
          
          <div className="rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow">
            <ExclamationCircleIcon className="w-5 h-5 text-gray-400 mb-2 mx-auto" />
            <p className="font-medium text-gray-800 mb-1">Réponses assistées</p>
            <p className="text-xs text-gray-500">
              Répondez avec l'aide de l'IA
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RestaurantsPage() {
  const { data: session } = useSession()
  const { locations, loading, error, refreshing, refresh } = useGoogleBusinessData()

  const getStateIcon = (state: string) => {
    switch (state) {
      case 'VERIFIED':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'UNVERIFIED':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
      default:
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
    }
  }

  const getStateText = (state: string) => {
    switch (state) {
      case 'VERIFIED':
        return 'Vérifié'
      case 'UNVERIFIED':
        return 'Non vérifié'
      default:
        return 'Inconnu'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-neutral-200 rounded w-1/3"></div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-6 h-48 shadow-sm"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-4xl font-bold text-neutral-900 mb-2">
              Mes établissements
            </h1>
            <p className="text-xl text-neutral-600">
              Connectez Google, Facebook, Trustpilot et collectez des avis
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={refresh}
              disabled={refreshing || !session?.accessToken}
              className="inline-flex items-center px-4 py-2 bg-neutral-50 text-neutral-600 border border-neutral-200 rounded-xl hover:bg-neutral-100 hover:border-neutral-300 transition-all duration-200 disabled:opacity-50"
            >
              <ArrowPathIcon className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Actualiser
            </button>
            <Link
              href="/dashboard/restaurants/add"
              className="inline-flex items-center px-6 py-2 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Connecter un établissement
            </Link>
          </div>
        </div>

        {/* Error message - seulement pour les erreurs autres que 404 */}
        {error && !error.includes('404') && !error.includes('trouvé') && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <div className="flex items-start space-x-3">
              <ExclamationCircleIcon className="h-6 w-6 text-red-500 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-red-900 mb-1">
                  Erreur de connexion
                </h3>
                <p className="text-red-700 mb-4">{error}</p>
                {error.includes('expiré') && (
                  <Link
                    href="/dashboard/restaurants/add"
                    className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Se reconnecter à Google Business
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        {/* État vide moderne - affiché si pas d'erreur critique et aucun établissement */}
        {!error || error.includes('404') || error.includes('trouvé') ? (
          locations.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 min-h-[600px] flex items-center justify-center">
              <EmptyState />
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {locations.map((location) => (
                <div
                  key={location.id}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-neutral-900 truncate">
                          {location.name}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          {getStateIcon(location.state)}
                          <span className="text-sm text-neutral-600">
                            {getStateText(location.state)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Address */}
                    {location.address && (
                      <div className="flex items-start space-x-3">
                        <MapPinIcon className="h-4 w-4 text-neutral-400 mt-1 flex-shrink-0" />
                        <span className="text-sm text-neutral-600 line-clamp-2">
                          {location.address}
                        </span>
                      </div>
                    )}

                    {/* Contact info */}
                    <div className="space-y-2">
                      {location.phone && (
                        <div className="flex items-center space-x-3">
                          <PhoneIcon className="h-4 w-4 text-neutral-400" />
                          <span className="text-sm text-neutral-600">
                            {location.phone}
                          </span>
                        </div>
                      )}
                      {location.website && (
                        <div className="flex items-center space-x-3">
                          <GlobeAltIcon className="h-4 w-4 text-neutral-400" />
                          <a
                            href={location.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline truncate"
                          >
                            Site web
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Action button */}
                    <div className="pt-4 border-t border-neutral-100">
                      <Link
                        href={`/dashboard/restaurants/${location.id}/reviews`}
                        className="w-full inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl hover:from-blue-600 hover:to-green-600 transition-all duration-200 text-sm font-medium"
                      >
                        <StarIcon className="h-4 w-4 mr-2" />
                        Gérer les avis
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : null}
      </div>
      
      {/* Styles pour les animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scale-in {
          from {
            transform: scale(0.8);
          }
          to {
            transform: scale(1);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.4s ease-out 0.2s both;
        }
      `}</style>
    </div>
  )
}
