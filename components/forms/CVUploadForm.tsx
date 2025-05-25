'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { DocumentArrowUpIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline'

interface CV {
  id: string
  filename: string
  original_name: string
  file_size: number
  upload_date: string
  is_primary: boolean
}

interface CVUploadFormProps {
  onUploadComplete?: () => void
  showList?: boolean
}

export default function CVUploadForm({ onUploadComplete, showList = true }: CVUploadFormProps) {
  const { user } = useAuth()
  const [uploading, setUploading] = useState(false)
  const [cvs, setCVs] = useState<CV[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchCVs = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/cvs')
      if (!response.ok) throw new Error('Erreur lors de la récupération des CVs')
      
      const data = await response.json()
      setCVs(data.cvs)
    } catch (err) {
      console.error('Erreur:', err)
      setError('Erreur lors de la récupération des CVs')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      setError('Seuls les fichiers PDF, DOC et DOCX sont acceptés')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Le fichier ne doit pas dépasser 5MB')
      return
    }

    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('cv', file)

      const response = await fetch('/api/cvs', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de l\'upload')
      }

      await fetchCVs()
      onUploadComplete?.()
      
      // Reset input
      event.target.value = ''
    } catch (err) {
      console.error('Erreur upload:', err)
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'upload')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (cvId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce CV ?')) return

    try {
      const response = await fetch(`/api/cvs?id=${cvId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Erreur lors de la suppression')

      await fetchCVs()
    } catch (err) {
      console.error('Erreur suppression:', err)
      setError('Erreur lors de la suppression')
    }
  }

  const handleSetPrimary = async (cvId: string) => {
    try {
      const response = await fetch('/api/cvs/primary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvId })
      })

      if (!response.ok) throw new Error('Erreur lors de la mise à jour')

      await fetchCVs()
    } catch (err) {
      console.error('Erreur:', err)
      setError('Erreur lors de la mise à jour')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-neutral-400 transition-colors">
        <DocumentArrowUpIcon className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-neutral-900 mb-2">
          Télécharger un CV
        </h3>
        <p className="text-sm text-neutral-600 mb-4">
          PDF, DOC ou DOCX - Maximum 5MB
        </p>
        <div className="relative">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileUpload}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <button
            type="button"
            disabled={uploading}
            className="bg-neutral-900 text-white px-6 py-2 rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Upload en cours...' : 'Sélectionner un fichier'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* CV List */}
      {showList && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900">
              Mes CVs
            </h3>
            <button
              onClick={fetchCVs}
              disabled={loading}
              className="text-sm text-neutral-600 hover:text-neutral-900 disabled:opacity-50"
            >
              {loading ? 'Chargement...' : 'Actualiser'}
            </button>
          </div>

          {cvs.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">
              Aucun CV téléchargé
            </div>
          ) : (
            <div className="space-y-3">
              {cvs.map((cv) => (
                <div
                  key={cv.id}
                  className={`border rounded-lg p-4 ${cv.is_primary ? 'border-green-300 bg-green-50' : 'border-neutral-200'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-neutral-900">
                          {cv.original_name}
                        </h4>
                        {cv.is_primary && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Principal
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-neutral-600">
                        {formatFileSize(cv.file_size)} • Téléchargé le {new Date(cv.upload_date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <a
                        href={`/api/cvs/download?id=${cv.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg"
                        title="Voir le CV"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </a>
                      
                      {!cv.is_primary && (
                        <button
                          onClick={() => handleSetPrimary(cv.id)}
                          className="text-xs bg-neutral-100 text-neutral-700 px-3 py-1 rounded hover:bg-neutral-200 transition-colors"
                        >
                          Définir comme principal
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDelete(cv.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                        title="Supprimer"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
