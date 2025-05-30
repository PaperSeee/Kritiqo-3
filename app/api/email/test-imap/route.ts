/**
 * Connexion IMAP sécurisée avec adaptation automatique dev/prod
 * - En dev : on désactive la vérification TLS pour éviter l'erreur self-signed
 * - En prod : on laisse la sécurité TLS activée par défaut
 */

export const runtime = "nodejs";

import { NextResponse } from "next/server";
const imaps = require("imap-simple");

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

    const messages = await connection.search(["ALL"], {
      bodies: ["HEADER"],
      markSeen: false,
    });

    const emails = messages.map((msg) => {
      const headers = msg.parts.find((p) => p.which === "HEADER")?.body || {};
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
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
