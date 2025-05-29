"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { 
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  VideoCameraIcon,
  BookOpenIcon
} from "@heroicons/react/24/outline";

interface SupportTicket {
  id: string;
  subject: string;
  status: 'open' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  lastUpdate: string;
}

const mockTickets: SupportTicket[] = [
  {
    id: "TICK-001",
    subject: "Problème de synchronisation des avis Google",
    status: "in-progress",
    priority: "high",
    createdAt: "2025-01-15",
    lastUpdate: "2025-01-16"
  },
  {
    id: "TICK-002", 
    subject: "Question sur l'export des données",
    status: "resolved",
    priority: "medium",
    createdAt: "2025-01-10",
    lastUpdate: "2025-01-12"
  }
];

export default function SupportPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'tickets' | 'knowledge' | 'contact'>('tickets');
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    priority: 'medium',
    category: '',
    description: ''
  });

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate ticket creation
    console.log('Creating ticket:', ticketForm);
    setShowNewTicket(false);
    setTicketForm({
      subject: '',
      priority: 'medium', 
      category: '',
      description: ''
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800'; 
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Centre de Support
        </h1>
        <p className="text-neutral-600">
          Bonjour {user?.email}, nous sommes là pour vous aider
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-neutral-200 mb-8">
        <button
          onClick={() => setActiveTab('tickets')}
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'tickets'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <ChatBubbleLeftRightIcon className="h-5 w-5 inline mr-2" />
          Mes Tickets
        </button>
        <button
          onClick={() => setActiveTab('knowledge')}
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'knowledge'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <BookOpenIcon className="h-5 w-5 inline mr-2" />
          Base de Connaissances
        </button>
        <button
          onClick={() => setActiveTab('contact')}
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'contact'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <QuestionMarkCircleIcon className="h-5 w-5 inline mr-2" />
          Contact Direct
        </button>
      </div>

      {/* Tickets Tab */}
      {activeTab === 'tickets' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">
              Vos Demandes de Support
            </h2>
            <button
              onClick={() => setShowNewTicket(!showNewTicket)}
              className="bg-neutral-900 text-white px-4 py-2 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              Nouveau Ticket
            </button>
          </div>

          {/* New Ticket Form */}
          {showNewTicket && (
            <div className="bg-white border border-neutral-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Créer un nouveau ticket</h3>
              <form onSubmit={handleTicketSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Sujet *
                    </label>
                    <input
                      type="text"
                      value={ticketForm.subject}
                      onChange={(e) => setTicketForm(prev => ({ ...prev, subject: e.target.value }))}
                      required
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                      placeholder="Décrivez brièvement votre problème"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Priorité
                    </label>
                    <select
                      value={ticketForm.priority}
                      onChange={(e) => setTicketForm(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                    >
                      <option value="low">Faible</option>
                      <option value="medium">Moyenne</option>
                      <option value="high">Élevée</option>
                      <option value="urgent">Urgente</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Catégorie
                  </label>
                  <select
                    value={ticketForm.category}
                    onChange={(e) => setTicketForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                  >
                    <option value="">Sélectionnez une catégorie</option>
                    <option value="technical">Problème technique</option>
                    <option value="account">Gestion de compte</option>
                    <option value="billing">Facturation</option>
                    <option value="feature">Demande de fonctionnalité</option>
                    <option value="other">Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={ticketForm.description}
                    onChange={(e) => setTicketForm(prev => ({ ...prev, description: e.target.value }))}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent resize-none"
                    placeholder="Décrivez votre problème en détail..."
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="bg-neutral-900 text-white px-4 py-2 rounded-lg hover:bg-neutral-800 transition-colors"
                  >
                    Créer le ticket
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewTicket(false)}
                    className="border border-neutral-300 text-neutral-700 px-4 py-2 rounded-lg hover:bg-neutral-50 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tickets List */}
          <div className="space-y-4">
            {mockTickets.map((ticket) => (
              <div key={ticket.id} className="bg-white border border-neutral-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-1">
                      {ticket.subject}
                    </h3>
                    <p className="text-sm text-neutral-600">
                      Ticket #{ticket.id} • Créé le {new Date(ticket.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}>
                      {ticket.status === 'open' && 'Ouvert'}
                      {ticket.status === 'in-progress' && 'En cours'}
                      {ticket.status === 'resolved' && 'Résolu'}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority === 'urgent' && 'Urgent'}
                      {ticket.priority === 'high' && 'Élevé'}
                      {ticket.priority === 'medium' && 'Moyen'}
                      {ticket.priority === 'low' && 'Faible'}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-neutral-600">
                    Dernière mise à jour: {new Date(ticket.lastUpdate).toLocaleDateString('fr-FR')}
                  </p>
                  <button className="text-neutral-900 hover:text-neutral-700 text-sm font-medium">
                    Voir les détails →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Knowledge Base Tab */}
      {activeTab === 'knowledge' && (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white border border-neutral-200 rounded-lg p-6">
            <DocumentTextIcon className="h-8 w-8 text-blue-600 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Guide de démarrage</h3>
            <p className="text-neutral-600 mb-4">
              Apprenez à configurer votre compte et vos premiers établissements.
            </p>
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Lire le guide →
            </button>
          </div>

          <div className="bg-white border border-neutral-200 rounded-lg p-6">
            <VideoCameraIcon className="h-8 w-8 text-purple-600 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Tutoriels vidéo</h3>
            <p className="text-neutral-600 mb-4">
              Découvrez toutes les fonctionnalités en vidéo.
            </p>
            <button className="text-purple-600 hover:text-purple-700 font-medium">
              Voir les vidéos →
            </button>
          </div>

          <div className="bg-white border border-neutral-200 rounded-lg p-6">
            <QuestionMarkCircleIcon className="h-8 w-8 text-green-600 mb-3" />
            <h3 className="text-lg font-semibold mb-2">FAQ</h3>
            <p className="text-neutral-600 mb-4">
              Réponses aux questions les plus fréquentes.
            </p>
            <button className="text-green-600 hover:text-green-700 font-medium">
              Consulter la FAQ →
            </button>
          </div>

          <div className="bg-white border border-neutral-200 rounded-lg p-6">
            <ExclamationTriangleIcon className="h-8 w-8 text-orange-600 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Dépannage</h3>
            <p className="text-neutral-600 mb-4">
              Solutions aux problèmes techniques courants.
            </p>
            <button className="text-orange-600 hover:text-orange-700 font-medium">
              Résoudre un problème →
            </button>
          </div>
        </div>
      )}

      {/* Direct Contact Tab */}
      {activeTab === 'contact' && (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white border border-neutral-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Support par Email</h3>
            <p className="text-neutral-600 mb-4">
              Notre équipe vous répond sous 24h en moyenne.
            </p>
            <div className="space-y-2">
              <p className="text-sm font-medium text-neutral-700">support@kritiqo.com</p>
              <p className="text-sm text-neutral-600">Réponse sous 24h</p>
            </div>
            <button className="mt-4 bg-neutral-900 text-white px-4 py-2 rounded-lg hover:bg-neutral-800 transition-colors">
              Envoyer un email
            </button>
          </div>

          <div className="bg-white border border-neutral-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Support Téléphonique</h3>
            <p className="text-neutral-600 mb-4">
              Assistance directe pour les problèmes urgents.
            </p>
            <div className="space-y-2">
              <p className="text-sm font-medium text-neutral-700">+33 1 23 45 67 89</p>
              <p className="text-sm text-neutral-600">Lun-Ven 9h-18h</p>
            </div>
            <button className="mt-4 border border-neutral-300 text-neutral-700 px-4 py-2 rounded-lg hover:bg-neutral-50 transition-colors">
              Programmer un appel
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 md:col-span-2">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">
              🚀 Support Premium
            </h3>
            <p className="text-blue-700 mb-4">
              Accédez à un support prioritaire avec réponse sous 2h et assistance dédiée.
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Découvrir le Premium
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
