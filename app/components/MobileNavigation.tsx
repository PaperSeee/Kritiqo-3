'use client';

import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function MobileNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* bouton mobile */}
      <button
        className="md:hidden p-2 text-neutral-600 hover:text-neutral-900"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {/* menu mobile */}
      {mobileMenuOpen && (
        <nav className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-neutral-200">
          <div className="flex flex-col px-6 py-4 space-y-4">
            <a
              href="#features"
              className="text-neutral-600 hover:text-neutral-900 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Fonctionnalités
            </a>
            <a
              href="#demo"
              className="text-neutral-600 hover:text-neutral-900 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Démonstration
            </a>
            <a
              href="/faq"
              className="text-neutral-600 hover:text-neutral-900 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </a>
            <a
              href="/contact"
              className="text-neutral-600 hover:text-neutral-900 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </a>
            <a
              href="/login"
              className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Se connecter
            </a>
          </div>
        </nav>
      )}
    </>
  );
}
