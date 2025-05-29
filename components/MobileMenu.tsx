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
          <div className="flex min-h-full items-start justify-center p-4 pt-16">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 translate-y-4"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-4"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all border border-neutral-200">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">K</span>
                    </div>
                    <span className="text-xl font-bold text-neutral-900">Kritiqo</span>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Navigation */}
                <nav className="space-y-4 mb-8">
                  <Link
                    href="/features"
                    onClick={onClose}
                    className="block px-4 py-3 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition-colors"
                  >
                    Fonctionnalités
                  </Link>
                  <Link
                    href="/pricing"
                    onClick={onClose}
                    className="block px-4 py-3 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition-colors"
                  >
                    Tarifs
                  </Link>
                  <Link
                    href="/faq"
                    onClick={onClose}
                    className="block px-4 py-3 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition-colors"
                  >
                    FAQ
                  </Link>
                  <Link
                    href="/contact"
                    onClick={onClose}
                    className="block px-4 py-3 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition-colors"
                  >
                    Contact
                  </Link>
                </nav>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <Link
                    href="/login"
                    onClick={onClose}
                    className="block w-full px-4 py-3 text-center border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
                  >
                    Se connecter
                  </Link>
                  <Link
                    href="/signup"
                    onClick={onClose}
                    className="block w-full px-4 py-3 text-center bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors font-medium"
                  >
                    Essai gratuit 14 jours
                  </Link>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
