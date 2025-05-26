'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { StarIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutlineIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

// Interface pour les entreprises
interface Business {
  id: string
  name: string
  slug: string
  city: string
  country: string
  place_id: string
  google_link: string
  ubereats_link: string | null
  deliveroo_link: string | null
  takeaway_link: string | null
  custom_url: string
  created_at: string
}

// Interface pour les avis
interface Review {
  id: number
  businessId: string
  businessName: string
  platform: string
  customerName: string
  rating: number
  comment: string
  date: string
  responded: boolean
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <div key={star}>
          {star <= rating ? (
            <StarIcon className="h-4 w-4 text-yellow-400" />
          ) : (
            <StarOutlineIcon className="h-4 w-4 text-gray-300" />
          )}
        </div>
      ))}
    </div>
  )
}

export default function ReviewsPage() {
  const { user } = useAuth()
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBusiness, setSelectedBusiness] = useState('all')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  
  // État pour les avis (vide pour l'instant, sera connecté à une API plus tard)
  const [reviews] = useState<Review[]>([])

  useEffect(() => {
    if (user) {
      fetchBusinesses()
    }
  }, [user])

  const fetchBusinesses = async () => {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setBusinesses(data || [])
    } catch (err) {
      console.error('Error fetching businesses:', err)
    } finally {
      setLoading(false)
    }
  }

  // Créer la liste des options de filtre avec les vraies entreprises
  const businessOptions = [
    { id: 'all', name: 'Tous les établissements', slug: 'all' },
    ...businesses.map(business => ({
      id: business.id,
      name: business.name,
      slug: business.slug || business.name.toLowerCase().replace(/\s+/g, '-')
    }))
  ]

  // Filtrer les avis selon le restaurant sélectionné
  const filteredReviews = selectedBusiness === 'all' 
    ? reviews 
    : reviews.filter(review => review.businessId === selectedBusiness)

  const selectedBusinessName = businessOptions.find(b => b.id === selectedBusiness)?.name || 'Tous les établissements'

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Avis Clients
        </h1>
        <p className="text-neutral-600">
          Gérez et répondez à vos avis clients
        </p>
      </div>

      {/* Filtre par restaurant */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-800">Filtrer par établissement</h2>
          
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 bg-neutral-50 border border-neutral-300 rounded-lg px-4 py-2 text-neutral-700 hover:bg-neutral-100 transition-colors"
              disabled={businesses.length === 0}
            >
              <span>{selectedBusinessName}</span>
              <ChevronDownIcon className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-neutral-200 rounded-lg shadow-lg z-10">
                {businessOptions.map((business) => (
                  <button
                    key={business.id}
                    onClick={() => {
                      setSelectedBusiness(business.id)
                      setIsDropdownOpen(false)
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-neutral-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                      selectedBusiness === business.id ? 'bg-neutral-100 font-medium' : ''
                    }`}
                  >
                    {business.name}
                    {selectedBusiness !== 'all' && business.id !== 'all' && (
                      <span className="text-sm text-neutral-500 ml-2">
                        ({reviews.filter(r => r.businessId === business.id).length} avis)
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {businesses.length === 0 && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-800 text-sm">
              Aucun établissement enregistré. 
              <Link href="/dashboard/businesses" className="font-medium underline ml-1">
                Ajouter un établissement
              </Link>
            </p>
          </div>
        )}
      </div>

      {/* Statistiques */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="bg-white p-6 rounded-xl border border-neutral-200">
          <h3 className="font-semibold text-neutral-800 mb-2">Total avis</h3>
          <p className="text-2xl font-bold text-neutral-900">{filteredReviews.length}</p>
          {selectedBusiness !== 'all' && (
            <p className="text-xs text-neutral-500 mt-1">pour {selectedBusinessName}</p>
          )}
        </div>
        
        <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
          <h3 className="font-semibold text-yellow-800 mb-2">Note moyenne</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {filteredReviews.length > 0 
              ? (filteredReviews.reduce((sum, review) => sum + review.rating, 0) / filteredReviews.length).toFixed(1)
              : '0'}/5
          </p>
        </div>
        
        <div className="bg-green-50 p-6 rounded-xl border border-green-200">
          <h3 className="font-semibold text-green-800 mb-2">Avis 5 étoiles</h3>
          <p className="text-2xl font-bold text-green-600">
            {filteredReviews.filter(review => review.rating === 5).length}
          </p>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">Réponses données</h3>
          <p className="text-2xl font-bold text-blue-600">
            {filteredReviews.filter(review => review.responded).length}
          </p>
        </div>
      </div>

      {/* Liste des avis */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
        <div className="p-6 border-b border-neutral-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-neutral-800">
              Avis récents
              {selectedBusiness !== 'all' && (
                <span className="text-base font-normal text-neutral-600 ml-2">
                  - {selectedBusinessName}
                </span>
              )}
            </h2>
            {filteredReviews.length === 0 && businesses.length > 0 && (
              <span className="text-sm text-neutral-500">Aucun avis trouvé</span>
            )}
          </div>
        </div>
        
        {businesses.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-neutral-400 mb-4">
              <StarOutlineIcon className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">Aucun établissement enregistré</h3>
            <p className="text-neutral-600 mb-4">
              Vous devez d'abord enregistrer vos établissements pour pouvoir gérer les avis.
            </p>
            <Link 
              href="/dashboard/businesses"
              className="inline-flex items-center px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
            >
              Ajouter un établissement
            </Link>
          </div>
        ) : filteredReviews.length > 0 ? (
          <div className="divide-y divide-neutral-200">
            {filteredReviews.map((review) => (
              <div key={review.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="font-medium text-neutral-900">{review.customerName}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        {selectedBusiness === 'all' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                            {review.businessName}
                          </span>
                        )}
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          review.platform === 'Google' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {review.platform}
                        </span>
                        <span className="text-sm text-neutral-500">
                          {new Date(review.date).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <StarRating rating={review.rating} />
                    <button
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        review.responded
                          ? 'bg-green-100 text-green-800'
                          : 'bg-neutral-900 text-white hover:bg-neutral-800'
                      }`}
                      disabled={review.responded}
                    >
                      {review.responded ? 'Répondu' : 'Répondre'}
                    </button>
                  </div>
                </div>
                
                <p className="text-neutral-700 leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="text-neutral-400 mb-4">
              <StarOutlineIcon className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">Aucun avis trouvé</h3>
            <p className="text-neutral-600">
              {selectedBusiness === 'all' 
                ? 'Aucun avis n\'a encore été laissé pour vos établissements.'
                : `Aucun avis n'a encore été laissé pour ${selectedBusinessName}.`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
