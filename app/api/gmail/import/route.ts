import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getGmailAccessToken } from '@/lib/token-manager';
import { validateUserId } from '@/lib/utils/uuid-validator';

interface GmailMessage {
  id: string;
  threadId: string;
  snippet: string;
  payload: {
    headers: Array<{ name: string; value: string }>;
    body?: { data?: string };
    parts?: Array<{ mimeType: string; body?: { data?: string } }>;
  };
  internalDate: string;
}

interface ImportedEmail {
  id: string;
  user_id: string;
  subject: string;
  sender: string;
  body: string;
  received_at: string;
  source: string;
  thread_id?: string;
  folder?: string; // Add folder information
  created_at: string;
  updated_at: string;
}

function extractEmailBody(message: GmailMessage): string {
  try {
    // Try main body first
    if (message.payload?.body?.data) {
      const decoded = Buffer.from(message.payload.body.data, 'base64').toString('utf-8')
      return cleanEmailContent(decoded)
    }

    // Search in parts for text content
    if (message.payload?.parts) {
      // Prefer plain text over HTML
      const textPart = message.payload.parts.find(part => 
        part.mimeType === 'text/plain'
      )
      
      if (textPart?.body?.data) {
        const decoded = Buffer.from(textPart.body.data, 'base64').toString('utf-8')
        return cleanEmailContent(decoded)
      }
      
      // Fallback to HTML if no plain text
      const htmlPart = message.payload.parts.find(part => 
        part.mimeType === 'text/html'
      )
      
      if (htmlPart?.body?.data) {
        const decoded = Buffer.from(htmlPart.body.data, 'base64').toString('utf-8')
        return cleanEmailContent(decoded)
      }
    }

    // Final fallback to snippet
    return message.snippet || 'Aucun contenu disponible'
  } catch (error) {
    console.error('Erreur extraction body:', error)
    return message.snippet || 'Erreur lecture contenu'
  }
}

function cleanEmailContent(content: string): string {
  // Remove HTML tags and clean up content
  return content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
    .replace(/&lt;/g, '<')   // Decode HTML entities
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')    // Normalize whitespace
    .trim()
}

function extractHeaderValue(headers: Array<{ name: string; value: string }>, headerName: string): string {
  const header = headers.find(h => h.name.toLowerCase() === headerName.toLowerCase());
  return header?.value || '';
}

function parseEmailAddress(fromHeader: string): string {
  // Extraire l'email de "Name <email@domain.com>" ou retourner tel quel
  const match = fromHeader.match(/<([^>]+)>/);
  return match ? match[1] : fromHeader;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const session = await getServerSession(authOptions);
    
    // ✅ Validation stricte de la session et de l'UUID
    if (!session?.userId) {
      return NextResponse.json(
        { error: 'Non autorisé - Session manquante' },
        { status: 401 }
      );
    }

    // ✅ Valider que l'ID utilisateur est un UUID valide
    const userId = validateUserId(session.userId);

    console.log(`🚀 Démarrage import Gmail pour l'utilisateur ${userId}`);

    // Étape 1: Récupérer le token Gmail valide
    const accessToken = await getGmailAccessToken(userId);
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Aucun compte Gmail lié ou token invalide. Veuillez vous reconnecter.' },
        { status: 401 }
      );
    }

    // Étape 2: Récupérer les emails depuis Gmail API
    console.log('📧 Récupération des emails depuis Gmail...');
    
    const messagesResponse = await fetch(
      'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=100&labelIds=INBOX',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!messagesResponse.ok) {
      const errorText = await messagesResponse.text();
      console.error('❌ Erreur Gmail API:', {
        status: messagesResponse.status,
        error: errorText
      });
      throw new Error(`Gmail API Error: ${messagesResponse.status}`);
    }

    const messagesData = await messagesResponse.json();
    const messageIds = messagesData.messages || [];

    if (messageIds.length === 0) {
      console.log('📭 Aucun message trouvé dans Gmail');
      return NextResponse.json({
        imported: 0,
        skipped: 0,
        message: 'Aucun email trouvé'
      });
    }

    console.log(`📬 ${messageIds.length} messages trouvés dans Gmail`);

    // Étape 3: Récupérer les détails de chaque email
    const emailsToProcess: ImportedEmail[] = [];
    let processedCount = 0;

    for (const messageRef of messageIds) {
      try {
        const messageResponse = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageRef.id}?format=full`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!messageResponse.ok) {
          console.warn(`⚠️ Erreur pour message ${messageRef.id}: ${messageResponse.status}`);
          continue;
        }

        const message: GmailMessage = await messageResponse.json();
        const headers = message.payload?.headers || [];

        const subject = extractHeaderValue(headers, 'Subject') || 'Sans sujet';
        const fromHeader = extractHeaderValue(headers, 'From') || 'Expéditeur inconnu';
        const sender = parseEmailAddress(fromHeader);
        const dateHeader = extractHeaderValue(headers, 'Date');
        
        // Parser la date
        let receivedAt = new Date().toISOString();
        if (dateHeader) {
          try {
            receivedAt = new Date(dateHeader).toISOString();
          } catch {
            receivedAt = new Date(parseInt(message.internalDate)).toISOString();
          }
        }

        const body = extractEmailBody(message);

        emailsToProcess.push({
          id: `gmail_${message.id}`,
          user_id: userId, // ✅ Utiliser l'UUID validé
          subject,
          sender,
          body,
          received_at: receivedAt,
          source: 'gmail',
          thread_id: message.threadId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

        processedCount++;

        // Log de progression tous les 10 emails
        if (processedCount % 10 === 0) {
          console.log(`📊 Traitement: ${processedCount}/${messageIds.length} emails`);
        }

      } catch (error) {
        console.error(`❌ Erreur traitement message ${messageRef.id}:`, error);
        continue;
      }
    }

    console.log(`✅ ${emailsToProcess.length} emails traités avec succès`);

    // Étape 4: Sauvegarder en base (batch upsert)
    let imported = 0;
    let skipped = 0;

    if (emailsToProcess.length > 0) {
      console.log('💾 Sauvegarde des emails en base...');
      
      try {
        const { data, error } = await supabaseAdmin
          .from('emails')
          .upsert(emailsToProcess, { 
            onConflict: 'id',
            ignoreDuplicates: false 
          })
          .select('id');

        if (error) {
          console.error('❌ Erreur Supabase:', error);
          throw error;
        }

        imported = data?.length || 0;
        skipped = emailsToProcess.length - imported;

        console.log(`✅ Import terminé: ${imported} nouveaux emails, ${skipped} doublons ignorés`);
      } catch (dbError) {
        console.error('❌ Erreur base de données:', dbError);
        throw new Error('Erreur lors de la sauvegarde en base');
      }
    }

    const duration = Date.now() - startTime;
    console.log(`🎉 Import Gmail terminé en ${duration}ms`);

    return NextResponse.json({
      imported,
      skipped,
      total: emailsToProcess.length,
      duration: `${duration}ms`,
      message: `${imported} emails importés avec succès`
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    
    console.error(`❌ Erreur import Gmail après ${duration}ms:`, errorMessage);
    
    return NextResponse.json(
      { 
        error: errorMessage,
        duration: `${duration}ms` 
      },
      { status: 500 }
    );
  }
}
