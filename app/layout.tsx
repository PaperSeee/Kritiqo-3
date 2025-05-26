import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";
import { Providers } from "./providers";
import { BusinessProvider } from "@/contexts/BusinessContext";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Kritiqo - Gestion d'avis clients pour restaurants et commerces",
    template: "%s | Kritiqo",
  },
  description:
    "Kritiqo vous aide à collecter et gérer vos avis clients avec des QR codes, pages d'avis personnalisées et outils de gestion d'emails. Augmentez votre réputation en ligne.",
  keywords: [
    "avis clients",
    "gestion avis",
    "QR code restaurant",
    "réputation en ligne",
    "collecte avis",
    "gestion restaurant",
    "avis Google",
    "feedback client",
    "e-réputation",
    "commerce local",
  ],
  authors: [{ name: "Kritiqo" }],
  creator: "Kritiqo",
  publisher: "Kritiqo",
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
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://kritiqo.com",
    siteName: "Kritiqo",
    title: "Kritiqo - Gestion d'avis clients pour restaurants et commerces",
    description:
      "Collectez et gérez vos avis clients facilement avec Kritiqo. QR codes, pages personnalisées, gestion d'emails - tout pour améliorer votre réputation en ligne.",
    images: [
      {
        url: "https://kritiqo.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kritiqo - Plateforme de gestion d'avis clients",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kritiqo - Gestion d'avis clients pour restaurants",
    description:
      "Collectez plus d'avis clients avec nos QR codes et pages personnalisées. Essai gratuit 14 jours.",
    images: ["https://kritiqo.com/twitter-image.jpg"],
    creator: "@kritiqo_app",
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  alternates: {
    canonical: "https://kritiqo.com",
  },
  category: "business",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AuthProvider>
          <BusinessProvider>
            <Providers>{children}</Providers>
          </BusinessProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
