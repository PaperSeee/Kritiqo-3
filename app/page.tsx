"use client";

import Image from "next/image";
import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="w-full">
      {/* Sticky Header */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-neutral-200 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Kritiqo
          </h1>
          {/* bouton mobile */}
          <button
            className="md:hidden p-2 text-neutral-600 hover:text-neutral-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
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
              href="#testimonials"
              className="text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Témoignages
            </a>
            <a
              href="/login"
              className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
            >
              Se connecter
            </a>
          </nav>
        </div>
        {/* menu mobile */}
        {mobileMenuOpen && (
          <nav className="md:hidden bg-white border-t border-neutral-200">
            <div className="flex flex-col px-6 py-4 space-y-4">
              <a
                href="#features"
                className="text-neutral-600 hover:text-neutral-900"
              >
                Fonctionnalités
              </a>
              <a
                href="#demo"
                className="text-neutral-600 hover:text-neutral-900"
              >
                Démonstration
              </a>
              <a
                href="#testimonials"
                className="text-neutral-600 hover:text-neutral-900"
              >
                Témoignages
              </a>
              <a
                href="/login"
                className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800"
              >
                Se connecter
              </a>
            </div>
          </nav>
        )}
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="text-5xl md:text-6xl font-bold text-neutral-900 mb-6 leading-tight">
          Centralisez vos avis.
          <br />
          <span className="text-neutral-600">Organisez vos mails.</span>
          <br />
          <span className="text-emerald-600">Gagnez du temps.</span>
        </h2>
        <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
          Un outil simple pour les commerces qui veulent se concentrer sur
          l'essentiel : satisfaire leurs clients.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/signup"
            className="inline-block bg-neutral-900 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-neutral-800 transition-colors"
          >
            Commencer gratuitement
          </a>
          <a
            href="#demo"
            className="inline-block border border-neutral-300 text-neutral-700 px-8 py-4 rounded-lg text-lg font-medium hover:bg-neutral-50 transition-colors"
          >
            Voir la démonstration
          </a>
        </div>
        <p className="text-sm text-neutral-500 mt-4">
          Gratuit pendant 14 jours • Aucune carte requise
        </p>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-neutral-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center mb-12 text-neutral-900">
            Tout ce dont vous avez besoin en un seul endroit
          </h3>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-200">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-3 text-neutral-800">
                Gestion des Avis
              </h4>
              <p className="text-neutral-600">
                Centralisez tous vos avis clients et répondez-y facilement depuis
                une interface unique.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-200">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-3 text-neutral-800">
                Organisation des Emails
              </h4>
              <p className="text-neutral-600">
                Triez et organisez automatiquement vos emails clients pour ne rien
                manquer d'important.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-3 text-neutral-800">
                Analyses & Rapports
              </h4>
              <p className="text-neutral-600">
                Suivez vos performances et identifiez les axes d'amélioration
                avec des rapports détaillés.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section with QR Code */}
      <section id="demo" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4 text-neutral-900">
              Découvrez Kritiqo en action
            </h3>
            <p className="text-lg text-neutral-600">
              Scannez le QR code pour voir notre dashboard en direct
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center">
              <div className="bg-white p-8 rounded-xl shadow-lg border border-neutral-200 inline-block">
                <div className="w-48 h-48 bg-neutral-100 rounded-lg flex items-center justify-center mb-4">
                  {/* QR Code placeholder */}
                  <div className="w-40 h-40 bg-gradient-to-br from-neutral-800 to-neutral-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs text-center">
                      QR Code
                      <br />
                      Demo
                    </span>
                  </div>
                </div>
                <p className="text-sm text-neutral-600">
                  Scannez avec votre téléphone
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 p-8 rounded-xl">
              <h4 className="text-xl font-semibold mb-4 text-neutral-800">
                Aperçu du Dashboard
              </h4>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-neutral-200">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="font-medium text-neutral-800">Avis récents</h5>
                  <span className="text-sm text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                    +12% ce mois
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex text-yellow-400">★★★★★</div>
                    <span className="text-sm text-neutral-600">
                      "Service excellent, je recommande !"
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex text-yellow-400">★★★★☆</div>
                    <span className="text-sm text-neutral-600">
                      "Très satisfait de mon achat"
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex text-yellow-400">★★★★★</div>
                    <span className="text-sm text-neutral-600">
                      "Livraison rapide et produit conforme"
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="bg-neutral-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center mb-12 text-neutral-900">
            Ils nous font confiance
          </h3>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
              <div className="flex text-yellow-400 mb-4">★★★★★</div>
              <p className="text-neutral-700 mb-4">
                "Kritiqo nous a fait gagner un temps énorme dans la gestion de nos
                avis clients. Interface intuitive et support réactif."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neutral-200 rounded-full"></div>
                <div>
                  <p className="font-medium text-neutral-800">Marie Dubois</p>
                  <p className="text-sm text-neutral-600">
                    Propriétaire, Café des Arts
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
              <div className="flex text-yellow-400 mb-4">★★★★★</div>
              <p className="text-neutral-700 mb-4">
                "Depuis qu'on utilise Kritiqo, notre note moyenne a augmenté de
                0.5 étoile. On répond plus vite aux clients mécontents."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neutral-200 rounded-full"></div>
                <div>
                  <p className="font-medium text-neutral-800">Jean Martin</p>
                  <p className="text-sm text-neutral-600">
                    Gérant, Restaurant Le Bistrot
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
              <div className="flex text-yellow-400 mb-4">★★★★★</div>
              <p className="text-neutral-700 mb-4">
                "L'organisation automatique des emails nous évite de perdre des
                messages importants. Un gain de productivité réel."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neutral-200 rounded-full"></div>
                <div>
                  <p className="font-medium text-neutral-800">Sophie Lefebvre</p>
                  <p className="text-sm text-neutral-600">
                    Directrice, Boutique Mode & Style
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-4 text-neutral-900">
            Prêt à simplifier la gestion de votre commerce ?
          </h3>
          <p className="text-lg text-neutral-600 mb-8">
            Rejoignez des centaines de commerces qui utilisent déjà Kritiqo pour
            améliorer leur relation client.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/signup"
              className="inline-block bg-neutral-900 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-neutral-800 transition-colors"
            >
              Essayer gratuitement
            </a>
            <a
              href="/contact"
              className="inline-block border border-neutral-300 text-neutral-700 px-8 py-4 rounded-lg text-lg font-medium hover:bg-neutral-50 transition-colors"
            >
              Parler à un expert
            </a>
          </div>
          <p className="text-sm text-neutral-500 mt-6">
            14 jours gratuits • Configuration en 5 minutes • Support dédié
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
                    href="#"
                    className="hover:text-white transition-colors"
                  >
                    Carrières
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-800 mt-8 pt-8 text-center text-neutral-400">
            <p>&copy; 2024 Kritiqo. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
