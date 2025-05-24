'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowLeftIcon, QrCodeIcon, PrinterIcon, ShareIcon, DocumentDuplicateIcon, ArrowDownTrayIcon, EyeIcon } from '@heroicons/react/24/outline'
import { CheckIcon } from '@heroicons/react/24/solid'

export default function QRPage() {
  const [qrCodeUrl] = useState("https://kritiqo.com/review/your-business-id")
  const [qrSize, setQrSize] = useState('400')
  const [qrFormat, setQrFormat] = useState('PNG')
  const [copied, setCopied] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  // Generate QR code data URL
  const generateQRCode = (size: string) => {
    const qrSize = size === 'small' ? 200 : size === 'medium' ? 400 : 600
    // Using QR Server API for demonstration - in production, use a proper QR library
    return `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(qrCodeUrl)}`
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(qrCodeUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const downloadQR = () => {
    const link = document.createElement('a')
    link.href = generateQRCode(qrSize)
    link.download = `qr-code-kritiqo.${qrFormat.toLowerCase()}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4">
        <Link
          href="/dashboard/reviews"
          className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Générateur QR Code
          </h1>
          <p className="text-neutral-600">
            Générez et partagez votre QR code pour collecter des avis
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* QR Code */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8">
          <div className="text-center">
            <div className="bg-neutral-100 rounded-xl p-8 mb-6">
              <div className="w-48 h-48 mx-auto bg-white rounded-lg border-2 border-neutral-200 flex items-center justify-center overflow-hidden">
                <img 
                  src={generateQRCode(qrSize)} 
                  alt="QR Code" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Votre QR Code d'avis
            </h3>
            <p className="text-sm text-neutral-600 mb-6">
              Scannez ce code pour laisser un avis
            </p>
            
            <div className="flex flex-wrap gap-3 justify-center">
              <button 
                onClick={copyToClipboard}
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {copied ? (
                  <CheckIcon className="h-4 w-4" />
                ) : (
                  <DocumentDuplicateIcon className="h-4 w-4" />
                )}
                <span>{copied ? 'Copié!' : 'Copier lien'}</span>
              </button>
              
              <button 
                onClick={downloadQR}
                className="inline-flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
                <span>Télécharger QR</span>
              </button>
              
              <button className="inline-flex items-center space-x-2 bg-neutral-900 text-white px-4 py-2 rounded-lg hover:bg-neutral-800 transition-colors">
                <PrinterIcon className="h-4 w-4" />
                <span>Imprimer</span>
              </button>
              
              <button 
                onClick={() => setShowPreview(!showPreview)}
                className="inline-flex items-center space-x-2 bg-white text-neutral-900 px-4 py-2 rounded-lg border border-neutral-300 hover:bg-neutral-50 transition-colors"
              >
                <EyeIcon className="h-4 w-4" />
                <span>Aperçu client</span>
              </button>
            </div>
          </div>
        </div>

        {/* Configuration */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Configuration
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  URL de destination
                </label>
                <input
                  type="text"
                  value={qrCodeUrl}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                  readOnly
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Taille du QR Code
                </label>
                <select 
                  value={qrSize}
                  onChange={(e) => setQrSize(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                >
                  <option value="200">Petite (200x200px)</option>
                  <option value="400">Moyenne (400x400px)</option>
                  <option value="600">Grande (600x600px)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Format de téléchargement
                </label>
                <select 
                  value={qrFormat}
                  onChange={(e) => setQrFormat(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                >
                  <option>PNG</option>
                  <option>JPG</option>
                  <option>SVG</option>
                  <option>PDF</option>
                </select>
              </div>
            </div>
            
            <button 
              onClick={downloadQR}
              className="w-full mt-6 bg-neutral-900 text-white py-3 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              Télécharger le QR Code
            </button>
          </div>

          <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
            <h4 className="font-semibold text-blue-800 mb-2">
              💡 Conseils d'utilisation
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Placez le QR code à l'accueil de votre établissement</li>
              <li>• Ajoutez-le sur vos factures et reçus</li>
              <li>• Partagez-le sur vos réseaux sociaux</li>
              <li>• Intégrez-le dans vos signatures email</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Customer Preview */}
      {showPreview && (
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8">
          <h3 className="text-xl font-semibold text-neutral-900 mb-6">
            📱 Aperçu de l'expérience client
          </h3>
          
          <div className="max-w-md mx-auto bg-neutral-50 rounded-2xl p-6 border-2 border-neutral-200">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-neutral-900 rounded-full mx-auto flex items-center justify-center">
                <span className="text-white font-bold text-xl">K</span>
              </div>
              
              <h4 className="text-lg font-semibold text-neutral-900">
                Votre Entreprise
              </h4>
              
              <p className="text-neutral-600 text-sm">
                Votre avis nous aide à nous améliorer
              </p>
              
              <div className="bg-white rounded-lg p-4 border border-neutral-200">
                <p className="text-sm text-neutral-700 mb-3">
                  Comment évalueriez-vous votre expérience ?
                </p>
                <div className="flex justify-center space-x-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div key={star} className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-yellow-600">★</span>
                    </div>
                  ))}
                </div>
                <button className="w-full bg-neutral-900 text-white py-2 rounded-lg text-sm">
                  Laisser un avis
                </button>
              </div>
              
              <p className="text-xs text-neutral-500">
                Propulsé par Kritiqo
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
