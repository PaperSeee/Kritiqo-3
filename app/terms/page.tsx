export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            Conditions d'Utilisation
          </h1>
          <p className="text-lg text-neutral-600">
            Dernière mise à jour : 15 janvier 2024
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              1. Acceptation des conditions
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              En utilisant Kritiqo, vous acceptez d'être lié par ces conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              2. Description du service
            </h2>
            <p className="text-neutral-700 leading-relaxed mb-4">
              Kritiqo est une plateforme SaaS qui permet aux entreprises de :
            </p>
            <ul className="space-y-2 text-neutral-700">
              <li>• Centraliser et gérer leurs avis clients</li>
              <li>• Organiser automatiquement leurs emails</li>
              <li>• Générer des QR codes pour collecter des avis</li>
              <li>• Créer des pages d'avis personnalisées</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              3. Compte utilisateur
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-neutral-800 mb-2">
                  Création de compte
                </h3>
                <p className="text-neutral-700 leading-relaxed">
                  Vous devez fournir des informations exactes et à jour lors de la création de votre compte. Vous êtes responsable de la confidentialité de vos identifiants de connexion.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-neutral-800 mb-2">
                  Usage responsable
                </h3>
                <p className="text-neutral-700 leading-relaxed">
                  Vous vous engagez à utiliser Kritiqo de manière légale et conforme à ces conditions. Toute utilisation abusive peut entraîner la suspension de votre compte.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              4. Disponibilité du service
            </h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-yellow-800 font-medium mb-2">
                ⚠️ Limitation importante
              </p>
              <p className="text-yellow-700">
                Bien que nous nous efforcions de maintenir une disponibilité maximale, nous ne garantissons pas que le service sera disponible 24h/24 et 7j/7 sans interruption.
              </p>
            </div>
            <p className="text-neutral-700 leading-relaxed mb-4">
              Nous pouvons interrompre temporairement le service pour :
            </p>
            <ul className="space-y-2 text-neutral-700">
              <li>• Maintenance programmée ou d'urgence</li>
              <li>• Mises à jour de sécurité</li>
              <li>• Problèmes techniques imprévus</li>
              <li>• Circonstances exceptionnelles indépendantes de notre volonté</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              5. Données et contenu
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-neutral-800 mb-2">
                  Vos données
                </h3>
                <p className="text-neutral-700 leading-relaxed">
                  Vous conservez la propriété de toutes les données que vous ajoutez à Kritiqo. Nous nous engageons à protéger vos données conformément à notre politique de confidentialité.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-neutral-800 mb-2">
                  Sauvegarde
                </h3>
                <p className="text-neutral-700 leading-relaxed">
                  Bien que nous effectuions des sauvegardes régulières, nous vous recommandons de conserver vos propres sauvegardes des données importantes.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              6. Tarification et paiement
            </h2>
            <p className="text-neutral-700 leading-relaxed mb-4">
              L'utilisation de Kritiqo peut être soumise à des frais d'abonnement selon le plan choisi. Les tarifs en vigueur sont disponibles sur notre site web.
            </p>
            <ul className="space-y-2 text-neutral-700">
              <li>• Les paiements sont traités de manière sécurisée</li>
              <li>• L'abonnement se renouvelle automatiquement</li>
              <li>• Vous pouvez annuler votre abonnement à tout moment</li>
              <li>• Aucun remboursement pour les périodes déjà facturées</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              7. Limitation de responsabilité
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800 font-medium mb-2">
                Clause importante
              </p>
              <p className="text-red-700">
                Kritiqo est fourni "en l'état" sans garantie d'aucune sorte. Nous ne garantissons pas que le service répondra à vos besoins spécifiques ou qu'il sera exempt d'erreurs.
              </p>
            </div>
            <p className="text-neutral-700 leading-relaxed">
              Notre responsabilité est limitée au montant des frais payés par vous au cours des 12 derniers mois pour l'utilisation du service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              8. Résiliation
            </h2>
            <p className="text-neutral-700 leading-relaxed mb-4">
              Vous pouvez résilier votre compte à tout moment. Nous nous réservons le droit de suspendre ou résilier votre compte en cas de violation de ces conditions.
            </p>
            <p className="text-neutral-700 leading-relaxed">
              En cas de résiliation, vous conservez l'accès à vos données pendant 30 jours pour les exporter.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              9. Modifications des conditions
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications importantes vous seront notifiées par email au moins 30 jours avant leur entrée en vigueur.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              10. Droit applicable
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              Ces conditions sont régies par le droit français. Tout litige sera soumis à la compétence des tribunaux français.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              11. Contact
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              Pour toute question concernant ces conditions d'utilisation, contactez-nous à :
            </p>
            <div className="bg-neutral-50 p-4 rounded-lg mt-4">
              <p className="font-medium text-neutral-900">Email :</p>
              <p className="text-neutral-700">legal@kritiqo.fr</p>
            </div>
          </section>
        </div>

        <div className="text-center mt-12">
          <a
            href="/"
            className="inline-flex items-center text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            ← Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  )
}
