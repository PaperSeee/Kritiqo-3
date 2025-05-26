"use client";

import { useState, useEffect } from "react";
import { useAuth } from '@/hooks/useAuth';
import { useSearchParams } from 'next/navigation';
import { handleCheckout } from '@/lib/stripe';
import { 
  CheckIcon,
  XMarkIcon,
  StarIcon,
  SparklesIcon,
  ArrowRightIcon,
  QuestionMarkCircleIcon,
  BuildingStorefrontIcon,
  QrCodeIcon,
  ChartBarIcon,
  EnvelopeIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function PricingPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const canceled = searchParams.get('canceled');

  useEffect(() => {
    if (canceled) {
      // Show cancelation message
      console.log('Payment was canceled');
    }
  }, [canceled]);

  const prices = {
    starter: {
      monthly: 'price_1RSzAKEHLYeVzQDZFcOdgFnU', // Starter monthly price ID
      yearly: 'price_1RSzCXEHLYeVzQDZW3UEq823',   // Starter yearly price ID
    },
    pro: {
      monthly: 'price_1RSzAWEHLYeVzQDZrjYuLBqE',     // Pro monthly price ID
      yearly: 'price_1RSzCAEHLYeVzQDZfj8AW37O',       // Pro yearly price ID
    },
  };

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      subtitle: 'Pour débuter',
      price: '9',
      originalPrice: '19',
      period: '/mois',
      description: 'Parfait pour un restaurant ou commerce avec un seul point de vente',
      popular: false,
      cta: 'Commencer l\'essai gratuit',
      launchOffer: true,
      features: [
        '1 établissement',
        'QR codes illimités',
        'Centralisation Google + Facebook',
        'Réponses aux avis',
        'Analytics de base',
        'Support par email',
        'Tri emails (100/mois)',
        'Interface mobile'
      ],
      limits: [
        'Pas de marque blanche',
        'Rapports limités',
        'Pas d\'API'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      subtitle: 'Le plus populaire',
      price: '79',
      originalPrice: '99',
      period: '/mois',
      description: 'Idéal pour les chaînes et entreprises multi-sites',
      popular: true,
      cta: 'Choisir Pro',
      features: [
        '5 établissements',
        'QR codes illimités + personnalisation',
        'Toutes plateformes (Google, Facebook, TripAdvisor, etc.)',
        'Réponses automatiques par IA',
        'Analytics avancés + alertes',
        'Support prioritaire',
        'Tri emails illimité + IA avancée',
        'App mobile dédiée',
        'Rapports automatiques',
        'Intégrations Zapier',
        'Formation personnalisée'
      ],
      limits: [
        'Marque blanche en option (+20€/mois)'
      ]
    },
    {
      id: 'enterprise',
      name: 'Entreprise',
      subtitle: 'Solution sur mesure',
      price: 'Sur devis',
      originalPrice: null,
      period: '',
      description: 'Pour les grandes entreprises avec des besoins spécifiques',
      popular: false,
      cta: 'Nous contacter',
      features: [
        'Établissements illimités',
        'Marque blanche incluse',
        'API complète',
        'Intégrations personnalisées',
        'Analytics enterprise + BI',
        'Support dédié 24/7',
        'IA sur mesure',
        'Formation équipe complète',
        'SLA garantie',
        'Hébergement dédié',
        'Conformité SOC2/ISO27001'
      ],
      limits: []
    }
  ];

  const features = [
    {
      category: 'Gestion des avis',
      items: [
        { name: 'Nombre d\'établissements', starter: '1', pro: '5', enterprise: 'Illimité' },
        { name: 'QR codes générés', starter: 'Illimité', pro: 'Illimité', enterprise: 'Illimité' },
        { name: 'Personnalisation QR codes', starter: false, pro: true, enterprise: true },
        { name: 'Plateformes connectées', starter: '2', pro: 'Toutes', enterprise: 'Toutes + API' },
        { name: 'Réponses automatiques IA', starter: false, pro: true, enterprise: true },
        { name: 'Analytics', starter: 'Base', pro: 'Avancé', enterprise: 'Enterprise' }
      ]
    },
    {
      category: 'Tri d\'emails intelligent',
      items: [
        { name: 'Emails triés par IA/mois', starter: '100', pro: 'Illimité', enterprise: 'Illimité' },
        { name: 'Analyse GPT-4 avancée', starter: false, pro: true, enterprise: true },
        { name: 'Suggestions de réponses IA', starter: false, pro: true, enterprise: true },
        { name: 'Catégorisation automatique', starter: true, pro: true, enterprise: true },
        { name: 'Intégrations email', starter: 'Gmail', pro: 'Gmail + Outlook', enterprise: 'API custom + tous' }
      ]
    },
    {
      category: 'Support & Formation',
      items: [
        { name: 'Support', starter: 'Email', pro: 'Prioritaire', enterprise: '24/7 dédié' },
        { name: 'Formation', starter: 'Documentation', pro: 'Personnalisée', enterprise: 'Équipe complète' },
        { name: 'SLA', starter: false, pro: false, enterprise: '99.9%' }
      ]
    }
  ];

  const faqs = [
    {
      question: 'Puis-je changer de plan à tout moment ?',
      answer: 'Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements prennent effet immédiatement et la facturation est ajustée au prorata.'
    },
    {
      question: 'Y a-t-il des frais de configuration ?',
      answer: 'Non, aucun frais de configuration. Nous vous aidons même à configurer votre compte gratuitement pendant l\'essai.'
    },
    {
      question: 'Que se passe-t-il si je dépasse les limites de mon plan ?',
      answer: 'Nous vous prévenons avant d\'atteindre les limites. Vous pouvez alors upgrader votre plan ou nous discutons d\'une solution personnalisée.'
    },
    {
      question: 'Proposez-vous des réductions pour les associations ?',
      answer: 'Oui, nous offrons 50% de réduction sur tous nos plans pour les associations et organismes à but non lucratif. Contactez-nous pour en bénéficier.'
    },
    {
      question: 'Comment fonctionne la garantie satisfait ou remboursé ?',
      answer: 'Nous offrons une garantie de 30 jours. Si vous n\'êtes pas satisfait, nous vous remboursons intégralement, sans question.'
    },
    {
      question: 'Les données sont-elles incluses dans le prix ?',
      answer: 'Oui, il n\'y a aucun coût supplémentaire pour le stockage des données. Tout est inclus dans votre abonnement mensuel.'
    }
  ];

  const getPrice = (basePrice: string) => {
    if (basePrice === 'Sur devis') return basePrice;
    const price = parseInt(basePrice);
    if (billingPeriod === 'yearly') {
      return Math.round(price * 0.8).toString(); // 20% discount for yearly
    }
    return basePrice;
  };

  const handlePlanSelection = async (planId: string) => {
    if (planId === 'enterprise') {
      // Redirect to contact for enterprise
      window.location.href = '/contact';
      return;
    }

    setIsLoading(planId);
    
    try {
      const priceId = prices[planId as 'starter' | 'pro'][billingPeriod];
      const userEmail = user?.email;
      
      console.log('Attempting checkout with:', { priceId, userEmail, planId, billingPeriod });
      
      await handleCheckout(priceId, userEmail);
    } catch (error) {
      console.error('Error handling checkout:', error);
      alert('Erreur lors de la création de la session de paiement. Veuillez réessayer.');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-6 bg-gradient-to-b from-neutral-50 to-white">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <SparklesIcon className="h-4 w-4" />
              <span>Offre de lancement - 50 premiers clients</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6 leading-tight">
              Choisissez votre plan
              <span className="block text-green-600">Kritiqo</span>
            </h1>
            
            <p className="text-xl text-neutral-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Des tarifs transparents et équitables pour toutes les tailles d'entreprise. 
              Commencez gratuitement, évoluez selon vos besoins.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-12">
              <span className={`text-lg font-medium ${billingPeriod === 'monthly' ? 'text-neutral-900' : 'text-neutral-500'}`}>
                Mensuel
              </span>
              <button
                onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
                className="relative inline-flex h-6 w-12 items-center rounded-full bg-neutral-200 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${billingPeriod === 'yearly' ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
              <span className={`text-lg font-medium ${billingPeriod === 'yearly' ? 'text-neutral-900' : 'text-neutral-500'}`}>
                Annuel
              </span>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                -20%
              </span>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center gap-8 text-sm text-neutral-500 mb-8">
              <span className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-green-500" />
                Sans engagement
              </span>
              <span className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-green-500" />
                Garantie 30 jours
              </span>
              <span className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-green-500" />
                Support inclus
              </span>
              <span className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-green-500" />
                Conformité RGPD
              </span>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-8 lg:grid-cols-3">
              {plans.map((plan) => (
                <div key={plan.id} className="relative">
                  {/* Badge Container */}
                  {(plan.popular || plan.launchOffer) && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                      {plan.popular ? (
                        <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 shadow-lg whitespace-nowrap">
                          <StarIcon className="h-4 w-4" />
                          <span>Plus populaire</span>
                        </div>
                      ) : (
                        <div className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 shadow-lg whitespace-nowrap">
                          <SparklesIcon className="h-4 w-4" />
                          <span>Offre de lancement</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Card */}
                  <div className={`relative rounded-2xl border-2 p-8 ${
                    plan.popular 
                      ? 'border-green-500 bg-green-50 shadow-xl' 
                      : 'border-neutral-200 bg-white shadow-lg'
                  } ${(plan.popular || plan.launchOffer) ? 'pt-12' : 'pt-8'}`}>

                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                        {plan.name}
                      </h3>
                      <p className="text-neutral-600 mb-4">
                        {plan.subtitle}
                      </p>
                      
                      <div className="mb-4">
                        {plan.price === 'Sur devis' ? (
                          <div className="text-3xl font-bold text-neutral-900">
                            Sur devis
                          </div>
                        ) : (
                          <div className="flex items-baseline justify-center">
                            {plan.originalPrice && (
                              <span className="text-lg text-neutral-400 line-through mr-2">
                                {billingPeriod === 'yearly' ? Math.round(parseInt(plan.originalPrice) * 0.8) : plan.originalPrice}€
                              </span>
                            )}
                            <span className="text-4xl font-bold text-neutral-900">
                              {getPrice(plan.price)}€
                            </span>
                            <span className="text-neutral-600 ml-1">
                              {billingPeriod === 'yearly' ? '/mois (facturé annuellement)' : plan.period}
                            </span>
                          </div>
                        )}
                        {plan.launchOffer && (
                          <p className="text-sm text-orange-600 font-medium mt-2">
                            Prix de lancement pour les 50 premiers clients
                          </p>
                        )}
                      </div>

                      <p className="text-neutral-600 mb-6">
                        {plan.description}
                      </p>

                      <button
                        onClick={() => handlePlanSelection(plan.id)}
                        disabled={isLoading === plan.id}
                        className={`block w-full py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                          plan.popular
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-neutral-900 text-white hover:bg-neutral-800'
                        }`}
                      >
                        {isLoading === plan.id ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Chargement...
                          </div>
                        ) : (
                          plan.cta
                        )}
                      </button>
                    </div>

                    <div className="space-y-4 mb-6">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-neutral-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {plan.limits.length > 0 && (
                      <div className="border-t border-neutral-200 pt-6">
                        <p className="text-sm font-medium text-neutral-500 mb-3">Limitations :</p>
                        <div className="space-y-2">
                          {plan.limits.map((limit, index) => (
                            <div key={index} className="flex items-start space-x-3">
                              <XMarkIcon className="h-4 w-4 text-neutral-400 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-neutral-500">{limit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Comparison */}
        <section className="py-20 px-6 bg-neutral-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                Comparaison détaillée
              </h2>
              <p className="text-xl text-neutral-600">
                Toutes les fonctionnalités de chaque plan en détail
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {features.map((category, categoryIndex) => (
                <div key={categoryIndex} className={categoryIndex > 0 ? 'border-t border-neutral-200' : ''}>
                  <div className="bg-neutral-50 px-6 py-4">
                    <h3 className="text-lg font-semibold text-neutral-900">
                      {category.category}
                    </h3>
                  </div>
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="grid grid-cols-4 gap-4 px-6 py-4 border-b border-neutral-100 last:border-b-0">
                      <div className="font-medium text-neutral-900">
                        {item.name}
                      </div>
                      <div className="text-center">
                        {typeof item.starter === 'boolean' ? (
                          item.starter ? (
                            <CheckIcon className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <XMarkIcon className="h-5 w-5 text-neutral-400 mx-auto" />
                          )
                        ) : (
                          <span className="text-neutral-700">{item.starter}</span>
                        )}
                      </div>
                      <div className="text-center">
                        {typeof item.pro === 'boolean' ? (
                          item.pro ? (
                            <CheckIcon className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <XMarkIcon className="h-5 w-5 text-neutral-400 mx-auto" />
                          )
                        ) : (
                          <span className="text-neutral-700">{item.pro}</span>
                        )}
                      </div>
                      <div className="text-center">
                        {typeof item.enterprise === 'boolean' ? (
                          item.enterprise ? (
                            <CheckIcon className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <XMarkIcon className="h-5 w-5 text-neutral-400 mx-auto" />
                          )
                        ) : (
                          <span className="text-neutral-700">{item.enterprise}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                Pourquoi choisir Kritiqo ?
              </h2>
              <p className="text-xl text-neutral-600">
                Une solution pensée pour maximiser votre impact sur la réputation en ligne
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="bg-neutral-50 rounded-xl p-8 text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                  Configuration rapide
                </h3>
                <p className="text-neutral-600 mb-4">
                  "Votre première campagne d'avis en moins de 5 minutes"
                </p>
                <div className="text-2xl font-bold text-green-600">5 min setup</div>
              </div>

              <div className="bg-green-50 rounded-xl p-8 text-center border-2 border-green-200">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                  Résultats mesurables
                </h3>
                <p className="text-neutral-600 mb-4">
                  "Suivez l'impact réel sur votre visibilité et vos ventes"
                </p>
                <div className="text-2xl font-bold text-green-600">Analytics détaillés</div>
              </div>

              <div className="bg-neutral-50 rounded-xl p-8 text-center">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                  Évolutif et flexible
                </h3>
                <p className="text-neutral-600 mb-4">
                  "De 1 à 100+ établissements, la plateforme grandit avec vous"
                </p>
                <div className="text-2xl font-bold text-green-600">Sans limites</div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-6 bg-neutral-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                Questions sur les tarifs
              </h2>
              <p className="text-xl text-neutral-600">
                Les réponses aux questions les plus fréquentes
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-neutral-200">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-neutral-50 transition-colors"
                  >
                    <span className="font-semibold text-neutral-900">
                      {faq.question}
                    </span>
                    <QuestionMarkCircleIcon className={`h-5 w-5 text-neutral-400 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-4">
                      <p className="text-neutral-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
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
                Contactez notre équipe commerciale
                <ArrowRightIcon className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-6 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Prêt à commencer avec Kritiqo ?
            </h2>
            <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
              Rejoignez des centaines d'entreprises qui améliorent leur réputation en ligne 
              et gagnent du temps chaque jour.
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
                Parler à un expert
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-sm text-neutral-400">
              <span className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-green-500" />
                Aucune carte bancaire requise
              </span>
              <span className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-green-500" />
                Configuration en 5 minutes
              </span>
              <span className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-green-500" />
                Support français inclus
              </span>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
