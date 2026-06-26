import type { Metadata } from 'next';
import { Barlow_Condensed, Syne, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import PublicShell from './PublicShell';

const barlowCondensed = Barlow_Condensed({
  weight: ['800'],
  subsets: ['latin'],
  variable: '--font-barlow',
  display: 'swap',
});

const syne = Syne({
  weight: ['400', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
  ),
  title: {
    default: 'Restaurante Marqués — Alta cocina en Madrid desde 1987',
    template: '%s · Restaurante Marqués',
  },
  description:
    'Restaurante Marqués, cocina de temporada en el corazón de Madrid desde 1987. Ingredientes de mercado, dos generaciones en la cocina y una sala única en Gran Vía.',
  keywords: ['restaurante madrid', 'restaurante gran vía', 'cocina de temporada madrid', 'marqués restaurante', 'reservar mesa madrid'],
  openGraph: {
    siteName: 'Restaurante Marqués',
    locale: 'es_ES',
    type: 'website',
    images: [{ url: '/hero.webp', width: 896, height: 1200, alt: 'Interior del restaurante Marqués' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/hero.webp'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${barlowCondensed.variable} ${syne.variable} ${plusJakarta.variable}`}
    >
      <body className="flex flex-col min-h-screen bg-[#F0F4F0]">
        <AuthProvider>
          <PublicShell>{children}</PublicShell>
        </AuthProvider>
      </body>
    </html>
  );
}
