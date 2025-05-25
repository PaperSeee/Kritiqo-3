'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ExclamationTriangleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const errorMessages: Record<string, { title: string; description: string; debug?: string }> = {
  AccessDenied: {
    title: 'Accès refusé',
    description: 'Votre connexion a été refusée. Cela peut être dû à un problème de configuration OAuth ou de permissions.',
    debug: 'Vérifiez que votre email est autorisé et que les scopes OAuth sont corrects.'
  },
  OAuthAccountNotLinked: {
    title: 'Compte non lié',
    description: 'Ce compte OAuth n\'est pas associé à votre profil utilisateur. Veuillez vous connecter avec votre compte habituel ou contacter le support.',
    debug: 'L\'email utilisé ne correspond pas à un compte existant.'
  },
  OAuthCallback: {
    title: 'Erreur OAuth',
    description: 'Erreur lors de l\'authentification avec Google. Veuillez réessayer ou contacter le support.',
    debug: 'Problème dans le callback OAuth - vérifiez les logs serveur.'
  },
  Configuration: {
    title: 'Erreur de configuration',
    description: 'Un problème de configuration empêche la connexion. Contactez l\'administrateur.',
    debug: 'Variables d\'environnement manquantes ou incorrectes.'
  },
  Default: {
    title: 'Erreur d\'authentification',
    description: 'Une erreur inattendue s\'est produite lors de l\'authentification. Veuillez réessayer.',
    debug: 'Erreur non catégorisée - consultez les logs pour plus d\'informations.'
  }
};

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') || 'Default';
  const errorInfo = errorMessages[error] || errorMessages.Default;

  // Debug info in development
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Error Icon */}
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-2">
            Kritiqo
          </h1>
          <h2 className="text-xl sm:text-2xl font-bold text-red-600 mb-4">
            {errorInfo.title}
          </h2>
        </div>

        {/* Error Details */}
        <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
          <div className="text-center space-y-4">
            <p className="text-neutral-700 text-sm leading-relaxed">
              {errorInfo.description}
            </p>
            
            {/* Debug info in development */}
            {isDev && errorInfo.debug && (
              <div className="bg-yellow-50 rounded-lg p-3 text-left">
                <p className="text-xs font-semibold text-yellow-800 mb-1">
                  Debug (développement):
                </p>
                <p className="text-xs text-yellow-700">
                  {errorInfo.debug}
                </p>
              </div>
            )}
            
            {error && error !== 'Default' && (
              <div className="bg-red-50 rounded-lg p-3">
                <p className="text-xs text-red-600 font-mono">
                  Code d'erreur: {error}
                </p>
              </div>
            )}

            {/* Development helper */}
            {isDev && (
              <div className="bg-blue-50 rounded-lg p-3 text-left">
                <p className="text-xs font-semibold text-blue-800 mb-1">
                  Actions de débogage:
                </p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Vérifiez les logs de la console serveur</li>
                  <li>• Contrôlez vos variables GOOGLE_CLIENT_ID et GOOGLE_CLIENT_SECRET</li>
                  <li>• Vérifiez que l'URL de redirection OAuth est correcte</li>
                  <li>• Assurez-vous que les scopes Gmail sont autorisés</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/login"
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-neutral-900 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900 transition-colors"
          >
            Réessayer la connexion
          </Link>
          
          <Link
            href="/"
            className="w-full flex items-center justify-center py-3 px-4 border border-neutral-300 text-sm font-medium rounded-lg text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Link>
        </div>

        {/* Support Link */}
        <div className="text-center">
          <p className="text-xs text-neutral-500">
            Si le problème persiste,{' '}
            <a 
              href="mailto:support@kritiqo.com" 
              className="text-neutral-700 hover:text-neutral-900 font-medium"
            >
              contactez notre support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}
