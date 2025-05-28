import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { supabaseAdmin } from '@/lib/supabase-admin';
import OpenAI from 'openai';
import { TriageCategorie, TriagePriorite, TriageAction, type TriageResult } from '@/lib/types/triage';

// Validate OpenAI API key
if (!process.env.OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY environment variable is missing');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key', // Use dummy key to prevent initialization errors
});

interface TriageRequest {
  id: string;
  subject: string;
  body: string;
  sender: string;
}

interface TriageResponse extends TriageResult {
  fromCache?: boolean;
}

function cleanEmailBody(body: string): string {
  // Remove HTML tags
  let cleaned = body.replace(/<[^>]*>/g, '');
  
  // Remove common email signatures patterns
  cleaned = cleaned.replace(/--\s*$/gm, '');
  cleaned = cleaned.replace(/^Sent from my.*/gm, '');
  cleaned = cleaned.replace(/^Envoyé depuis mon.*/gm, '');
  cleaned = cleaned.replace(/^Get Outlook for.*/gm, '');
  
  // Remove excessive whitespace
  cleaned = cleaned.replace(/\n\s*\n/g, '\n').trim();
  
  return cleaned;
}

// Étape 2 & 3: Préfiltrage intelligent avec focus sur avis clients
function prefilterEmail(sender: string, subject: string, body: string): TriageResponse | null {
  const lowerSender = sender.toLowerCase();
  const lowerSubject = subject.toLowerCase();
  const lowerBody = body.toLowerCase();

  // Étape 2: Filtre noreply
  if (lowerSender.startsWith('noreply@') || lowerSender.includes('no-reply')) {
    return {
      categorie: 'Spam/Pub',
      priorite: 'Faible',
      action: 'Ignorer',
      suggestion: null
    };
  }

  // Nouveau: Détection avis clients (priorité haute)
  const avisKeywords = ['avis', 'review', 'commentaire', 'expérience', 'service', 'restaurant', 'plat', 'recommande', 'témoignage', 'satisfaction'];
  const hasAvisContent = avisKeywords.some(keyword => 
    lowerSubject.includes(keyword) || lowerBody.includes(keyword)
  );

  if (hasAvisContent && !lowerSender.includes('noreply')) {
    return {
      categorie: 'Avis client',
      priorite: 'Urgent',
      action: 'Répondre',
      suggestion: null
    };
  }

  // Étape 3: Filtre promotionnel étendu
  const promoKeywords = [
    'promo', 'réduction', 'offre', 'code promo', 'promotion', 'solde', 'discount', 
    'black friday', 'cyber monday', 'deal', 'flash sale', 'limited time', 'act now',
    'gratuit', 'cadeau', 'gagnez', 'winner', 'congratulations', 'félicitations',
    'special offer', 'offre spéciale', 'prix cassé', 'dernière chance', 'exclusif',
    'vip', 'membre premium', 'cashback', 'économisez', 'save money'
  ];
  const hasPromoContent = promoKeywords.some(keyword => 
    lowerSubject.includes(keyword) || lowerBody.includes(keyword)
  );

  // Domaines suspects étendus
  const suspiciousDomains = [
    'mailchimp.com', 'constantcontact.com', 'mailgun.net', 'sendgrid.net',
    'marketing', 'promo', 'newsletter', 'campaign-archive.com'
  ];
  const isSuspiciousDomain = suspiciousDomains.some(domain => lowerSender.includes(domain));

  if (hasPromoContent || isSuspiciousDomain) {
    return {
      categorie: 'Spam/Pub',
      priorite: 'Faible',
      action: 'Ignorer',
      suggestion: null
    };
  }

  return null;
}

// Étape 6: Nettoyer la réponse GPT des blocs markdown
function cleanGptResponse(responseText: string): string {
  return responseText
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();
}

