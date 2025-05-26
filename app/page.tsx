import Image from "next/image";
import type { Metadata } from 'next'
import Link from 'next/link'
import { 
  StarIcon, 
  QrCodeIcon, 
  ChartBarIcon, 
  DevicePhoneMobileIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'
import MobileNavigation from './components/MobileNavigation'

export const metadata: Metadata = {
  title: 'Kritiqo - Collectez plus d\'avis clients avec des QR codes',
  description: 'Augmentez vos avis clients de 300% avec Kritiqo. QR codes personnalisés, pages d\'avis optimisées, gestion centralisée. Essai gratuit 14 jours pour restaurants et commerces.',
  keywords: [
    'collecter avis clients',
    'QR code avis restaurant',
    'augmenter avis Google',
    'gestion réputation restaurant',
    'plateforme avis clients',
    'feedback client automatique'
  ],
  openGraph: {
    title: 'Kritiqo - Collectez 300% d\'avis clients en plus',
    description: 'La solution #1 pour collecter et gérer vos avis clients. QR codes, pages personnalisées, tableau de bord complet.',
    url: 'https://kritiqo.com',
  },
  alternates: {
    canonical: 'https://kritiqo.com',
  },
}

const features = [
  {
    icon: QrCodeIcon,
    title: 'QR Codes Personnalisés',
    description: 'Générez des QR codes uniques pour chaque établissement et collectez des avis en quelques secondes.',
    benefits: ['Installation facile', 'Design personnalisable', 'Statistiques en temps réel']
  },
  {
    icon: StarIcon,
    title: 'Pages d\'Avis Optimisées',
    description: 'Créez des pages d\'avis attractives qui encouragent vos clients à laisser des commentaires positifs.',
    benefits: ['Interface intuitive', 'Mobile-friendly', 'Intégration multi-plateformes']
  },
  {
    icon: ChartBarIcon,
    title: 'Tableau de Bord Analytique',
    description: 'Suivez vos performances, analysez vos avis et optimisez votre stratégie de réputation.',
    benefits: ['Rapports détaillés', 'Alertes automatiques', 'Export des données']
  }
]

const testimonials = [
  {
    name: 'Marie Dubois',
    business: 'Restaurant Le Petit Bistrot',
    content: 'Depuis que j\'utilise Kritiqo, j\'ai triplé le nombre d\'avis sur Google. Les QR codes sont très pratiques !',
    rating: 5,
    location: 'Paris'
  },
  {
    name: 'Pierre Martin',
    business: 'Café Central',
    content: 'Interface très simple, mes clients laissent facilement des avis. Je recommande Kritiqo à tous les restaurateurs.',
    rating: 5,
    location: 'Lyon'
  },
  {
    name: 'Sophie Bernard',
    business: 'Boulangerie des Halles',
    content: 'Excellent outil pour gérer notre e-réputation. Le support client est également top !',
    rating: 5,
    location: 'Marseille'
  }
]

const faqItems = [
  {
    question: 'Comment Kritiqo augmente-t-il mes avis clients ?',
    answer: 'Kritiqo facilite le processus de collecte d\'avis avec des QR codes simples à scanner et des pages optimisées qui encouragent les retours positifs.'
  },
  {
    question: 'Kritiqo fonctionne-t-il avec Google Avis ?',
    answer: 'Oui, Kritiqo s\'intègre parfaitement avec Google Avis, Facebook, TripAdvisor et d\'autres plateformes d\'avis populaires.'
  },
  {
    question: 'Combien coûte Kritiqo ?',
    answer: 'Kritiqo propose plusieurs formules adaptées à tous les budgets, avec un essai gratuit de 14 jours sans engagement.'
  },
  {
    question: 'L\'installation est-elle compliquée ?',
    answer: 'Non ! Il suffit de coller votre lien Google Maps et nous créons automatiquement votre page d\'avis et votre QR code.'
  }
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Header */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-neutral-200 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Kritiqo
          </h1>
          <MobileNavigation />
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Fonctionnalités
            </a>
            <a
              href="#demo"
              className="text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Démonstration
            </a>
            <a
              href="/faq"
              className="text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              FAQ
            </a>
            <a
              href="/contact"
              className="text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Contact
            </a>
            <a
              href="/login"
              className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
            >
              Se connecter
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section - Optimisé SEO */}
      <section className="bg-gradient-to-br from-neutral-50 to-neutral-100 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 mb-6">
              Collectez <span className="text-blue-600">300% d'avis</span> clients en plus
            </h1>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto mb-8">
              Kritiqo aide les restaurants et commerces à <strong>collecter plus d'avis clients</strong> avec des 
              <strong> QR codes personnalisés</strong> et des <strong>pages d'avis optimisées</strong>. 
              Augmentez votre réputation en ligne dès aujourd'hui.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/signup"
                className="bg-neutral-900 text-white px-8 py-4 rounded-lg hover:bg-neutral-800 transition-colors text-lg font-semibold"
              >
                Essai gratuit 14 jours
              </Link>
              <Link
                href="/contact"
                className="border border-neutral-300 text-neutral-700 px-8 py-4 rounded-lg hover:bg-neutral-50 transition-colors text-lg"
              >
                Voir une démo
              </Link>
            </div>
            
            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-neutral-500">
              <span className="flex items-center gap-2">
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                Essai gratuit sans CB
              </span>
              <span className="flex items-center gap-2">
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                Installation en 2 minutes
              </span>
              <span className="flex items-center gap-2">
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                Support client français
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              Pourquoi choisir Kritiqo pour vos avis clients ?
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              La solution complète pour transformer vos clients satisfaits en ambassadeurs en ligne
            </p>
          </div>
          
          <div className="grid gap-12 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-semibold text-neutral-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 mb-6">
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center justify-center gap-2 text-sm text-neutral-500">
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              Ils ont choisi Kritiqo pour leurs avis clients
            </h2>
            <p className="text-xl text-neutral-600">
              Découvrez comment nos clients augmentent leur réputation en ligne
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-neutral-200">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-neutral-700 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-neutral-900">{testimonial.name}</p>
                  <p className="text-sm text-neutral-600">{testimonial.business}</p>
                  <p className="text-sm text-neutral-500">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              Questions fréquentes sur Kritiqo
            </h2>
            <p className="text-xl text-neutral-600">
              Tout ce que vous devez savoir sur notre plateforme de gestion d'avis
            </p>
          </div>
          
          <div className="space-y-8">
            {faqItems.map((item, index) => (
              <div key={index} className="border border-neutral-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                  {item.question}
                </h3>
                <p className="text-neutral-600">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-neutral-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Prêt à augmenter vos avis clients ?
          </h2>
          <p className="text-xl text-neutral-300 mb-8">
            Rejoignez les centaines de commerces qui utilisent Kritiqo pour améliorer leur réputation en ligne
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-white text-neutral-900 px-8 py-4 rounded-lg hover:bg-neutral-100 transition-colors text-lg font-semibold"
          >
            Commencer maintenant
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
          <p className="text-sm text-neutral-400 mt-4">
            Essai gratuit 14 jours • Sans engagement • Support inclus
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h4 className="text-xl font-bold mb-4">Kritiqo</h4>
              <p className="text-neutral-400">
                La solution tout-en-un pour gérer vos avis et emails clients.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-3">Produit</h5>
              <ul className="space-y-2 text-neutral-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors"
                  >
                    Fonctionnalités
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Tarifs
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors"
                  >
                    Démonstration
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-3">Support</h5>
              <ul className="space-y-2 text-neutral-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors"
                  >
                    Centre d'aide
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors"
                  >
                    Formation
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-3">Entreprise</h5>
              <ul className="space-y-2 text-neutral-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors"
                  >
                    À propos
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="/careers"
                    className="hover:text-white transition-colors"
                  >
                    Carrières
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center text-neutral-400">
            <p>&copy; 2024 Kritiqo. Tous droits réservés.</p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <a
                href="/privacy"
                className="hover:text-white transition-colors text-sm"
              >
                Politique de confidentialité
              </a>
              <a
                href="/terms"
                className="hover:text-white transition-colors text-sm"
              >
                Conditions d'utilisation
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
