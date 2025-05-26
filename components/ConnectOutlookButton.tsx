'use client'

import { signIn } from 'next-auth/react'
import { EnvelopeIcon } from '@heroicons/react/24/outline'

export default function ConnectOutlookButton() {
  return (
    <button
      className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors text-neutral-700 hover:text-neutral-900"
      onClick={() =>
        signIn('azure-ad', {
          callbackUrl: '/dashboard/mails', // 🔁 Redirige vers la page mails après login
          prompt: 'select_account', // 🔥 Force Microsoft à demander le compte
        })
      }
    >
      <EnvelopeIcon className="w-4 h-4" />
      Reconnecter Outlook
    </button>
  )
}
