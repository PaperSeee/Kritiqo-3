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
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'
import { useGoogleBusinessData } from '@/lib/hooks/useGoogleBusinessData'

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
              Gérez vos fiches Google Business et collectez des avis
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={refresh}
              disabled={refreshing || !session?.accessToken}
              className="inline-flex items-center px-4 py-2 bg-white text-neutral-700 border border-neutral-300 rounded-xl hover:bg-neutral-50 transition-all duration-200 disabled:opacity-50"
            >
              <ArrowPathIcon className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Actualiser
            </button>
            <Link
              href="/dashboard/restaurants/add"
              className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl hover:from-blue-600 hover:to-green-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Connecter un établissement
            </Link>
          </div>
        </div>

        {/* Error message */}
        {error && (
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

        {/* Locations grid */}
        {!error && locations.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-neutral-200 text-center">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPinIcon className="h-8 w-8 text-neutral-400" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
              Aucune fiche Google Business trouvée
            </h3>
            <p className="text-neutral-600 mb-6 max-w-md mx-auto">
              {session?.accessToken 
                ? "Aucun établissement n'a été trouvé dans votre compte Google Business. Assurez-vous d'avoir créé au moins une fiche d'établissement."
                : "Connectez votre compte Google Business pour commencer à gérer vos avis et améliorer votre présence en ligne."
              }
            </p>
            <Link
              href="/dashboard/restaurants/add"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl hover:from-blue-600 hover:to-green-600 transition-all duration-200 shadow-lg"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Connecter Google Business
            </Link>
          </div>
        ) : !error && (
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
        )}
      </div>
    </div>
  )
}
