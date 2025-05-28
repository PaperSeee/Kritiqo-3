'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeftIcon, 
  ArrowRightIcon,
  CheckCircleIcon,
  StarIcon,
  QrCodeIcon,
  ExclamationCircleIcon,
  BuildingStorefrontIcon,
  MapPinIcon,
  PhoneIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'
import ConnectGoogleBusinessButton from '@/components/ConnectGoogleBusinessButton'
import ConnectFacebookButton from '@/components/ConnectFacebookButton'
import ConnectTrustpilotButton from '@/components/ConnectTrustpilotButton'

type Step = 'info' | 'platforms' | 'confirmation'

interface RestaurantInfo {
  name: string
  address: string
  phone: string
  website: string
  description: string
}

interface ConnectedPlatforms {
  google: boolean
  facebook: boolean
  trustpilot: boolean
}

export default function AddRestaurantPage() {
  const [currentStep, setCurrentStep] = useState<Step>('info')
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo>({
    name: '',
    address: '',
    phone: '',
    website: '',
    description: ''
  })
  const [connectedPlatforms, setConnectedPlatforms] = useState<ConnectedPlatforms>({
    google: false,
    facebook: false,
    trustpilot: false
  })

  const steps = [
    { id: 'info', name: 'Informations', description: 'Détails de votre établissement' },
    { id: 'platforms', name: 'Plateformes', description: 'Connexion des avis' },
    { id: 'confirmation', name: 'Confirmation', description: 'Finalisation' }
  ]

  const platforms = [
    {
      id: 'google',
      name: 'Google Business',
      description: 'Avis Google My Business - La plateforme la plus utilisée',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      ),
      color: 'from-blue-500 to-blue-600',
      priority: 'Recommandé',
      benefits: ['Visibilité maximale', 'Référencement local', 'Photos et infos']
    },
    {
      id: 'facebook',
      name: 'Facebook',
      description: 'Avis et recommandations Facebook - Réseau social populaire',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-white">
          <path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      color: 'from-[#1877F2] to-[#166FE5]',
      priority: 'Populaire',
      benefits: ['Partage social', 'Recommandations', 'Engagement client']
    },
    {
      id: 'trustpilot',
      name: 'Trustpilot',
      description: 'Avis Trustpilot - Plateforme de confiance internationale',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6">
          <path fill="#00B67A" d="M12 2L14.09 8.26L22 8.26L15.95 13.14L18.18 19.5L12 15.77L5.82 19.5L8.05 13.14L2 8.26L9.91 8.26L12 2Z"/>
        </svg>
      ),
      color: 'from-[#00B67A] to-[#00A069]',
      priority: 'International',
      benefits: ['Crédibilité élevée', 'Portée internationale', 'Avis détaillés']
    }
  ]

  const currentStepIndex = steps.findIndex(step => step.id === currentStep)
  const hasConnectedPlatform = Object.values(connectedPlatforms).some(connected => connected)

  const handleNext = () => {
    if (currentStep === 'info' && restaurantInfo.name && restaurantInfo.address) {
      setCurrentStep('platforms')
    } else if (currentStep === 'platforms' && hasConnectedPlatform) {
      setCurrentStep('confirmation')
    }
  }

  const handleBack = () => {
    if (currentStep === 'platforms') {
      setCurrentStep('info')
    } else if (currentStep === 'confirmation') {
      setCurrentStep('platforms')
    }
  }

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
              Ajouter votre établissement
            </h1>
            <p className="text-xl text-neutral-600">
              Configurez votre restaurant en quelques étapes simples
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
          <div className="flex items-center justify-between mb-6">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center space-x-3 ${
                  index <= currentStepIndex ? 'text-blue-600' : 'text-neutral-400'
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    index < currentStepIndex 
                      ? 'bg-green-500 text-white' 
                      : index === currentStepIndex
                      ? 'bg-blue-500 text-white'
                      : 'bg-neutral-200 text-neutral-400'
                  }`}>
                    {index < currentStepIndex ? (
                      <CheckCircleIcon className="h-6 w-6" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="hidden md:block">
                    <div className="font-semibold">{step.name}</div>
                    <div className="text-sm text-neutral-500">{step.description}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-4 rounded ${
                    index < currentStepIndex ? 'bg-green-500' : 'bg-neutral-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 'info' && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-200">
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <BuildingStorefrontIcon className="h-8 w-8 text-blue-600" />
                <h2 className="text-2xl font-bold text-neutral-900">
                  Informations de votre établissement
                </h2>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Nom du restaurant *
                  </label>
                  <input
                    type="text"
                    value={restaurantInfo.name}
                    onChange={(e) => setRestaurantInfo(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Restaurant Le Gourmet"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Adresse complète *
                  </label>
                  <div className="relative">
                    <MapPinIcon className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                    <input
                      type="text"
                      value={restaurantInfo.address}
                      onChange={(e) => setRestaurantInfo(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="123 Rue de la Paix, 75001 Paris"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Téléphone
                  </label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                    <input
                      type="tel"
                      value={restaurantInfo.phone}
                      onChange={(e) => setRestaurantInfo(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="01 23 45 67 89"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Site web
                  </label>
                  <div className="relative">
                    <GlobeAltIcon className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                    <input
                      type="url"
                      value={restaurantInfo.website}
                      onChange={(e) => setRestaurantInfo(prev => ({ ...prev, website: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://mon-restaurant.fr"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Description (optionnel)
                  </label>
                  <textarea
                    value={restaurantInfo.description}
                    onChange={(e) => setRestaurantInfo(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Décrivez brièvement votre restaurant, votre cuisine, votre ambiance..."
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'platforms' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-center space-x-3">
                <ExclamationCircleIcon className="h-6 w-6 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-neutral-900">
                    Connectez au moins une plateforme pour continuer
                  </h3>
                  <p className="text-sm text-neutral-600">
                    Vous pourrez toujours en ajouter d'autres plus tard dans les paramètres.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              {platforms.map((platform) => (
                <div
                  key={platform.id}
                  className={`bg-white rounded-2xl p-6 shadow-sm border-2 transition-all duration-300 ${
                    connectedPlatforms[platform.id as keyof ConnectedPlatforms]
                      ? 'border-green-500 ring-4 ring-green-100'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${platform.color} flex items-center justify-center shadow-lg`}>
                        {platform.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-bold text-neutral-900">
                            {platform.name}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            platform.priority === 'Recommandé' 
                              ? 'bg-blue-100 text-blue-700'
                              : platform.priority === 'Populaire'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {platform.priority}
                          </span>
                        </div>
                        <p className="text-neutral-600 text-sm mb-3">
                          {platform.description}
                        </p>
                        <div className="flex items-center space-x-4">
                          {platform.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center space-x-1">
                              <CheckCircleIcon className="h-4 w-4 text-green-500" />
                              <span className="text-xs text-neutral-600">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      {connectedPlatforms[platform.id as keyof ConnectedPlatforms] ? (
                        <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-xl">
                          <CheckCircleIcon className="h-5 w-5" />
                          <span className="font-medium">Connecté</span>
                        </div>
                      ) : (
                        <div className="w-48">
                          {platform.id === 'google' && <ConnectGoogleBusinessButton />}
                          {platform.id === 'facebook' && <ConnectFacebookButton />}
                          {platform.id === 'trustpilot' && <ConnectTrustpilotButton />}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 'confirmation' && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-200">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircleIcon className="h-10 w-10 text-green-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-neutral-900 mb-2">
                  Félicitations ! 🎉
                </h2>
                <p className="text-lg text-neutral-600">
                  Votre établissement "{restaurantInfo.name}" est configuré
                </p>
              </div>

              <div className="bg-neutral-50 rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-neutral-900">Récapitulatif :</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Nom :</span>
                    <span className="font-medium">{restaurantInfo.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Adresse :</span>
                    <span className="font-medium">{restaurantInfo.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Plateformes connectées :</span>
                    <span className="font-medium">
                      {Object.entries(connectedPlatforms)
                        .filter(([_, connected]) => connected)
                        .map(([platform]) => platform)
                        .join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Link
                  href="/dashboard"
                  className="w-full inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-green-700 transition-all duration-200 transform hover:scale-[1.02]"
                >
                  Aller au tableau de bord
                </Link>
                <Link
                  href="/dashboard/qr-codes"
                  className="w-full inline-flex items-center justify-center px-8 py-4 bg-neutral-100 text-neutral-700 font-medium rounded-xl hover:bg-neutral-200 transition-all duration-200"
                >
                  Générer mon QR code
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 'info'}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              currentStep === 'info'
                ? 'text-neutral-400 cursor-not-allowed'
                : 'text-neutral-600 hover:text-neutral-800 hover:bg-white'
            }`}
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Précédent</span>
          </button>

          {currentStep !== 'confirmation' && (
            <button
              onClick={handleNext}
              disabled={
                (currentStep === 'info' && (!restaurantInfo.name || !restaurantInfo.address)) ||
                (currentStep === 'platforms' && !hasConnectedPlatform)
              }
              className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-medium transition-all duration-200 ${
                (currentStep === 'info' && (!restaurantInfo.name || !restaurantInfo.address)) ||
                (currentStep === 'platforms' && !hasConnectedPlatform)
                  ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-[1.02]'
              }`}
            >
              <span>
                {currentStep === 'info' ? 'Connecter les plateformes' : 'Finaliser'}
              </span>
              <ArrowRightIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
