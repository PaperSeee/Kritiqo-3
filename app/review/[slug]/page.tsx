'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { CheckIcon, ClipboardIcon } from '@heroicons/react/24/outline'

interface Business {
  id: string
  name: string
  city: string
  country: string
  google_link: string | null
  ubereats_link: string | null
  deliveroo_link: string | null
  takeaway_link: string | null
}

interface Platform {
  name: string
  url: string
  icon: string
  color: string
}

export default function ReviewPage({ params }: { params: { slug: string } }) {
  const [business, setBusiness] = useState<Business | null>(null)
  const [review, setReview] = useState('')
  const [loading, setLoading] = useState(true)
  const [copiedPlatform, setCopiedPlatform] = useState<string | null>(null)

  useEffect(() => {
    fetchBusiness()
  }, [params.slug])

  const fetchBusiness = async () => {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('slug', params.slug)
        .single()

      if (error) throw error
      setBusiness(data)
    } catch (error) {
      console.error('Error fetching business:', error)
    } finally {
      setLoading(false)
    }
  }

  const platforms: Platform[] = business ? [
    {
      name: 'Google',
      url: business.google_link || '',
      icon: '🔍',
      color: 'bg-red-50 border-red-200 text-red-800 hover:bg-red-100'
    },
    {
      name: 'Uber Eats',
      url: business.ubereats_link || '',
      icon: '🚗',
      color: 'bg-green-50 border-green-200 text-green-800 hover:bg-green-100'
    },
    {
      name: 'Deliveroo',
      url: business.deliveroo_link || '',
      icon: '🛵',
      color: 'bg-cyan-50 border-cyan-200 text-cyan-800 hover:bg-cyan-100'
    },
    {
      name: 'Takeaway',
      url: business.takeaway_link || '',
      icon: '🍔',
      color: 'bg-orange-50 border-orange-200 text-orange-800 hover:bg-orange-100'
    }
  ].filter(platform => platform.url) : []

  const handlePlatformClick = async (platform: Platform) => {
    if (!review.trim()) {
      alert('Veuillez d\'abord écrire votre avis')
      return
    }

    try {
      // Copy review to clipboard
      await navigator.clipboard.writeText(review)
      setCopiedPlatform(platform.name)

      // Show confirmation
      setTimeout(() => setCopiedPlatform(null), 3000)

      // Open platform in new tab
      window.open(platform.url, '_blank')
    } catch (error) {
      console.error('Error copying to clipboard:', error)
      alert('Erreur lors de la copie du message')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900"></div>
      </div>
    )
  }

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Entreprise non trouvée</h1>
          <p className="text-neutral-600">Le lien que vous avez suivi n'est pas valide.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-neutral-900 to-neutral-700 p-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              {business.name}
            </h1>
            <p className="text-neutral-300">
              {business.city}, {business.country}
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-neutral-800 mb-3">
                Partagez votre expérience
              </h2>
              <p className="text-neutral-600">
                Rédigez votre avis ci-dessous, puis choisissez où le publier
              </p>
            </div>

            {/* Review textarea */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                Votre avis
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Décrivez votre expérience..."
                rows={6}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-neutral-500 focus:border-transparent resize-none"
              />
              <p className="text-xs text-neutral-500 mt-2">
                {review.length} caractères
              </p>
            </div>

            {/* Platform buttons */}
            {platforms.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-neutral-800 text-center mb-4">
                  Choisissez où publier votre avis
                </h3>
                
                <div className="grid gap-3">
                  {platforms.map((platform) => (
                    <button
                      key={platform.name}
                      onClick={() => handlePlatformClick(platform)}
                      disabled={!review.trim()}
                      className={`
                        w-full p-4 border-2 rounded-xl transition-all duration-200 flex items-center justify-between
                        ${review.trim() 
                          ? platform.color 
                          : 'bg-neutral-100 border-neutral-200 text-neutral-400 cursor-not-allowed'
                        }
                      `}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{platform.icon}</span>
                        <span className="font-medium">Publier sur {platform.name}</span>
                      </div>
                      
                      {copiedPlatform === platform.name ? (
                        <div className="flex items-center space-x-2 text-green-600">
                          <CheckIcon className="h-5 w-5" />
                          <span className="text-sm">Copié !</span>
                        </div>
                      ) : (
                        <ClipboardIcon className="h-5 w-5" />
                      )}
                    </button>
                  ))}
                </div>

                {copiedPlatform && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                    <p className="text-green-800 font-medium mb-1">
                      Message copié avec succès !
                    </p>
                    <p className="text-sm text-green-600">
                      Collez-le sur {copiedPlatform} et confirmez l'envoi
                    </p>
                  </div>
                )}
              </div>
            )}

            {platforms.length === 0 && (
              <div className="text-center py-8">
                <p className="text-neutral-500">
                  Aucune plateforme d'avis disponible pour cette entreprise
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-neutral-50 px-8 py-4 text-center">
            <p className="text-xs text-neutral-500">
              Propulsé par <span className="font-semibold text-neutral-700">Kritiqo</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
