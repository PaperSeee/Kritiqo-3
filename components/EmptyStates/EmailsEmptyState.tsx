'use client'

import { InboxIcon } from '@heroicons/react/24/outline'
import { useSession, signIn } from 'next-auth/react'

export default function EmailsEmptyState() {
  const { data: session } = useSession()

  const connectGmail = () => {
    signIn('google', {
      callbackUrl: '/dashboard/mails',
      scope: 'openid email profile https://www.googleapis.com/auth/gmail.readonly'
    })
  }

  const connectOutlook = () => {
    signIn('azure-ad', {
      callbackUrl: '/dashboard/mails',
      scope: 'openid email profile https://graph.microsoft.com/mail.read'
    })
  }

  return (
    <div className="text-center py-24 max-w-md mx-auto">
      <InboxIcon className="w-12 h-12 text-gray-400 mb-4 mx-auto" />
      
      <h2 className="text-xl font-semibold text-gray-800 flex items-center justify-center gap-2 mb-3">
        Aucun compte email connecté
        <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-medium">
          IA intégrée
        </span>
      </h2>
      
      <p className="text-sm text-gray-600 mb-2 leading-relaxed">
        Connectez un compte Gmail ou Outlook pour activer le tri intelligent de vos messages
      </p>
      
      <p className="text-xs text-gray-500 mb-6 leading-relaxed">
        Vos emails seront automatiquement triés et analysés dès qu'un compte est connecté.
      </p>
      
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        <button
          onClick={connectGmail}
          disabled={!session}
          className="bg-[#4285F4] text-white px-6 py-3 rounded-lg hover:bg-[#357ae8] transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#4285F4] focus:ring-offset-2"
        >
          Se connecter avec Gmail
        </button>
        
        <button
          onClick={connectOutlook}
          disabled={!session}
          className="bg-[#0078D4] text-white px-6 py-3 rounded-lg hover:bg-[#005a9e] transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#0078D4] focus:ring-offset-2"
        >
          Se connecter avec Outlook
        </button>
      </div>
      
      {!session && (
        <p className="text-xs text-gray-500 mt-4">
          Vous devez être connecté pour ajouter un compte email
        </p>
      )}
    </div>
  )
}
