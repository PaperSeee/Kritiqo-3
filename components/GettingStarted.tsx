'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  BuildingStorefrontIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  QrCodeIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

interface GettingStartedProps {
  hasBusiness: boolean
}

export default function GettingStarted({ hasBusiness }: GettingStartedProps) {
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-[#F9FAFB] rounded-xl p-8 border border-[#E5E7EB]">
        <div className="text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-[#E5E7EB]">
            <SparklesIcon className="h-8 w-8 text-[#6B7280]" />
          </div>
          <h1 className="text-3xl font-bold text-[#111827] mb-2">
            Bienvenue sur Kritiqo ! 🎉
          </h1>
          <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
            Configurez votre compte en connectant votre source d'avis pour commencer à 
            centraliser vos avis et automatiser la gestion de votre réputation en ligne.
          </p>
        </div>
      </div>

      {/* Single Step */}
      <div className="grid md:grid-cols-1 gap-6">
        <div className="cursor-pointer transition-all duration-300 hover:scale-102">
          <div className={`relative overflow-hidden rounded-xl border p-6 hover:shadow-md transition-all duration-200 ${
            hasBusiness 
              ? 'bg-[#F9FAFB] border-[#10B981] shadow-sm' 
              : 'bg-white border-[#E5E7EB] hover:border-[#D1D5DB]'
          }`}>
            {/* Badge */}
            <div className="absolute top-4 right-4">
              {hasBusiness ? (
                <div className="w-6 h-6 bg-[#10B981] rounded-full flex items-center justify-center">
                  <CheckCircleIcon className="h-4 w-4 text-white" />
                </div>
              ) : (
                <div className="w-6 h-6 bg-[#F3F4F6] rounded-full flex items-center justify-center border border-[#E5E7EB]">
                  <span className="text-[#6B7280] text-sm font-medium">1</span>
                </div>
              )}
            </div>

            {/* Icon */}
            <div className="w-12 h-12 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center mb-4 shadow-sm">
              <BuildingStorefrontIcon className="h-6 w-6 text-[#6B7280]" />
            </div>

            {/* Content */}
            <h3 className="text-lg font-semibold text-[#111827] mb-2">
              Connecter une source d'avis
            </h3>
            <p className="text-sm text-[#6B7280] mb-4">
              Connectez votre établissement ou plateforme d'avis pour commencer
            </p>

            {/* Status */}
            <div className="text-xs">
              {hasBusiness ? (
                <span className="text-[#10B981] font-medium bg-[#D1FAE5] px-2 py-1 rounded">✓ Configuré</span>
              ) : (
                <span className="text-[#6B7280] font-medium bg-[#F3F4F6] px-2 py-1 rounded">⚪ En attente</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed View */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-[#E5E7EB]">
        <BusinessStepDetail hasBusiness={hasBusiness} />
      </div>
    </div>
  )
}

function BusinessStepDetail({ hasBusiness }: { hasBusiness: boolean }) {
  return (
    <div>
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-white border border-[#E5E7EB] rounded-xl flex items-center justify-center shadow-sm">
          <BuildingStorefrontIcon className="h-6 w-6 text-[#6B7280]" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-[#111827]">
            {hasBusiness ? 'Source d\'avis connectée ✓' : 'Connecter votre source d\'avis'}
          </h3>
          <p className="text-[#6B7280]">
            {hasBusiness 
              ? 'Votre source d\'avis est configurée. Vous pouvez maintenant générer des QR codes.'
              : 'Connectez Google, Facebook, Trustpilot ou autre plateforme pour commencer'
            }
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-[#6B7280] font-semibold text-sm">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-[#111827]">Choisissez votre plateforme</h4>
                <p className="text-sm text-[#6B7280]">
                  Google, Facebook, Trustpilot ou collez directement un lien
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-[#6B7280] font-semibold text-sm">2</span>
              </div>
              <div>
                <h4 className="font-semibold text-[#111827]">Configuration automatique</h4>
                <p className="text-sm text-[#6B7280]">
                  Kritiqo extrait automatiquement toutes les informations nécessaires
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <QrCodeIcon className="h-4 w-4 text-[#6B7280]" />
              </div>
              <div>
                <h4 className="font-semibold text-[#111827]">QR Code généré</h4>
                <p className="text-sm text-[#6B7280]">
                  Votre QR code personnalisé est prêt à imprimer et partager
                </p>
              </div>
            </div>
          </div>

          {!hasBusiness && (
            <Link
              href="/dashboard/businesses"
              className="inline-flex items-center space-x-2 mt-6 bg-[#2563EB] text-white px-6 py-3 rounded-xl hover:bg-[#1D4ED8] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2"
            >
              <BuildingStorefrontIcon className="h-5 w-5" />
              <span>Connecter une source d'avis</span>
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          )}
          
          {hasBusiness && (
            <Link
              href="/dashboard/reviews/qr"
              className="inline-flex items-center space-x-2 mt-6 bg-[#10B981] text-white px-6 py-3 rounded-xl hover:bg-[#059669] transition-colors focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:ring-offset-2"
            >
              <QrCodeIcon className="h-5 w-5" />
              <span>Générer mon QR Code</span>
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          )}
        </div>

        <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-6">
          <h4 className="font-semibold text-[#111827] mb-4">Ce que vous obtenez :</h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <CheckCircleIcon className="h-5 w-5 text-[#10B981]" />
              <span className="text-sm text-[#374151]">QR code personnalisé pour collecter des avis</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircleIcon className="h-5 w-5 text-[#10B981]" />
              <span className="text-sm text-[#374151]">Lien direct vers vos plateformes d'avis</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircleIcon className="h-5 w-5 text-[#10B981]" />
              <span className="text-sm text-[#374151]">Centralisation de tous vos avis</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircleIcon className="h-5 w-5 text-[#10B981]" />
              <span className="text-sm text-[#374151]">Suivi des performances</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
