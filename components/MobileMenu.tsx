'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50 md:hidden" onClose={onClose}>
        {/* Background overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-white/95 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 translate-y-4"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-4"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden transition-all">
                {/* Close button */}
                <div className="absolute top-8 right-8">
                  <button
                    onClick={onClose}
                    className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors"
                    aria-label="Fermer le menu"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Logo */}
                <div className="flex justify-center mb-12">
                  <Link href="/" onClick={onClose} className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-neutral-900 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">K</span>
                    </div>
                    <span className="text-2xl font-bold text-neutral-900">Kritiqo</span>
                  </Link>
                </div>

                {/* Navigation links */}
                <nav className="flex flex-col items-center space-y-8 text-xl">
                  <Link
                    href="/features"
                    onClick={onClose}
                    className="text-neutral-700 hover:text-neutral-900 transition-colors font-medium py-2"
                  >
                    Fonctionnalités
                  </Link>
                  <Link
                    href="/pricing"
                    onClick={onClose}
                    className="text-neutral-700 hover:text-neutral-900 transition-colors font-medium py-2"
                  >
                    Tarifs
                  </Link>
                  <Link
                    href="/faq"
                    onClick={onClose}
                    className="text-neutral-700 hover:text-neutral-900 transition-colors font-medium py-2"
                  >
                    FAQ
                  </Link>
                  <Link
                    href="/contact"
                    onClick={onClose}
                    className="text-neutral-700 hover:text-neutral-900 transition-colors font-medium py-2"
                  >
                    Contact
                  </Link>

                  {/* Separator */}
                  <div className="w-16 h-px bg-neutral-200 my-4" />

                  {/* Auth links */}
                  <Link
                    href="/login"
                    onClick={onClose}
                    className="text-neutral-600 hover:text-neutral-900 transition-colors font-medium py-2"
                  >
                    Se connecter
                  </Link>
                  <Link
                    href="/signup"
                    onClick={onClose}
                    className="inline-flex items-center justify-center px-8 py-4 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Essai gratuit
                  </Link>
                </nav>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
