'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import QRCode from 'qrcode'
import { isValidGoogleMapsUrl } from '@/lib/utils/url-validator'
import { CheckCircleIcon, PlusIcon, TrashIcon, LinkIcon, QrCodeIcon } from '@heroicons/react/24/outline'

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

export default function BusinessesPage() {
  const { user } = useAuth()
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [googleMapsUrl, setGoogleMapsUrl] = useState('')
  const [errors, setErrors] = useState<string[]>([])
  const [success, setSuccess] = useState(false)

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
    } catch (error) {
      console.error('Error fetching businesses:', error)
    } finally {
      setLoading(false)
    }
  }

  const validateGoogleMapsUrl = (url: string) => {
    return isValidGoogleMapsUrl(url)
  }

  async function extractPlaceInfo(mapsUrl: string) {
    try {
      const response = await fetch('/api/extract-place-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mapsUrl }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Impossible d\'extraire les informations de l\'entreprise')
      }

      return {
        name: data.name,
        city: data.city,
        country: data.country,
        place_id: data.place_id,
        googleReviewLink: data.googleReviewLink,
        ubereatsLink: data.ubereatsLink,
        deliverooLink: data.deliverooLink,
        takeawayLink: data.takeawayLink,
      }
    } catch (error) {
      console.error('Error extracting place info:', error)
      throw new Error('Impossible d\'extraire les informations de l\'entreprise')
    }
  }

  const generateSlug = (name: string, city: string) => {
    const text = `${name} ${city}`
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-') + '-' + Date.now().toString().slice(-4)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors([])
    setSubmitting(true)
    setSuccess(false)

    try {
      // Validation
      if (!googleMapsUrl.trim()) {
        setErrors(['Le lien Google Maps est requis'])
        return
      }

      if (!validateGoogleMapsUrl(googleMapsUrl)) {
        setErrors(['Veuillez utiliser un lien Google Maps valide. Assurez-vous d\'utiliser un lien direct vers un lieu spécifique.'])
        return
      }

      // Extract place information using API
      const placeInfo = await extractPlaceInfo(googleMapsUrl)

      // Generate slug and custom URL
      const slug = generateSlug(placeInfo.name, placeInfo.city)
      const customUrl = `${window.location.origin}/review/${slug}`

      // Save to Supabase
      const { error } = await supabase.from('businesses').insert([
        {
          name: placeInfo.name,
          slug,
          city: placeInfo.city,
          country: placeInfo.country,
          place_id: placeInfo.place_id,
          google_link: placeInfo.googleReviewLink,
          ubereats_link: placeInfo.ubereatsLink,
          deliveroo_link: placeInfo.deliverooLink,
          takeaway_link: placeInfo.takeawayLink,
          custom_url: customUrl,
          user_id: user?.id,
        },
      ])

      if (error) throw error

      // Reset form and show success
      setGoogleMapsUrl('')
      setSuccess(true)
      setTimeout(() => setSuccess(false), 5000)
      await fetchBusinesses()
    } catch (error: any) {
      console.error('Error adding business:', error)
      setErrors([error.message || 'Erreur lors de l\'ajout de l\'entreprise'])
    } finally {
      setSubmitting(false)
    }
  }

  const deleteBusiness = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette entreprise ?')) return

    try {
      const { error } = await supabase
        .from('businesses')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchBusinesses()
    } catch (error) {
      console.error('Error deleting business:', error)
    }
  }

  const generateQRCode = async (url: string) => {
    try {
      return await QRCode.toDataURL(url, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
    } catch (error) {
      console.error('Error generating QR code:', error)
      return ''
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Gestion des entreprises
        </h1>
        <p className="text-neutral-600">
          Collez simplement un lien Google Maps et nous extrairons automatiquement toutes les informations nécessaires
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <h2 className="text-xl font-semibold text-neutral-800 mb-4">
          Ajouter une entreprise automatiquement
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Lien Google Maps de votre entreprise
            </label>
            <input
              type="url"
              value={googleMapsUrl}
              onChange={(e) => setGoogleMapsUrl(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
              placeholder="https://www.google.com/maps/place/Restaurant+Name/..."
            />
            <p className="text-xs text-neutral-500 mt-1">
              Copiez le lien depuis Google Maps - nous extrairons automatiquement le nom et toutes les informations
            </p>
          </div>

          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <ul className="text-sm text-red-600 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center space-x-2">
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <span className="text-sm text-green-600 font-medium">
                Entreprise ajoutée avec succès – QR code prêt à être imprimé !
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center space-x-2 bg-neutral-900 text-white px-6 py-2 rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50"
          >
            <PlusIcon className="h-4 w-4" />
            <span>
              {submitting ? 'Extraction en cours...' : 'Extraire automatiquement'}
            </span>
          </button>
        </form>
      </div>

      {/* Liste des entreprises */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
        <div className="p-6 border-b border-neutral-200">
          <h2 className="text-xl font-semibold text-neutral-800">
            Entreprises ajoutées ({businesses.length})
          </h2>
        </div>

        {businesses.length === 0 ? (
          <div className="p-8 text-center text-neutral-500">
            Aucune entreprise ajoutée pour le moment
          </div>
        ) : (
          <div className="divide-y divide-neutral-200">
            {businesses.map((business) => (
              <BusinessCard
                key={business.id}
                business={business}
                onDelete={deleteBusiness}
                generateQRCode={generateQRCode}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function BusinessCard({ business, onDelete, generateQRCode }: {
  business: Business
  onDelete: (id: string) => void
  generateQRCode: (url: string) => Promise<string>
}) {
  const [qrCode, setQrCode] = useState('')
  const [showQR, setShowQR] = useState(false)

  const handleShowQR = async () => {
    if (!qrCode) {
      const qrDataUrl = await generateQRCode(business.custom_url)
      setQrCode(qrDataUrl)
    }
    setShowQR(!showQR)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const platformLinks = [
    { name: 'Google', url: business.google_link, available: true },
    { name: 'Uber Eats', url: business.ubereats_link, available: !!business.ubereats_link },
    { name: 'Deliveroo', url: business.deliveroo_link, available: !!business.deliveroo_link },
    { name: 'Takeaway', url: business.takeaway_link, available: !!business.takeaway_link }
  ]

  return (
    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-neutral-900 mb-1">
            {business.name}
          </h3>
          <p className="text-sm text-neutral-500 mb-2">
            {business.city}
          </p>
          <div className="flex flex-wrap gap-2">
            {platformLinks.map((platform) => (
              <span
                key={platform.name}
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  platform.available
                    ? 'bg-green-100 text-green-800'
                    : 'bg-neutral-100 text-neutral-500'
                }`}
              >
                {platform.name} {platform.available ? '✓' : '✗'}
              </span>
            ))}
          </div>
        </div>
        
        <button
          onClick={() => onDelete(business.id)}
          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Supprimer"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">
            Lien personnalisé Kritiqo
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={business.custom_url}
              readOnly
              className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded text-sm"
            />
            <button
              onClick={() => copyToClipboard(business.custom_url)}
              className="p-2 text-neutral-500 hover:bg-neutral-100 rounded"
              title="Copier"
            >
              <LinkIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={handleShowQR}
            className="inline-flex items-center space-x-2 bg-neutral-100 text-neutral-700 px-4 py-2 rounded-lg hover:bg-neutral-200 transition-colors"
          >
            <QrCodeIcon className="h-4 w-4" />
            <span>{showQR ? 'Masquer QR' : 'Afficher QR'}</span>
          </button>

          <div className="flex space-x-2">
            {platformLinks.filter(p => p.available).map((platform) => (
              <a
                key={platform.name}
                href={platform.url ?? undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-neutral-500 hover:text-neutral-700"
              >
                {platform.name} →
              </a>
            ))}
          </div>
        </div>

        {showQR && qrCode && (
          <div className="mt-4 p-4 bg-neutral-50 rounded-lg text-center">
            <img src={qrCode ?? undefined} alt="QR Code" className="mx-auto mb-2" />
            <p className="text-xs text-neutral-500">
              Scannez ce QR code pour accéder au lien d'avis
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
