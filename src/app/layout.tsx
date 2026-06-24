import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Restaurante Marqués',
  description: 'Alta cocina en el corazón de Madrid. Reserve su mesa en Marqués.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
