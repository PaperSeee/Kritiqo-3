import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface SuggestRequest {
  subject: string;
  body: string;
}

interface SuggestResponse {
  suggestion: string;
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

function cleanGptResponse(responseText: string): string {
  return responseText
    .replace(/```[\w]*\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();
}

export async function POST(request: NextRequest) {
  try {
    const { subject, body }: SuggestRequest = await request.json();

    // Vérification des champs requis
    if (!subject || !body) {
      return NextResponse.json(
        { error: 'Subject et body sont requis' },
        { status: 400 }
      );
    }

    const cleanBody = cleanEmailBody(body);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Tu es un assistant pour PME. Rédige une réponse claire, polie et professionnelle au mail suivant :

Objet : ${subject}
Contenu : ${cleanBody}

Ta réponse doit être directement prête à envoyer au client. Ne réponds qu'avec le texte de la réponse, sans explication ni JSON.`
        },
        {
          role: "user",
          content: `Rédige une réponse professionnelle à ce mail.`
        }
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const responseText = completion.choices[0]?.message?.content;
    
    if (!responseText) {
      throw new Error('Pas de réponse de OpenAI');
    }

    const cleanedSuggestion = cleanGptResponse(responseText);

    const result: SuggestResponse = {
      suggestion: cleanedSuggestion
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('Erreur génération suggestion:', error);
    
    return NextResponse.json(
      { error: 'Erreur lors de la génération de la suggestion' },
      { status: 500 }
    );
  }
}
