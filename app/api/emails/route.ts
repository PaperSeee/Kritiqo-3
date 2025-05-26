import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { getValidAccessToken } from '@/lib/token-manager'
import { decodeJwt } from 'jose'
import { getMicrosoftEmails } from '@/lib/microsoft-emails'

// Cache pour éviter les logs redondants
const errorLogCache = new Map<string, number>();
const ERROR_LOG_COOLDOWN = 60000; // 1 minute

function shouldLogError(errorKey: string): boolean {
  const now = Date.now();
  const lastLogged = errorLogCache.get(errorKey);
  
  if (!lastLogged || now - lastLogged > ERROR_LOG_COOLDOWN) {
    errorLogCache.set(errorKey, now);
    return true;
  }
  
  return false;
}

async function fetchGmailEmails(userId: string, accountEmail: string) {
  const errorKey = `gmail_${accountEmail}`;
  
  try {
    // Utiliser getValidAccessToken au lieu du token de session
    const validAccessToken = await getValidAccessToken(userId, 'google');
    
    if (!validAccessToken) {
      if (shouldLogError(errorKey)) {
        console.error(`❌ Token Gmail invalide ou expiré pour ${accountEmail}`);
      }
      throw new Error('Token Gmail invalide ou expiré');
    }

    const messagesResponse = await fetch(
      'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=100&labelIds=INBOX',
      {
        headers: {
          Authorization: `Bearer ${validAccessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!messagesResponse.ok) {
      const errorText = await messagesResponse.text();
      if (shouldLogError(errorKey)) {
        console.error(`❌ Gmail API Error pour ${accountEmail}:`, {
          status: messagesResponse.status,
          statusText: messagesResponse.statusText,
          error: errorText
        });
      }
      throw new Error(`Gmail API Error: ${messagesResponse.status}`);
    }

    const messagesData = await messagesResponse.json();
    const messageIds = messagesData.messages || [];

    if (messageIds.length === 0) {
      console.log(`📭 Aucun message trouvé pour ${accountEmail}`);
      return [];
    }

    // Limiter à 50 emails pour éviter trop d'appels API
    const emailPromises = messageIds.slice(0, 50).map(async (message: { id: string }) => {
      try {
        const messageResponse = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}?format=full`,
          {
            headers: {
              Authorization: `Bearer ${validAccessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!messageResponse.ok) return null;

        const messageData = await messageResponse.json();
        const headers = messageData.payload?.headers || [];
        
        const subject = headers.find((h: any) => h.name === 'Subject')?.value || 'Sans sujet';
        const from = headers.find((h: any) => h.name === 'From')?.value || 'Expéditeur inconnu';
        const dateHeader = headers.find((h: any) => h.name === 'Date')?.value;
        
        let date = new Date().toISOString();
        if (dateHeader) {
          try {
            date = new Date(dateHeader).toISOString();
          } catch {
            date = new Date(parseInt(messageData.internalDate)).toISOString();
          }
        }

        const senderEmail = from.match(/<([^>]+)>/) ? from.match(/<([^>]+)>/)![1] : from;
        
        // Get full email body for better AI analysis
        let bodyText = messageData.snippet || 'Aucun contenu disponible';
        if (messageData.payload?.body?.data) {
          try {
            bodyText = Buffer.from(messageData.payload.body.data, 'base64').toString('utf-8');
          } catch {
            // If body is in parts
            if (messageData.payload?.parts) {
              const textPart = messageData.payload.parts.find((part: any) => 
                part.mimeType === 'text/plain' || part.mimeType === 'text/html'
              );
              if (textPart?.body?.data) {
                try {
                  bodyText = Buffer.from(textPart.body.data, 'base64').toString('utf-8');
                } catch {
                  bodyText = messageData.snippet || 'Aucun contenu disponible';
                }
              }
            }
          }
        }

        return {
          id: `gmail_${message.id}`,
          subject,
          sender: senderEmail,
          preview: messageData.snippet || 'Aucun aperçu disponible',
          body: bodyText,
          date,
          source: 'gmail'
        };
      } catch (err) {
        // Log uniquement la première erreur pour ce message
        const messageErrorKey = `gmail_message_${message.id}`;
        if (shouldLogError(messageErrorKey)) {
          console.error(`❌ Erreur message ${message.id}:`, err instanceof Error ? err.message : 'Erreur inconnue');
        }
        return null;
      }
    });

    const emails = (await Promise.all(emailPromises)).filter(Boolean);
    console.log(`✅ ${emails.length} emails Gmail récupérés pour ${accountEmail}`);
    return emails;

  } catch (err) {
    if (shouldLogError(errorKey)) {
      console.error(`❌ Erreur Gmail pour ${accountEmail}:`, err instanceof Error ? err.message : 'Erreur inconnue');
    }
    throw err;
  }
}

async function fetchMicrosoftEmails(userId: string, accountEmail: string) {
  const errorKey = `microsoft_${accountEmail}`;
  
  try {
    // Utiliser getValidAccessToken pour Azure AD
    const validAccessToken = await getValidAccessToken(userId, 'azure-ad');
    
    if (!validAccessToken) {
      if (shouldLogError(errorKey)) {
        console.error(`❌ Token Microsoft invalide ou expiré pour ${accountEmail}`);
      }
      throw new Error('Token Microsoft invalide ou expiré');
    }

    // Utiliser la nouvelle fonction getMicrosoftEmails
    const emails = await getMicrosoftEmails(validAccessToken);
    
    // Ajouter l'email du compte à chaque email
    emails.forEach((email: any) => {
      email.accountEmail = accountEmail;
      email.accountProvider = 'azure-ad';
    });

    console.log(`✅ ${emails.length} emails Outlook récupérés pour ${accountEmail}`);
    return emails;

  } catch (err) {
    if (shouldLogError(errorKey)) {
      console.error(`❌ Erreur Microsoft pour ${accountEmail}:`, err instanceof Error ? err.message : 'Erreur inconnue');
    }
    throw err;
  }
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const selectedEmail = searchParams.get('email');
    const isRefresh = searchParams.get('refresh') === 'true';

    console.log(`🔍 Récupération emails pour user ${session.userId}${selectedEmail ? ` (email: ${selectedEmail})` : ''}${isRefresh ? ' (refresh forcé)' : ''}`);

    // Récupérer les comptes connectés
    let query = supabaseAdmin
      .from('connected_emails')
      .select('*')
      .eq('user_id', session.userId);

    if (selectedEmail) {
      query = query.eq('email', selectedEmail);
    }

    const { data: connectedEmails, error } = await query;

    if (error) throw error;

    if (!connectedEmails || connectedEmails.length === 0) {
      console.log('📭 Aucun compte email connecté');
      return NextResponse.json({ emails: [], connectedEmails: [] });
    }

    // Récupérer les emails pour chaque compte connecté
    const allEmails = [];
    const errors = [];
    
    for (const account of connectedEmails) {
      try {
        let emails = [];
        if (account.provider === 'google') {
          emails = await fetchGmailEmails(session.userId, account.email);
        } else if (account.provider === 'azure-ad') {
          emails = await fetchMicrosoftEmails(session.userId, account.email);
        }

        // Ajouter l'info du compte à chaque email
        emails.forEach((email: any) => {
          email.accountEmail = account.email;
          email.accountProvider = account.provider;
        });

        allEmails.push(...emails);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
        errors.push(`${account.email}: ${errorMessage}`);
      }
    }

    const duration = Date.now() - startTime;
    console.log(`✅ Récupération terminée en ${duration}ms - ${allEmails.length} emails au total`);

    if (errors.length > 0) {
      console.warn(`⚠️ Erreurs rencontrées: ${errors.join(', ')}`);
    }

    return NextResponse.json({ 
      emails: allEmails,
      connectedEmails,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (err) {
    const duration = Date.now() - startTime;
    const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
    
    console.error(`❌ Erreur générale après ${duration}ms:`, errorMessage);
    
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
