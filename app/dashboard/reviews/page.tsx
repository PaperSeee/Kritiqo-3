'use client'

import Link from 'next/link'
import { StarIcon, QrCodeIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'

// Avis simulés
const mockReviews = [
  {
    id: 1,
    platform: 'Google',
    customerName: 'Sophie Martin',
    rating: 5,
    comment: 'Service excellent ! Je recommande vivement cette entreprise.',
    date: '2024-01-15',
    responded: false
  },
  {
    id: 2,
    platform: 'Facebook',
    customerName: 'Pierre Dubois',
    rating: 4,
    comment: 'Très bon service, livraison rapide. Quelques petits points à améliorer.',
    date: '2024-01-12',
    responded: true
  },
  {
    id: 3,
    platform: 'Google',
    customerName: 'Marie Leroy',
    rating: 5,
    comment: 'Parfait ! Équipe professionnelle et à l\'écoute.',
    date: '2024-01-10',
    responded: false
  },
  {
    id: 4,
    platform: 'Facebook',
    customerName: 'Jean Bernard',
    rating: 3,
    comment: 'Service correct mais délais un peu longs.',
    date: '2024-01-08',
    responded: true
  }
]

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
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Avis & QR Code
          </h1>
          <p className="text-neutral-600">
            Gérez vos avis clients et générez votre QR code de collecte
          </p>
        </div>
        
        <Link
          href="/dashboard/reviews/qr"
          className="inline-flex items-center space-x-2 bg-neutral-900 text-white px-6 py-3 rounded-lg hover:bg-neutral-800 transition-colors"
        >
          <QrCodeIcon className="h-5 w-5" />
          <span>Générer mon QR d'avis</span>
        </Link>
      </div>

      {/* Statistiques */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="bg-white p-6 rounded-xl border border-neutral-200">
          <h3 className="font-semibold text-neutral-800 mb-2">Total avis</h3>
          <p className="text-2xl font-bold text-neutral-900">{mockReviews.length}</p>
        </div>
        
        <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
          <h3 className="font-semibold text-yellow-800 mb-2">Note moyenne</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {(mockReviews.reduce((sum, review) => sum + review.rating, 0) / mockReviews.length).toFixed(1)}/5
          </p>
        </div>
        
        <div className="bg-green-50 p-6 rounded-xl border border-green-200">
          <h3 className="font-semibold text-green-800 mb-2">Avis 5 étoiles</h3>
          <p className="text-2xl font-bold text-green-600">
            {mockReviews.filter(review => review.rating === 5).length}
          </p>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">Réponses données</h3>
          <p className="text-2xl font-bold text-blue-600">
            {mockReviews.filter(review => review.responded).length}
          </p>
        </div>
      </div>

      {/* Liste des avis */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
        <div className="p-6 border-b border-neutral-200">
          <h2 className="text-xl font-semibold text-neutral-800">Avis récents</h2>
        </div>
        
        <div className="divide-y divide-neutral-200">
          {mockReviews.map((review) => (
            <div key={review.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="font-medium text-neutral-900">{review.customerName}</h3>
                    <div className="flex items-center space-x-2 mt-1">
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
      </div>
    </div>
  )
}
