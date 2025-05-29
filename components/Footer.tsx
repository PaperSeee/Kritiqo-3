import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-neutral-100 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <div className="col-span-1 sm:col-span-2 md:col-span-1 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <span className="text-xl font-bold text-neutral-900">Kritiqo</span>
            </div>
            <p className="text-neutral-600 text-sm mb-4">
              La plateforme tout-en-un pour centraliser et gérer vos avis clients.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-500 hover:text-neutral-700 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-neutral-500 hover:text-neutral-700 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-neutral-900 mb-4">Produit</h3>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li><Link href="/features" className="hover:text-neutral-900 transition-colors">Fonctionnalités</Link></li>
              <li><Link href="/pricing" className="hover:text-neutral-900 transition-colors">Tarifs</Link></li>
              <li><Link href="/dashboard" className="hover:text-neutral-900 transition-colors">Dashboard</Link></li>
              <li><Link href="#" className="hover:text-neutral-900 transition-colors">API</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-neutral-900 mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li><Link href="/contact" className="hover:text-neutral-900 transition-colors">Contact</Link></li>
              <li><Link href="/faq" className="hover:text-neutral-900 transition-colors">FAQ</Link></li>
              <li><Link href="#" className="hover:text-neutral-900 transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-neutral-900 transition-colors">Centre d'aide</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-neutral-900 mb-4">Entreprise</h3>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li><Link href="#" className="hover:text-neutral-900 transition-colors">À propos</Link></li>
              <li><Link href="#" className="hover:text-neutral-900 transition-colors">Blog</Link></li>
              <li><Link href="/careers" className="hover:text-neutral-900 transition-colors">Carrières</Link></li>
              <li><Link href="#" className="hover:text-neutral-900 transition-colors">Presse</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-neutral-900 mb-4">Légal</h3>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li><Link href="/privacy" className="hover:text-neutral-900 transition-colors">Confidentialité</Link></li>
              <li><Link href="/terms" className="hover:text-neutral-900 transition-colors">CGU</Link></li>
              <li><Link href="#" className="hover:text-neutral-900 transition-colors">Cookies</Link></li>
              <li><Link href="#" className="hover:text-neutral-900 transition-colors">RGPD</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-300 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-neutral-500 mb-4 sm:mb-0">
            © 2025 Kritiqo. Tous droits réservés.
          </p>
          <div className="flex items-center space-x-6 text-sm text-neutral-500">
            <span>🇧🇪 Made in Belgium</span>
            <span>Avec ❤️ pour les professionnels</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
