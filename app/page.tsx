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
    description: 'Notre IA organise automatiquement vos emails par catégories : factures, RH, clients, admin. Gagnez 2h par jour.',
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
        <section className="py-20 px-6 text-center bg-gradient-to-b from-neutral-50 to-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6 leading-tight">
              Centralisez vos
              <span className="block text-green-600">avis clients</span>
              <span className="block text-lg md:text-2xl font-normal text-neutral-600 mt-2">
                + triez vos emails par IA
              </span>
            </h1>
            
            <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Collectez et gérez vos avis Google, Facebook, TripAdvisor depuis une plateforme unique. 
              <span className="font-medium text-neutral-800"> Notre IA organise automatiquement vos emails par catégories.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                href="/signup"
                className="bg-neutral-900 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-neutral-800 transition-colors flex items-center space-x-2"
              >
                <span>Essai gratuit 14 jours</span>
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
              <a
                href="#demo"
                className="border border-neutral-300 text-neutral-700 px-8 py-4 rounded-lg text-lg font-medium hover:bg-neutral-50 transition-colors"
              >
                Voir la démonstration
              </a>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-sm text-neutral-500">
              <span className="flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                Sans engagement
              </span>
              <span className="flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                Configuration en 5 min
              </span>
              <span className="flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                Support inclus
              </span>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                Tout ce dont vous avez besoin pour gérer vos avis
              </h2>
              <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
                Une plateforme complète qui simplifie la gestion de votre réputation en ligne
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
              {features.map((feature, index) => (
                <div key={index} className="bg-neutral-50 rounded-xl p-8 hover:shadow-lg transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <feature.icon className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-neutral-900">
                          {feature.title}
                        </h3>
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                          {feature.highlight}
                        </span>
                      </div>
                      <p className="text-neutral-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-20 px-6 bg-neutral-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                Pourquoi choisir Kritiqo ?
              </h2>
              <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
                Conçu spécialement pour les restaurants, commerces et entreprises de services
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-16">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center p-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-neutral-600">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="grid gap-8 md:grid-cols-3 text-center">
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-2">+150%</div>
                  <p className="text-neutral-600">d'avis collectés en moyenne</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-2">3h</div>
                  <p className="text-neutral-600">économisées par semaine</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-2">5 min</div>
                  <p className="text-neutral-600">pour configurer votre compte</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                Comment ça marche ?
              </h2>
              <p className="text-xl text-neutral-600">
                Trois étapes simples pour démarrer
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                  Ajoutez vos établissements
                </h3>
                <p className="text-neutral-600">
                  Connectez vos restaurants ou magasins en quelques clics. 
                  Collez simplement vos liens Google Maps.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                  Générez vos QR codes
                </h3>
                <p className="text-neutral-600">
                  Créez des QR codes personnalisés pour chaque point de vente. 
                  Imprimez-les et placez-les stratégiquement.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                  Collectez et gérez
                </h3>
                <p className="text-neutral-600">
                  Suivez vos avis en temps réel, répondez rapidement et 
                  boostez votre réputation en ligne.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 px-6 bg-neutral-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                Questions fréquentes
              </h2>
              <p className="text-xl text-neutral-600">
                Tout ce que vous devez savoir sur Kritiqo
              </p>
            </div>

            <div className="space-y-6">
              {faqItems.map((faq, index) => (
                <details key={index} className="bg-white rounded-lg p-6 shadow-sm">
                  <summary className="font-semibold text-neutral-900 cursor-pointer mb-3 text-lg">
                    {faq.question}
                  </summary>
                  <p className="text-neutral-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-neutral-600 mb-4">
                Vous avez d'autres questions ?
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
              >
                Contactez notre équipe
                <ArrowRightIcon className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-6 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Prêt à transformer votre gestion d'avis ?
            </h2>
            <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
              Rejoignez les centaines d'entreprises qui font confiance à Kritiqo 
              pour améliorer leur réputation en ligne.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-green-700 transition-colors"
              >
                Commencer l'essai gratuit
              </Link>
              <Link
                href="/contact"
                className="border border-neutral-400 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-white/10 transition-colors"
              >
                Parler à un expert
              </Link>
            </div>

            <p className="text-sm text-neutral-400 mt-6">
              Essai gratuit 14 jours • Sans engagement • Support inclus
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
