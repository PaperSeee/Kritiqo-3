'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { 
  ArrowLeftIcon, 
  CheckCircleIcon, 
  QrCodeIcon,
  ArrowDownTrayIcon,
  ExclamationCircleIcon 
} from '@heroicons/react/24/outline'

interface FormData {
  name: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  googleUrl: string
  facebookUrl: string
  tripadvisorUrl: string
  uberEatsUrl: string
  deliverooUrl: string
  takeawayUrl: string
}

interface Errors {
  [key: string]: string
}

export default function AddRestaurantPage() {
  const { user } = useAuth()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'France',
    googleUrl: '',
    facebookUrl: '',
    tripadvisorUrl: '',
    uberEatsUrl: '',
    deliverooUrl: '',
    takeawayUrl: ''
  })
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [generatedSlug, setGeneratedSlug] = useState('')
  const [reviewPageUrl, setReviewPageUrl] = useState('')

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

  const validateForm = (): boolean => {
    const newErrors: Errors = {}

    if (!formData.name.trim()) newErrors.name = 'Le nom du restaurant est requis'
    if (!formData.email.trim()) newErrors.email = 'L\'email est requis'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Format email invalide'
    if (!formData.phone.trim()) newErrors.phone = 'Le numéro de téléphone est requis'
    if (!formData.address.trim()) newErrors.address = 'L\'adresse est requise'
    if (!formData.city.trim()) newErrors.city = 'La ville est requise'
    if (!formData.country.trim()) newErrors.country = 'Le pays est requis'

    // Validation des URLs (optionnelles mais format valide si renseignées)
    const urlFields = ['googleUrl', 'facebookUrl', 'tripadvisorUrl', 'uberEatsUrl', 'deliverooUrl', 'takeawayUrl']
    urlFields.forEach(field => {
      const value = formData[field as keyof FormData]
      if (value && !/^https?:\/\/.+/.test(value)) {
        newErrors[field] = 'URL invalide (doit commencer par http:// ou https://)'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const generateQRCode = async (url: string) => {
    try {
      // For production, use a proper QR code library like qrcode
      return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`
    } catch (error) {
      console.error('Error generating QR code:', error)
      return ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setSubmitting(true)
    
    try {
      const slug = generateSlug(formData.name, formData.city)
      const reviewUrl = `${window.location.origin}/review/${slug}`
      
      // Save to Supabase
      const { error } = await supabase.from('restaurants').insert([
        {
          name: formData.name,
          slug,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          country: formData.country,
          google_url: formData.googleUrl || null,
          facebook_url: formData.facebookUrl || null,
          tripadvisor_url: formData.tripadvisorUrl || null,
          ubereats_url: formData.uberEatsUrl || null,
          deliveroo_url: formData.deliverooUrl || null,
          takeaway_url: formData.takeawayUrl || null,
          review_page_url: reviewUrl,
          user_id: user?.id,
        }
      ])

      if (error) throw error

      // Generate QR Code
      const qrCode = await generateQRCode(reviewUrl)
      
      setGeneratedSlug(slug)
      setReviewPageUrl(reviewUrl)
      setQrCodeUrl(qrCode)
      setSuccess(true)
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l\'ajout du restaurant'
      setErrors({ submit: errorMessage })
    } finally {
      setSubmitting(false)
    }
  }

  const downloadQRCode = () => {
    if (!qrCodeUrl) return
    
    const link = document.createElement('a')
    link.href = qrCodeUrl
    link.download = `qr-code-${generatedSlug}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (success) {
    return (
      <div className="space-y-8">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/restaurants"
            className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <h1 className="text-3xl font-bold text-neutral-900">
            Restaurant créé avec succès !
          </h1>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
            <div>
              <h2 className="text-xl font-semibold text-green-800">
                {formData.name} a été ajouté à Kritiqo
              </h2>
              <p className="text-green-600">
                Votre page d&apos;avis est maintenant accessible
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 mb-4">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              URL de votre page d&apos;avis
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={reviewPageUrl}
                readOnly
                className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm"
              />
              <button
                onClick={() => navigator.clipboard.writeText(reviewPageUrl)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Copier
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <h3 className="text-lg font-semibold text-neutral-800">
              QR Code à imprimer
            </h3>
            {qrCodeUrl && (
              <div className="bg-white p-6 rounded-lg border-2 border-neutral-200">
                <img src={qrCodeUrl ?? undefined} alt="QR Code" className="w-64 h-64" />
              </div>
            )}
            <button
              onClick={downloadQRCode}
              className="inline-flex items-center space-x-2 bg-neutral-900 text-white px-6 py-3 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <ArrowDownTrayIcon className="h-5 w-5" />
              <span>Télécharger le QR Code</span>
            </button>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h4 className="font-semibold text-blue-800 mb-3">
            🎉 Prochaines étapes
          </h4>
          <ul className="text-blue-700 space-y-2">
            <li>• Imprimez votre QR code et placez-le dans votre restaurant</li>
            <li>• Partagez le lien de votre page d&apos;avis avec vos clients</li>
            <li>• Consultez vos statistiques dans le tableau de bord</li>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4">
        <Link
          href="/dashboard"
          className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Ajouter un restaurant
          </h1>
          <p className="text-neutral-600">
            Créez votre page d&apos;avis personnalisée avec QR code
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informations générales */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <h2 className="text-xl font-semibold text-neutral-800 mb-6">
            Informations du restaurant
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Nom du restaurant *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent ${
                  errors.name ? 'border-red-300' : 'border-neutral-300'
                }`}
                placeholder="Le Petit Bistrot"
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Email de contact *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent ${
                  errors.email ? 'border-red-300' : 'border-neutral-300'
                }`}
                placeholder="contact@restaurant.fr"
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Téléphone *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent ${
                  errors.phone ? 'border-red-300' : 'border-neutral-300'
                }`}
                placeholder="+33 1 23 45 67 89"
              />
              {errors.phone && (
                <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Pays *
              </label>
              <select
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent ${
                  errors.country ? 'border-red-300' : 'border-neutral-300'
                }`}
              >
                <option value="France">France</option>
                <option value="Belgique">Belgique</option>
                <option value="Suisse">Suisse</option>
                <option value="Canada">Canada</option>
                <option value="Autre">Autre</option>
              </select>
              {errors.country && (
                <p className="text-red-600 text-sm mt-1">{errors.country}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Adresse complète *
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent ${
                  errors.address ? 'border-red-300' : 'border-neutral-300'
                }`}
                placeholder="123 Rue de la Paix, 75001 Paris"
              />
              {errors.address && (
                <p className="text-red-600 text-sm mt-1">{errors.address}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Ville *
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent ${
                  errors.city ? 'border-red-300' : 'border-neutral-300'
                }`}
                placeholder="Paris"
              />
              {errors.city && (
                <p className="text-red-600 text-sm mt-1">{errors.city}</p>
              )}
            </div>
          </div>
        </div>

        {/* Error message */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
            <p className="text-red-600">{errors.submit}</p>
          </div>
        )}

        {/* Submit button */}
        <div className="flex justify-end space-x-4">
          <Link
            href="/dashboard"
            className="px-6 py-3 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center space-x-2 bg-neutral-900 text-white px-6 py-3 rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50"
          >
            <QrCodeIcon className="h-5 w-5" />
            <span>
              {submitting ? 'Création en cours...' : 'Créer le restaurant'}
            </span>
          </button>
        </div>
      </form>
    </div>
  )
}
