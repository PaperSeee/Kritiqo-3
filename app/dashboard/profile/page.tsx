'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { 
  UserIcon, 
  KeyIcon, 
  TrashIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'

export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('personal')
  
  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  
  // UI state
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')

  // Helper function to get display name safely
  const getDisplayName = () => {
    if (!user) return ''
    
    // Check user metadata first
    const fullName = user.user_metadata?.full_name || user.user_metadata?.name
    if (fullName) return fullName
    
    // Fallback to email prefix
    if (user.email) {
      return user.email.split('@')[0]
    }
    
    return 'Utilisateur'
  }

  // Get user avatar
  const getUserAvatar = () => {
    return user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null
  }

  const tabs = [
    {
      id: 'personal',
      name: 'Informations personnelles',
      icon: UserIcon
    },
    {
      id: 'security',
      name: 'Sécurité',
      icon: KeyIcon
    }
  ]

  // Clear message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [message])

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    // Validation
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({
        type: 'error',
        text: 'Les nouveaux mots de passe ne correspondent pas'
      })
      setLoading(false)
      return
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage({
        type: 'error',
        text: 'Le nouveau mot de passe doit contenir au moins 6 caractères'
      })
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      })

      if (error) throw error

      setMessage({
        type: 'success',
        text: 'Mot de passe mis à jour avec succès'
      })
      
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Erreur lors de la mise à jour du mot de passe'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'SUPPRIMER') {
      setMessage({
        type: 'error',
        text: 'Veuillez taper "SUPPRIMER" pour confirmer'
      })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      // Delete user account
      const { error } = await supabase.auth.admin.deleteUser(user?.id || '')
      
      if (error) throw error

      // Sign out and redirect
      await signOut()
      router.push('/')
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Erreur lors de la suppression du compte'
      })
      setLoading(false)
    }
  }

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Mon Profil
          </h1>
          <p className="text-neutral-600">
            Gérez vos informations personnelles et vos paramètres de sécurité
          </p>
        </div>
        
        <button
          onClick={signOut}
          className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-2xl transition-colors"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          <span>Se déconnecter</span>
        </button>
      </div>

      {/* Message d'alerte */}
      {message && (
        <div className={`p-4 rounded-2xl border ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center space-x-2">
            {message.type === 'success' ? (
              <CheckCircleIcon className="h-5 w-5" />
            ) : (
              <ExclamationTriangleIcon className="h-5 w-5" />
            )}
            <span>{message.text}</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-neutral-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-neutral-900 text-neutral-900'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-8">
        {activeTab === 'personal' && (
          <div className="space-y-8">
            <h2 className="text-xl font-semibold text-neutral-900">
              Informations personnelles
            </h2>
            
            {/* Avatar Section */}
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-neutral-100 rounded-2xl flex items-center justify-center overflow-hidden">
                {getUserAvatar() ? (
                  <img 
                    src={getUserAvatar()} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon className="h-10 w-10 text-neutral-400" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-medium text-neutral-900">
                  Photo de profil
                </h3>
                <p className="text-sm text-neutral-600">
                  Gérée automatiquement par votre fournisseur d'authentification
                </p>
              </div>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Nom complet
                </label>
                <input
                  type="text"
                  value={getDisplayName()}
                  readOnly
                  className="w-full px-4 py-3 border border-neutral-300 rounded-2xl bg-neutral-50 text-neutral-600"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  readOnly
                  className="w-full px-4 py-3 border border-neutral-300 rounded-2xl bg-neutral-50 text-neutral-600"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  ID utilisateur
                </label>
                <input
                  type="text"
                  value={user?.id || ''}
                  readOnly
                  className="w-full px-4 py-3 border border-neutral-300 rounded-2xl bg-neutral-50 text-neutral-600 font-mono text-sm"
                />
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
              <div className="flex items-start space-x-3">
                <ExclamationTriangleIcon className="h-6 w-6 text-orange-600 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-orange-900 mb-1">
                    Modification des informations personnelles
                  </h4>
                  <p className="text-sm text-orange-800">
                    Pour modifier votre nom ou email, veuillez nous contacter à{' '}
                    <a href="mailto:support@kritiqo.com" className="underline font-medium">
                      support@kritiqo.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-8">
            <h2 className="text-xl font-semibold text-neutral-900">
              Sécurité du compte
            </h2>
            
            {/* Change Password Section */}
            <div className="bg-neutral-50 rounded-2xl p-6">
              <h3 className="text-lg font-medium text-neutral-900 mb-4">
                Modifier mon mot de passe
              </h3>
              
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Mot de passe actuel
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="w-full px-4 py-3 pr-12 border border-neutral-300 rounded-2xl focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                      placeholder="Entrez votre mot de passe actuel"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                      {showPasswords.current ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full px-4 py-3 pr-12 border border-neutral-300 rounded-2xl focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                      placeholder="Entrez votre nouveau mot de passe"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                      {showPasswords.new ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Confirmer le nouveau mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full px-4 py-3 pr-12 border border-neutral-300 rounded-2xl focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                      placeholder="Confirmez votre nouveau mot de passe"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                      {showPasswords.confirm ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                  className="bg-neutral-900 text-white px-6 py-3 rounded-2xl hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
                </button>
              </form>
            </div>

            {/* Delete Account Section */}
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <div className="flex items-start space-x-3">
                <TrashIcon className="h-6 w-6 text-red-600 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-red-900 mb-2">
                    Supprimer mon compte
                  </h3>
                  <p className="text-sm text-red-700 mb-4">
                    Cette action est irréversible. Toutes vos données seront définitivement supprimées.
                  </p>
                  
                  {!showDeleteConfirm ? (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="bg-red-600 text-white px-4 py-2 rounded-2xl hover:bg-red-700 transition-colors text-sm"
                    >
                      Supprimer mon compte
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-red-700 mb-2">
                          Tapez "SUPPRIMER" pour confirmer
                        </label>
                        <input
                          type="text"
                          value={deleteConfirmText}
                          onChange={(e) => setDeleteConfirmText(e.target.value)}
                          className="w-full px-4 py-3 border border-red-300 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="SUPPRIMER"
                        />
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={handleDeleteAccount}
                          disabled={loading || deleteConfirmText !== 'SUPPRIMER'}
                          className="bg-red-600 text-white px-4 py-2 rounded-2xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          {loading ? 'Suppression...' : 'Confirmer la suppression'}
                        </button>
                        <button
                          onClick={() => {
                            setShowDeleteConfirm(false)
                            setDeleteConfirmText('')
                          }}
                          className="border border-neutral-300 text-neutral-700 px-4 py-2 rounded-2xl hover:bg-neutral-50 transition-colors text-sm"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
