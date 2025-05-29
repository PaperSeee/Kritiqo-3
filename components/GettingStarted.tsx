'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  BuildingStorefrontIcon,
  EnvelopeIcon,
  EyeIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  QrCodeIcon,
  StarIcon,
  SparklesIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

interface GettingStartedProps {
  hasBusiness: boolean
  hasMailbox: boolean
}

export default function GettingStarted({ hasBusiness, hasMailbox }: GettingStartedProps) {
  const [activeStep, setActiveStep] = useState<'business' | 'mailbox' | 'mentions'>('business')

  const steps = [
    {
      id: 'business',
      title: 'Connecter une source d\'avis',
      description: 'Connectez votre établissement ou plateforme d\'avis pour commencer',
      completed: hasBusiness,
      comingSoon: false,
      icon: BuildingStorefrontIcon,
      link: '/dashboard/businesses'
    },
    {
      id: 'mailbox',
      title: 'Connecter votre boîte mail',
      description: 'Laissez notre IA trier automatiquement vos emails',
      completed: hasMailbox,
      comingSoon: false,
      icon: EnvelopeIcon,
      link: '/dashboard/mails'
    },
    {
      id: 'mentions',
      title: 'Surveiller vos mentions',
      description: 'Suivez ce que les gens disent de votre marque en ligne',
      completed: false,
      comingSoon: true,
      icon: EyeIcon,
      link: '/dashboard/mentions'
    }
  ]

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
            Configurez votre compte en 3 étapes simples pour commencer à centraliser vos avis 
            et automatiser la gestion de votre réputation en ligne.
          </p>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        {steps.map((step, index) => {
          const StepIcon = step.icon
          const isActive = activeStep === step.id
          
          return (
            <div
              key={step.id}
              onClick={() => setActiveStep(step.id as any)}
              className={`cursor-pointer transition-all duration-300 ${
                isActive ? 'transform scale-105' : 'hover:scale-102'
              }`}
            >
              <div className={`relative overflow-hidden rounded-xl border p-6 hover:shadow-md transition-all duration-200 ${
                step.completed 
                  ? 'bg-[#F9FAFB] border-[#10B981] shadow-sm' 
                  : step.comingSoon
                  ? 'bg-[#F9FAFB] border-[#E5E7EB]'
                  : 'bg-white border-[#E5E7EB] hover:border-[#D1D5DB]'
              }`}>
                {/* Badge */}
                <div className="absolute top-4 right-4">
                  {step.completed ? (
                    <div className="w-6 h-6 bg-[#10B981] rounded-full flex items-center justify-center">
                      <CheckCircleIcon className="h-4 w-4 text-white" />
                    </div>
                  ) : step.comingSoon ? (
                    <span className="px-2 py-1 bg-[#FEF3C7] text-[#F97316] text-xs font-medium rounded-full border border-[#FDE68A]">
                      Bientôt
                    </span>
                  ) : (
                    <div className="w-6 h-6 bg-[#F3F4F6] rounded-full flex items-center justify-center border border-[#E5E7EB]">
                      <span className="text-[#6B7280] text-sm font-medium">{index + 1}</span>
                    </div>
                  )}
                </div>

                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center mb-4 shadow-sm">
                  <StepIcon className="h-6 w-6 text-[#6B7280]" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-[#111827] mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-[#6B7280] mb-4">
                  {step.description}
                </p>

                {/* Status */}
                <div className="text-xs">
                  {step.completed ? (
                    <span className="text-[#10B981] font-medium bg-[#D1FAE5] px-2 py-1 rounded">✓ Configuré</span>
                  ) : step.comingSoon ? (
                    <span className="text-[#F97316] font-medium bg-[#FEF3C7] px-2 py-1 rounded">⏳ En développement</span>
                  ) : (
                    <span className="text-[#6B7280] font-medium bg-[#F3F4F6] px-2 py-1 rounded">⚪ En attente</span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Detailed View */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-[#E5E7EB]">
        {activeStep === 'business' && <BusinessStepDetail hasBusiness={hasBusiness} />}
        {activeStep === 'mailbox' && <MailboxStepDetail hasMailbox={hasMailbox} />}
        {activeStep === 'mentions' && <MentionsStepDetail />}
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
              : 'Première étape : connectez Google, Facebook, Trustpilot ou autre plateforme'
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

function MailboxStepDetail({ hasMailbox }: { hasMailbox: boolean }) {
  return (
    <div>
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-white border border-[#E5E7EB] rounded-xl flex items-center justify-center shadow-sm">
          <EnvelopeIcon className="h-6 w-6 text-[#6B7280]" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-[#111827]">
            {hasMailbox ? 'Boîte mail connectée ✓' : 'Connecter votre boîte mail'}
          </h3>
          <p className="text-[#6B7280]">
            {hasMailbox 
              ? 'Votre boîte mail est connectée. L\'IA trie automatiquement vos emails.'
              : 'Laissez notre IA organiser automatiquement vos emails'
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
                <h4 className="font-semibold text-[#111827]">Connexion sécurisée</h4>
                <p className="text-sm text-[#6B7280]">
                  Connectez Gmail ou Outlook avec OAuth (accès lecture seule)
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <SparklesIcon className="h-4 w-4 text-[#6B7280]" />
              </div>
              <div>
                <h4 className="font-semibold text-[#111827]">IA automatique</h4>
                <p className="text-sm text-[#6B7280]">
                  L'IA classe vos emails : clients, factures, RH, admin, etc.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <ClockIcon className="h-4 w-4 text-[#6B7280]" />
              </div>
              <div>
                <h4 className="font-semibold text-[#111827]">Gain de temps</h4>
                <p className="text-sm text-[#6B7280]">
                  Économisez 2h par jour sur la gestion de vos emails
                </p>
              </div>
            </div>
          </div>

          {!hasMailbox && (
            <Link
              href="/api/auth/signin"
              className="inline-flex items-center space-x-2 mt-6 bg-[#2563EB] text-white px-6 py-3 rounded-xl hover:bg-[#1D4ED8] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2"
            >
              <EnvelopeIcon className="h-5 w-5" />
              <span>Connecter ma boîte mail</span>
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          )}
        </div>

        <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-6">
          <h4 className="font-semibold text-[#111827] mb-4">Catégories automatiques :</h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-[#6B7280] rounded"></div>
              <span className="text-sm text-[#374151]">Clients & Prospects</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-[#6B7280] rounded"></div>
              <span className="text-sm text-[#374151]">Factures & Comptabilité</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-[#6B7280] rounded"></div>
              <span className="text-sm text-[#374151]">Ressources Humaines</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-[#6B7280] rounded"></div>
              <span className="text-sm text-[#374151]">Administration</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-[#6B7280] rounded"></div>
              <span className="text-sm text-[#374151]">Urgent</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MentionsStepDetail() {
  return (
    <div>
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-white border border-[#E5E7EB] rounded-xl flex items-center justify-center shadow-sm">
          <EyeIcon className="h-6 w-6 text-[#6B7280]" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-[#111827]">
            Surveillance des mentions
          </h3>
          <p className="text-[#6B7280]">
            Fonctionnalité en cours de développement - Bientôt disponible !
          </p>
        </div>
      </div>

      <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-xl p-6 mb-6">
        <div className="flex items-center space-x-3">
          <ClockIcon className="h-6 w-6 text-[#F97316]" />
          <div>
            <h4 className="font-semibold text-[#92400E]">Coming Soon</h4>
            <p className="text-[#B45309] text-sm">
              Notre équipe travaille activement sur cette fonctionnalité de veille automatique.
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h4 className="font-semibold text-[#111827] mb-4">Ce qui sera disponible :</h4>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <EyeIcon className="h-4 w-4 text-[#6B7280]" />
              </div>
              <div>
                <h5 className="font-medium text-[#111827]">Surveillance temps réel</h5>
                <p className="text-sm text-[#6B7280]">
                  Détection automatique de nouvelles mentions sur le web
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <SparklesIcon className="h-4 w-4 text-[#6B7280]" />
              </div>
              <div>
                <h5 className="font-medium text-[#111827]">Analyse de sentiment</h5>
                <p className="text-sm text-[#6B7280]">
                  Classification automatique : positif, négatif, neutre
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <StarIcon className="h-4 w-4 text-[#6B7280]" />
              </div>
              <div>
                <h5 className="font-medium text-[#111827]">Alertes intelligentes</h5>
                <p className="text-sm text-[#6B7280]">
                  Notifications pour les mentions importantes
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-6">
          <h4 className="font-semibold text-[#111827] mb-4">Sources surveillées :</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-[#6B7280] rounded-full"></div>
              <span className="text-sm text-[#374151]">Google</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-[#6B7280] rounded-full"></div>
              <span className="text-sm text-[#374151]">Facebook</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-[#6B7280] rounded-full"></div>
              <span className="text-sm text-[#374151]">Twitter/X</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-[#6B7280] rounded-full"></div>
              <span className="text-sm text-[#374151]">Instagram</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-[#6B7280] rounded-full"></div>
              <span className="text-sm text-[#374151]">TikTok</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-[#6B7280] rounded-full"></div>
              <span className="text-sm text-[#374151]">TripAdvisor</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Link
          href="/dashboard/mentions"
          className="inline-flex items-center space-x-2 bg-[#F3F4F6] text-[#6B7280] px-6 py-3 rounded-xl cursor-not-allowed border border-[#E5E7EB]"
        >
          <EyeIcon className="h-5 w-5" />
          <span>Bientôt disponible</span>
        </Link>
      </div>
    </div>
  )
}
