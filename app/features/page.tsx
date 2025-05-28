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
    icon: QrCodeIcon,
    title: 'QR Codes Intelligents',
    subtitle: 'Collecte d\'avis simplifiée',
    description: 'Générez des QR codes personnalisés pour chaque établissement. Vos clients scannent et accèdent directement à une page d\'avis optimisée.',
    features: [
      'Génération instantanée et illimitée',
      'Codes haute résolution pour impression',
      'Pages d\'atterrissage personnalisées',
      'Redirection intelligente selon la plateforme',
      'Analytics de scan en temps réel'
    ],
    demo: '/demo-qr.mp4',
    color: 'blue'
  },
  {
    id: 'centralization',
    icon: StarIcon,
    title: 'Centralisation Totale',
    subtitle: 'Tous vos avis en un endroit',
    description: 'Regroupez automatiquement vos avis Google, Facebook, TripAdvisor, et bien d\'autres dans un tableau de bord unifié.',
    features: [
      'Synchronisation automatique multi-plateformes',
      'Import d\'avis existants',
      'Notifications en temps réel',
      'Réponses directes depuis Kritiqo',
      'Historique complet et recherche avancée'
    ],
    demo: '/demo-centralization.mp4',
    color: 'yellow'
  },
  {
    id: 'email-ai',
    icon: EnvelopeIcon,
    title: 'IA de Tri d\'Emails',
    subtitle: 'Organisation automatique',
    description: 'Notre intelligence artificielle analyse et classe vos emails par categories : factures, RH, clients, administration.',
    features: [
      'Classification automatique par IA',
      'Niveau de priorité intelligent',
      'Intégration Gmail et Outlook',
      'Filtres personnalisables',
      'Gain de temps de 3h par semaine'
    ],
    demo: '/demo-email-ai.mp4',
    color: 'purple'
  },
  {
    id: 'analytics',
    icon: ChartBarIcon,
    title: 'Analytics Avancés',
    subtitle: 'Insights en temps réel',
    description: 'Suivez l\'évolution de votre réputation, analysez les tendances et optimisez votre stratégie client avec des données précises.',
    features: [
      'Tableau de bord temps réel',
      'Analyse des sentiments',
      'Comparaison avec la concurrence',
      'Rapports automatiques',
      'Alertes personnalisées'
    ],
    demo: '/demo-analytics.mp4',
    color: 'green'
  },
  {
    id: 'surveillance',
    icon: MagnifyingGlassIcon,
    title: 'Surveillance par Mots-Clés',
    subtitle: 'Veille automatique',
    description: 'Surveillez automatiquement ce que les gens disent de votre établissement sur le web avec notre système de veille par mots-clés.',
    features: [
      'Surveillance temps réel multi-plateformes',
      'Détection automatique des mentions',
      'Analyse de sentiment des mentions',
      'Alertes instantanées pour mentions critiques',
      'Historique complet des mentions trouvées'
    ],
    demo: '/demo-surveillance.mp4',
    color: 'purple'
  }
];

const additionalFeatures = [
  {
    icon: BuildingStorefrontIcon,
    title: 'Multi-établissements',
    description: 'Gérez tous vos points de vente depuis une interface unique'
  },
  {
    icon: DevicePhoneMobileIcon,
    title: 'Mobile-First',
    description: 'Interface parfaitement optimisée pour smartphone et tablette'
  },
  {
    icon: ClockIcon,
    title: 'Automatisation',
    description: 'Workflows automatiques pour réduire les tâches répétitives'
  },
  {
    icon: ShieldCheckIcon,
    title: 'Sécurité RGPD',
    description: 'Conformité totale aux réglementations européennes'
  },
  {
    icon: BellAlertIcon,
    title: 'Notifications Intelligentes',
    description: 'Alertes personnalisées pour ne rien manquer'
  },
  {
    icon: GlobeAltIcon,
    title: 'Multi-langues',
    description: 'Interface disponible en français, anglais et autres langues'
  },
  {
    icon: MagnifyingGlassIcon,
    title: 'Veille par Mots-Clés',
    description: 'Surveillez automatiquement les mentions de votre marque'
  }
];

