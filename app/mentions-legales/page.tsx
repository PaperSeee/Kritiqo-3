export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-bold text-neutral-900 mb-8">
          Mentions Légales
        </h1>
        
        <div className="prose prose-neutral max-w-none">
          <h2>Éditeur du site</h2>
          <p>
            Le site Kritiqo est édité par [Nom de votre société]<br/>
            Siège social : [Adresse]<br/>
            SIRET : [Numéro SIRET]<br/>
            Email : contact@kritiqo.com
          </p>

          <h2>Hébergement</h2>
          <p>
            Ce site est hébergé par Vercel Inc.<br/>
            340 S Lemon Ave #4133<br/>
            Walnut, CA 91789<br/>
            États-Unis
          </p>

          <h2>Protection des données</h2>
          <p>
            Conformément au Règlement Général sur la Protection des Données (RGPD), 
            vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles.
          </p>
          
          <p>
            Pour exercer ces droits, contactez-nous à : contact@kritiqo.com
          </p>
        </div>
      </div>
    </div>
  );
}
