"use client";

import { useState } from "react";
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from "@heroicons/react/24/outline";
import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
    setFormData({
      name: '',
      email: '',
      company: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
            Contactez-nous
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Une question sur Kritiqo ? Besoin d'aide pour configurer votre compte ?
            Notre équipe est là pour vous accompagner.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-6">
              Envoyez-nous un message
            </h2>

            {isSubmitted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  Message envoyé !
                </h3>
                <p className="text-green-600">
                  Nous vous répondrons dans les plus brefs délais.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Entreprise
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                    placeholder="Nom de votre entreprise"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Sujet *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="demo">Demande de démonstration</option>
                    <option value="support">Support technique</option>
                    <option value="pricing">Questions sur les tarifs</option>
                    <option value="partnership">Partenariat</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent resize-none"
                    placeholder="Décrivez votre besoin ou votre question..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-neutral-900 text-white px-6 py-3 rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
                </button>
              </form>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-neutral-50 rounded-xl p-8">
              <h3 className="text-xl font-semibold text-neutral-900 mb-6">
                Autres moyens de nous contacter
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-neutral-900 rounded-lg flex items-center justify-center">
                    <EnvelopeIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-900 mb-1">Email</h4>
                    <p className="text-neutral-600">contact@kritiqo.com</p>
                    <p className="text-sm text-neutral-500">
                      Réponse sous 24h en moyenne
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-neutral-900 rounded-lg flex items-center justify-center">
                    <PhoneIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-900 mb-1">Téléphone</h4>
                    <p className="text-neutral-600">+33 1 23 45 67 89</p>
                    <p className="text-sm text-neutral-500">
                      Lun-Ven 9h-18h
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-neutral-900 rounded-lg flex items-center justify-center">
                    <MapPinIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-900 mb-1">Adresse</h4>
                    <p className="text-neutral-600">
                      123 Rue de la Innovation<br />
                      75001 Paris, France
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl border border-blue-200 p-8">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">
                💡 Besoin d'aide rapidement ?
              </h3>
              <ul className="space-y-3 text-blue-700">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Consultez notre centre d'aide en ligne</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Regardez nos tutoriels vidéo</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Rejoignez notre communauté Discord</span>
                </li>
              </ul>
            </div>

            <div className="bg-green-50 rounded-xl border border-green-200 p-8">
              <h3 className="text-xl font-semibold text-green-800 mb-4">
                🚀 Démonstration gratuite
              </h3>
              <p className="text-green-700 mb-4">
                Découvrez Kritiqo en action avec une démonstration personnalisée de 30 minutes.
              </p>
              <a
                href="/signup"
                className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Réserver ma démo
              </a>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-neutral-900 mb-12">
            Questions fréquentes
          </h2>
          
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-neutral-900 mb-2">
                  Comment fonctionne l'essai gratuit ?
                </h3>
                <p className="text-neutral-600 text-sm">
                  Vous bénéficiez de 14 jours d'accès complet à toutes les fonctionnalités de Kritiqo, sans engagement.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-neutral-900 mb-2">
                  Puis-je intégrer plusieurs restaurants ?
                </h3>
                <p className="text-neutral-600 text-sm">
                  Oui, vous pouvez ajouter autant de restaurants que vous voulez et gérer tous vos avis depuis un seul tableau de bord.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-neutral-900 mb-2">
                  Mes données sont-elles sécurisées ?
                </h3>
                <p className="text-neutral-600 text-sm">
                  Absolument. Nous utilisons un chiffrement de niveau bancaire et nous conformons au RGPD.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-neutral-900 mb-2">
                  Proposez-vous une formation ?
                </h3>
                <p className="text-neutral-600 text-sm">
                  Oui, nous offrons une formation complète et un support continu pour vous aider à tirer le meilleur parti de Kritiqo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
