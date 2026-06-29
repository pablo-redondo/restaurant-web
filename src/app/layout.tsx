import type { Metadata } from 'next';
import { Barlow_Condensed, Syne, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import PublicShell from './PublicShell';
import ApiWarmup from '@/components/ApiWarmup';

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
  title: 'Restaurante Marqués',
  description: 'Alta cocina en el corazón de Madrid. Reserve su mesa en Marqués.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${barlowCondensed.variable} ${syne.variable} ${plusJakarta.variable}`}
    >
      <body className="flex flex-col min-h-screen bg-[#F0F4F0]">
        <ApiWarmup />
        <AuthProvider>
          <PublicShell>{children}</PublicShell>
        </AuthProvider>
      </body>
    </html>
  );
}
