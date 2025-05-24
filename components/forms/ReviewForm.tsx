'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { reviewFormSchema, type ReviewFormData } from '@/lib/validations/review'
import { isValidGoogleMapsUrl } from '@/lib/utils/url-validator'

export default function ReviewForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    clearErrors
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema)
  })

  const googleMapsUrl = watch('googleMapsUrl')

  // Validation en temps réel de l'URL Google Maps
  const validateUrlOnChange = (url: string) => {
    if (url && !isValidGoogleMapsUrl(url)) {
      setError('googleMapsUrl', {
        type: 'manual',
        message: 'Veuillez entrer un lien Google Maps valide'
      })
    } else {
      clearErrors('googleMapsUrl')
    }
  }

  const onSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true)
    
    try {
      // Validation finale de l'URL
      if (!isValidGoogleMapsUrl(data.googleMapsUrl)) {
        setError('googleMapsUrl', {
          type: 'manual',
          message: 'URL Google Maps invalide'
        })
        return
      }

      // ...existing code for form submission...
      
      console.log('Form data:', data)
      
    } catch (error) {
      console.error('Erreur lors de la soumission:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Nom de l'entreprise *
        </label>
        <input
          {...register('businessName')}
          type="text"
          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Nom de votre entreprise"
        />
        {errors.businessName && (
          <p className="text-red-500 text-sm mt-1">{errors.businessName.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Lien Google Maps *
        </label>
        <input
          {...register('googleMapsUrl')}
          type="url"
          onChange={(e) => validateUrlOnChange(e.target.value)}
          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://www.google.com/maps/place/..."
        />
        {errors.googleMapsUrl && (
          <p className="text-red-500 text-sm mt-1">{errors.googleMapsUrl.message}</p>
        )}
        <p className="text-neutral-500 text-sm mt-1">
          Copiez le lien complet de votre établissement sur Google Maps
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Description (optionnel)
        </label>
        <textarea
          {...register('description')}
          rows={4}
          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Description de votre entreprise..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? 'Génération en cours...' : 'Générer le QR Code'}
      </button>
    </form>
  )
}
