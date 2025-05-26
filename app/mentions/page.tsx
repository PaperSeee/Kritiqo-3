export default function MentionsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            Mentions Légales
          </h1>
          <p className="text-lg text-neutral-600">
            Dernière mise à jour : 15 janvier 2024
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              1. Informations légales
            </h2>
            <div className="bg-neutral-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-neutral-800 mb-4">
                Éditeur du site
              </h3>
              <div className="space-y-2 text-neutral-700">
                <p><strong>Raison sociale :</strong> Kritiqo SAS</p>
                <p><strong>Siège social :</strong> [Adresse à compléter]</p>
                <p><strong>Capital social :</strong> [Montant à compléter] €</p>
                <p><strong>RCS :</strong> [Numéro RCS à compléter]</p>
                <p><strong>SIRET :</strong> [Numéro SIRET à compléter]</p>
                <p><strong>Numéro TVA :</strong> [Numéro TVA à compléter]</p>
                <p><strong>Téléphone :</strong> [Numéro à compléter]</p>
                <p><strong>Email :</strong> contact@kritiqo.com</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              2. Directeur de la publication
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              Le directeur de la publication est [Nom du directeur de publication], représentant légal de Kritiqo SAS.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              3. Hébergement
            </h2>
            <div className="bg-neutral-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-neutral-800 mb-4">
                Hébergeur du site
              </h3>
              <div className="space-y-2 text-neutral-700">
                <p><strong>Société :</strong> Vercel Inc.</p>
                <p><strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</p>
                <p><strong>Site web :</strong> <a href="https://vercel.com" className="text-green-600 hover:text-green-700">vercel.com</a></p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              4. Propriété intellectuelle
            </h2>
            <p className="text-neutral-700 leading-relaxed mb-4">
              L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
            </p>
            <p className="text-neutral-700 leading-relaxed mb-4">
              La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement interdite sauf autorisation expresse du directeur de la publication.
            </p>
            <p className="text-neutral-700 leading-relaxed">
              Les marques et logos figurant sur le site sont déposés par Kritiqo SAS ou éventuellement par ses partenaires. Toute reproduction totale ou partielle de ces marques ou logos, effectuée à partir des éléments du site sans l'autorisation expresse de Kritiqo SAS est donc prohibée.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              5. Données personnelles
            </h2>
            <p className="text-neutral-700 leading-relaxed mb-4">
              Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi « Informatique et Libertés », vous disposez d'un droit d'accès, de rectification, de portabilité et d'effacement de vos données ou encore de limitation du traitement.
            </p>
            <p className="text-neutral-700 leading-relaxed">
              Pour exercer ces droits ou pour toute question sur le traitement de vos données dans ce dispositif, vous pouvez nous contacter à l'adresse : contact@kritiqo.com
            </p>
            <div className="mt-4">
              <a
                href="/privacy"
                className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
              >
                Consulter notre politique de confidentialité →
              </a>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              6. Cookies
            </h2>
            <p className="text-neutral-700 leading-relaxed mb-4">
              Ce site utilise des cookies nécessaires à son fonctionnement et à la fourniture du service. Ces cookies techniques ne nécessitent pas de consentement préalable.
            </p>
            <p className="text-neutral-700 leading-relaxed">
              Aucun cookie de tracking ou publicitaire n'est utilisé sur ce site.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              7. Limitation de responsabilité
            </h2>
            <p className="text-neutral-700 leading-relaxed mb-4">
              Kritiqo SAS ne pourra être tenue responsable des dommages directs et indirects causés au matériel de l'utilisateur, lors de l'accès au site, et résultant soit de l'utilisation d'un matériel ne répondant pas aux spécifications techniques requises, soit de l'apparition d'un bug ou d'une incompatibilité.
            </p>
            <p className="text-neutral-700 leading-relaxed">
              Des liens hypertextes peuvent renvoyer vers d'autres sites. Kritiqo SAS dégage toute responsabilité à propos de ces liens externes ou des liens créés par d'autres sites vers celui-ci.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              8. Droit applicable et juridiction
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              Tout litige en relation avec l'utilisation du site kritiqo.com est soumis au droit français. En dehors des cas où la loi ne le permet pas, il est fait attribution exclusive de juridiction aux tribunaux compétents de [Ville du siège social].
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              9. Contact
            </h2>
            <p className="text-neutral-700 leading-relaxed mb-4">
              Pour toute question concernant ces mentions légales, vous pouvez nous contacter :
            </p>
            <div className="bg-neutral-50 p-4 rounded-lg">
              <div className="space-y-2">
                <p className="font-medium text-neutral-900">Email :</p>
                <p className="text-neutral-700">contact@kritiqo.com</p>
                <p className="font-medium text-neutral-900 mt-4">Adresse postale :</p>
                <p className="text-neutral-700">[Adresse complète à compléter]</p>
              </div>
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
