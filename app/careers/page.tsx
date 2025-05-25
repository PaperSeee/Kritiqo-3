npm install --save-dev @types/uuid"use client";

import { useState } from "react";
import { 
  BriefcaseIcon, 
  MapPinIcon, 
  UsersIcon,
  RocketLaunchIcon,
  HeartIcon,
  PaperAirplaneIcon
} from "@heroicons/react/24/outline";
import CVUploadForm from "@/components/forms/CVUploadForm";

const companyValues = [
  {
    icon: RocketLaunchIcon,
    title: 'Innovation',
    description: 'Nous repoussons constamment les limites pour créer des solutions qui révolutionnent la gestion d\'avis.'
  },
  {
    icon: UsersIcon,
    title: 'Esprit d\'équipe',
    description: 'La collaboration et l\'entraide sont au cœur de notre culture d\'entreprise.'
  },
  {
    icon: HeartIcon,
    title: 'Passion client',
    description: 'Chaque décision est prise en pensant à l\'impact positif sur nos utilisateurs.'
  }
];

const departments = [
  'Engineering',
  'Product',
  'Sales',
  'Marketing',
  'Customer Success',
  'Design',
  'Autre'
];

export default function CareersPage() {
  const [applicationForm, setApplicationForm] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    experience: '',
    skills: '',
    motivation: '',
    linkedin: '',
    portfolio: ''
  });

  const [showCVUpload, setShowCVUpload] = useState(false);

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    alert('Candidature spontanée envoyée avec succès ! Nous vous recontacterons rapidement.');
    setApplicationForm({
      name: '',
      email: '',
      phone: '',
      department: '',
      experience: '',
      skills: '',
      motivation: '',
      linkedin: '',
      portfolio: ''
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
            Rejoignez l'aventure Kritiqo
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto mb-8">
            Nous construisons l'avenir de la gestion d'avis clients. 
            Rejoignez une équipe passionnée qui révolutionne l'expérience client pour des milliers de commerces.
          </p>
          <div className="flex justify-center gap-8 text-sm text-neutral-500">
            <span className="flex items-center gap-2">
              <UsersIcon className="h-4 w-4" />
              25+ employés
            </span>
            <span className="flex items-center gap-2">
              <MapPinIcon className="h-4 w-4" />
              Paris, Lyon, Remote
            </span>
            <span className="flex items-center gap-2">
              <RocketLaunchIcon className="h-4 w-4" />
              Startup en croissance
            </span>
          </div>
        </div>

        {/* Company Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-neutral-900 mb-12">
            Nos valeurs
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {companyValues.map((value, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-neutral-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Spontaneous Application */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <PaperAirplaneIcon className="h-16 w-16 text-neutral-900 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Candidature spontanée
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Vous ne trouvez pas d'offre qui vous correspond ? Présentez-vous et vos compétences, 
              nous serions ravis de découvrir votre profil !
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* CV Upload Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-blue-800">
                  📄 Téléchargez votre CV
                </h3>
                <button
                  onClick={() => setShowCVUpload(!showCVUpload)}
                  className="text-blue-600 hover:text-blue-800 text-sm underline"
                >
                  {showCVUpload ? 'Masquer' : 'Afficher le gestionnaire de CV'}
                </button>
              </div>
              
              <p className="text-blue-700 text-sm mb-4">
                Téléchargez votre CV pour qu'il soit automatiquement joint à votre candidature.
              </p>
              
              {showCVUpload && (
                <CVUploadForm 
                  onUploadComplete={() => {
                    // Optionally show success message
                  }}
                  showList={true}
                />
              )}
            </div>

            <div className="bg-white border border-neutral-200 rounded-xl p-8 shadow-sm">
              <form onSubmit={handleSubmitApplication} className="space-y-6">
                {/* Personal Info */}
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                    Informations personnelles
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        required
                        value={applicationForm.name}
                        onChange={(e) => setApplicationForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={applicationForm.email}
                        onChange={(e) => setApplicationForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        value={applicationForm.phone}
                        onChange={(e) => setApplicationForm(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Département d'intérêt *
                      </label>
                      <select
                        required
                        value={applicationForm.department}
                        onChange={(e) => setApplicationForm(prev => ({ ...prev, department: e.target.value }))}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                      >
                        <option value="">Sélectionner un département</option>
                        {departments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Professional Info */}
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                    Profil professionnel
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Expérience professionnelle *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={applicationForm.experience}
                      onChange={(e) => setApplicationForm(prev => ({ ...prev, experience: e.target.value }))}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent resize-none"
                      placeholder="Décrivez brièvement votre parcours professionnel et vos principales expériences..."
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Compétences clés *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={applicationForm.skills}
                      onChange={(e) => setApplicationForm(prev => ({ ...prev, skills: e.target.value }))}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent resize-none"
                      placeholder="Listez vos compétences techniques et soft skills principales..."
                    />
                  </div>
                </div>

                {/* Motivation */}
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                    Motivation
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Pourquoi souhaitez-vous rejoindre Kritiqo ? *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={applicationForm.motivation}
                      onChange={(e) => setApplicationForm(prev => ({ ...prev, motivation: e.target.value }))}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent resize-none"
                      placeholder="Parlez-nous de votre motivation pour rejoindre notre équipe et de ce que vous pourriez apporter à Kritiqo..."
                    />
                  </div>
                </div>

                {/* Links */}
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                    Liens (optionnel)
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        LinkedIn
                      </label>
                      <input
                        type="url"
                        value={applicationForm.linkedin}
                        onChange={(e) => setApplicationForm(prev => ({ ...prev, linkedin: e.target.value }))}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                        placeholder="https://linkedin.com/in/votre-profil"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Portfolio / Site web
                      </label>
                      <input
                        type="url"
                        value={applicationForm.portfolio}
                        onChange={(e) => setApplicationForm(prev => ({ ...prev, portfolio: e.target.value }))}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                        placeholder="https://votre-portfolio.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-neutral-200">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-green-700">
                      <strong>💡 Astuce:</strong> Si vous avez téléchargé un CV, 
                      il sera automatiquement joint à votre candidature.
                    </p>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-neutral-900 text-white py-4 rounded-lg hover:bg-neutral-800 transition-colors text-lg font-medium"
                  >
                    Envoyer ma candidature spontanée
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Why Join Us */}
        <div className="bg-neutral-50 rounded-xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6 text-center">
            Pourquoi rejoindre Kritiqo ?
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">Impact réel</h3>
                  <p className="text-sm text-neutral-600">
                    Votre travail impacte directement des milliers de commerces et leurs clients.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">Croissance rapide</h3>
                  <p className="text-sm text-neutral-600">
                    Évoluez dans une startup en forte croissance avec de nombreuses opportunités.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">Technologie moderne</h3>
                  <p className="text-sm text-neutral-600">
                    Travaillez avec les dernières technologies et outils.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">Équilibre vie pro/perso</h3>
                  <p className="text-sm text-neutral-600">
                    Télétravail hybride et horaires flexibles pour une meilleure qualité de vie.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">Formation continue</h3>
                  <p className="text-sm text-neutral-600">
                    Budget formation et accompagnement pour développer vos compétences.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">Ambiance startup</h3>
                  <p className="text-sm text-neutral-600">
                    Équipe jeune, dynamique et passionnée dans un environnement stimulant.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">
            Des questions sur nos opportunités ?
          </h2>
          <p className="text-neutral-600 mb-6">
            N'hésitez pas à nous contacter pour en savoir plus sur Kritiqo et nos équipes.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center bg-neutral-900 text-white px-6 py-3 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Nous contacter
          </a>
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
    </div>
  );
}
