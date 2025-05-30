'use client'

import { useAuth } from '@/hooks/useAuth'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  StarIcon, 
  EnvelopeIcon, 
  BuildingStorefrontIcon,
  ChartBarIcon,
  QrCodeIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PlusIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

interface DashboardStats {
  businesses: number
  reviews: number
  emails: number
  qrScans: number
}

interface RecentActivity {
  id: string
  type: 'review' | 'email' | 'qr'
  message: string
  time: string
  restaurant?: string
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    businesses: 0,
    reviews: 0,
    emails: 0,
    qrScans: 0
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [connectedEmails, setConnectedEmails] = useState(0)

  useEffect(() => {
    if (user?.id) {
      fetchDashboardData()
    }
  }, [user?.id])

  const fetchDashboardData = async () => {
    if (!user?.id) return

    try {
      setLoading(true)

      // Fetch businesses count
      const { count: businessCount } = await supabase
        .from('businesses')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      // Fetch reviews count (this month)
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const { count: reviewCount } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', startOfMonth.toISOString())

      // Fetch emails count
      const { count: emailCount } = await supabase
        .from('emails')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      // Fetch connected emails count
      const { count: connectedEmailsCount } = await supabase
        .from('connected_emails')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      // Fetch recent activity
      const { data: recentReviews } = await supabase
        .from('reviews')
        .select('id, rating, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

      const { data: recentEmails } = await supabase
        .from('emails')
        .select('id, subject, analyzed_at')
        .eq('user_id', user.id)
        .not('analyzed_at', 'is', null)
        .order('analyzed_at', { ascending: false })
        .limit(5)

      // Format recent activity
      const activity: RecentActivity[] = []

      // Add recent reviews
      recentReviews?.forEach(review => {
        activity.push({
          id: review.id,
          type: 'review',
          message: `Nouvel avis ${review.rating} étoile${review.rating > 1 ? 's' : ''} reçu`,
          time: formatTimeAgo(new Date(review.created_at)),
          restaurant: 'Votre établissement'
        })
      })

      // Add recent email analysis
      recentEmails?.forEach(email => {
        activity.push({
          id: email.id,
          type: 'email',
          message: 'Email analysé par l\'IA',
          time: formatTimeAgo(new Date(email.analyzed_at)),
          restaurant: 'Système'
        })
      })

      // Sort by time and take top 5
      activity.sort((a, b) => {
        const timeA = parseTimeAgo(a.time)
        const timeB = parseTimeAgo(b.time)
        return timeA - timeB
      })

      setStats({
        businesses: businessCount || 0,
        reviews: reviewCount || 0,
        emails: emailCount || 0,
        qrScans: 0 // TODO: Implement QR scan tracking
      })

      setRecentActivity(activity.slice(0, 5))
      setConnectedEmails(connectedEmailsCount || 0)

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTimeAgo = (date: Date): string => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 60) {
      return `Il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) {
      return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`
    }
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`
  }

  const parseTimeAgo = (timeString: string): number => {
    const match = timeString.match(/Il y a (\d+)/)
    return match ? parseInt(match[1]) : 0
  }

  // Show empty state if no businesses and no connected emails
  const showEmptyState = !loading && stats.businesses === 0 && connectedEmails === 0

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900" />
      </div>
    )
  }

  if (showEmptyState) {
    return (
      <div className="space-y-6 sm:space-y-8">
        {/* Welcome Header */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">
            Bienvenue sur Kritiqo ! 👋
          </h1>
          <p className="text-neutral-600 text-sm sm:text-base">
            Commençons par configurer votre première source d'avis ou votre boîte email
          </p>
        </div>

        {/* Setup Guide */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <ExclamationTriangleIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-blue-900 mb-3">
                Configuration requise
              </h3>
              <p className="text-blue-700 mb-6">
                Pour utiliser Kritiqo, vous devez configurer au moins une source d'avis ou connecter votre boîte email.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <Link
                  href="/dashboard/businesses"
                  className="bg-white border border-blue-200 rounded-lg p-4 hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BuildingStorefrontIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-neutral-900">Ajouter un établissement</h4>
                  </div>
                  <p className="text-sm text-neutral-600 mb-3">
                    Connectez votre restaurant ou commerce pour collecter et gérer vos avis clients
                  </p>
                  <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
                    <span>Commencer →</span>
                  </div>
                </Link>

                <Link
                  href="/dashboard/mails"
                  className="bg-white border border-blue-200 rounded-lg p-4 hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <EnvelopeIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-neutral-900">Connecter vos emails</h4>
                  </div>
                  <p className="text-sm text-neutral-600 mb-3">
                    Synchronisez Gmail ou Outlook pour trier automatiquement vos emails
                  </p>
                  <div className="flex items-center text-green-600 text-sm font-medium group-hover:text-green-700">
                    <span>Connecter →</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Features Preview */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            Ce que vous pourrez faire ensuite
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-neutral-50 rounded-lg">
              <QrCodeIcon className="h-8 w-8 text-neutral-600 mx-auto mb-2" />
              <h4 className="font-medium text-neutral-900 mb-1">QR Codes d'avis</h4>
              <p className="text-sm text-neutral-600">Générez des QR codes pour collecter des avis</p>
            </div>
            <div className="text-center p-4 bg-neutral-50 rounded-lg">
              <StarIcon className="h-8 w-8 text-neutral-600 mx-auto mb-2" />
              <h4 className="font-medium text-neutral-900 mb-1">Gestion des avis</h4>
              <p className="text-sm text-neutral-600">Répondez et gérez tous vos avis en un endroit</p>
            </div>
            <div className="text-center p-4 bg-neutral-50 rounded-lg">
              <ChartBarIcon className="h-8 w-8 text-neutral-600 mx-auto mb-2" />
              <h4 className="font-medium text-neutral-900 mb-1">Analyses IA</h4>
              <p className="text-sm text-neutral-600">Triez et analysez vos emails automatiquement</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show partial setup warning if only one is configured
  const showPartialWarning = stats.businesses === 0 || connectedEmails === 0

  const statsData = [
    {
      title: 'Établissements',
      value: stats.businesses.toString(),
      change: stats.businesses > 0 ? '+1' : '0',
      changeType: 'increase' as const,
      icon: BuildingStorefrontIcon,
      href: '/dashboard/businesses'
    },
    {
      title: 'Avis ce mois',
      value: stats.reviews.toString(),
      change: stats.reviews > 0 ? `+${stats.reviews}` : '0',
      changeType: 'increase' as const,
      icon: StarIcon,
      href: '/dashboard/reviews'
    },
    {
      title: 'Emails analysés',
      value: stats.emails.toString(),
      change: stats.emails > 0 ? `+${stats.emails}` : '0',
      changeType: 'increase' as const,
      icon: EnvelopeIcon,
      href: '/dashboard/mails'
    },
    {
      title: 'QR scans',
      value: stats.qrScans.toString(),
      change: '0',
      changeType: 'increase' as const,
      icon: QrCodeIcon,
      href: '/dashboard/reviews/qr'
    }
  ]

  const quickActions = [
    {
      title: 'Ajouter un établissement',
      description: 'Connecter un nouveau restaurant',
      href: '/dashboard/businesses',
      icon: BuildingStorefrontIcon,
      color: 'bg-blue-50 text-blue-600',
      show: true
    },
    {
      title: 'Générer un QR code',
      description: 'Créer un nouveau QR d\'avis',
      href: '/dashboard/reviews/qr',
      icon: QrCodeIcon,
      color: 'bg-purple-50 text-purple-600',
      show: stats.businesses > 0
    },
    {
      title: 'Voir les emails',
      description: 'Consulter les derniers emails',
      href: '/dashboard/mails',
      icon: EnvelopeIcon,
      color: 'bg-green-50 text-green-600',
      show: true
    }
  ].filter(action => action.show)

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

      {/* Partial Setup Warning */}
      {showPartialWarning && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <ExclamationTriangleIcon className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-amber-900 mb-1">
                Configuration incomplète
              </h3>
              <p className="text-amber-700 text-sm mb-3">
                {stats.businesses === 0 && connectedEmails === 0 
                  ? "Ajoutez un établissement et connectez vos emails pour profiter pleinement de Kritiqo"
                  : stats.businesses === 0 
                    ? "Ajoutez votre premier établissement pour gérer vos avis clients"
                    : "Connectez vos emails pour trier automatiquement votre boîte mail"
                }
              </p>
              <div className="flex flex-wrap gap-2">
                {stats.businesses === 0 && (
                  <Link
                    href="/dashboard/businesses"
                    className="inline-flex items-center space-x-1 bg-amber-100 text-amber-800 px-3 py-1 rounded-lg text-sm font-medium hover:bg-amber-200 transition-colors"
                  >
                    <PlusIcon className="h-4 w-4" />
                    <span>Ajouter un établissement</span>
                  </Link>
                )}
                {connectedEmails === 0 && (
                  <Link
                    href="/dashboard/mails"
                    className="inline-flex items-center space-x-1 bg-amber-100 text-amber-800 px-3 py-1 rounded-lg text-sm font-medium hover:bg-amber-200 transition-colors"
                  >
                    <PlusIcon className="h-4 w-4" />
                    <span>Connecter emails</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statsData.map((stat, index) => (
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
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={activity.id} className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-neutral-100 rounded-full flex items-center justify-center flex-shrink-0">
                    {activity.type === 'review' && <StarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />}
                    {activity.type === 'email' && <EnvelopeIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />}
                    {activity.type === 'qr' && <QrCodeIcon className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base text-neutral-900">{activity.message}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 text-xs sm:text-sm text-neutral-500">
                      <span>{activity.time}</span>
                      {activity.restaurant && (
                        <>
                          <span className="hidden sm:inline">•</span>
                          <span>{activity.restaurant}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-neutral-500 text-sm">Aucune activité récente</p>
                <p className="text-neutral-400 text-xs mt-1">
                  L'activité apparaîtra ici une fois que vous commencerez à utiliser Kritiqo
                </p>
              </div>
            )}
          </div>
          {recentActivity.length > 0 && (
            <div className="mt-6 pt-4 border-t border-neutral-200">
              <Link
                href="/dashboard/monitoring"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Voir toute l'activité →
              </Link>
            </div>
          )}
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
