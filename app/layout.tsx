import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";
import { BusinessProvider } from "@/contexts/BusinessContext";
import { Providers } from "@/app/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Kritiqo - Faites grandir votre PME sans lever le petit doigt",
  description:
    "Kritiqo automatise les réponses aux avis, trie vos emails par IA, et surveille votre e-réputation pour que vous restiez concentré sur l'essentiel : faire croître votre business.",
  keywords:
    "avis clients, gestion avis, QR code avis, Google Reviews, centralisation avis, tri emails IA",
  authors: [{ name: "Kritiqo" }],
  creator: "Kritiqo",
  publisher: "Kritiqo",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Kritiqo - Faites grandir votre PME sans lever le petit doigt",
    description:
      "Kritiqo automatise les réponses aux avis, trie vos emails par IA, et surveille votre e-réputation pour faire croître votre business",
    url: "https://kritiqo.com",
    siteName: "Kritiqo",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kritiqo - Faites grandir votre PME sans lever le petit doigt",
    description:
      "Kritiqo automatise les réponses aux avis, trie vos emails par IA, et surveille votre e-réputation pour faire croître votre business",
    creator: "@kritiqo_app",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code", // À remplacer par votre code Google
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={inter.variable}>
      <head>
        <meta name="theme-color" content="#171717" />
      </head>
      <body className={inter.className}>
        <Providers>
          <AuthProvider>
            <BusinessProvider>{children}</BusinessProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
