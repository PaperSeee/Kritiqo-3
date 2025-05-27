"use client";

import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import Header from '../../components/Header';
import Footer from '../../components/Footer';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: "Qu'est-ce que Kritiqo ?",
    answer: "Kritiqo est une plateforme qui centralise la gestion de vos avis clients et organise vos emails automatiquement. Nous aidons les commerces à améliorer leur relation client en simplifiant la collecte et la gestion des retours.",
    category: "Général"
  },
  {
    id: 2,
    question: "Comment fonctionne l'essai gratuit ?",
    answer: "Vous bénéficiez de 14 jours d'accès complet à toutes les fonctionnalités de Kritiqo, sans engagement ni carte de crédit requise. Vous pouvez annuler à tout moment pendant cette période.",
    category: "Tarification"
  },
  {
    id: 3,
    question: "Puis-je ajouter plusieurs établissements ?",
    answer: "Oui, vous pouvez ajouter autant d'établissements que vous souhaitez. Chaque établissement aura sa propre page d'avis et son QR code personnalisé, le tout gérable depuis un seul tableau de bord.",
    category: "Fonctionnalités"
  },
  {
    id: 4,
    question: "Comment génère-t-on un QR code ?",
    answer: "Une fois votre établissement ajouté, Kritiqo génère automatiquement un QR code unique. Vos clients peuvent le scanner pour accéder directement à votre page d'avis personnalisée. Le QR code est téléchargeable en haute qualité pour impression.",
    category: "QR Codes"
  },
  {
    id: 5,
    question: "Les avis sont-ils vraiment centralisés ?",
    answer: "Oui, Kritiqo collecte et centralise vos avis provenant de Google, Facebook, et d'autres plateformes. Vous pouvez tout visualiser et gérer depuis un seul endroit, avec des outils pour répondre efficacement.",
    category: "Fonctionnalités"
  },
  {
    id: 6,
    question: "Mes données sont-elles sécurisées ?",
    answer: "Absolument. Nous utilisons un chiffrement de niveau bancaire (SSL/TLS) et nous nous conformons strictement au RGPD. Vos données ne sont jamais partagées avec des tiers et sont stockées sur des serveurs sécurisés.",
    category: "Sécurité"
  },
  {
    id: 7,
    question: "Comment fonctionne l'organisation automatique des emails ?",
    answer: "Notre IA analyse automatiquement vos emails et les classe par categories (Factures, RH, Clients, Admin). Elle assigne également un niveau de priorité pour vous aider à traiter les plus importants en premier.",
    category: "Emails"
  },
  {
    id: 8,
    question: "Puis-je connecter mes comptes Gmail et Outlook ?",
    answer: "Oui, Kritiqo s'intègre facilement avec Gmail et Outlook. Vous pouvez connecter plusieurs comptes email et basculer entre eux sans effort.",
    category: "Emails"
  },
  {
    id: 9,
    question: "Quels sont les tarifs après l'essai gratuit ?",
    answer: "Nous proposons plusieurs plans adaptés à la taille de votre entreprise, à partir de 9€/mois. Tous les plans incluent les fonctionnalités principales, avec des limites différentes selon vos besoins.",
    category: "Tarification"
  },
  {
    id: 10,
    question: "Y a-t-il une formation ou du support ?",
    answer: "Oui, nous offrons une formation complète lors de votre inscription, des tutoriels vidéo, une base de connaissances et un support client réactif. Notre équipe est là pour vous accompagner.",
    category: "Support"
  },
  {
    id: 11,
    question: "Puis-je annuler mon abonnement à tout moment ?",
    answer: "Oui, vous pouvez annuler votre abonnement à tout moment depuis votre tableau de bord. Il n'y a aucun engagement de durée et aucuns frais d'annulation.",
    category: "Tarification"
  },
  {
    id: 12,
    question: "Comment fonctionne la page d'avis personnalisée ?",
    answer: "Chaque établissement obtient une page d'avis unique avec votre branding. Vos clients peuvent y laisser des avis directement, et vous recevez une notification en temps réel pour pouvoir répondre rapidement.",
    category: "Fonctionnalités"
  },
  {
    id: 13,
    question: "Kritiqo fonctionne-t-il sur mobile ?",
    answer: "Oui, Kritiqo est entièrement responsive et fonctionne parfaitement sur tous les appareils : ordinateurs, tablettes et smartphones. Vous pouvez gérer vos avis en déplacement.",
    category: "Technique"
  },
  {
    id: 14,
    question: "Puis-je importer mes avis existants ?",
    answer: "Oui, nous pouvons vous aider à importer vos avis existants depuis Google My Business et d'autres plateformes. Contactez notre équipe support pour assistance.",
    category: "Migration"
  },
  {
    id: 15,
    question: "Y a-t-il une API disponible ?",
    answer: "Oui, nous proposons une API REST complète pour les développeurs qui souhaitent intégrer Kritiqo avec leurs systèmes existants. Documentation disponible sur demande.",
    category: "Technique"
  }
];

