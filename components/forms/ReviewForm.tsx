'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { reviewFormSchema, type ReviewFormData } from '@/lib/validations/review'

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

  const onSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true)
    try {
      // Handle form submission
      console.log('Form data:', data)
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="googleMapsUrl" className="block text-sm font-medium text-neutral-700 mb-1">
          URL Google Maps
        </label>
        <input
          {...register('googleMapsUrl')}
          type="url"
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
          placeholder="https://maps.google.com/..."
        />
        {errors.googleMapsUrl && (
          <p className="text-red-600 text-sm mt-1">{errors.googleMapsUrl.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-neutral-900 text-white px-6 py-3 rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50"
      >
        {isSubmitting ? 'Traitement...' : 'Ajouter le restaurant'}
      </button>
    </form>
  )
}
