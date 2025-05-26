import Link from 'next/link'
import MobileNavigation from '../app/components/MobileNavigation'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-200">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between relative">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <span className="text-xl font-bold text-neutral-900">Kritiqo</span>
          </Link>

          {/* Navigation desktop - centered */}
          <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
            <Link href="/features" className="text-neutral-600 hover:text-neutral-900 transition-colors">
              Fonctionnalités
            </Link>
            <Link href="/pricing" className="text-neutral-600 hover:text-neutral-900 transition-colors">
              Tarifs
            </Link>
            <Link href="/faq" className="text-neutral-600 hover:text-neutral-900 transition-colors">
              FAQ
            </Link>
            <Link href="/contact" className="text-neutral-600 hover:text-neutral-900 transition-colors">
              Contact
            </Link>
          </nav>

          {/* CTA desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/login"
              className="text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Se connecter
            </Link>
            <Link
              href="/signup"
              className="bg-neutral-900 text-white px-4 py-2 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              Essai gratuit
            </Link>
          </div>

          {/* Navigation mobile */}
          <MobileNavigation />
        </div>
      </div>
    </header>
  )
}
