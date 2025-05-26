import Link from 'next/link'
import MobileNavigation from '../app/components/MobileNavigation'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-200">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <span className="text-xl font-bold text-neutral-900">Kritiqo</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-neutral-600 hover:text-neutral-900 transition-colors">
              Fonctionnalités
            </a>
            <a href="#benefits" className="text-neutral-600 hover:text-neutral-900 transition-colors">
              Avantages
            </a>
            <Link href="/faq" className="text-neutral-600 hover:text-neutral-900 transition-colors">
              FAQ
            </Link>
            <Link href="/contact" className="text-neutral-600 hover:text-neutral-900 transition-colors">
              Contact
            </Link>
            <Link 
              href="/login"
              className="bg-neutral-900 text-white px-4 py-2 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              Se connecter
            </Link>
          </nav>

          <MobileNavigation />
        </div>
      </div>
    </header>
  )
}
