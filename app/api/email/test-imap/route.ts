/**
 * Connexion IMAP sécurisée avec adaptation automatique dev/prod
 * - En dev : on désactive la vérification TLS pour éviter l'erreur self-signed
 * - En prod : on laisse la sécurité TLS activée par défaut
 */

export const runtime = "nodejs";

import { NextResponse } from "next/server";
const imaps = require("imap-simple");

// TypeScript interfaces for IMAP message structure
interface ImapHeaders {
  from?: string[];
  subject?: string[];
  date?: string[];
  [key: string]: string[] | undefined;
}

interface ImapMessagePart {
  which: string;
  body: ImapHeaders | string;
}

interface ImapMessage {
  parts: ImapMessagePart[];
  attributes: {
    uid: number;
    [key: string]: any;
  };
}

export async function GET() {
  const isDev = process.env.NODE_ENV !== "production";

  const config = {
    imap: {
      user: "ilias.cryp@gmail.com",
      password: "TON_MDP_APP", // mot de passe d'application Gmail
      host: "imap.gmail.com",
      port: 993,
      tls: true,
      tlsOptions: isDev ? { rejectUnauthorized: false } : undefined,
    },
  };

  try {
    const connection = await imaps.connect(config);
    await connection.openBox("INBOX");

    const messages: ImapMessage[] = await connection.search(["ALL"], {
      bodies: ["HEADER"],
      markSeen: false,
    });

    const emails = messages.map((msg: ImapMessage) => {
      const headers = msg.parts.find((p) => p.which === "HEADER")?.body as ImapHeaders || {};
      return {
        from: headers.from?.[0] || "Inconnu",
        subject: headers.subject?.[0] || "Sans objet",
        date: headers.date?.[0] || "Sans date",
      };
    });

    await connection.end();
    return NextResponse.json(emails);
  } catch (err) {
    console.error("❌ IMAP extraction error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 });
  }
}
