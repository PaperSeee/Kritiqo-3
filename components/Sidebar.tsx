'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  HomeIcon,
  BuildingStorefrontIcon,
  StarIcon,
  QrCodeIcon,
  ChatBubbleBottomCenterTextIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'

const navigation = [
  { name: 'Tableau de Bord', href: '/dashboard', icon: HomeIcon, badge: null },
  { name: 'Établissements', href: '/dashboard/businesses', icon: BuildingStorefrontIcon, badge: null },
  { name: 'Avis', href: '/dashboard/reviews', icon: StarIcon, badge: null },
  { name: 'QR Codes', href: '/dashboard/reviews/qr', icon: QrCodeIcon, badge: null },
  { name: 'Réponses', href: '/dashboard/responses', icon: ChatBubbleBottomCenterTextIcon, badge: null },
  { name: 'Analytics', href: '/dashboard/analytics', icon: ChartBarIcon, badge: null },
]

export default function Sidebar() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 bg-white border-b border-[#E5E7EB]">
        <Link href="/dashboard" className="text-2xl font-bold text-[#111827]">
          Kritiqo
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        <div className="px-4 py-6">
          {navigation.map((item) => (
            <div key={item.name} className="mb-4">
              <Link
                href={item.href}
                className="flex items-center p-3 text-sm font-medium rounded-lg transition-all duration-200"
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span className="flex-1">{item.name}</span>
                {item.badge && (
                  <span className="inline-flex items-center justify-center w-3 h-3 p-3 text-xs font-medium text-white bg-red-600 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            </div>
          ))}
        </div>
      </nav>

      {/* User account section - à personnaliser */}
      <div className="p-4 border-t border-[#E5E7EB]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-500 text-xl font-medium">JD</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-[#111827]">John Doe</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
          <Link
            href="/api/auth/signout"
            className="text-sm font-medium text-red-600 hover:underline"
          >
            Se déconnecter
          </Link>
        </div>
      </div>
    </div>
  )
}