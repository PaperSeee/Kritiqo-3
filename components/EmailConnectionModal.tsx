'use client'

import { useState } from 'react'
import { X, Mail, Shield, AlertCircle, Eye, EyeOff } from 'lucide-react'

interface EmailConnectionModalProps {
  isOpen: boolean
  onClose: () => void
  onEmailConnected: () => void
}

type Provider = 'gmail' | 'microsoft' | null

export default function EmailConnectionModal({ 
  isOpen, 
  onClose, 
  onEmailConnected 
}: EmailConnectionModalProps) {
  const [selectedProvider, setSelectedProvider] = useState<Provider>(null)
  const [email, setEmail] = useState('')
  const [appPassword, setAppPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleGmailConnect = async () => {
    // Clear previous errors
    setError('')

    // Validate required fields
    if (!email || !appPassword) {
      setError('Veuillez remplir tous les champs')
      return
    }

    // Validate email format
    const trimmedEmail = email.trim().toLowerCase()
    if (!trimmedEmail.includes('@gmail.com')) {
      setError('Veuillez utiliser une adresse Gmail valide')
      return
    }

    // Clean and validate app password
    const cleanAppPassword = appPassword.replace(/\s/g, '')
    if (cleanAppPassword.length < 16) {
      setError('Le mot de passe d\'application doit contenir au moins 16 caractères')
      return
    }

    setLoading(true)

    try {
      console.log('Attempting Gmail connection...', { email: trimmedEmail.substring(0, 5) + '***' })
      
      // ✅ Keep it simple - NextAuth session handles authentication
      const response = await fetch('/api/email/imap-connect', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: trimmedEmail, 
          appPassword: cleanAppPassword 
        })
      })

      const data = await response.json()
      console.log('Response:', { status: response.status, success: response.ok })

      if (response.ok) {
        console.log('Connexion Gmail réussie:', data)
        onEmailConnected()
        resetForm()
        onClose()
      } else {
        console.error('Erreur IMAP:', data?.error || data)
        // ✅ Show more specific error messages
        if (data?.error?.includes('User validation failed')) {
          setError('Session expirée. Veuillez vous reconnecter à votre compte Kritiqo.')
        } else {
          setError(data.error || `Erreur ${response.status}: Impossible de se connecter à Gmail`)
        }
      }
    } catch (error) {
      console.error('Erreur lors de la connexion Gmail:', error)
      setError('Erreur réseau lors de la connexion. Vérifiez votre connexion internet.')
    } finally {
      setLoading(false)
    }
  }

  const handleMicrosoftConnect = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/email/microsoft-auth', {
        method: 'POST'
      })

      const data = await response.json()

      if (response.ok && data.authUrl) {
        window.location.href = data.authUrl
      } else {
        setError('Erreur lors de l\'initialisation de l\'authentification Microsoft')
      }
    } catch (error) {
      setError('Erreur réseau lors de la connexion')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setSelectedProvider(null)
    setEmail('')
    setAppPassword('')
    setError('')
    setShowPassword(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Connectez votre boîte mail
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Permettez à Kritiqo de trier et analyser automatiquement vos emails importants.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {!selectedProvider ? (
            // Provider Selection
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 mb-4">
                Choisissez votre fournisseur d'email
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                {/* Gmail Option */}
                <button
                  onClick={() => setSelectedProvider('gmail')}
                  className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all text-left"
                >
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mb-3">
                    <Mail className="h-4 w-4 text-red-600" />
                  </div>
                  <div className="font-medium text-gray-900">Gmail</div>
                  <div className="text-xs text-gray-500">Via IMAP</div>
                </button>

                {/* Microsoft Option */}
                <button
                  onClick={() => setSelectedProvider('microsoft')}
                  className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all text-left"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                    <Mail className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="font-medium text-gray-900">Outlook</div>
                  <div className="text-xs text-gray-500">Hotmail, Live</div>
                </button>

                {/* Yahoo (Coming Soon) */}
                <button
                  disabled
                  className="p-4 border border-gray-200 rounded-lg bg-gray-50 opacity-50 cursor-not-allowed text-left"
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="font-medium text-gray-500">Yahoo Mail</div>
                  <div className="text-xs text-gray-400">Bientôt</div>
                </button>

                {/* Other (Disabled) */}
                <button
                  disabled
                  className="p-4 border border-gray-200 rounded-lg bg-gray-50 opacity-50 cursor-not-allowed text-left"
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="font-medium text-gray-500">Autre</div>
                  <div className="text-xs text-gray-400">Non disponible</div>
                </button>
              </div>
            </div>
          ) : selectedProvider === 'gmail' ? (
            // Gmail IMAP Form
            <div className="space-y-6">
              <button
                onClick={() => setSelectedProvider(null)}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                ← Retour aux fournisseurs
              </button>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-2">🔒 Sécurité obligatoire pour Gmail</p>
                    <p className="mb-3">
                      Pour des raisons de sécurité, Google exige l'utilisation d'un mot de passe d'application spécifique 
                      pour les connexions IMAP. Votre mot de passe principal Gmail ne fonctionnera pas.
                    </p>
                    <div className="space-y-2 text-xs">
                      <p className="font-medium">Étapes requises :</p>
                      <ol className="list-decimal list-inside space-y-1 ml-2">
                        <li>Activez la vérification en 2 étapes sur votre compte Google</li>
                        <li>Générez un mot de passe d'application dédié à Kritiqo</li>
                        <li>Utilisez ce mot de passe (16 caractères) ci-dessous</li>
                      </ol>
                    </div>
                    <div className="mt-3 pt-2 border-t border-blue-300">
                      <a
                        href="https://myaccount.google.com/apppasswords"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-700 hover:text-blue-900 font-medium underline"
                      >
                        🔗 Créer un mot de passe d'application Gmail
                        <svg className="ml-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse email Gmail *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre-email@gmail.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe d'application Gmail *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={appPassword}
                      onChange={(e) => setAppPassword(e.target.value)}
                      placeholder="xxxx xxxx xxxx xxxx"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Format attendu : 16 caractères sans espaces (ex: abcdwxyzabcdwxyz)
                  </p>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-red-700">
                    <p className="font-medium mb-1">Erreur de connexion</p>
                    <p>{error}</p>
                    <p className="mt-2 text-xs">
                      Vérifiez que vous avez bien généré un mot de passe d'application Gmail et non votre mot de passe principal.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleGmailConnect}
                  disabled={loading || !email || !appPassword}
                  className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Connexion...' : 'Se connecter'}
                </button>
              </div>
            </div>
          ) : (
            // Microsoft OAuth
            <div className="space-y-6">
              <button
                onClick={() => setSelectedProvider(null)}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                ← Retour aux fournisseurs
              </button>

              <div className="text-center py-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Connexion Microsoft sécurisée
                </h3>
                <p className="text-gray-600 text-sm">
                  Vous allez être redirigé vers Microsoft pour autoriser l'accès 
                  à votre boîte mail Outlook, Hotmail ou Live.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleMicrosoftConnect}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Redirection...' : 'Se connecter avec Microsoft'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
