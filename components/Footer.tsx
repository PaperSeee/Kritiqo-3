import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-neutral-100 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <span className="text-xl font-bold text-neutral-900">Kritiqo</span>
            </div>
            <p className="text-neutral-600 text-sm">
              La plateforme tout-en-un pour centraliser et gérer vos avis clients.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-neutral-900 mb-4">Produit</h3>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li><a href="/#features" className="hover:text-neutral-900 transition-colors">Fonctionnalités</a></li>
              <li><Link href="/faq" className="hover:text-neutral-900 transition-colors">FAQ</Link></li>
              <li><Link href="/dashboard" className="hover:text-neutral-900 transition-colors">Connexion</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-neutral-900 mb-4">Entreprise</h3>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li><Link href="/contact" className="hover:text-neutral-900 transition-colors">Contact</Link></li>
              <li><Link href="/careers" className="hover:text-neutral-900 transition-colors">Carrières</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-neutral-900 mb-4">Légal</h3>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li><Link href="/privacy" className="hover:text-neutral-900 transition-colors">Confidentialité</Link></li>
              <li><a href="/terms" className="hover:text-neutral-900 transition-colors">CGU</a></li>
              <li><Link href="/mentions" className="hover:text-neutral-900 transition-colors">Mentions légales</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-neutral-600">
            © 2025 Kritiqo. Tous droits réservés.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="mailto:contact@kritiqo.com" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
              contact@kritiqo.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
