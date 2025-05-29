import { Metadata } from 'next'
import Link from 'next/link'
import { 
  QrCodeIcon, 
  StarIcon, 
  BuildingStorefrontIcon,
  EnvelopeIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import Header from '../components/Header'
import Footer from '../components/Footer'

export const metadata: Metadata = {
  title: 'Kritiqo - Centralisez et gérez tous vos avis clients en un seul endroit',
  description: 'Collectez, organisez et répondez à tous vos avis clients (Google, Facebook, TripAdvisor) depuis une plateforme unique. Générez des QR codes personnalisés pour booster vos avis positifs.',
  keywords: 'avis clients, gestion avis, QR code avis, Google Reviews, Facebook avis, centralisation avis, restaurant avis, commerce avis',
  openGraph: {
    title: 'Kritiqo - Centralisez tous vos avis clients',
    description: 'La plateforme tout-en-un pour gérer vos avis clients et booster votre réputation en ligne',
    url: 'https://kritiqo.com',
    siteName: 'Kritiqo',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kritiqo - Centralisez tous vos avis clients',
    description: 'La plateforme tout-en-un pour gérer vos avis clients et booster votre réputation en ligne',
  },
  robots: {
    index: true,
    follow: true,
  }
}

const features = [
  {
    icon: QrCodeIcon,
    title: 'QR Codes Personnalisés',
    description: 'Générez des QR codes uniques pour chaque établissement. Vos clients scannent et laissent un avis en 30 secondes.',
    highlight: 'Génération instantanée'
  },
  {
    icon: StarIcon,
    title: 'Centralisation des Avis',
    description: 'Regroupez tous vos avis Google, Facebook, TripAdvisor dans un tableau de bord unique. Fini le jonglage entre plateformes.',
    highlight: 'Toutes plateformes'
  },
  {
    icon: EnvelopeIcon,
    title: 'Tri Intelligent des Emails',
    description: 'Notre IA organise automatiquement vos emails par categories : factures, RH, clients, admin. Gagnez 2h par jour.',
    highlight: 'IA intégrée'
  },
  {
    icon: ChartBarIcon,
    title: 'Analytics Avancés',
    description: 'Suivez l\'évolution de votre réputation, identifiez les tendances et optimisez votre stratégie client.',
    highlight: 'Insights en temps réel'
  }
]

const benefits = [
  {
    icon: ClockIcon,
    title: 'Gagnez 3h par semaine',
    description: 'Automatisez la collecte et l\'organisation de vos avis clients'
  },
  {
    icon: BuildingStorefrontIcon,
    title: 'Multi-établissements',
    description: 'Gérez tous vos points de vente depuis une seule interface'
  },
  {
    icon: DevicePhoneMobileIcon,
    title: 'Mobile-first',
    description: 'Interface optimisée pour smartphone et tablette'
  },
  {
    icon: ComputerDesktopIcon,
    title: 'Intégration simple',
    description: 'Configuration en 5 minutes, sans installation'
  }
]

const faqItems = [
  {
    question: 'Comment fonctionne la collecte d\'avis via QR code ?',
    answer: 'Vous générez un QR code unique pour votre établissement. Vos clients le scannent avec leur smartphone et accèdent directement à une page optimisée pour laisser un avis sur Google, Facebook ou d\'autres plateformes.'
  },
  {
    question: 'Quelles plateformes d\'avis sont supportées ?',
    answer: 'Kritiqo centralise les avis de Google My Business, Facebook, TripAdvisor, et d\'autres plateformes populaires. Nous ajoutons régulièrement de nouvelles intégrations selon les besoins de nos utilisateurs.'
  },
  {
    question: 'Le tri automatique des emails est-il sécurisé ?',
    answer: 'Absolument. Nous utilisons l\'authentification OAuth sécurisée et ne lisons que les métadonnées nécessaires au tri (expéditeur, objet). Vos emails restent privés et nous respectons le RGPD.'
  },
  {
    question: 'Puis-je gérer plusieurs restaurants ou magasins ?',
    answer: 'Oui ! Kritiqo est conçu pour les entreprises multi-sites. Vous pouvez ajouter autant d\'établissements que nécessaire et les gérer depuis un tableau de bord unique.'
  },
  {
    question: 'Y a-t-il une période d\'essai ?',
    answer: 'Oui, nous offrons 14 jours d\'essai gratuit avec accès à toutes les fonctionnalités. Aucune carte bancaire requise pour commencer.'
  },
  {
    question: 'Comment puis-je répondre aux avis clients ?',
    answer: 'Kritiqo vous permet de répondre directement aux avis depuis la plateforme. Vous recevez des notifications pour les nouveaux avis et pouvez répondre rapidement pour maintenir une bonne relation client.'
  }
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-12 sm:py-20 px-4 sm:px-6 text-center bg-gradient-to-b from-neutral-50 to-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-neutral-900 mb-4 sm:mb-6">
              Centralisez tous vos
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 block sm:inline sm:ml-3">
                avis clients
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-neutral-600 mb-8 sm:mb-12 max-w-3xl mx-auto px-4">
              La plateforme tout-en-un qui collecte, centralise et analyse vos avis clients. 
              QR codes intelligents, tri automatique par IA, analytics avancés.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 sm:mb-12 px-4">
              <Link
                href="/signup"
                className="w-full sm:w-auto bg-neutral-900 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Essai gratuit 14 jours</span>
                <ArrowRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
              <a
                href="#demo"
                className="w-full sm:w-auto border border-neutral-300 text-neutral-700 px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-medium hover:bg-neutral-50 transition-colors"
              >
                Voir la démonstration
              </a>
            </div>

            <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-sm text-neutral-500 px-4">
              <span className="flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
                Sans engagement
              </span>
              <span className="flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
                Configuration en 5 minutes
              </span>
              <span className="flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
                Support inclus
              </span>
            </div>
          </div>
        </section>

        {/* Features Preview */}
        <section className="py-12 sm:py-20 px-4 sm:px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 mb-4 sm:mb-6">
                Tout ce dont vous avez besoin
              </h2>
              <p className="text-lg sm:text-xl text-neutral-600 max-w-3xl mx-auto">
                Une solution complète pour gérer votre e-réputation et optimiser vos avis clients
              </p>
            </div>

            <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-neutral-50 p-6 sm:p-8 rounded-xl">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 mb-2">
                  QR Codes Intelligents
                </h3>
                <p className="text-neutral-600 text-sm sm:text-base">
                  Générez des QR codes qui dirigent automatiquement vers la bonne plateforme d'avis
                </p>
              </div>

              <div className="bg-neutral-50 p-6 sm:p-8 rounded-xl">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 mb-2">
                  Tri Automatique IA
                </h3>
                <p className="text-neutral-600 text-sm sm:text-base">
                  L'IA trie et analyse automatiquement vos emails et messages clients
                </p>
              </div>

              <div className="bg-neutral-50 p-6 sm:p-8 rounded-xl md:col-span-2 lg:col-span-1">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 mb-2">
                  Analytics Avancés
                </h3>
                <p className="text-neutral-600 text-sm sm:text-base">
                  Tableaux de bord détaillés pour suivre votre e-réputation en temps réel
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-20 px-4 sm:px-6 bg-neutral-900 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
              Prêt à améliorer votre e-réputation ?
            </h2>
            <p className="text-lg sm:text-xl text-neutral-300 mb-8 sm:mb-12">
              Rejoignez les centaines d'entreprises qui font confiance à Kritiqo
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center bg-white text-neutral-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-medium hover:bg-neutral-100 transition-colors space-x-2"
            >
              <span>Commencer gratuitement</span>
              <ArrowRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
