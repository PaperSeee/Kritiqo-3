"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  QrCodeIcon, 
  StarIcon, 
  EnvelopeIcon,
  ChartBarIcon,
  BuildingStorefrontIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  ClockIcon,
  CursorArrowRaysIcon,
  BellAlertIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  SparklesIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  DocumentChartBarIcon,
  CogIcon,
  PlusIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline";
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const mainFeatures = [
  {
    id: 'qr-codes',
    title: 'QR Codes Intelligents',
    description: 'Générez des QR codes qui dirigent automatiquement vos clients vers la bonne plateforme d\'avis selon leurs préférences.',
    icon: QrCodeIcon,
    color: 'blue',
    benefits: [
      'Génération automatique de QR codes personnalisés',
      'Redirection intelligente vers Google, Yelp, TripAdvisor...',
      'Analytics détaillés sur les scans',
      'Design personnalisable selon votre marque'
    ]
  },
  {
    id: 'ai-triage',
    title: 'Tri Automatique par IA',
    description: 'Notre intelligence artificielle analyse et trie automatiquement vos emails et messages clients pour vous faire gagner du temps.',
    icon: SparklesIcon,
    color: 'purple',
    benefits: [
      'Classification automatique des emails (avis, factures, support...)',
      'Détection des avis clients dans vos messages',
      'Priorisation intelligente des messages importants',
      'Filtrage automatique du spam et de la publicité'
    ]
  },
  {
    id: 'analytics',
    title: 'Analytics Avancés',
    description: 'Tableaux de bord complets pour suivre votre e-réputation et optimiser votre stratégie d\'avis clients.',
    icon: ChartBarIcon,
    color: 'green',
    benefits: [
      'Vue d\'ensemble de tous vos avis en temps réel',
      'Analyse des tendances et de l\'évolution',
      'Rapports détaillés par plateforme',
      'Alertes automatiques pour les avis négatifs'
    ]
  },
  {
    id: 'monitoring',
    title: 'Veille & Mentions',
    description: 'Surveillez automatiquement ce que l\'on dit de votre établissement sur le web et les réseaux sociaux.',
    icon: MagnifyingGlassIcon,
    color: 'yellow',
    benefits: [
      'Surveillance de toutes les plateformes',
      'Alertes en temps réel',
      'Analyse du sentiment',
      'Historique complet des mentions'
    ]
  }
];

const additionalFeatures = [
  {
    title: 'Gestion Multi-Établissements',
    description: 'Gérez tous vos restaurants et points de vente depuis un seul tableau de bord.',
    icon: '🏢'
  },
  {
    title: 'Intégrations Natives',
    description: 'Connectez-vous facilement avec Google, Yelp, TripAdvisor, UberEats et plus.',
    icon: '🔗'
  },
  {
    title: 'Réponses Automatiques',
    description: 'Configurez des réponses automatiques pour remercier vos clients rapidement.',
    icon: '🤖'
  },
  {
    title: 'Export & Rapports',
    description: 'Exportez vos données et générez des rapports détaillés pour vos équipes.',
    icon: '📊'
  },
  {
    title: 'Support 24/7',
    description: 'Notre équipe est disponible pour vous accompagner dans votre réussite.',
    icon: '💬'
  },
  {
    title: 'Sécurité Avancée',
    description: 'Vos données sont protégées avec un chiffrement de niveau bancaire.',
    icon: '🔒'
  }
];

