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
      if (e?.errors) setErrors(e.errors.map((v) => v.message));
      else setErrors([e?.error ?? 'Error al registrarse']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-58px)] flex items-center justify-center px-4 bg-[#F0F4F0]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="text-[#5A6B60] text-[11px] font-bold tracking-[2.5px] uppercase font-body mb-3">Registro</p>
          <h1 className="font-heading font-bold text-[38px] tracking-[-0.5px] text-[#172E22]">Crear cuenta</h1>
          <p className="text-[#5A6B60] text-[14px] mt-2">Regístrate para hacer tu primera reserva</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[#C4D5CA] rounded-card p-8 space-y-5"
        >
          {errors.length > 0 && (
            <div className="bg-[rgba(220,38,38,0.08)] border border-[rgba(220,38,38,0.3)] text-[#991B1B] rounded-btn p-3 text-sm space-y-1">
              {errors.map((e, i) => <p key={i}>{e}</p>)}
            </div>
          )}

          {[
            { label: 'Nombre completo', type: 'text', value: name, set: setName, placeholder: 'Juan García', min: undefined },
            { label: 'Email', type: 'email', value: email, set: setEmail, placeholder: 'tu@email.com', min: undefined },
            { label: 'Contraseña (mín. 6 car.)', type: 'password', value: password, set: setPassword, placeholder: '••••••', min: 6 },
          ].map(({ label, type, value, set, placeholder, min }) => (
            <div key={label}>
              <label className="block text-[11px] font-bold text-[#5A6B60] uppercase tracking-[2px] mb-2 font-body">
                {label}
              </label>
              <input
                type={type}
                required
                value={value}
                minLength={min}
                onChange={(e) => set(e.target.value)}
                className="w-full border border-[#C4D5CA] rounded-btn px-4 py-2.5 text-[#172E22] text-[14px] placeholder-[#C4D5CA] focus:outline-none focus:border-[#172E22] transition-colors"
                placeholder={placeholder}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-btn bg-[#172E22] text-white font-semibold text-sm font-body hover:bg-[#1A3D2D] disabled:opacity-50 transition-colors"
          >
            {loading ? 'Creando cuenta...' : 'Registrarse'}
          </button>

          <p className="text-center text-[#5A6B60] text-sm">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-[#172E22] font-semibold hover:underline">
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
