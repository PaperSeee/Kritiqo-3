/**
 * 📬 Fonction qui récupère les mails via Microsoft Graph API
 * Nécessite : access_token Microsoft Graph avec scope Mail.Read
 */
export async function fetchOutlookEmails(accessToken: string, maxEmails: number = 10) {
  const endpoint = `https://graph.microsoft.com/v1.0/me/messages?$top=${maxEmails}&$select=id,subject,sender,receivedDateTime,bodyPreview,body&$orderby=receivedDateTime desc`;

  try {
    const res = await fetch(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (res.status === 401) {
      throw new Error("❌ Unauthorized: le token est invalide ou expiré");
    }
    if (res.status === 403) {
      throw new Error("❌ Forbidden: le compte ne possède pas de boîte Outlook ou les permissions sont insuffisantes");
    }
    if (!res.ok) {
      throw new Error(`❌ Erreur HTTP ${res.status} - ${res.statusText}`);
    }

    const data = await res.json();
    console.log(`✅ ${data.value?.length || 0} emails Outlook récupérés`);
    
    // Formater les emails dans le format attendu
    const formattedEmails = (data.value || []).map((message: any) => ({
      id: `outlook_${message.id}`,
      subject: message.subject || 'Sans sujet',
      sender: message.sender?.emailAddress?.address || 'Expéditeur inconnu',
      preview: message.bodyPreview || 'Aucun aperçu disponible',
      body: message.body?.content || message.bodyPreview || 'Aucun contenu disponible',
      date: new Date(message.receivedDateTime).toISOString(),
      source: 'outlook'
    }));
    
    return formattedEmails;

  } catch (err) {
    console.error("Erreur lors de la récupération des mails Outlook:", err);
    return [];
  }
}

/**
 * Vérifier les permissions et la validité d'un token Microsoft
 */
export async function checkMicrosoftTokenPermissions(accessToken: string): Promise<{
  valid: boolean;
  hasMailPermissions: boolean;
  error?: string;
}> {
  try {
    // Test simple avec un endpoint qui nécessite Mail.Read
    const testRes = await fetch('https://graph.microsoft.com/v1.0/me/mailFolders/inbox', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (testRes.status === 401) {
      return {
        valid: false,
        hasMailPermissions: false,
        error: 'Token invalide ou expiré'
      };
    }
    
    if (testRes.status === 403) {
      return {
        valid: true,
        hasMailPermissions: false,
        error: 'Permissions Mail.Read insuffisantes'
      };
    }
    
    if (testRes.ok) {
      return {
        valid: true,
        hasMailPermissions: true
      };
    }
    
    return {
      valid: false,
      hasMailPermissions: false,
      error: `Erreur HTTP ${testRes.status}`
    };
    
  } catch (err) {
    return {
      valid: false,
      hasMailPermissions: false,
      error: err instanceof Error ? err.message : 'Erreur inconnue'
    };
  }
}