export default function FeaturesPage() {
  const [activeFeature, setActiveFeature] = useState(mainFeatures[0].id);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="pt-16 sm:pt-20">
        {/* Hero Section */}
        <section className="py-12 sm:py-20 px-4 sm:px-6 text-center bg-gradient-to-b from-neutral-50 to-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 mb-4 sm:mb-6">
              Fonctionnalités Puissantes
            </h1>
            <p className="text-lg sm:text-xl text-neutral-600 mb-8 sm:mb-12 max-w-3xl mx-auto">
              Découvrez tous les outils dont vous avez besoin pour gérer efficacement 
              votre e-réputation et optimiser vos avis clients.
            </p>
          </div>
        </section>

        {/* Interactive Features Section */}
        <section className="py-12 sm:py-20 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            {/* Feature Navigation */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-12 sm:mb-16">
              {mainFeatures.map((feature) => (
                <button
                  key={feature.id}
                  onClick={() => setActiveFeature(feature.id)}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-all ${
                    activeFeature === feature.id
                      ? 'bg-neutral-900 text-white shadow-lg'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {feature.title}
                </button>
              ))}
            </div>

            {/* Active Feature Display */}
            {mainFeatures.map((feature) => (
              activeFeature === feature.id && (
                <div key={feature.id} className="grid gap-8 sm:gap-12 lg:grid-cols-2 items-center">
                  <div>
                    <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto lg:mx-0 mb-6 rounded-2xl flex items-center justify-center ${
                      feature.color === 'blue' ? 'bg-blue-100' :
                      feature.color === 'yellow' ? 'bg-yellow-100' :
                      feature.color === 'purple' ? 'bg-purple-100' :
                      'bg-green-100'
                    }`}>
                      <feature.icon className={`h-8 w-8 sm:h-10 sm:w-10 ${
                        feature.color === 'blue' ? 'text-blue-600' :
                        feature.color === 'yellow' ? 'text-yellow-600' :
                        feature.color === 'purple' ? 'text-purple-600' :
                        'text-green-600'
                      }`} />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-4 text-center lg:text-left">
                      {feature.title}
                    </h2>
                    <p className="text-lg text-neutral-600 mb-6 text-center lg:text-left">
                      {feature.description}
                    </p>
                    <ul className="space-y-3">
                      {feature.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 ${
                            feature.color === 'blue' ? 'bg-blue-100' :
                            feature.color === 'yellow' ? 'bg-yellow-100' :
                            feature.color === 'purple' ? 'bg-purple-100' :
                            'bg-green-100'
                          }`}>
                            <div className={`w-2 h-2 rounded-full ${
                              feature.color === 'blue' ? 'bg-blue-600' :
                              feature.color === 'yellow' ? 'bg-yellow-600' :
                              feature.color === 'purple' ? 'bg-purple-600' :
                              'bg-green-600'
                            }`} />
                          </div>
                          <span className="text-neutral-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-neutral-50 rounded-xl p-6 sm:p-8 text-center">
                    <div className={`w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
                      feature.color === 'blue' ? 'bg-blue-100' :
                      feature.color === 'yellow' ? 'bg-yellow-100' :
                      feature.color === 'purple' ? 'bg-purple-100' :
                      'bg-green-100'
                    }`}>
                      <feature.icon className={`h-10 w-10 sm:h-12 sm:w-12 ${
                        feature.color === 'blue' ? 'text-blue-600' :
                        feature.color === 'yellow' ? 'text-yellow-600' :
                        feature.color === 'purple' ? 'text-purple-600' :
                        'text-green-600'
                      }`} />
                    </div>
                    <p className="text-neutral-600 mb-4">
                      Démo interactive disponible
                    </p>
                    <button className="bg-white border border-neutral-300 text-neutral-700 px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-neutral-50 transition-colors text-sm sm:text-base">
                      Voir la démonstration
                    </button>
                  </div>
                </div>
              )
            ))}
          </div>
        </section>

        {/* Additional Features Grid */}
        <section className="py-12 sm:py-20 px-4 sm:px-6 bg-neutral-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 mb-4 sm:mb-6">
                Et bien plus encore
              </h2>
              <p className="text-lg sm:text-xl text-neutral-600 max-w-3xl mx-auto">
                Kritiqo inclut de nombreuses autres fonctionnalités pour vous simplifier la vie
              </p>
            </div>

            <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {additionalFeatures.map((feature, index) => (
                <div key={index} className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-3xl sm:text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600 text-sm sm:text-base">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-20 px-4 sm:px-6 bg-neutral-900 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
              Prêt à essayer Kritiqo ?
            </h2>
            <p className="text-lg sm:text-xl text-neutral-300 mb-8 sm:mb-12">
              Démarrez votre essai gratuit de 14 jours et découvrez la puissance de notre plateforme
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="/signup"
                className="w-full sm:w-auto bg-white text-neutral-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-medium hover:bg-neutral-100 transition-colors"
              >
                Commencer gratuitement
              </a>
              <a
                href="/contact"
                className="w-full sm:w-auto border border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-medium hover:bg-white hover:text-neutral-900 transition-colors"
              >
                Demander une démo
              </a>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
