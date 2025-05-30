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
  ClockIcon,
  ShieldCheckIcon,
  EyeIcon,
  SparklesIcon,
  InboxIcon,
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  CalendarDaysIcon,
  PlayIcon
} from '@heroicons/react/24/outline'
import Header from '../components/Header'
import Footer from '../components/Footer'
import GettingStarted from '@/components/GettingStarted'

export const metadata: Metadata = {
  title: 'Kritiqo - Centralisez vos avis clients en un seul endroit',
  description: 'Kritiqo vous aide à gérer vos avis clients et surveiller votre réputation en ligne. Solution IA pour restaurateurs, indépendants et professionnels.',
  keywords: 'avis clients, réputation en ligne, QR codes, Google Reviews, gestion avis clients',
  openGraph: {
    title: 'Kritiqo - Centralisez vos avis clients',
    description: 'Kritiqo vous aide à gérer vos avis clients et surveiller votre réputation en ligne',
    url: 'https://kritiqo.com',
    siteName: 'Kritiqo',
    type: 'website',
  }
}

const keyBenefits = [
  {
    icon: QrCodeIcon,
    title: "QR Codes personnalisés",
    description: "Générez des QR codes pour collecter facilement des avis clients.",
    comingSoon: false
  },
  {
    icon: ChartBarIcon,
    title: "Centralisation multi-plateformes",
    description: "Gérez tous vos avis depuis Google, Facebook, TripAdvisor en un seul endroit.",
    comingSoon: false
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: "Réponses automatiques",
    description: "Répondez aux avis clients avec l'aide de l'IA pour maintenir votre réputation.",
    comingSoon: true
  },
  {
    icon: MagnifyingGlassIcon,
    title: "Surveillance des mentions",
    description: "Suivez ce que les gens disent de votre marque en ligne.",
    comingSoon: true
  }
]

const detailedFeatures = [
  {
    icon: QrCodeIcon,
    title: 'QR codes de collecte',
    description: 'Générez des codes pour booster vos avis'
  },
  {
    icon: ChartBarIcon,
    title: 'Analytics détaillés',
    description: 'Suivez votre réputation en temps réel'
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: 'Réponses pré-remplies',
    description: 'Templates intelligents pour avis clients'
  },
  {
    icon: MagnifyingGlassIcon,
    title: 'Veille automatique',
    description: 'TikTok, Twitter, forums... [Coming soon]',
    comingSoon: true
  },
  {
    icon: ShieldCheckIcon,
    title: 'Sécurité maximale',
    description: 'Conforme RGPD, données protégées'
  },
  {
    icon: SparklesIcon,
    title: 'IA spécialisée',
    description: 'Algorithmes adaptés aux professionnels'
  }
]

const whyChooseKritiqo = [
  {
    icon: ClockIcon,
    title: "Économisez du temps",
    description: "Centralisez tous vos avis clients et générez des QR codes personnalisés en quelques clics."
  },
  {
    icon: ShieldCheckIcon,
    title: "Solution belge & RGPD",
    description: "Développé en Belgique avec une protection maximale de vos données personnelles et professionnelles."
  },
  {
    icon: SparklesIcon,
    title: "IA spécialisée métiers",
    description: "Algorithmes entraînés spécifiquement pour les besoins des restaurateurs et indépendants."
  }
]

