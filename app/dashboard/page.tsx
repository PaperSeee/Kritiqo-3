'use client';

import { useAuth } from '@/hooks/useAuth';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  QrCodeIcon, 
  StarIcon, 
  EnvelopeIcon, 
  ChartBarIcon, 
  BuildingStorefrontIcon, 
  CheckCircleIcon, 
  SparklesIcon,
  BoltIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  BellIcon,
  ArrowRightIcon,
  PlusIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [showSuccess, setShowSuccess] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<Array<{
    id: string;
    type: 'warning' | 'success' | 'info';
    message: string;
    action?: string;
    link?: string;
  }>>([]);

  // Check for success parameter
  const success = searchParams.get('success');

  useEffect(() => {
    if (success) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Simulate AI recommendations
  useEffect(() => {
    const recommendations = [
      {
        id: '1',
        type: 'warning' as const,
        message: 'Vous avez 3 avis négatifs en attente de réponse',
        action: 'Répondre maintenant',
        link: '/dashboard/reviews'
      },
      {
        id: '2',
        type: 'info' as const,
        message: 'Votre taux de réponse est de 68% - objectif : 80%',
        action: 'Améliorer',
        link: '/dashboard/reviews'
      },
      {
        id: '3',
        type: 'success' as const,
        message: 'Activez la surveillance pour voir ce que les gens disent de vous',
        action: 'Activer',
        link: '/dashboard/monitoring'
      }
    ];
    setAiRecommendations(recommendations);
  }, []);

  const stats = [
    {
      name: 'Avis reçus',
      value: '24',
      trend: '+12%',
      icon: StarIcon,
      color: 'bg-yellow-500',
    },
    {
      name: 'QR Codes générés',
      value: '8',
      trend: '+3',
      icon: QrCodeIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Emails triés',
      value: '156',
      trend: '+45',
      icon: EnvelopeIcon,
      color: 'bg-purple-500',
    },
    {
      name: 'Taux de réponse',
      value: '68%',
      trend: '-5%',
      icon: ChartBarIcon,
      color: 'bg-green-500',
    },
  ];

  const quickActions = [
    {
      name: 'Ajouter un établissement',
      description: 'Connectez votre Google Business',
      icon: BuildingStorefrontIcon,
      href: '/dashboard/restaurants/add',
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
      iconColor: 'text-blue-600'
    },
    {
      name: 'Générer un QR Code',
      description: 'Pour collecter plus d\'avis',
      icon: QrCodeIcon,
      href: '/dashboard/reviews',
      color: 'bg-green-50 hover:bg-green-100 border-green-200',
      iconColor: 'text-green-600'
    },
    {
      name: 'Connecter surveillance',
      description: 'Surveillez votre marque',
      icon: MagnifyingGlassIcon,
      href: '/dashboard/monitoring',
      color: 'bg-orange-50 hover:bg-orange-100 border-orange-200',
      iconColor: 'text-orange-600'
    },
    {
      name: 'Trier mes emails',
      description: 'IA automatique',
      icon: SparklesIcon,
      href: '/dashboard/mails',
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
      iconColor: 'text-purple-600'
    }
  ];

  const mockSurveillanceData = [
    {
      platform: 'Twitter',
      mention: 'Super expérience chez @MonRestaurant !',
      sentiment: 'positive',
      time: '2h'
    },
    {
      platform: 'Facebook',
      mention: 'Quelqu\'un connaît un bon restaurant dans le coin ?',
      sentiment: 'neutral',
      time: '5h'
    },
    {
      platform: 'Google',
      mention: 'Service un peu lent mais bon repas',
      sentiment: 'mixed',
      time: '1j'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Success message */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center">
            <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-green-800">
                🎉 Félicitations ! Votre abonnement est actif
              </h3>
              <p className="text-green-600 mt-1">
                Vous pouvez maintenant profiter de toutes les fonctionnalités de Kritiqo. 
                Commencez par ajouter votre premier établissement !
              </p>
            </div>
            <button
              onClick={() => setShowSuccess(false)}
              className="ml-auto text-green-400 hover:text-green-600"
            >
              <span className="sr-only">Fermer</span>
              ×
            </button>
          </div>
        </div>
      )}

      {/* Welcome section */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              Tableau de bord Kritiqo
            </h1>
            <p className="text-neutral-600">
              Bonjour <span className="font-medium">{user?.email}</span>, voici un aperçu de votre activité
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-2 bg-neutral-50 px-4 py-2 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-neutral-600">Système opérationnel</span>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <SparklesIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-blue-900">
              Ce que vous devriez faire aujourd'hui
            </h2>
            <p className="text-blue-700 text-sm">Recommandations basées sur votre activité</p>
          </div>
        </div>
        
        <div className="space-y-3">
          {aiRecommendations.map((rec) => (
            <div
              key={rec.id}
              className={`flex items-center justify-between p-4 rounded-lg border ${
                rec.type === 'warning' 
                  ? 'bg-amber-50 border-amber-200' 
                  : rec.type === 'success'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                {rec.type === 'warning' && (
                  <ExclamationTriangleIcon className="h-5 w-5 text-amber-600" />
                )}
                {rec.type === 'success' && (
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                )}
                {rec.type === 'info' && (
                  <ArrowTrendingUpIcon className="h-5 w-5 text-blue-600" />
                )}
                <span className={`text-sm font-medium ${
                  rec.type === 'warning' 
                    ? 'text-amber-800' 
                    : rec.type === 'success'
                    ? 'text-green-800'
                    : 'text-blue-800'
                }`}>
                  {rec.message}
                </span>
              </div>
              {rec.action && rec.link && (
                <Link
                  href={rec.link}
                  className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    rec.type === 'warning'
                      ? 'bg-amber-600 text-white hover:bg-amber-700'
                      : rec.type === 'success'
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {rec.action}
                  <ArrowRightIcon className="h-3 w-3 ml-1" />
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`${stat.color} p-3 rounded-lg shadow-sm`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-600">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-bold text-neutral-900">
                    {stat.value}
                  </p>
                </div>
              </div>
              <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                stat.trend.startsWith('+') 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {stat.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick actions - 2/3 width */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-neutral-100 rounded-lg">
              <BoltIcon className="h-6 w-6 text-neutral-600" />
            </div>
            <h2 className="text-xl font-semibold text-neutral-900">
              Actions rapides
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.name}
                href={action.href}
                className={`flex items-center space-x-4 p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${action.color}`}
              >
                <div className={`p-3 rounded-lg bg-white shadow-sm`}>
                  <action.icon className={`h-6 w-6 ${action.iconColor}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-neutral-900 mb-1">
                    {action.name}
                  </h3>
                  <p className="text-sm text-neutral-600">
                    {action.description}
                  </p>
                </div>
                <ArrowRightIcon className="h-5 w-5 text-neutral-400" />
              </Link>
            ))}
          </div>
        </div>

        {/* Surveillance preview - 1/3 width */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <EyeIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">
                Surveillance
              </h2>
              <p className="text-xs text-neutral-500">Aperçu des mentions</p>
            </div>
          </div>

          <div className="space-y-3 mb-4">
            {mockSurveillanceData.map((item, index) => (
              <div key={index} className="p-3 bg-neutral-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-neutral-600">
                    {item.platform}
                  </span>
                  <span className="text-xs text-neutral-500">{item.time}</span>
                </div>
                <p className="text-sm text-neutral-700 line-clamp-2 mb-2">
                  {item.mention}
                </p>
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  item.sentiment === 'positive' 
                    ? 'bg-green-100 text-green-700'
                    : item.sentiment === 'negative'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {item.sentiment === 'positive' ? '😊 Positif' : 
                   item.sentiment === 'negative' ? '😞 Négatif' : '😐 Neutre'}
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/dashboard/monitoring"
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            <span className="text-sm font-medium">Activer la surveillance</span>
          </Link>
        </div>
      </div>

      {/* Recent activity summary */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-900">
            Activité récente
          </h2>
          <Link
            href="/dashboard/reviews"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Voir tout →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
            <div>
              <p className="font-medium text-green-900">Nouvel avis 5⭐</p>
              <p className="text-sm text-green-700">Restaurant Central - Il y a 2h</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
            <EnvelopeIcon className="h-8 w-8 text-blue-600" />
            <div>
              <p className="font-medium text-blue-900">45 emails triés</p>
              <p className="text-sm text-blue-700">Par l'IA - Il y a 3h</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg">
            <BellIcon className="h-8 w-8 text-orange-600" />
            <div>
              <p className="font-medium text-orange-900">Nouvelle mention</p>
              <p className="text-sm text-orange-700">Twitter - Il y a 4h</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