const useCases = [
  {
    icon: "🍽️",
    title: "Restaurants & Cafés",
    description: "Collectez plus d'avis positifs avec des QR codes sur vos tables",
    benefits: ["+ 200% d'avis collectés", "Réponse client 5x plus rapide", "Amélioration note moyenne"]
  },
  {
    icon: "🏪",
    title: "Commerces de proximité",
    description: "Centralisez vos avis Google et Facebook pour booster votre visibilité",
    benefits: ["Gestion simplifiée", "Visibilité locale accrue", "Fidélisation client"]
  },
  {
    icon: "💇",
    title: "Salons & Spas",
    description: "Organisez vos emails clients et collectez des témoignages",
    benefits: ["Organisation parfaite", "Suivi client optimal", "Réputation renforcée"]
  },
  {
    icon: "🏥",
    title: "Cabinets médicaux",
    description: "Gérez votre réputation en ligne de manière professionnelle",
    benefits: ["Conformité RGPD", "Gestion discrète", "Confiance patient"]
  }
];

const whyChooseKritiqo = [
  {
    icon: "⚡",
    title: "Mise en place rapide",
    description: "Configuration complète en moins de 5 minutes",
    details: ["Interface intuitive", "Import automatique", "Formation incluse"]
  },
  {
    icon: "🔒",
    title: "Sécurité garantie",
    description: "Conformité RGPD et sécurité européenne",
    details: ["Données hébergées en Europe", "Chiffrement bout-en-bout", "Audits réguliers"]
  },
  {
    icon: "🚀",
    title: "Innovation continue",
    description: "Nouvelles fonctionnalités chaque mois",
    details: ["IA en constante évolution", "Intégrations régulières", "Feedback utilisateurs"]
  }
];

