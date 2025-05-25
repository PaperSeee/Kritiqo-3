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
                href="/contact"
                className="text-neutral-600 hover:text-neutral-900"
              >
                Contact
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

      {/* Launch Announcement Section */}
      <section id="features" className="bg-gradient-to-br from-emerald-50 via-white to-orange-50 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
            Lancement imminent
          </div>
          
          {/* Main Announcement */}
          <h3 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
            🚀 Kritiqo arrive bientôt !
          </h3>
          
          <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
            Soyez parmi les premiers à révolutionner la gestion de vos avis clients 
            et bénéficiez d'avantages exclusifs de lancement.
          </p>

          {/* Special Offer Box */}
          <div className="bg-white rounded-2xl shadow-xl border border-neutral-200 p-8 mb-10 max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <div className="inline-block bg-gradient-to-r from-emerald-600 to-orange-600 text-white px-6 py-2 rounded-full text-sm font-bold mb-4">
                OFFRE DE LANCEMENT
              </div>
              <h4 className="text-2xl font-bold text-neutral-900 mb-2">
                6 mois gratuits
              </h4>
              <p className="text-neutral-600">
                au lieu de 3 mois pour les 100 premiers inscrits
              </p>
            </div>
            
            {/* Benefits List */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center text-left">
                <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <svg className="w-3 h-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <span className="text-sm text-neutral-700">Accès prioritaire à toutes les fonctionnalités</span>
              </div>
              <div className="flex items-center text-left">
                <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <svg className="w-3 h-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <span className="text-sm text-neutral-700">Support premium dédié</span>
              </div>
              <div className="flex items-center text-left">
                <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <svg className="w-3 h-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <span className="text-sm text-neutral-700">Formation personnalisée incluse</span>
              </div>
              <div className="flex items-center text-left">
                <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <svg className="w-3 h-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <span className="text-sm text-neutral-700">Aucun engagement, résiliable à tout moment</span>
              </div>
            </div>

            {/* Early Access Form */}
            <div className="bg-neutral-50 rounded-xl p-6">
              <h5 className="font-semibold text-neutral-900 mb-4">
                Réservez votre accès anticipé
              </h5>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="votre@email.com"
                  className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-orange-600 text-white rounded-lg font-medium hover:from-emerald-700 hover:to-orange-700 transition-all">
                  Je réserve ma place
                </button>
              </div>
              <p className="text-xs text-neutral-500 mt-3 text-center">
                🔒 Vos données sont sécurisées. Pas de spam, promis !
              </p>
            </div>
          </div>

          {/* Counter */}
          <div className="flex items-center justify-center gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-emerald-600">67</div>
              <div className="text-sm text-neutral-600">places réservées</div>
            </div>
            <div className="w-px h-8 bg-neutral-300"></div>
            <div>
              <div className="text-2xl font-bold text-orange-600">33</div>
              <div className="text-sm text-neutral-600">places restantes</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="demo" className="py-20 bg-gradient-to-b from-white to-neutral-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <h3 className="text-4xl font-bold mb-6 text-neutral-900">
              Comment ça fonctionne ?
            </h3>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Découvrez comment Kritiqo transforme la gestion de vos avis clients en un processus simple et automatisé
            </p>
          </div>

          {/* Main Steps */}
          <div className="space-y-20">
            
            {/* Étape 1 - Configuration */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-xl font-bold text-white">1</span>
                  </div>
                  <h4 className="text-2xl font-bold text-neutral-900">
                    Configuration intelligente
                  </h4>
                </div>
                
                <p className="text-lg text-neutral-600 mb-8">
                  Connectez toutes vos plateformes d'avis et sources d'emails en quelques clics. 
                  Notre assistant intelligent détecte automatiquement vos comptes existants.
                </p>

                {/* Sub-steps */}
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                      <svg className="w-3 h-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <h5 className="font-semibold text-neutral-800">Connexion automatique</h5>
                      <p className="text-neutral-600">Google My Business, Facebook, TripAdvisor, Yelp détectés automatiquement</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                      <svg className="w-3 h-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <h5 className="font-semibold text-neutral-800">Synchronisation emails</h5>
                      <p className="text-neutral-600">Gmail, Outlook, et boîtes professionnelles intégrées en un clic</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                      <svg className="w-3 h-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <h5 className="font-semibold text-neutral-800">Paramétrage personnalisé</h5>
                      <p className="text-neutral-600">Filtres, notifications et préférences configurés selon votre activité</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="flex items-center text-emerald-800">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span className="font-medium">Temps moyen de configuration : 5 minutes</span>
                  </div>
                </div>
              </div>
              
              <div className="order-1 lg:order-2">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-neutral-200">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-500 rounded mr-3"></div>
                        <span className="font-medium">Google My Business</span>
                      </div>
                      <span className="text-emerald-600 font-medium">✓ Connecté</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-600 rounded mr-3"></div>
                        <span className="font-medium">Facebook</span>
                      </div>
                      <span className="text-emerald-600 font-medium">✓ Connecté</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-red-500 rounded mr-3"></div>
                        <span className="font-medium">Gmail</span>
                      </div>
                      <span className="text-orange-500 font-medium">● En cours...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Étape 2 - Centralisation */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-neutral-200">
                  <div className="mb-4">
                    <h6 className="font-semibold text-neutral-800 mb-2">Tableau de bord unifié</h6>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-emerald-50 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-emerald-600">12</div>
                        <div className="text-xs text-emerald-700">Nouveaux avis</div>
                      </div>
                      <div className="bg-orange-50 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-orange-600">5</div>
                        <div className="text-xs text-orange-700">À traiter</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start p-3 bg-neutral-50 rounded-lg">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3"></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">Excellent service ⭐⭐⭐⭐⭐</div>
                        <div className="text-xs text-neutral-600">Google • Il y a 2h</div>
                      </div>
                    </div>
                    <div className="flex items-start p-3 bg-neutral-50 rounded-lg">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3"></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">Question sur les horaires</div>
                        <div className="text-xs text-neutral-600">Email • Il y a 1h</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-xl font-bold text-white">2</span>
                  </div>
                  <h4 className="text-2xl font-bold text-neutral-900">
                    Centralisation intelligente
                  </h4>
                </div>
                
                <p className="text-lg text-neutral-600 mb-8">
                  Tous vos avis, emails et messages clients arrivent dans un tableau de bord unique. 
                  Notre IA classe automatiquement par priorité et urgence.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                      <svg className="w-3 h-3 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <h5 className="font-semibold text-neutral-800">Classification automatique</h5>
                      <p className="text-neutral-600">Avis positifs, négatifs, questions, réclamations triés automatiquement</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                      <svg className="w-3 h-3 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <h5 className="font-semibold text-neutral-800">Alertes intelligentes</h5>
                      <p className="text-neutral-600">Notifications prioritaires pour les avis négatifs et urgences</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                      <svg className="w-3 h-3 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <h5 className="font-semibold text-neutral-800">Vue d'ensemble en temps réel</h5>
                      <p className="text-neutral-600">Statistiques live de votre réputation et performance client</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center text-orange-800">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span className="font-medium">Économie de temps : 75% par rapport aux méthodes manuelles</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Étape 3 - Réponse et Analyse */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-xl font-bold text-white">3</span>
                  </div>
                  <h4 className="text-2xl font-bold text-neutral-900">
                    Réponse assistée & Analytics
                  </h4>
                </div>
                
                <p className="text-lg text-neutral-600 mb-8">
                  Répondez 3x plus rapidement grâce à nos suggestions IA personnalisées et 
                  suivez votre performance avec des rapports détaillés automatiques.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                      <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <h5 className="font-semibold text-neutral-800">Réponses suggérées par IA</h5>
                      <p className="text-neutral-600">Modèles personnalisés selon votre ton et votre secteur d'activité</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                      <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <h5 className="font-semibold text-neutral-800">Rapports automatiques</h5>
                      <p className="text-neutral-600">Analyses hebdomadaires de votre réputation et points d'amélioration</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                      <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <h5 className="font-semibold text-neutral-800">Suivi de performance</h5>
                      <p className="text-neutral-600">Évolution de votre note moyenne et satisfaction client en temps réel</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-purple-800 text-center">
                      <div className="text-2xl font-bold">3x</div>
                      <div className="text-sm">plus de réponses</div>
                    </div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-purple-800 text-center">
                      <div className="text-2xl font-bold">24h</div>
                      <div className="text-sm">temps de réponse</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="order-1 lg:order-2">
                <div className="space-y-4">
                  {/* Exemple de réponse IA */}
                  <div className="bg-white rounded-2xl shadow-xl p-6 border border-neutral-200">
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h6 className="font-semibold text-neutral-800">Réponse suggérée</h6>
                        <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">IA</span>
                      </div>
                      <div className="text-sm text-neutral-600 bg-neutral-50 p-3 rounded-lg mb-3">
                        "Service décevant, attente trop longue" ⭐⭐
                      </div>
                      <div className="text-sm bg-green-50 p-3 rounded-lg border border-green-200">
                        "Bonjour [Nom], merci pour votre retour. Nous sommes désolés que votre expérience n'ait pas été à la hauteur de vos attentes. Nous aimerions corriger cela..."
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-2 bg-purple-600 text-white rounded text-sm font-medium">Utiliser cette réponse</button>
                      <button className="px-3 py-2 border border-neutral-300 rounded text-sm">Modifier</button>
                    </div>
                  </div>

                  {/* Dashboard analytics */}
                  <div className="bg-white rounded-2xl shadow-xl p-6 border border-neutral-200">
                    <h6 className="font-semibold text-neutral-800 mb-4">Analyse de performance</h6>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-neutral-600">Note moyenne</span>
                        <div className="flex items-center">
                          <span className="text-lg font-bold text-emerald-600">4.3</span>
                          <span className="text-xs text-emerald-600 ml-1">↗ +0.2</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-neutral-600">Temps de réponse</span>
                        <div className="flex items-center">
                          <span className="text-lg font-bold text-orange-600">18h</span>
                          <span className="text-xs text-orange-600 ml-1">↗ -6h</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-neutral-600">Taux de réponse</span>
                        <div className="flex items-center">
                          <span className="text-lg font-bold text-purple-600">89%</span>
                          <span className="text-xs text-purple-600 ml-1">↗ +12%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bonus Features */}
          <div className="mt-20 bg-gradient-to-r from-neutral-50 to-neutral-100 rounded-2xl p-8">
            <div className="text-center mb-12">
              <h4 className="text-2xl font-bold text-neutral-900 mb-4">
                Et ce n'est pas tout...
              </h4>
              <p className="text-neutral-600">
                Découvrez toutes les fonctionnalités qui font de Kritiqo l'outil indispensable des professionnels
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 7h5l-5-5v5z"/>
                  </svg>
                </div>
                <h5 className="font-semibold text-neutral-800 mb-2">Auto-réponses</h5>
                <p className="text-sm text-neutral-600">Réponses automatiques pour les avis positifs standards</p>
              </div>

              <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                </div>
                <h5 className="font-semibold text-neutral-800 mb-2">Rapports détaillés</h5>
                <p className="text-sm text-neutral-600">Analytics complets avec export PDF et Excel</p>
              </div>

              <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"/>
                  </svg>
                </div>
                <h5 className="font-semibold text-neutral-800 mb-2">Équipe collaborative</h5>
                <p className="text-sm text-neutral-600">Assignation des avis à vos collaborateurs</p>
              </div>

              <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 7h5l-5-5v5z"/>
                  </svg>
                </div>
                <h5 className="font-semibold text-neutral-800 mb-2">Alertes critiques</h5>
                <p className="text-sm text-neutral-600">Notifications instantanées pour les avis négatifs</p>
              </div>
            </div>
          </div>

          {/* Final Statistics */}
          <div className="mt-16 grid gap-8 md:grid-cols-3 bg-gradient-to-r from-emerald-500 to-orange-500 rounded-2xl p-8 text-white">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">75%</div>
              <p className="opacity-90">
                de temps économisé sur la gestion des avis
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">3x</div>
              <p className="opacity-90">
                plus de réponses aux avis clients
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">24h</div>
              <p className="opacity-90">
                temps de réponse moyen divisé par 4
              </p>
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
  );
}
