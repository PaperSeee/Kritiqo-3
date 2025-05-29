'use client'

import { useAuth } from '@/hooks/useAuth'
import { 
  StarIcon, 
  EnvelopeIcon, 
  BuildingStorefrontIcon,
  ChartBarIcon,
  QrCodeIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function DashboardPage() {
  const { user } = useAuth()

  const stats = [
    {
      title: 'Établissements',
      value: '3',
      change: '+1',
      changeType: 'increase',
      icon: BuildingStorefrontIcon,
      href: '/dashboard/restaurants'
    },
    {
      title: 'Avis ce mois',
      value: '24',
      change: '+12%',
      changeType: 'increase',
      icon: StarIcon,
      href: '/dashboard/reviews'
    },
    {
      title: 'Emails analysés',
      value: '156',
      change: '+8%',
      changeType: 'increase',
      icon: EnvelopeIcon,
      href: '/dashboard/mails'
    },
    {
      title: 'QR scans',
      value: '89',
      change: '+23%',
      changeType: 'increase',
      icon: QrCodeIcon,
      href: '/dashboard/reviews/qr'
    }
  ]

  const recentActivity = [
    {
      type: 'review',
      message: 'Nouvel avis 5 étoiles sur Google',
      time: 'Il y a 2 heures',
      restaurant: 'Restaurant Central'
    },
    {
      type: 'email',
      message: 'Email client analysé par l\'IA',
      time: 'Il y a 4 heures',
      restaurant: 'Bistro du Coin'
    },
    {
      type: 'qr',
      message: 'QR code scanné',
      time: 'Il y a 6 heures',
      restaurant: 'Restaurant Central'
    }
  ]

  const quickActions = [
    {
      title: 'Ajouter un établissement',
      description: 'Connecter un nouveau restaurant',
      href: '/dashboard/restaurants/add',
      icon: BuildingStorefrontIcon,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'Générer un QR code',
      description: 'Créer un nouveau QR d\'avis',
      href: '/dashboard/reviews/qr',
      icon: QrCodeIcon,
      color: 'bg-purple-50 text-purple-600'
    },
    {
      title: 'Voir les emails',
      description: 'Consulter les derniers emails',
      href: '/dashboard/mails',
      icon: EnvelopeIcon,
      color: 'bg-green-50 text-green-600'
    }
  ]

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Header */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">
          Bonjour {user?.email?.split('@')[0]} 👋
        </h1>
        <p className="text-neutral-600 text-sm sm:text-base">
          Voici un aperçu de votre activité récente sur Kritiqo
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <Link
            key={index}
            href={stat.href}
            className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4 sm:p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
                <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-neutral-600" />
              </div>
              <div className={`flex items-center space-x-1 text-xs sm:text-sm ${
                stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.changeType === 'increase' ? (
                  <ArrowUpIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                ) : (
                  <ArrowDownIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                )}
                <span>{stat.change}</span>
              </div>
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-neutral-600">{stat.title}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-neutral-900 mb-4 sm:mb-6">
            Actions rapides
          </h2>
          <div className="space-y-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className="flex items-center space-x-4 p-3 sm:p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center ${action.color}`}>
                  <action.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-neutral-900 text-sm sm:text-base">
                    {action.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 truncate">
                    {action.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-neutral-900 mb-4 sm:mb-6">
            Activité récente
          </h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-neutral-100 rounded-full flex items-center justify-center flex-shrink-0">
                  {activity.type === 'review' && <StarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />}
                  {activity.type === 'email' && <EnvelopeIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />}
                  {activity.type === 'qr' && <QrCodeIcon className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base text-neutral-900">{activity.message}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 text-xs sm:text-sm text-neutral-500">
                    <span>{activity.time}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>{activity.restaurant}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-neutral-200">
            <Link
              href="/dashboard/monitoring"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Voir toute l'activité →
            </Link>
          </div>
        </div>
      </div>

      {/* Getting Started */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <h3 className="text-lg sm:text-xl font-semibold text-blue-900 mb-2">
              Besoin d'aide pour commencer ?
            </h3>
            <p className="text-blue-700 text-sm sm:text-base">
              Consultez notre guide de démarrage rapide ou contactez notre équipe support.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/dashboard/support"
              className="inline-flex items-center justify-center px-4 py-2 bg-white text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
            >
              Centre d'aide
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Contacter le support
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
