'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      const redirect = searchParams.get('redirect');
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push(redirect || '/reservations/me');
      }
    } catch (err: unknown) {
      const e = err as { error?: string };
      setError(e?.error ?? 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-58px)] flex items-center justify-center px-4 bg-[#F0F4F0]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="text-[#5A6B60] text-[11px] font-bold tracking-[2.5px] uppercase font-body mb-3">Acceso</p>
          <h1 className="font-heading font-bold text-[38px] tracking-[-0.5px] text-[#172E22]">Bienvenido</h1>
          <p className="text-[#5A6B60] text-[14px] mt-2">Accede a tu cuenta para gestionar reservas</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[#C4D5CA] rounded-card p-8 space-y-5"
        >
          {error && (
            <div className="bg-[rgba(220,38,38,0.08)] border border-[rgba(220,38,38,0.3)] text-[#991B1B] rounded-btn p-3 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-[#5A6B60] uppercase tracking-[2px] mb-2 font-body">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#C4D5CA] rounded-btn px-4 py-2.5 text-[#172E22] text-[14px] placeholder-[#C4D5CA] focus:outline-none focus:border-[#172E22] transition-colors"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#5A6B60] uppercase tracking-[2px] mb-2 font-body">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#C4D5CA] rounded-btn px-4 py-2.5 text-[#172E22] text-[14px] placeholder-[#C4D5CA] focus:outline-none focus:border-[#172E22] transition-colors"
              placeholder="••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-btn bg-[#172E22] text-white font-semibold text-sm font-body hover:bg-[#1A3D2D] disabled:opacity-50 transition-colors"
          >
            {loading ? 'Entrando...' : 'Iniciar sesión'}
          </button>

          <p className="text-center text-[#5A6B60] text-sm">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="text-[#172E22] font-semibold hover:underline">
              Regístrate
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
