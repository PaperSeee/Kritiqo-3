'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeftIcon, 
  CheckCircleIcon,
  StarIcon,
  QrCodeIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'
import ConnectGoogleBusinessButton from '@/components/ConnectGoogleBusinessButton'
import ConnectFacebookButton from '@/components/ConnectFacebookButton'

export default function AddRestaurantPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)

  const platforms = [
    {
      id: 'google',
      name: 'Google Business',
      description: 'Connectez votre fiche Google My Business pour collecter des avis Google',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600',
      benefits: ['Avis Google', 'Visibilité locale', 'Photos et infos']
    },
    {
      id: 'facebook',
      name: 'Facebook Business',
      description: 'Connectez votre page Facebook pour gérer vos avis et recommandations',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-white">
          <path
            fill="currentColor"
            d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
          />
        </svg>
      ),
      color: 'from-[#1877F2] to-[#166FE5]',
      benefits: ['Avis Facebook', 'Recommandations', 'Posts et photos']
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard"
            className="p-3 text-neutral-500 hover:text-neutral-700 hover:bg-white rounded-xl transition-all duration-200 shadow-sm"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-neutral-900 mb-2">
              Connecter votre établissement
            </h1>
            <p className="text-xl text-neutral-600">
              Choisissez les plateformes pour collecter vos avis clients
            </p>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-neutral-500">Étape 1 sur 3</span>
            <span className="text-sm text-neutral-400">Connexion des plateformes</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full w-1/3 transition-all duration-500"></div>
          </div>
        </div>

        {/* Platform selection */}
        <div className="grid gap-6 md:grid-cols-2">
          {platforms.map((platform) => (
            <div
              key={platform.id}
              className={`bg-white rounded-2xl p-8 shadow-sm border-2 transition-all duration-300 hover:shadow-lg ${
                selectedPlatform === platform.id
                  ? 'border-blue-500 ring-4 ring-blue-100'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <div className="space-y-6">
                {/* Platform header */}
                <div className="flex items-center space-x-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${platform.color} flex items-center justify-center shadow-lg`}>
                    {platform.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900">
                      {platform.name}
                    </h3>
                    <p className="text-neutral-600 text-sm">
                      {platform.description}
                    </p>
                  </div>
                </div>

                {/* Benefits */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-neutral-800 text-sm">
                    Fonctionnalités incluses :
                  </h4>
                  <div className="space-y-2">
                    {platform.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircleIcon className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-neutral-600">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Connect button */}
                <div className="pt-4">
                  {platform.id === 'google' ? (
                    <ConnectGoogleBusinessButton />
                  ) : (
                    <ConnectFacebookButton />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info section */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 border border-blue-200">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <ExclamationCircleIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                🎯 Pourquoi connecter vos plateformes ?
              </h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center space-x-3">
                  <StarIcon className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm text-neutral-700">Centralisez tous vos avis</span>
                </div>
                <div className="flex items-center space-x-3">
                  <QrCodeIcon className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-neutral-700">Générez des QR codes</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-blue-500" />
                  <span className="text-sm text-neutral-700">Répondez rapidement</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next steps preview */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
          <h3 className="font-semibold text-neutral-800 mb-4">Prochaines étapes :</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center space-x-3 p-4 bg-neutral-50 rounded-xl">
              <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center text-sm font-bold text-neutral-600">
                2
              </div>
              <span className="text-sm text-neutral-700">Configuration des infos</span>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-neutral-50 rounded-xl">
              <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center text-sm font-bold text-neutral-600">
                3
              </div>
              <span className="text-sm text-neutral-700">Génération du QR code</span>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
              <CheckCircleIcon className="h-6 w-6 text-green-500" />
              <span className="text-sm text-neutral-700 font-medium">Prêt à collecter !</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
