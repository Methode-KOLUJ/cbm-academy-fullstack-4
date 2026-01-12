import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import ScrollSmooth from "@/components/LenisScroll";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  title: "CBM Academy Books",
  description: "La plateforme de l'Entrepreneuriat et du Développement personnel par excellence.",
  icons: {
    icon: [
      { url: '/favicon/16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon/512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon/apple.png' },
    ],
  },
  openGraph: {
    title: "CBM Academy Books",
    description: "La plateforme de l'Entrepreneuriat et du Développement personnel par excellence.",
    siteName: 'CBM Academy Books',
    images: [
      {
        url: '/Og.jpg',
        width: 1200,
        height: 630,
        alt: 'CBM Academy Books',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "CBM Academy Books",
    description: "La plateforme de l'Entrepreneuriat et du Développement personnel par excellence.",
    images: ['/Twitter.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={inter.className}>
      <body className="antialiased bg-gray-950 text-white selection:bg-amber-500/30 selection:text-amber-50">
        <AuthProvider>
          <Navbar />
          <ScrollSmooth>
            {children}
          </ScrollSmooth>
          <Footer />
        </AuthProvider>
      </body>
      <GoogleAnalytics gaId="G-PRD86QSJ14" />
    </html>
  );
}
