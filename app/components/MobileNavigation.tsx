'use client';

import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function MobileNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* bouton mobile */}
      <button
        className="md:hidden p-2 text-neutral-600 hover:text-neutral-900"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Menu navigation mobile"
      >
        {mobileMenuOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {/* menu mobile */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu */}
          <nav className="md:hidden fixed top-[73px] right-0 z-50 w-64 h-screen bg-white border-l border-neutral-200 shadow-lg">
            <div className="flex flex-col px-6 py-6 space-y-6">
              <a
                href="#features"
                className="text-neutral-600 hover:text-neutral-900 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Fonctionnalités
              </a>
              <a
                href="#benefits"
                className="text-neutral-600 hover:text-neutral-900 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Avantages
              </a>
              <a
                href="#faq"
                className="text-neutral-600 hover:text-neutral-900 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </a>
              <Link
                href="/contact"
                className="text-neutral-600 hover:text-neutral-900 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="pt-4 border-t border-neutral-200">
                <Link
                  href="/login"
                  className="block w-full px-4 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors text-center font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Se connecter
                </Link>
              </div>
            </div>
          </nav>
        </>
      )}
    </>
  );
}
