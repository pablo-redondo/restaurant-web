import type { Metadata } from 'next';
import Link from 'next/link';
import AnimateIn from '@/components/AnimateIn';

export const metadata: Metadata = {
  title: 'Dónde estamos y horarios',
  description:
    'Restaurante Marqués en Calle Gran Vía, 45 — Madrid. Horarios de apertura, cómo llegar y teléfono de contacto. Abierto de martes a domingo.',
  openGraph: {
    title: 'Dónde estamos · Restaurante Marqués',
    description: 'Gran Vía, 45 · Madrid · Martes a domingo · +34 91 000 0000',
    url: '/contacto',
  },
};

const horarios = [
  { dias: 'Lunes', horas: 'Cerrado', cerrado: true },
  { dias: 'Martes – Jueves', horas: '13:30 – 16:00 h  ·   20:30 – 23:00 h', cerrado: false },
  { dias: 'Viernes', horas: '13:30 – 16:30 h  ·   20:30 – 23:30 h', cerrado: false },
  { dias: 'Sábado', horas: '13:30 – 16:30 h  ·   20:30 – 23:30 h', cerrado: false },
  { dias: 'Domingo', horas: '13:30 – 16:30 h (solo comidas)', cerrado: false },
];

const contactInfo = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C8DC2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    label: 'Dirección',
    content: <>Calle Gran Vía, 45<br />28013 Madrid</>,
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C8DC2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
    label: 'Teléfono',
    content: <>+34 91 000 0000</>,
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C8DC2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    label: 'Email',
    content: <>info@marquesmadrid.es</>,
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C8DC2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="1"/>
        <path d="M16 8l5 3-5 3V8z"/>
      </svg>
    ),
    label: 'Metro',
    content: <>Gran Vía (L1, L5) · 3 min a pie<br />Callao (L3, L5) · 5 min a pie</>,
  },
];

export default function ContactoPage() {
  return (
    <>
      {/* Hero band */}
      <section className="bg-[#172E22] px-[52px] py-16 border-b border-[#1E3020]">
        <p className="anim-fade-up text-[#C8DC2E] text-[11px] font-bold tracking-[2.5px] uppercase mb-4" style={{ animationDelay: '0.05s' }}>Encúntranos</p>
        <h1 className="anim-fade-up font-hero font-[800] text-[clamp(40px,6vw,64px)] leading-[1.0] text-white mb-4" style={{ animationDelay: '0.15s' }}>
          Dónde estamos
        </h1>
        <p className="anim-fade-up text-[#8AB5A0] text-[17px] leading-[1.7] max-w-[480px]" style={{ animationDelay: '0.25s' }}>
          En el corazón de Madrid, a dos pasos de la Gran Vía.
          Reserva con antelación, especialmente los fines de semana.
        </p>
      </section>

      {/* Horarios + Contacto */}
      <section className="bg-[#F1EFE9] px-[52px] py-[88px]">
        <div className="grid md:grid-cols-2 gap-16 max-w-5xl mx-auto">

          {/* Horarios */}
          <AnimateIn from="left">
            <p className="text-[#172E22] text-[10px] font-bold tracking-[2.5px] uppercase mb-6">Horarios de apertura</p>
            <h2 className="font-heading font-bold text-[32px] tracking-[-0.5px] text-[#172E22] mb-8">Cuándo visitarnos</h2>
            <div className="space-y-0">
              {horarios.map((h, i) => (
                <AnimateIn key={h.dias} delay={i * 60}>
                  <div
                    className={`flex items-baseline justify-between py-4 border-b border-[#D8E2DC] transition-colors duration-200 hover:bg-[#EBE9E3] -mx-2 px-2 rounded-[2px] ${
                      h.cerrado ? 'opacity-40' : ''
                    }`}
                  >
                    <span className="font-heading font-semibold text-[15px] text-[#172E22] min-w-[160px]">{h.dias}</span>
                    <span className={`text-[14px] text-right ${
                      h.cerrado ? 'text-[#5A6B60] italic' : 'text-[#5A6B60]'
                    }`}>{h.horas}</span>
                  </div>
                </AnimateIn>
              ))}
            </div>
            <p className="mt-6 text-[#8A9C90] text-[12px] leading-[1.65]">
              La cocina cierra 30 minutos antes del horario indicado.
              Recomendamos reservar mesa con antelación.
            </p>
          </AnimateIn>

          {/* Contacto */}
          <AnimateIn from="right">
            <p className="text-[#172E22] text-[10px] font-bold tracking-[2.5px] uppercase mb-6">Cómo llegar</p>
            <h2 className="font-heading font-bold text-[32px] tracking-[-0.5px] text-[#172E22] mb-8">Dónde encontrarnos</h2>
            <div className="space-y-6">
              {contactInfo.map((item, i) => (
                <AnimateIn key={item.label} delay={i * 80}>
                  <div className="flex gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-[#172E22] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#C8DC2E] transition-colors duration-300">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-heading font-semibold text-[15px] text-[#172E22] mb-1">{item.label}</p>
                      <p className="text-[#5A6B60] text-[14px] leading-[1.65]">{item.content}</p>
                    </div>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Mapa */}
      <section className="bg-[#172E22] px-[52px] py-[72px]">
        <AnimateIn className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <p className="text-[#C8DC2E] text-[10px] font-bold tracking-[2.5px] uppercase mb-3">Ubicación</p>
            <h2 className="font-heading font-bold text-[32px] text-white mb-3">Calle Gran Vía, 45</h2>
            <p className="text-[#6A9A80] text-[15px] leading-[1.65]">
              Madrid Centro · 28013<br />
              A 5 minutos del metro Gran Vía
            </p>
          </div>
          <a
            href="https://maps.google.com/?q=Gran+Via+45+Madrid"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-[28px] py-[14px] bg-white/8 border border-white/15 text-white text-[14px] font-medium rounded-[3px] hover:bg-white/12 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            Ver en Google Maps ↗
          </a>
        </AnimateIn>
      </section>

      {/* CTA */}
      <section className="bg-[#F0F4F0] px-[52px] py-[72px] border-t border-[#C4D5CA]">
        <AnimateIn className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="font-heading font-bold text-[28px] text-[#172E22] mb-2">¿Lista para reservar?</h2>
            <p className="text-[#5A6B60] text-[15px]">Asegúrate tu mesa con antelación, especialmente en fin de semana.</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link href="/reservations" className="px-[28px] py-[13px] bg-[#172E22] text-white font-bold text-[14px] rounded-[3px] hover:bg-[#1E3A2A] hover:scale-[1.02] active:scale-[0.98] transition-all">Reservar mesa →</Link>
            <Link href="/carta" className="px-[28px] py-[13px] border border-[#C4D5CA] text-[#172E22] text-[14px] rounded-[3px] hover:bg-[#E8EDE8] transition-all">Ver la carta</Link>
          </div>
        </AnimateIn>
      </section>
    </>
  );
}
