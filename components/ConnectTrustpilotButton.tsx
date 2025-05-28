'use client'

import { useState } from 'react'

export default function ConnectTrustpilotButton() {
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      // Trustpilot Business API connection
      const clientId = process.env.NEXT_PUBLIC_TRUSTPILOT_API_KEY
      const redirectUri = encodeURIComponent(`${window.location.origin}/api/auth/callback/trustpilot`)
      
      const trustpilotAuthUrl = `https://authenticate.trustpilot.com?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=business_profile_read,reviews_read&state=trustpilot-business`
      
      window.location.href = trustpilotAuthUrl
    } catch (error) {
      console.error('Erreur lors de la connexion Trustpilot:', error)
      setIsConnecting(false)
    }
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting}
      className="group w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#00B67A] hover:bg-[#00A069] disabled:bg-[#4db894] text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-5 h-5">
            <path
              fill="#00B67A"
              d="M12 2L14.09 8.26L22 8.26L15.95 13.14L18.18 19.5L12 15.77L5.82 19.5L8.05 13.14L2 8.26L9.91 8.26L12 2Z"
            />
          </svg>
        </div>
        <div className="text-left">
          <div className="text-white font-semibold">Trustpilot</div>
          <div className="text-green-100 text-sm">Connecter ma page</div>
        </div>
      </div>
      {isConnecting && (
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
      )}
    </button>
  )
}
