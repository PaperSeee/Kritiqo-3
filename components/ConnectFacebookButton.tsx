'use client'

import { useState } from 'react'

export default function ConnectFacebookButton() {
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      // Facebook OAuth URL with necessary scopes for business pages
      const clientId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID
      const redirectUri = encodeURIComponent(`${window.location.origin}/api/auth/callback/facebook`)
      const scope = encodeURIComponent('pages_manage_metadata,pages_read_engagement,pages_show_list')
      
      const facebookAuthUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&state=facebook-business`
      
      window.location.href = facebookAuthUrl
    } catch (error) {
      console.error('Erreur lors de la connexion Facebook:', error)
      setIsConnecting(false)
    }
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting}
      className="group w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#1877F2] hover:bg-[#166FE5] disabled:bg-[#4f94f7] text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#1877F2]">
            <path
              fill="currentColor"
              d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
            />
          </svg>
        </div>
        <div className="text-left">
          <div className="text-white font-semibold">Facebook</div>
          <div className="text-blue-100 text-sm">Connecter ma page</div>
        </div>
      </div>
      {isConnecting && (
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
      )}
    </button>
  )
}
