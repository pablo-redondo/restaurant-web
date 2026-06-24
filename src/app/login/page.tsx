'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/reservations/me');
    } catch (err: unknown) {
      const e = err as { error?: string };
      setError(e?.error ?? 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="font-serif text-3xl text-center mb-2">Bienvenido</h1>
        <p className="text-stone-400 text-center mb-8">Accede a tu cuenta para gestionar reservas</p>

        <form onSubmit={handleSubmit} className="bg-stone-900 border border-stone-800 rounded-xl p-8 space-y-5">
          {error && (
            <div className="bg-red-900/40 border border-red-700 text-red-300 rounded p-3 text-sm">{error}</div>
          )}

          <div>
            <label className="block text-sm text-stone-300 mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-2.5 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 transition-colors"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm text-stone-300 mb-1.5">Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-2.5 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 transition-colors"
              placeholder="••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-500 text-stone-950 font-semibold rounded-lg hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Entrando...' : 'Iniciar sesión'}
          </button>

          <p className="text-center text-stone-500 text-sm">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="text-amber-400 hover:text-amber-300">
              Regístrate
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
