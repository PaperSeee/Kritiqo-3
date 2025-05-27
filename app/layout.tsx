import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";
import { Providers } from "@/app/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Kritiqo - Centralisez et gérez tous vos avis clients",
  description:
    "La plateforme tout-en-un pour collecter, centraliser et gérer vos avis clients. QR codes personnalisés, tri intelligent des emails par IA, analytics avancés.",
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
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
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
    title: "Kritiqo - Centralisez tous vos avis clients",
    description:
      "La plateforme tout-en-un pour gérer vos avis clients et booster votre réputation en ligne",
    url: "https://kritiqo.com",
    siteName: "Kritiqo",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kritiqo - Centralisez tous vos avis clients",
    description:
      "La plateforme tout-en-un pour gérer vos avis clients et booster votre réputation en ligne",
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
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#171717" />
      </head>
      <body className={inter.className}>
        <Providers>
          <AuthProvider>{children}</AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
