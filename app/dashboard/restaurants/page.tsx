'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { 
  PlusIcon, 
  BuildingStorefrontIcon,
  QrCodeIcon,
  LinkIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

interface Restaurant {
  id: string
  name: string
  slug: string
  city: string
  country: string
  email?: string
  phone?: string
  address?: string
  google_link: string
  ubereats_link?: string
  deliveroo_link?: string
  takeaway_link?: string
  review_page_url: string
  created_at: string
}

export default function RestaurantsPage() {
  const { user } = useAuth()
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchRestaurants()
    }
  }, [user])

  const fetchRestaurants = async () => {
    try {
      setError(null)
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
      
      // Transform data to include review_page_url
      const transformedData = (data || []).map(restaurant => ({
        ...restaurant,
        review_page_url: `${window.location.origin}/review/${restaurant.slug}`
      }))
      
      setRestaurants(transformedData)
    } catch (err) {
      if (err instanceof Error) {
        console.error('Erreur lors de la récupération des restaurants:', err.message, err.name)
        setError(err.message || 'Une erreur est survenue lors du chargement des restaurants')
      } else {
        console.error('Erreur inconnue lors de la récupération des restaurants:', JSON.stringify(err))
        setError('Une erreur est survenue lors du chargement des restaurants')
      }
    } finally {
      setLoading(false)
    }
  }

  const deleteRestaurant = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce restaurant ?')) return

    try {
      const { error } = await supabase
        .from('businesses')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchRestaurants()
    } catch (err) {
      if (err instanceof Error) {
        console.error('Erreur lors de la suppression du restaurant:', err.message, err.name)
        setError(err.message || 'Erreur lors de la suppression')
      } else {
        console.error('Erreur inconnue lors de la suppression du restaurant:', JSON.stringify(err))
        setError('Erreur lors de la suppression')
      }
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Erreur</h3>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <button 
            onClick={fetchRestaurants}
            className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Mes restaurants
          </h1>
          <p className="text-neutral-600">
            Gérez vos établissements et leurs pages d'avis
          </p>
        </div>
        
        <Link
          href="/dashboard/restaurants/add"
          className="inline-flex items-center space-x-2 bg-neutral-900 text-white px-6 py-3 rounded-lg hover:bg-neutral-800 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Ajouter un restaurant</span>
        </Link>
      </div>

      {/* Statistiques */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-white p-6 rounded-xl border border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-neutral-800 mb-1">Total restaurants</h3>
              <p className="text-2xl font-bold text-neutral-900">{restaurants.length}</p>
            </div>
            <BuildingStorefrontIcon className="h-8 w-8 text-neutral-400" />
          </div>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-blue-800 mb-1">Pages actives</h3>
              <p className="text-2xl font-bold text-blue-600">{restaurants.length}</p>
            </div>
            <EyeIcon className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-green-50 p-6 rounded-xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-green-800 mb-1">QR codes générés</h3>
              <p className="text-2xl font-bold text-green-600">{restaurants.length}</p>
            </div>
            <QrCodeIcon className="h-8 w-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* Liste des restaurants */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
        <div className="p-6 border-b border-neutral-200">
          <h2 className="text-xl font-semibold text-neutral-800">
            Restaurants ({restaurants.length})
          </h2>
        </div>

        {restaurants.length === 0 ? (
          <div className="p-12 text-center">
            <BuildingStorefrontIcon className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Aucun restaurant ajouté
            </h3>
            <p className="text-neutral-600 mb-6">
              Commencez par ajouter votre premier restaurant pour générer sa page d'avis.
            </p>
            <Link
              href="/dashboard/restaurants/add"
              className="inline-flex items-center space-x-2 bg-neutral-900 text-white px-6 py-3 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Ajouter mon premier restaurant</span>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-neutral-200">
            {restaurants.map((restaurant) => (
              <div key={restaurant.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-1">
                      {restaurant.name}
                    </h3>
                    <p className="text-sm text-neutral-600 mb-1">
                      {restaurant.address || 'Adresse non renseignée'}
                    </p>
                    <p className="text-sm text-neutral-500">
                      {restaurant.city}, {restaurant.country}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-neutral-500">
                      {restaurant.email && <span>📧 {restaurant.email}</span>}
                      {restaurant.phone && <span>📞 {restaurant.phone}</span>}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => deleteRestaurant(restaurant.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Supprimer"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-500 mb-1">
                      Page d'avis Kritiqo
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={restaurant.review_page_url}
                        readOnly
                        className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded text-sm"
                      />
                      <button
                        onClick={() => copyToClipboard(restaurant.review_page_url)}
                        className="p-2 text-neutral-500 hover:bg-neutral-100 rounded"
                        title="Copier"
                      >
                        <LinkIcon className="h-4 w-4" />
                      </button>
                      <a
                        href={restaurant.review_page_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-neutral-500 hover:bg-neutral-100 rounded"
                        title="Voir la page"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Link
                      href={`/dashboard/reviews/qr?restaurant=${restaurant.slug}`}
                      className="inline-flex items-center space-x-2 bg-neutral-100 text-neutral-700 px-4 py-2 rounded-lg hover:bg-neutral-200 transition-colors"
                    >
                      <QrCodeIcon className="h-4 w-4" />
                      <span>Générer QR Code</span>
                    </Link>

                    <span className="text-xs text-neutral-500">
                      Créé le {new Date(restaurant.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
