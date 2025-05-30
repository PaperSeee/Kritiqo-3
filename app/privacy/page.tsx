export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            Politique de Confidentialité
          </h1>
          <p className="text-lg text-neutral-600">
            Dernière mise à jour : 29 mai 2025
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              1. Introduction
            </h2>
            <p className="text-neutral-700 leading-relaxed mb-4">
              Kritiqo s'engage à protéger la confidentialité de vos données personnelles. Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations lorsque vous utilisez notre service de gestion d'avis clients.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              2. Données que nous collectons
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-neutral-800 mb-2">
                  Informations de compte
                </h3>
                <p className="text-neutral-700 leading-relaxed">
                  Nous collectons votre adresse email, nom et informations de contact nécessaires pour créer et gérer votre compte Kritiqo.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-neutral-800 mb-2">
                  Données d'entreprise
                </h3>
                <p className="text-neutral-700 leading-relaxed">
                  Nous collectons les informations de vos établissements (nom, adresse, liens vers les plateformes) que vous ajoutez à votre compte.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-neutral-800 mb-2">
                  Intégration Gmail & Outlook avec IA
                </h3>
                <p className="text-neutral-700 leading-relaxed">
                  Avec votre autorisation explicite, nous accédons à vos emails Gmail et Outlook pour les analyser automatiquement via notre IA (GPT-4). 
                  L'IA lit uniquement le sujet et le contenu nécessaire pour le tri et génère des suggestions de réponses. 
                  Vos emails ne sont jamais stockés et l'analyse se fait en temps réel de manière sécurisée.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              3. Utilisation des données Google Workspace
            </h2>
            <p className="text-neutral-700 leading-relaxed mb-4">
              <strong>Kritiqo n'utilise pas les données obtenues via les API Google Workspace (telles que Gmail) pour développer, améliorer ou entraîner des modèles d'intelligence artificielle ou de machine learning généralisés.</strong>
            </p>
            <p className="text-neutral-700 leading-relaxed">
              Les données sont uniquement utilisées pour fournir les fonctionnalités du service à l'utilisateur connecté : analyse et tri automatique des emails, génération de suggestions de réponses personnalisées, et organisation par catégories.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              4. Comment nous utilisons vos données
            </h2>
            <ul className="space-y-2 text-neutral-700">
              <li>• Fournir et améliorer nos services de gestion d'avis</li>
              <li>• Analyser intelligemment vos emails via IA pour catégorisation et suggestions</li>
              <li>• Générer automatiquement des réponses personnalisées pour vos emails</li>
              <li>• Organiser automatiquement vos emails par categories</li>
              <li>• Générer des QR codes et pages d'avis personnalisées</li>
              <li>• Vous envoyer des notifications importantes sur votre compte</li>
              <li>• Assurer la sécurité et prévenir la fraude</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              5. Partage des données
            </h2>
            <p className="text-neutral-700 leading-relaxed mb-4">
              <strong>Nous ne vendons, ne louons ni ne partageons vos données personnelles avec des tiers.</strong> Vos données ne sont utilisées que pour fournir le service Kritiqo.
            </p>
            <p className="text-neutral-700 leading-relaxed">
              Les seules exceptions sont les cas où la loi nous l'exige ou pour protéger nos droits légitimes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              6. Sécurité des données
            </h2>
            <p className="text-neutral-700 leading-relaxed mb-4">
              Nous mettons en place des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos données contre l'accès non autorisé, la perte ou la destruction.
            </p>
            <ul className="space-y-2 text-neutral-700">
              <li>• Chiffrement des données en transit et au repos</li>
              <li>• Accès limité aux données selon le principe du moindre privilège</li>
              <li>• Surveillance continue de nos systèmes</li>
              <li>• Sauvegardes régulières et sécurisées</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              7. Vos droits
            </h2>
            <p className="text-neutral-700 leading-relaxed mb-4">
              Conformément au RGPD, vous disposez des droits suivants :
            </p>
            <ul className="space-y-2 text-neutral-700">
              <li>• Droit d'accès à vos données personnelles</li>
              <li>• Droit de rectification des données inexactes</li>
              <li>• Droit à l'effacement de vos données</li>
              <li>• Droit à la portabilité de vos données</li>
              <li>• Droit d'opposition au traitement</li>
              <li>• Droit de retirer votre consentement à tout moment</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              8. Conservation des données
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              Nous conservons vos données personnelles uniquement pendant la durée nécessaire aux finalités pour lesquelles elles ont été collectées, ou selon les exigences légales applicables.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              9. Cookies
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              Nous utilisons des cookies essentiels pour le fonctionnement de notre service (authentification, préférences). Aucun cookie de tracking ou publicitaire n'est utilisé.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              10. Contact
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits, contactez-nous à :
            </p>
            <div className="bg-neutral-50 p-4 rounded-lg mt-4">
              <p className="font-medium text-neutral-900">Email :</p>
              <p className="text-neutral-700">contact@kritiqo.com</p>
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
