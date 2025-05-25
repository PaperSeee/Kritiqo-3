'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  StarIcon, 
  ClipboardDocumentIcon, 
  CheckIcon,
  ExclamationTriangleIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

interface Business {
  id: string;
  name: string;
  slug: string;
  city: string;
  country: string;
  email?: string;
  phone?: string;
  address?: string;
  google_link: string;
  ubereats_link?: string;
  deliveroo_link?: string;
  takeaway_link?: string;
  created_at: string;
}

interface Platform {
  name: string;
  url: string;
  icon: string;
  color: string;
  isOpen: boolean;
  description?: string;
}

export default function ReviewPage({ params }: { params: { slug: string } }) {
  const [business, setBusiness] = useState<Business | null>(null);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [reviewWritten, setReviewWritten] = useState(false);

  useEffect(() => {
    fetchBusiness();
  }, [params.slug]);

  const fetchBusiness = async () => {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('slug', params.slug)
        .single();

      if (error) throw error;
      setBusiness(data);
    } catch (err) {
      if (err instanceof Error) {
        console.error('Erreur lors de la récupération du restaurant:', err.message, err.name)
      } else {
        console.error('Erreur inconnue lors de la récupération du restaurant:', JSON.stringify(err))
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, platformName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(platformName);
      setTimeout(() => setCopied(null), 3000);
    } catch (err) {
      if (err instanceof Error) {
        console.error('Erreur lors de la copie dans le presse-papiers:', err.message, err.name)
      } else {
        console.error('Erreur inconnue lors de la copie dans le presse-papiers:', JSON.stringify(err))
      }
    }
  };

  const handlePlatformClick = async (platform: Platform) => {
    if (review.trim()) {
      await copyToClipboard(review, platform.name);
      // Small delay to ensure copy notification is visible
      setTimeout(() => {
        window.open(platform.url, '_blank');
      }, 500);
    } else {
      window.open(platform.url, '_blank');
    }
  };

  const handleReviewChange = (value: string) => {
    setReview(value);
    if (value.trim() && !reviewWritten) {
      setReviewWritten(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Restaurant non trouvé</h1>
          <p className="text-neutral-600">Le lien que vous avez suivi n&apos;est pas valide.</p>
        </div>
      </div>
    );
  }

  const platforms: Platform[] = [
    // Open platforms (no order required)
    {
      name: 'Google',
      url: business.google_link,
      icon: '🔍',
      color: 'bg-blue-500 hover:bg-blue-600',
      isOpen: true
    },
    {
      name: 'Facebook',
      url: `https://www.facebook.com/search/top?q=${encodeURIComponent(business.name)}`,
      icon: '📘',
      color: 'bg-blue-600 hover:bg-blue-700',
      isOpen: true
    },
    {
      name: 'TripAdvisor',
      url: `https://www.tripadvisor.com/Search?q=${encodeURIComponent(business.name + ' ' + business.city)}`,
      icon: '🦉',
      color: 'bg-green-600 hover:bg-green-700',
      isOpen: true
    },
    // Closed platforms (order required)
    ...(business.ubereats_link ? [{
      name: 'Uber Eats',
      url: business.ubereats_link,
      icon: '🍔',
      color: 'bg-black hover:bg-neutral-800',
      isOpen: false,
      description: 'Commande requise'
    }] : []),
    ...(business.deliveroo_link ? [{
      name: 'Deliveroo',
      url: business.deliveroo_link,
      icon: '🛵',
      color: 'bg-teal-500 hover:bg-teal-600',
      isOpen: false,
      description: 'Commande requise'
    }] : []),
    ...(business.takeaway_link ? [{
      name: 'Takeaway',
      url: business.takeaway_link,
      icon: '🥡',
      color: 'bg-orange-500 hover:bg-orange-600',
      isOpen: false,
      description: 'Commande requise'
    }] : [])
  ];

  const openPlatforms = platforms.filter(p => p.isOpen);
  const closedPlatforms = platforms.filter(p => !p.isOpen);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <HeartIcon className="h-8 w-8 text-orange-500 mr-2" />
            <h1 className="text-3xl font-bold text-neutral-900">{business.name}</h1>
          </div>
          <p className="text-neutral-600 mb-2">{business.city}, {business.country}</p>
          <p className="text-lg text-neutral-700">
            Votre avis compte ! Aidez d&apos;autres clients à découvrir ce restaurant.
          </p>
        </div>

        {/* Review Writing Section */}
        <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6 mb-8">
          <div className="flex items-center mb-4">
            <StarIcon className="h-6 w-6 text-yellow-500 mr-2" />
            <h2 className="text-xl font-semibold text-neutral-800">
              Rédigez votre avis
            </h2>
          </div>
          
          <textarea
            value={review}
            onChange={(e) => handleReviewChange(e.target.value)}
            placeholder="Partagez votre expérience... Qu&apos;avez-vous aimé ? Le service, la nourriture, l&apos;ambiance ?"
            className="w-full h-32 px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            maxLength={500}
          />
          
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-neutral-500">
              {review.length}/500 caractères
            </span>
            {reviewWritten && (
              <div className="flex items-center text-green-600 text-sm">
                <CheckIcon className="h-4 w-4 mr-1" />
                Avis rédigé !
              </div>
            )}
          </div>

          {reviewWritten && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center text-green-700">
                <CheckIcon className="h-5 w-5 mr-2" />
                <span className="font-medium">Parfait !</span>
              </div>
              <p className="text-green-600 text-sm mt-1">
                Votre avis sera automatiquement copié quand vous cliquerez sur une plateforme.
              </p>
            </div>
          )}
        </div>

        {/* Open Platforms */}
        {openPlatforms.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Plateformes ouvertes - Avis libre
            </h3>
            <div className="grid gap-3">
              {openPlatforms.map((platform) => (
                <button
                  key={platform.name}
                  onClick={() => handlePlatformClick(platform)}
                  className={`${platform.color} text-white p-4 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-between`}
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{platform.icon}</span>
                    <span className="font-medium">Laisser un avis sur {platform.name}</span>
                  </div>
                  {copied === platform.name && (
                    <div className="flex items-center text-green-200">
                      <CheckIcon className="h-4 w-4 mr-1" />
                      <span className="text-sm">Copié !</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Closed Platforms */}
        {closedPlatforms.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-amber-500 mr-2" />
              Plateformes de livraison - Commande requise
            </h3>
            <div className="grid gap-3">
              {closedPlatforms.map((platform) => (
                <div key={platform.name} className="relative">
                  <button
                    onClick={() => handlePlatformClick(platform)}
                    className={`${platform.color} text-white p-4 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-between w-full`}
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{platform.icon}</span>
                      <div className="text-left">
                        <div className="font-medium">Laisser un avis sur {platform.name}</div>
                        <div className="text-sm opacity-90">Vous devez avoir commandé via cette plateforme</div>
                      </div>
                    </div>
                    {copied === platform.name && (
                      <div className="flex items-center text-green-200">
                        <CheckIcon className="h-4 w-4 mr-1" />
                        <span className="text-sm">Copié !</span>
                      </div>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-blue-800 mb-2">Comment ça marche ?</h4>
          <ol className="text-blue-700 text-sm space-y-1">
            <li>1. Rédigez votre avis ci-dessus</li>
            <li>2. Cliquez sur la plateforme de votre choix</li>
            <li>3. Votre avis sera copié automatiquement</li>
            <li>4. Collez-le sur la plateforme et validez</li>
          </ol>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-neutral-500">
          <p>Merci de prendre le temps de partager votre expérience !</p>
          <p className="mt-1">Vos avis aident les restaurateurs à s&apos;améliorer.</p>
        </div>
      </div>
    </div>
  );
}
