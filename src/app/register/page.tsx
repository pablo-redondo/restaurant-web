'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);
    try {
      await register(name, email, password);
      router.push('/reservations');
    } catch (err: unknown) {
      const e = err as { error?: string; errors?: { field: string; message: string }[] };
      if (e?.errors) {
        setErrors(e.errors.map((v) => v.message));
      } else {
        setErrors([e?.error ?? 'Error al registrarse']);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="font-serif text-3xl text-center mb-2">Crear cuenta</h1>
        <p className="text-stone-400 text-center mb-8">Regístrate para hacer tu primera reserva</p>

        <form onSubmit={handleSubmit} className="bg-stone-900 border border-stone-800 rounded-xl p-8 space-y-5">
          {errors.length > 0 && (
            <div className="bg-red-900/40 border border-red-700 text-red-300 rounded p-3 text-sm space-y-1">
              {errors.map((e, i) => <p key={i}>{e}</p>)}
            </div>
          )}

          <div>
            <label className="block text-sm text-stone-300 mb-1.5">Nombre completo</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-2.5 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 transition-colors"
              placeholder="Juan García"
            />
          </div>

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
            <label className="block text-sm text-stone-300 mb-1.5">Contraseña (mín. 6 caracteres)</label>
            <input
              type="password"
              required
              minLength={6}
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
            {loading ? 'Creando cuenta...' : 'Registrarse'}
          </button>

          <p className="text-center text-stone-500 text-sm">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-amber-400 hover:text-amber-300">
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