const targetAudiences = [
  "Restaurateurs",
  "Indépendants", 
  "Esthéticiennes",
  "Cabinets médicaux",
  "Salons de coiffure",
  "Commerces de proximité"
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 text-center bg-gradient-to-br from-neutral-50 via-white to-blue-50">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-900 mb-6 leading-tight">
              Centralisez vos avis clients
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 block mt-2">
                en un seul endroit
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-neutral-600 mb-10 max-w-4xl mx-auto leading-relaxed">
              Kritiqo vous aide à gérer vos avis clients et surveiller votre réputation en ligne.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                href="/signup"
                className="w-full sm:w-auto bg-neutral-900 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-neutral-800 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <span>Essayer gratuitement</span>
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
              <button className="w-full sm:w-auto border-2 border-neutral-300 text-neutral-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-neutral-50 transition-colors flex items-center justify-center space-x-2">
                <PlayIcon className="h-5 w-5" />
                <span>Voir une démo</span>
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-neutral-500">
              <span className="flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                14 jours gratuits
              </span>
              <span className="flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                Sans engagement
              </span>
              <span className="flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                Configuration en 5 min
              </span>
            </div>
          </div>
        </section>

        {/* Key Benefits */}
        <section id="features" className="py-20 px-4 sm:px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
                Tout ce dont vous avez besoin
              </h2>
              <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
                Une solution complète pour gérer votre réputation et vos communications
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {keyBenefits.map((benefit, index) => (
                <div key={index} className="bg-white p-8 rounded-2xl border border-neutral-200 hover:border-neutral-300 transition-all duration-200 hover:shadow-lg group">
                  <div className="relative">
                    <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                      <benefit.icon className="h-7 w-7 text-blue-600" />
                    </div>
                    {benefit.comingSoon && (
                      <span className="absolute -top-2 -right-2 bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-1 rounded-full">
                        Coming soon
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-neutral-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dashboard Preview */}
        <section className="py-20 px-4 sm:px-6 bg-neutral-50">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-6">
              Un tableau de bord simple et puissant
            </h2>
            <p className="text-xl text-neutral-600 mb-12">
              Gérez votre réputation en quelques clics
            </p>
            
            <div className="bg-white rounded-2xl shadow-2xl p-8 border">
              <GettingStarted hasBusiness={false} />
            </div>
          </div>
        </section>

        {/* Detailed Features */}
        <section className="py-20 px-4 sm:px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
                Fonctionnalités détaillées
              </h2>
              <p className="text-xl text-neutral-600">
                Tout l'arsenal nécessaire pour votre e-réputation
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {detailedFeatures.map((feature, index) => (
                <div key={index} className="relative bg-neutral-50 p-6 rounded-xl hover:bg-neutral-100 transition-colors">
                  {feature.comingSoon && (
                    <span className="absolute top-4 right-4 bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-1 rounded-full">
                      Coming soon
                    </span>
                  )}
                  <feature.icon className="h-8 w-8 text-blue-600 mb-4" />
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-neutral-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Target Audience */}
        <section className="py-20 px-4 sm:px-6 bg-neutral-900 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Fait pour les pros débordés
            </h2>
            <p className="text-xl text-neutral-300 mb-12">
              Kritiqo s'adapte à votre secteur d'activité
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              {targetAudiences.map((audience, index) => (
                <span key={index} className="bg-neutral-800 px-4 py-2 rounded-full text-neutral-200 border border-neutral-700">
                  {audience}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-20 px-4 sm:px-6 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-6">
              Tarification simple et transparente
            </h2>
            
            <div className="bg-white border-2 border-neutral-200 rounded-2xl p-8 shadow-lg max-w-md mx-auto">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">Starter</h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-neutral-900">14€</span>
                  <span className="text-neutral-600 ml-2">/mois</span>
                </div>
                <p className="text-orange-600 font-medium mt-2">
                  Offre de lancement – passe bientôt à 19€/mois
                </p>
              </div>
              
              <ul className="space-y-3 mb-8 text-left">
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>3 connexions avis</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>IA de tri et suggestions</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Dashboard complet</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>QR codes illimités</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Support email</span>
                </li>
              </ul>
              
              <Link
                href="/signup"
                className="w-full bg-neutral-900 text-white py-4 rounded-xl font-semibold hover:bg-neutral-800 transition-colors block text-center"
              >
                Commencer gratuitement
              </Link>
            </div>
          </div>
        </section>

        {/* Why Choose Kritiqo */}
        <section className="py-20 px-4 sm:px-6 bg-neutral-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
                Pourquoi choisir Kritiqo ?
              </h2>
              <p className="text-xl text-neutral-600">
                Une solution pensée pour les professionnels francophones
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {whyChooseKritiqo.map((reason, index) => (
                <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-neutral-200 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <reason.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-4">
                    {reason.title}
                  </h3>
                  <p className="text-neutral-600 leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl border border-blue-100">
                <h3 className="text-2xl font-bold text-neutral-900 mb-4">
                  Prêt à transformer votre gestion client ?
                </h3>
                <p className="text-neutral-600 mb-6 max-w-2xl mx-auto">
                  Rejoignez les professionnels qui optimisent leur temps et améliorent leur réputation en ligne avec Kritiqo.
                </p>
                <Link
                  href="/signup"
                  className="inline-flex items-center space-x-2 bg-neutral-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-neutral-800 transition-colors"
                >
                  <span>Essayer gratuitement</span>
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Security Block */}
        <section className="py-20 px-4 sm:px-6 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-12">
              Sécurité et transparence
            </h2>
            
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <ShieldCheckIcon className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-neutral-900 mb-2">Conforme RGPD</h3>
                <p className="text-neutral-600 text-sm">Vos données sont protégées selon les standards européens</p>
              </div>
              <div className="text-center">
                <EyeIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-neutral-900 mb-2">Données privées</h3>
                <p className="text-neutral-600 text-sm">Aucune donnée utilisée pour entraîner des IA tierces</p>
              </div>
              <div className="text-center">
                <CheckCircleIcon className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-neutral-900 mb-2">OAuth vérifié</h3>
                <p className="text-neutral-600 text-sm">Connexions sécurisées validées par Google</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-4 sm:px-6 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Gérez votre réputation comme les grandes marques
            </h2>
            <p className="text-xl text-neutral-300 mb-12">
              Rejoignez les professionnels qui ont choisi Kritiqo
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="bg-white text-neutral-900 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-neutral-100 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Créer un compte Kritiqo</span>
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-neutral-900 transition-colors flex items-center justify-center space-x-2">
                <CalendarDaysIcon className="h-5 w-5" />
                <span>Planifier une démo gratuite</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