const categories = Array.from(new Set(faqData.map(item => item.category)));

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Tous");

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const filteredFAQ = selectedCategory === "Tous" 
    ? faqData 
    : faqData.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
            Questions fréquentes
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Trouvez rapidement les réponses à vos questions sur Kritiqo. 
            Si vous ne trouvez pas ce que vous cherchez, n'hésitez pas à nous contacter.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setSelectedCategory("Tous")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === "Tous"
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              Tous
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4 mb-12">
          {filteredFAQ.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-neutral-200 rounded-lg shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-neutral-50 transition-colors"
              >
                <span className="font-medium text-neutral-900 pr-4">
                  {item.question}
                </span>
                {openItems.includes(item.id) ? (
                  <ChevronUpIcon className="h-5 w-5 text-neutral-500 flex-shrink-0" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5 text-neutral-500 flex-shrink-0" />
                )}
              </button>
              
              {openItems.includes(item.id) && (
                <div className="px-6 pb-4">
                  <div className="border-t border-neutral-100 pt-4">
                    <p className="text-neutral-600 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="bg-neutral-50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">
            Vous ne trouvez pas votre réponse ?
          </h2>
          <p className="text-neutral-600 mb-6">
            Notre équipe support est là pour vous aider. Contactez-nous et nous vous répondrons rapidement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-block bg-neutral-900 text-white px-6 py-3 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              Contacter le support
            </a>
            <a
              href="/signup"
              className="inline-block border border-neutral-300 text-neutral-700 px-6 py-3 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              Essayer gratuitement
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="text-center">
            <h3 className="font-semibold text-neutral-900 mb-2">📚 Guides</h3>
            <p className="text-sm text-neutral-600 mb-3">
              Tutoriels pas-à-pas pour bien démarrer
            </p>
            <a href="#" className="text-neutral-700 hover:text-neutral-900 text-sm font-medium">
              Voir les guides →
            </a>
          </div>
          
          <div className="text-center">
            <h3 className="font-semibold text-neutral-900 mb-2">🎥 Démonstration</h3>
            <p className="text-sm text-neutral-600 mb-3">
              Regardez Kritiqo en action
            </p>
            <a href="#demo" className="text-neutral-700 hover:text-neutral-900 text-sm font-medium">
              Voir la démo →
            </a>
          </div>
          
          <div className="text-center">
            <h3 className="font-semibold text-neutral-900 mb-2">💬 Communauté</h3>
            <p className="text-sm text-neutral-600 mb-3">
              Échangez avec d'autres utilisateurs
            </p>
            <a href="#" className="text-neutral-700 hover:text-neutral-900 text-sm font-medium">
              Rejoindre →
            </a>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-12">
          <a
            href="/"
            className="inline-flex items-center text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            ← Retour à l'accueil
          </a>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}