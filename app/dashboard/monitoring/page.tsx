'use client'

import { useState, useEffect } from 'react'
import { 
  MagnifyingGlassIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

export default function MonitoringPage() {
  const [keyword, setKeyword] = useState('')
  const [savedKeyword, setSavedKeyword] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Charger le mot-clé depuis localStorage au montage
  useEffect(() => {
    const saved = localStorage.getItem('kritiqo-monitoring-keyword')
    if (saved) {
      setSavedKeyword(saved)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!keyword.trim()) return

    setLoading(true)
    
    // Simulation d'un appel API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Sauvegarder dans localStorage
    localStorage.setItem('kritiqo-monitoring-keyword', keyword.trim())
    setSavedKeyword(keyword.trim())
    setKeyword('')
    setLoading(false)
    setShowSuccess(true)
    
    // Masquer le message de succès après 3 secondes
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleEdit = () => {
    setKeyword(savedKeyword || '')
    setSavedKeyword(null)
  }

  const handleDelete = () => {
    localStorage.removeItem('kritiqo-monitoring-keyword')
    setSavedKeyword(null)
    setKeyword('')
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-neutral-900 mb-2">
          Surveillance de marque
        </h1>
        <p className="text-xl text-neutral-600">
          Surveillez ce que l'on dit de votre entreprise sur le web
        </p>
      </div>

      {/* Development Notice */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
        <div className="flex items-start space-x-3">
          <InformationCircleIcon className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-xl font-bold text-blue-900 mb-2">
              ℹ️ Cette fonctionnalité est en cours de développement.
            </h2>
            <p className="text-blue-800 leading-relaxed">
              Bientôt, vous pourrez surveiller automatiquement tout ce que les gens disent sur votre entreprise en ligne.<br />
              Kritiqo utilisera une technologie de veille pour détecter les mentions publiques sur les réseaux sociaux, Google, blogs, forums, etc., en lien avec votre nom de marque.
            </p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold text-green-900">
                Mot-clé connecté avec succès !
              </h3>
              <p className="text-green-800">
                Nous commencerons à surveiller les mentions dès que la fonctionnalité sera disponible.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Current Keyword Display */}
      {savedKeyword && (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-neutral-900">
              Mot-clé configuré
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={handleEdit}
                className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
                title="Modifier"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                title="Supprimer"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="bg-neutral-50 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <MagnifyingGlassIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-600 mb-1">Mot-clé surveillé :</p>
                <p className="text-xl font-semibold text-neutral-900">
                  "{savedKeyword}"
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-sm text-amber-800">
              <strong>Limitation actuelle :</strong> Un seul mot-clé par utilisateur. 
              La surveillance démarrera automatiquement dès que la fonctionnalité sera disponible.
            </p>
          </div>
        </div>
      )}

      {/* Keyword Setup Form */}
      {!savedKeyword && (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-200">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MagnifyingGlassIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
              Connecter votre mot-clé
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Choisissez le mot-clé principal qui représente votre entreprise. 
              Il sera utilisé pour détecter toutes les mentions publiques vous concernant.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="space-y-4">
              <div>
                <label htmlFor="keyword" className="block text-sm font-medium text-neutral-700 mb-2">
                  Mot-clé de surveillance
                </label>
                <input
                  type="text"
                  id="keyword"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Ex: Restaurant Le Gourmet, Café Central..."
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
                <p className="mt-2 text-xs text-neutral-500">
                  Conseil : Utilisez le nom exact de votre établissement tel qu'il apparaît sur vos supports de communication.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !keyword.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-xl transition-colors"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Connexion en cours...
                  </div>
                ) : (
                  'Connecter le mot-clé'
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 p-4 bg-neutral-50 rounded-xl">
            <h3 className="font-medium text-neutral-900 mb-2">Limitation actuelle :</h3>
            <ul className="text-sm text-neutral-600 space-y-1">
              <li>• Un seul mot-clé par utilisateur</li>
              <li>• Surveillance sur réseaux sociaux, blogs, forums, etc.</li>
              <li>• Notifications automatiques (prochainement)</li>
            </ul>
          </div>
        </div>
      )}

      {/* Coming Soon Features */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-200">
        <h3 className="text-2xl font-bold text-neutral-900 mb-6 text-center">
          Prochainement disponible
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <MagnifyingGlassIcon className="h-6 w-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-neutral-900 mb-2">
              Surveillance temps réel
            </h4>
            <p className="text-sm text-neutral-600">
              Détection automatique des nouvelles mentions sur tous les canaux
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <CheckCircleIcon className="h-6 w-6 text-pink-600" />
            </div>
            <h4 className="font-semibold text-neutral-900 mb-2">
              Analyse de sentiment
            </h4>
            <p className="text-sm text-neutral-600">
              Classification automatique : positif, négatif, neutre
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <InformationCircleIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <h4 className="font-semibold text-neutral-900 mb-2">
              Alertes intelligentes
            </h4>
            <p className="text-sm text-neutral-600">
              Notifications pour les mentions importantes ou critiques
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