// Étape 7: GPT with retry and API key validation
async function callGptWithRetry(subject: string, body: string, maxRetries = 3): Promise<TriageResponse> {
  // Check if OpenAI API key is available
  if (!process.env.OPENAI_API_KEY) {
    console.warn('⚠️ OPENAI_API_KEY not available, using fallback classification');
    return {
      categorie: 'Autre',
      priorite: 'Moyen',
      action: 'Examiner manuellement',
      suggestion: null
    };
  }

  const cleanBody = cleanEmailBody(body);

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `Tu es un assistant pour PME. Analyse le mail suivant et retourne en JSON :

{
  "categorie": "Avis client | Commande | Juridique | RH | Facture | Notification automatique | Commercial | Publicité | Autre",
  "priorite": "Urgent | Moyen | Faible", 
  "action": "Répondre | Répondre avec excuse | Transférer au support | Transférer à la comptabilité | Ignorer | Examiner manuellement",
  "suggestion": null
}

⚠️ Ne génère jamais de texte de réponse ici. La suggestion doit être null.`
          },
          {
            role: "user",
            content: `Objet : ${subject}\n\nContenu : ${cleanBody}`
          }
        ],
        temperature: 0.2,
        max_tokens: 200,
      });

      const responseText = completion.choices[0]?.message?.content;
      
      if (!responseText) {
        throw new Error('No response from OpenAI');
      }

      const cleanedResponse = cleanGptResponse(responseText);
      const gptResult = JSON.parse(cleanedResponse);

      return {
        categorie: gptResult.categorie,
        priorite: gptResult.priorite,
        action: gptResult.action,
        suggestion: null
      };

    } catch (error: any) {
      // Étape 7: Gestion du rate limiting
      if (error?.error?.code === 'rate_limit_exceeded' && attempt < maxRetries) {
        console.log(`Rate limit hit, retrying in 500ms (attempt ${attempt}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, 500));
        continue;
      }
      
      // Si c'est la dernière tentative ou une autre erreur
      if (attempt === maxRetries) {
        console.error('GPT error after all retries:', error);
        throw error;
      }
    }
  }

  throw new Error('Max retries exceeded');
}

export async function POST(request: NextRequest) {
  let id: string = '';
  let subject: string = '';
  let sender: string = '';
  let body: string = '';
  let session: any = null; // Add session declaration here
  
  try {
    session = await getServerSession(authOptions); // Remove const here
    
    if (!session?.userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Étape 1: Récupérer les champs requis
    const requestData: TriageRequest = await request.json();
    id = requestData.id;
    subject = requestData.subject;
    body = requestData.body;
    sender = requestData.sender;

    if (!id || !subject || !body || !sender) {
      return NextResponse.json(
        { error: 'ID, subject, body et sender sont requis' },
        { status: 400 }
      );
    }

    // Étape 4: Vérifier le cache Supabase AVANT tout traitement
    try {
      const { data: existingEmail, error: fetchError } = await supabaseAdmin
        .from('emails')
        .select('gpt_categorie, gpt_priorite, gpt_action, gpt_suggestion, analyzed_at')
        .eq('id', id)
        .eq('user_id', session.userId)
        .single();

      // Si trouvé dans le cache et déjà analysé, retourner immédiatement
      if (existingEmail && existingEmail.analyzed_at && existingEmail.gpt_categorie && !fetchError) {
        console.log(`📊 Email ${id} trouvé en cache avec analyse complète, retour immédiat`);
        return NextResponse.json({
          categorie: existingEmail.gpt_categorie,
          priorite: existingEmail.gpt_priorite,
          action: existingEmail.gpt_action,
          suggestion: existingEmail.gpt_suggestion,
          fromCache: true
        });
      }
    } catch (err) {
      console.log(`📝 Pas de cache trouvé pour ${id}, analyse nécessaire`);
    }

    // Étape 2 & 3: Préfiltrage intelligent
    const prefilterResult = prefilterEmail(sender, subject, body);
    
    if (prefilterResult) {
      console.log(`🔍 Email ${id} préfiltré: ${prefilterResult.categorie}`);
      
      // Sauvegarder le résultat du préfiltre
      const emailData = {
        id,
        user_id: session.userId,
        subject,
        sender,
        body,
        gpt_categorie: prefilterResult.categorie,
        gpt_priorite: prefilterResult.priorite,
        gpt_action: prefilterResult.action,
        gpt_suggestion: null,
        analyzed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      try {
        const { error: upsertError } = await supabaseAdmin
          .from('emails')
          .upsert(emailData, { onConflict: 'id' });

        if (upsertError) {
          console.error('❌ Erreur sauvegarde préfiltre:', upsertError.message);
        }
      } catch (err) {
        console.error('❌ Erreur Supabase (préfiltre):', err instanceof Error ? err.message : 'Erreur inconnue');
      }

      return NextResponse.json({
        ...prefilterResult,
        fromCache: false
      });
    }

    console.log(`🤖 Analyse GPT nécessaire pour ${id}`);

    // Étape 5: Analyser avec GPT-4o
    const triageResult = await callGptWithRetry(subject, body);

    // Étape 8: Sauvegarder le résultat GPT dans Supabase
    const emailData = {
      id,
      user_id: session.userId,
      subject,
      sender,
      body,
      gpt_categorie: triageResult.categorie,
      gpt_priorite: triageResult.priorite,
      gpt_action: triageResult.action,
      gpt_suggestion: null,
      analyzed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    try {
      const { error: upsertError } = await supabaseAdmin
        .from('emails')
        .upsert(emailData, { onConflict: 'id' });

      if (upsertError) {
        console.error('❌ Erreur sauvegarde GPT:', upsertError.message);
      } else {
        console.log(`✅ Email ${id} analysé et sauvegardé`);
      }
    } catch (err) {
      console.error('❌ Erreur Supabase (sauvegarde GPT):', err instanceof Error ? err.message : 'Erreur inconnue');
    }

    // Étape 9: Retourner les données finales
    return NextResponse.json({
      ...triageResult,
      fromCache: false
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    console.error('❌ Erreur triage générale:', errorMessage);
    
    // Fallback response en cas d'erreur
    const fallbackResponse: TriageResponse = {
      categorie: 'Autre',
      priorite: 'Moyen',
      action: 'Examiner manuellement',
      suggestion: null,
      fromCache: false
    };

    // If OpenAI is not available, provide basic fallback
    if (!process.env.OPENAI_API_KEY) {
      const emailId = id || 'email non identifié';
      console.log(`⚠️ OpenAI non disponible, classification basique pour ${emailId}`);
      
      // Still save to Supabase for tracking
      if (id && session?.userId) {
        const emailData = {
          id,
          user_id: session.userId,
          subject,
          sender,
          body,
          gpt_categorie: fallbackResponse.categorie,
          gpt_priorite: fallbackResponse.priorite,
          gpt_action: fallbackResponse.action,
          gpt_suggestion: null,
          analyzed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        try {
          await supabaseAdmin.from('emails').upsert(emailData, { onConflict: 'id' });
        } catch (err) {
          console.error('❌ Erreur Supabase (fallback):', err);
        }
      }

      return NextResponse.json(fallbackResponse);
    }

    return NextResponse.json(fallbackResponse, { status: 200 });
  }
}
