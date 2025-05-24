'use client';

import { useAuth } from '@/hooks/useAuth';
import { QrCodeIcon, StarIcon, EnvelopeIcon, ChartBarIcon } from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const { user } = useAuth();

  const stats = [
    {
      name: 'Avis reçus',
      value: '24',
      icon: StarIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'QR Codes générés',
      value: '12',
      icon: QrCodeIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Emails envoyés',
      value: '156',
      icon: EnvelopeIcon,
      color: 'bg-purple-500',
    },
    {
      name: 'Taux de réponse',
      value: '68%',
      icon: ChartBarIcon,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome section */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">
          Bienvenue sur Kritiqo
        </h1>
        <p className="text-neutral-600 text-sm sm:text-base">
          Connecté en tant que <span className="font-medium">{user?.email}</span>
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4 flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-600 truncate">
                  {stat.name}
                </p>
                <p className="text-2xl font-bold text-neutral-900">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent reviews */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            Derniers avis
          </h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start space-x-3 p-3 bg-neutral-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-neutral-300 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-neutral-600">JD</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900">
                    John Doe
                  </p>
                  <p className="text-xs text-neutral-500 mb-1">
                    Il y a 2 heures
                  </p>
                  <p className="text-sm text-neutral-600 line-clamp-2">
                    Excellent service, très satisfait de mon expérience !
                  </p>
                  <div className="flex items-center mt-2">
                    {[...Array(5)].map((_, starIndex) => (
                      <StarIcon
                        key={starIndex}
                        className={`h-4 w-4 ${
                          starIndex < 5 ? 'text-yellow-400 fill-current' : 'text-neutral-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            Actions rapides
          </h2>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 bg-neutral-50 hover:bg-neutral-100 rounded-lg transition-colors text-left">
              <div className="flex items-center space-x-3">
                <QrCodeIcon className="h-5 w-5 text-neutral-600" />
                <span className="text-sm font-medium text-neutral-900">
                  Générer un QR Code
                </span>
              </div>
              <span className="text-neutral-400">→</span>
            </button>
            
            <button className="w-full flex items-center justify-between p-4 bg-neutral-50 hover:bg-neutral-100 rounded-lg transition-colors text-left">
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="h-5 w-5 text-neutral-600" />
                <span className="text-sm font-medium text-neutral-900">
                  Envoyer un email
                </span>
              </div>
              <span className="text-neutral-400">→</span>
            </button>
            
            <button className="w-full flex items-center justify-between p-4 bg-neutral-50 hover:bg-neutral-100 rounded-lg transition-colors text-left">
              <div className="flex items-center space-x-3">
                <StarIcon className="h-5 w-5 text-neutral-600" />
                <span className="text-sm font-medium text-neutral-900">
                  Voir tous les avis
                </span>
              </div>
              <span className="text-neutral-400">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