export default function FeaturesPage() {
  const [activeFeature, setActiveFeature] = useState('qr-codes');

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-6 bg-gradient-to-b from-neutral-50 to-white">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <SparklesIcon className="h-4 w-4" />
              <span>Plateforme tout-en-un</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6 leading-tight">
              Toutes les fonctionnalités
              <span className="block text-green-600">pour votre succès</span>
            </h1>
            
            <p className="text-xl text-neutral-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Découvrez comment Kritiqo révolutionne la gestion d'avis clients et l'organisation d'emails 
              pour des milliers d'entreprises dans le monde.
            </p>

            <div className="grid gap-6 md:grid-cols-4 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">5+</div>
                <p className="text-sm text-neutral-600">Plateformes connectées</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">5 min</div>
                <p className="text-sm text-neutral-600">Configuration moyenne</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
                <p className="text-sm text-neutral-600">Disponibilité système</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">RGPD</div>
                <p className="text-sm text-neutral-600">Conformité garantie</p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Features Section */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                Fonctionnalités principales
              </h2>
              <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
                Quatre outils puissants pour transformer votre gestion client
              </p>
            </div>

            {/* Feature Tabs */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {mainFeatures.map((feature) => (
                <button
                  key={feature.id}
                  onClick={() => setActiveFeature(feature.id)}
                  className={`flex items-center space-x-3 px-6 py-3 rounded-lg font-medium transition-all ${
                    activeFeature === feature.id
                      ? 'bg-neutral-900 text-white shadow-lg'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  <feature.icon className="h-5 w-5" />
                  <span>{feature.title}</span>
                </button>
              ))}
            </div>

            {/* Active Feature Display */}
            {mainFeatures.map((feature) => (
              activeFeature === feature.id && (
                <div key={feature.id} className="grid gap-12 lg:grid-cols-2 items-center">
                  <div>
                    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium mb-4 ${
                      feature.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                      feature.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                      feature.color === 'purple' ? 'bg-purple-100 text-purple-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      <feature.icon className="h-4 w-4" />
                      <span>{feature.subtitle}</span>
                    </div>
                    
                    <h3 className="text-3xl font-bold text-neutral-900 mb-4">
                      {feature.title}
                    </h3>
                    
                    <p className="text-xl text-neutral-600 mb-8 leading-relaxed">
                      {feature.description}
                    </p>

                    <div className="space-y-4 mb-8">
                      {feature.features.map((item, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-neutral-700">{item}</span>
                        </div>
                      ))}
                    </div>

                    <Link
                      href="/signup"
                      className="inline-flex items-center space-x-2 bg-neutral-900 text-white px-6 py-3 rounded-lg hover:bg-neutral-800 transition-colors"
                    >
                      <span>Tester cette fonctionnalité</span>
                      <ArrowRightIcon className="h-4 w-4" />
                    </Link>
                  </div>

                  <div className="bg-neutral-50 rounded-xl p-8 text-center">
                    <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
                      feature.color === 'blue' ? 'bg-blue-100' :
                      feature.color === 'yellow' ? 'bg-yellow-100' :
                      feature.color === 'purple' ? 'bg-purple-100' :
                      'bg-green-100'
                    }`}>
                      <feature.icon className={`h-12 w-12 ${
                        feature.color === 'blue' ? 'text-blue-600' :
                        feature.color === 'yellow' ? 'text-yellow-600' :
                        feature.color === 'purple' ? 'text-purple-600' :
                        'text-green-600'
                      }`} />
                    </div>
                    <p className="text-neutral-600 mb-4">
                      Démo interactive disponible
                    </p>
                    <button className="bg-white border border-neutral-300 text-neutral-700 px-4 py-2 rounded-lg hover:bg-neutral-50 transition-colors">
                      Voir la démonstration
                    </button>
                  </div>
                </div>
              )
            ))}
          </div>
        </section>

        {/* Additional Features Grid */}
        <section className="py-20 px-6 bg-neutral-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                Et bien plus encore...
              </h2>
              <p className="text-xl text-neutral-600">
                Découvrez toutes les fonctionnalités qui font de Kritiqo la solution #1
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {additionalFeatures.map((feature, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-neutral-700" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                Adapté à votre secteur
              </h2>
              <p className="text-xl text-neutral-600">
                Kritiqo s'adapte parfaitement aux besoins spécifiques de votre activité
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {useCases.map((useCase, index) => (
                <div key={index} className="text-center p-6">
                  <div className="text-4xl mb-4">{useCase.icon}</div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                    {useCase.title}
                  </h3>
                  <p className="text-neutral-600 mb-6">
                    {useCase.description}
                  </p>
                  <div className="space-y-2">
                    {useCase.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center justify-center space-x-2">
                        <CheckCircleIcon className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-neutral-600">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Kritiqo Section */}
        <section className="py-20 px-6 bg-neutral-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                Pourquoi choisir Kritiqo ?
              </h2>
              <p className="text-xl text-neutral-600">
                Une solution pensée pour vous faire gagner du temps et améliorer votre réputation
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3 mb-16">
              {whyChooseKritiqo.map((reason, index) => (
                <div key={index} className="bg-white rounded-xl p-8 shadow-sm text-center">
                  <div className="text-4xl mb-4">{reason.icon}</div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                    {reason.title}
                  </h3>
                  <p className="text-neutral-600 mb-6">
                    {reason.description}
                  </p>
                  <div className="space-y-2">
                    {reason.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-center justify-center space-x-2">
                        <CheckCircleIcon className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-neutral-600">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Stats Section */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8">
              <div className="grid gap-6 md:grid-cols-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-2">5 min</div>
                  <p className="text-sm text-neutral-600">Configuration moyenne</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-2">24h</div>
                  <p className="text-sm text-neutral-600">Premier résultat visible</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-2">3x</div>
                  <p className="text-sm text-neutral-600">Plus d'avis collectés</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-2">4h</div>
                  <p className="text-sm text-neutral-600">Temps gagné par semaine</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Integration Section */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                Intégrations natives
              </h2>
              <p className="text-xl text-neutral-600 mb-8">
                Kritiqo se connecte avec tous vos outils préférés
              </p>
              
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                <div className="text-2xl font-bold">Google</div>
                <div className="text-2xl font-bold">Facebook</div>
                <div className="text-2xl font-bold">TripAdvisor</div>
                <div className="text-2xl font-bold">Gmail</div>
                <div className="text-2xl font-bold">Outlook</div>
                <div className="text-2xl font-bold">Zapier</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 text-center">
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">
                Une intégration manque ?
              </h3>
              <p className="text-neutral-600 mb-6">
                Notre équipe développe constamment de nouvelles intégrations sur demande
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center space-x-2 bg-neutral-900 text-white px-6 py-3 rounded-lg hover:bg-neutral-800 transition-colors"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Demander une intégration</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-6 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Prêt à découvrir toute la puissance de Kritiqo ?
            </h2>
            <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
              Rejoignez les centaines d'entreprises qui transforment leur gestion client avec nos fonctionnalités avancées.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                href="/signup"
                className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-green-700 transition-colors"
              >
                Essai gratuit 14 jours
              </Link>
              <Link
                href="/contact"
                className="border border-neutral-400 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-white/10 transition-colors"
              >
                Démonstration personnalisée
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-sm text-neutral-400">
              <span className="flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                Configuration en 5 minutes
              </span>
              <span className="flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                Support premium inclus
              </span>
              <span className="flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                Satisfaction garantie
              </span>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
