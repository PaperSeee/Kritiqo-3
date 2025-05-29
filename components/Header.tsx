'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bars3Icon } from '@heroicons/react/24/outline'
import MobileMenu from './MobileMenu'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <span className="text-xl font-bold text-neutral-900">Kritiqo</span>
            </Link>

            {/* Navigation Desktop */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/features"
                className="text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                Fonctionnalités
              </Link>
              <Link
                href="/pricing"
                className="text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                Tarifs
              </Link>
              <Link
                href="/faq"
                className="text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                FAQ
              </Link>
              <Link
                href="/contact"
                className="text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                Contact
              </Link>
            </nav>

            {/* Actions Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/login"
                className="text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                Connexion
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors font-medium"
              >
                Essai gratuit
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Ouvrir le menu"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  )
}
