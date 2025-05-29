'use client'

import { 
  MagnifyingGlassIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  GlobeAltIcon,
  ExclamationTriangleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

const platforms = [
  {
    name: 'Instagram',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6">
        <path fill="currentColor" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
    color: 'from-pink-500 to-purple-600'
  },
  {
    name: 'Google',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    ),
    color: 'from-blue-500 to-blue-600'
  },
  {
    name: 'X (Twitter)',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 text-white">
        <path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    color: 'from-gray-800 to-black'
  },
  {
    name: 'Facebook',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 text-white">
        <path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    color: 'from-blue-600 to-blue-700'
  },
  {
    name: 'TikTok',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 text-white">
        <path fill="currentColor" d="M19.321 5.562a5.124 5.124 0 0 1-.443-.258 6.228 6.228 0 0 1-1.137-.966c-.849-.849-1.248-1.79-1.413-2.338h-3.006v11.723a3.069 3.069 0 1 1-1.259-2.473V8.539a5.763 5.763 0 0 0-1.259-.139C9.456 8.4 8 9.856 8 11.723s1.456 3.323 3.323 3.323 3.323-1.456 3.323-3.323V7.342c.849.566 1.79.849 2.738.849h.566V5.562h1.371z"/>
      </svg>
    ),
    color: 'from-red-500 to-black'
  },
  {
    name: 'LinkedIn',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 text-white">
        <path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    color: 'from-blue-700 to-blue-800'
  }
]

const features = [
  {
    icon: MagnifyingGlassIcon,
    title: 'Surveillance en temps réel',
    description: 'Détection automatique de nouvelles mentions sur toutes les plateformes'
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: 'Analyse de sentiment',
    description: 'Classification automatique des mentions en positives, négatives ou neutres'
  },
  {
    icon: EyeIcon,
    title: 'Alertes intelligentes',
    description: 'Notifications instantanées pour les mentions importantes ou critiques'
  },
  {
    icon: GlobeAltIcon,
    title: 'Vue d\'ensemble globale',
    description: 'Tableau de bord unifié pour tous vos canaux de communication'
  }
]

export default function MentionsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-neutral-900 mb-2">
          Veille & Mentions
        </h1>
        <p className="text-xl text-neutral-600">
          Surveillez ce que l'on dit de votre établissement sur le web
        </p>
      </div>

      {/* Coming Soon Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ClockIcon className="h-10 w-10 text-amber-600" />
          </div>
          <h2 className="text-3xl font-bold text-amber-900 mb-3">
            Coming Soon 🚀
          </h2>
          <p className="text-lg text-amber-800 max-w-2xl mx-auto">
            Notre équipe développe activement cet outil de veille puissant qui vous permettra 
            de surveiller automatiquement votre e-réputation sur toutes les plateformes.
          </p>
          <div className="mt-6 inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-full text-sm font-medium">
            <span className="mr-2">⏳</span>
            En cours de développement
          </div>
        </div>
      </div>

      {/* What's Coming */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-200">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">
            Bientôt disponible
          </h2>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
            Kritiqo va intégrer un outil de veille puissant qui regroupera automatiquement 
            tout ce que les gens disent sur votre établissement à travers le web.
          </p>
        </div>

        {/* Platforms Grid */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-neutral-900 mb-6 text-center">
            Sources de données surveillées
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {platforms.map((platform) => (
              <div
                key={platform.name}
                className="flex flex-col items-center p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${platform.color} flex items-center justify-center mb-3`}>
                  {platform.icon}
                </div>
                <span className="text-sm font-medium text-neutral-700">
                  {platform.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div>
          <h3 className="text-xl font-semibold text-neutral-900 mb-6 text-center">
            Fonctionnalités à venir
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-neutral-50 rounded-xl">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-neutral-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 border border-blue-200">
        <h3 className="text-2xl font-bold text-neutral-900 mb-6 text-center">
          Pourquoi surveiller vos mentions ?
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <EyeIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h4 className="font-semibold text-neutral-900 mb-2">
              Réactivité
            </h4>
            <p className="text-sm text-neutral-600">
              Répondez rapidement aux commentaires et gérez votre réputation en temps réel
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-green-600" />
            </div>
            <h4 className="font-semibold text-neutral-900 mb-2">
              Engagement
            </h4>
            <p className="text-sm text-neutral-600">
              Identifiez les opportunités d'engagement et renforcez la relation client
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MagnifyingGlassIcon className="h-8 w-8 text-purple-600" />
            </div>
            <h4 className="font-semibold text-neutral-900 mb-2">
              Insights
            </h4>
            <p className="text-sm text-neutral-600">
              Analysez les tendances et améliorez votre service grâce aux retours clients
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center bg-white rounded-2xl p-8 shadow-sm border border-neutral-200">
        <h3 className="text-xl font-semibold text-neutral-900 mb-2">
          Restez informé
        </h3>
        <p className="text-neutral-600 mb-6">
          Nous vous notifierons dès que cette fonctionnalité sera disponible.
        </p>
        <div className="inline-flex items-center px-6 py-3 bg-neutral-100 text-neutral-500 rounded-xl cursor-not-allowed">
          <span className="font-medium">Bientôt disponible</span>
        </div>
      </div>
    </div>
  )
}
