"use client";

import { useState, useEffect, Suspense } from "react";
import { useAuth } from '@/hooks/useAuth';
import { useSearchParams } from 'next/navigation';
import { handleCheckout } from '@/lib/stripe';
import { 
  CheckIcon,
  StarIcon,
  SparklesIcon,
  ArrowRightIcon,
  QuestionMarkCircleIcon,
  QrCodeIcon,
  ChartBarIcon,
  EnvelopeIcon,
  ClockIcon,
  FireIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Header from '../../components/Header';
import Footer from '../../components/Footer';

function PricingContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [spotsLeft] = useState(50); // Updated to 50 spots
  const canceled = searchParams.get('canceled');

  useEffect(() => {
    if (canceled) {
      console.log('Payment was canceled');
    }
  }, [canceled]);

  const launchPriceId = 'price_1RSzAKEHLYeVzQDZFcOdgFnU'; // Launch offer price ID

  const features = [
    {
      icon: StarIcon,
      title: 'Centralisation des avis',
      description: 'Google, Facebook et plus - tout au même endroit'
    },
    {
      icon: QrCodeIcon,
      title: 'Générateur de page d\'avis + QR code',
      description: 'Collectez plus d\'avis facilement'
    },
    {
      icon: EnvelopeIcon,
      title: 'Filtrage intelligent des emails',
      description: 'Factures, clients, urgences... triés automatiquement'
    },
    {
      icon: SparklesIcon,
      title: 'Suggestions IA',
      description: 'Pour répondre aux avis et messages efficacement'
    },
    {
      icon: ChartBarIcon,
      title: 'Tableau de bord ultra simple',
      description: 'Gérez tout depuis une seule interface'
    },
    {
      icon: StarIcon,
      title: 'Surveillance par mots-clés',
      description: 'Surveillez ce qu\'on dit de votre établissement en ligne'
    }
  ];

  const faqs = [
    {
      question: 'Cette offre est-elle vraiment limitée ?',
      answer: 'Oui, nous limitons volontairement cette offre aux 50 premiers clients pour nous assurer de pouvoir accompagner chacun personnellement lors du lancement.'
    },
    {
      question: 'Le prix restera-t-il à 14€/mois à vie ?',
      answer: 'Absolument ! Une fois que vous êtes client à 14€/mois, ce tarif est maintenu à vie. Les nouveaux clients après ces 50 places paieront 19€/mois.'
    },
    {
      question: 'Puis-je annuler à tout moment ?',
      answer: 'Oui, aucun engagement. Vous pouvez annuler votre abonnement à tout moment depuis votre tableau de bord.'
    },
    {
      question: 'Y a-t-il une période d\'essai ?',
      answer: 'Oui, vous bénéficiez de 14 jours d\'essai gratuit pour tester toutes les fonctionnalités avant d\'être facturé.'
    },
    {
      question: 'Le support est-il inclus ?',
      answer: 'Oui, le support par email est inclus ainsi qu\'une formation personnalisée pour vous aider à bien démarrer.'
    },
    {
      question: 'Que se passe-t-il après les 50 places ?',
      answer: 'Une fois les 50 places écoulées, le tarif passera à 19€/mois pour les nouveaux clients. Mais vous gardez votre tarif préférentiel à vie.'
    }
  ];

  const handleLaunchOffer = async () => {
    setIsLoading(true);
    
    try {
      const userEmail = user?.email;
      
      // Handle null email case
      if (!userEmail) {
        alert('Veuillez vous connecter pour continuer.');
        return;
      }
      
      console.log('Starting checkout for launch offer:', { priceId: launchPriceId, userEmail });
      
      await handleCheckout(launchPriceId, userEmail);
    } catch (error) {
      console.error('Error handling checkout:', error);
      alert('Erreur lors de la création de la session de paiement. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-6 bg-gradient-to-b from-neutral-50 to-white">
          <div className="max-w-4xl mx-auto text-center">
            {/* Removed urgency badge */}
            
            <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6 leading-tight">
              Tarif de lancement
              <span className="block text-red-600">exceptionnel</span>
            </h1>
            
            <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Seulement 14€/mois pour les 50 premiers clients
            </p>

            {/* Price Section */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-neutral-200 p-8 mb-8 max-w-md mx-auto">
              <div className="text-center">
                <div className="flex items-baseline justify-center mb-4">
                  <span className="text-lg text-neutral-400 line-through mr-3">19€</span>
                  <span className="text-5xl font-bold text-neutral-900">14€</span>
                  <span className="text-neutral-600 ml-2">/mois TTC</span>
                </div>
                
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  Offre à vie - Prix maintenu pour toujours
                </div>

                <button
                  onClick={handleLaunchOffer}
                  disabled={isLoading}
                  className="w-full bg-red-600 text-white py-4 px-8 rounded-lg text-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Chargement...
                    </div>
                  ) : (
                    <>
                      Je profite de l'offre à 14€/mois
                      <ArrowRightIcon className="h-5 w-5 ml-2 inline" />
                    </>
                  )}
                </button>

                <p className="text-sm text-neutral-500 mt-4">
                  ✓ 14 jours d'essai gratuit • ✓ Sans engagement • ✓ Support inclus
                </p>
              </div>
            </div>

            {/* Timer */}
            <div className="flex items-center justify-center space-x-2 text-sm text-neutral-600">
              <ClockIcon className="h-4 w-4" />
              <span>Offre limitée aux 50 premiers clients</span>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                Tout ce dont vous avez besoin
              </h2>
              <p className="text-xl text-neutral-600">
                Une solution complète pour gérer votre réputation en ligne
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div key={index} className="text-center p-6">
                  <div className="bg-neutral-100 rounded-xl p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <feature.icon className="h-8 w-8 text-neutral-600" />
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

        {/* Social Proof */}
        <section className="py-16 px-6 bg-neutral-50">
          <div className="max-w-4xl mx-auto text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-2xl font-bold text-neutral-900 mb-2">⚡ 5 min</div>
                <p className="text-neutral-600">Configuration complète</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-2xl font-bold text-neutral-900 mb-2">🎯 +40%</div>
                <p className="text-neutral-600">D'avis en moyenne</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-2xl font-bold text-neutral-900 mb-2">💪 100%</div>
                <p className="text-neutral-600">Automatisé</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                Questions fréquentes
              </h2>
              <p className="text-xl text-neutral-600">
                Tout ce que vous devez savoir sur cette offre
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-neutral-50 rounded-lg border border-neutral-200">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-neutral-100 transition-colors"
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
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-6 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ne ratez pas cette opportunité
            </h2>
            <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
              Rejoignez les entrepreneurs qui ont déjà sécurisé leur tarif à vie
            </p>
            
            <div className="bg-green-600 text-white px-6 py-3 rounded-lg inline-block mb-8 font-medium">
              ✅ Places disponibles sur cette offre
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleLaunchOffer}
                disabled={isLoading}
                className="bg-red-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Chargement...' : 'Réserver ma place à 14€/mois'}
              </button>
              <Link
                href="/contact"
                className="border border-neutral-400 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-white/10 transition-colors"
              >
                Poser une question
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-sm text-neutral-400 mt-8">
              <span className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-green-500" />
                Prix maintenu à vie
              </span>
              <span className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-green-500" />
                14 jours d'essai gratuit
              </span>
              <span className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-green-500" />
                Sans engagement
              </span>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-neutral-900"></div>
      </div>
    }>
      <PricingContent />
    </Suspense>
  );
}
