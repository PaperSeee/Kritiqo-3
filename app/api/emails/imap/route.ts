export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { validateUserId } from '@/lib/utils/uuid-validator';
import { classifyEmailAutomatically } from '@/lib/types/triage';

// Use require for imap-simple to avoid build issues
const imaps = eval('require')('imap-simple');

interface EmailData {
  id: string;
  subject: string;
  sender: string;
  date: string;
  preview: string;
  body: string;
  source: string;
  accountEmail: string;
  autoCategory: any;
}

async function extractImapEmails(email: string, appPassword: string): Promise<EmailData[]> {
  const config = {
    imap: {
      user: email,
      password: appPassword,
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      authTimeout: 10000,
      connTimeout: 15000
    }
  };

  try {
    console.log(`📧 Connecting to IMAP for ${email}`);
    const connection = await imaps.connect(config);
    await connection.openBox('INBOX');

    const messages = await connection.search(['ALL'], {
      bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)', 'TEXT'],
      struct: true,
      markSeen: false
    });

    console.log(`📬 Found ${messages.length} messages via IMAP`);

    const emails: EmailData[] = [];
    const maxMessages = Math.min(messages.length, 50); // Limit for performance

    for (let i = 0; i < maxMessages; i++) {
      const message = messages[i];
      
      try {
        const headers = message.parts.find((part: any) => 
          part.which === 'HEADER.FIELDS (FROM TO SUBJECT DATE)'
        );
        const textPart = message.parts.find((part: any) => part.which === 'TEXT');
        
        if (!headers) continue;

        const headerLines = headers.body;
        const subject = extractHeader(headerLines, 'Subject') || 'Sans sujet';
        const from = extractHeader(headerLines, 'From') || 'Expéditeur inconnu';
        const dateStr = extractHeader(headerLines, 'Date');
        
        let emailDate = new Date().toISOString();
        if (dateStr) {
          try {
            emailDate = new Date(dateStr).toISOString();
          } catch {
            emailDate = new Date().toISOString();
          }
        }

        const senderEmail = from.match(/<([^>]+)>/) ? from.match(/<([^>]+)>/)![1] : from;
        let bodyText = textPart?.body || 'Aucun contenu disponible';
        
        // Clean and limit body text
        bodyText = bodyText.replace(/<[^>]*>/g, '').substring(0, 1000);
        
        const emailData: EmailData = {
          id: `imap_${message.attributes.uid}_${Date.now()}`,
          subject,
          sender: senderEmail,
          date: emailDate,
          preview: bodyText.substring(0, 200) || 'Aucun aperçu disponible',
          body: bodyText,
          source: 'imap',
          accountEmail: email,
          autoCategory: classifyEmailAutomatically(senderEmail, subject, bodyText)
        };

        emails.push(emailData);
      } catch (msgError) {
        console.warn(`⚠️ Error processing message:`, msgError);
        continue;
      }
    }

    await connection.end();
    console.log(`✅ Extracted ${emails.length} emails via IMAP`);
    return emails;

  } catch (error) {
    console.error('❌ IMAP extraction error:', error);
    throw error;
  }
}

function extractHeader(headerText: string, headerName: string): string | null {
  const regex = new RegExp(`^${headerName}:\\s*(.+)$`, 'im');
  const match = headerText.match(regex);
  return match ? match[1].trim() : null;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.userId) {
      return NextResponse.json(
        { error: 'Non autorisé - Session manquante' },
        { status: 401 }
      );
    }

    const userId = validateUserId(session.userId);

    // Get connected IMAP accounts
    const { data: imapAccounts, error } = await supabaseAdmin
      .from('connected_emails')
      .select('*')
      .eq('user_id', userId)
      .eq('provider', 'imap');

    if (error) {
      console.error('❌ Error fetching IMAP accounts:', error);
      throw error;
    }

    if (!imapAccounts || imapAccounts.length === 0) {
      return NextResponse.json({ 
        emails: [], 
        message: 'Aucun compte IMAP connecté' 
      });
    }

    const allEmails: EmailData[] = [];
    const errors: string[] = [];

    // Extract emails from each IMAP account
    for (const account of imapAccounts) {
      try {
        const emails = await extractImapEmails(account.email, account.access_token);
        allEmails.push(...emails);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Erreur inconnue';
        errors.push(`${account.email}: ${errorMsg}`);
        console.error(`❌ Failed to extract from ${account.email}:`, errorMsg);
      }
    }

    return NextResponse.json({
      emails: allEmails,
      errors: errors.length > 0 ? errors : undefined,
      message: `${allEmails.length} emails extraits via IMAP`
    });

  } catch (error) {
    console.error('❌ IMAP route error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'extraction IMAP' },
      { status: 500 }
    );
  }
}
