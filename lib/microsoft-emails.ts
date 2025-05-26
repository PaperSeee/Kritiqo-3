import { decodeJwt } from 'jose'

/**
 * 📬 Fonction pour récupérer les emails de l'utilisateur connecté via Microsoft (Azure AD)
 * ⚠️ Utilise le bon accessToken obtenu via next-auth
 * ✅ Vérifie que le token contient bien le scope "Mail.Read"
 * ✅ Utilise fetch avec le header Authorization: Bearer <access_token>
 * ✅ Appelle le bon endpoint: https://graph.microsoft.com/v1.0/me/messages
 * ✅ Gère les erreurs 401 et affiche un message d'erreur clair
 */
export async function getMicrosoftEmails(accessToken: string) {
  if (!accessToken) {
    console.error("❌ Aucun token Microsoft fourni");
    return [];
  }

  // Vérification du scope Mail.Read
  try {
    const decoded = decodeJwt(accessToken);
    const scopes = (decoded.scp as string) || '';
    
    console.log("🔍 Token Microsoft Info:", {
      scopes: scopes || 'N/A',
      expires: new Date((decoded.exp || 0) * 1000).toISOString(),
      hasMailRead: scopes.includes('Mail.Read')
    });
    
    if (!scopes.includes('Mail.Read')) {
      console.error("❌ Scope Mail.Read manquant dans le token Microsoft");
      return [];
    }
  } catch (decodeError) {
    console.warn("⚠️ Impossible de décoder le token Microsoft");
  }

  try {
    const endpoint = "https://graph.microsoft.com/v1.0/me/messages?$top=100&$select=id,subject,sender,receivedDateTime,bodyPreview,body&$orderby=receivedDateTime desc";
    
    const res = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      if (res.status === 401) {
        console.error("❌ Unauthorized: le token Microsoft est invalide ou expiré");
      } else if (res.status === 403) {
        const errorText = await res.text();
        console.error("❌ Forbidden: permissions insuffisantes ou scope Mail.Read manquant", errorText);
      } else {
        console.error(`❌ Erreur API Graph: ${res.status} ${res.statusText}`);
      }
      return [];
    }

    const data = await res.json();
    const messages = data.value ?? [];
    
    console.log(`✅ ${messages.length} emails Microsoft récupérés avec succès`);
    
    // Formater les emails pour correspondre au format attendu
    return messages.map((message: any) => ({
      id: `microsoft_${message.id}`,
      subject: message.subject || 'Sans sujet',
      sender: message.sender?.emailAddress?.address || 'Expéditeur inconnu',
      preview: message.bodyPreview || 'Aucun aperçu disponible',
      body: message.body?.content || message.bodyPreview || 'Aucun contenu disponible',
      date: new Date(message.receivedDateTime).toISOString(),
      source: 'microsoft'
    }));
    
  } catch (err) {
    console.error("❌ Erreur lors de la récupération des emails Microsoft:", err);
    return [];
  }
}

export interface MicrosoftEmail {
  id: string;
  subject: string;
  sender: string;
  preview: string;
  body: string;
  date: string;
  source: 'microsoft';
}
