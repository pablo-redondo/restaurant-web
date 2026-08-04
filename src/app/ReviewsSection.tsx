'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { reviewsApi } from '@/lib/api';
import type { Review } from '@/types';
import AnimateIn from '@/components/AnimateIn';
import CountUp from '@/components/CountUp';
import MagneticEl from '@/components/MagneticEl';

const TIMEOUT_MS = 5000;

type Status = 'loading' | 'done' | 'empty';

/** Estrellas decorativas. El valor real se expone aparte como texto accesible,
 *  así que aquí los glifos van marcados como decorativos. */
function Stars({ rating, className = '' }: { rating: number; className?: string }) {
  const filled = Math.min(5, Math.max(0, Math.round(rating)));
  return (
    <span aria-hidden="true" className={`inline-flex gap-[3px] ${className}`}>
      {[0, 1, 2, 3, 4].map(i => (
        <span key={i} className={i < filled ? 'text-[#8A9C1E]' : 'text-[#C9D2C6]'}>
          ★
        </span>
      ))}
    </span>
  );
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avg,     setAvg]     = useState<number | null>(null);
  const [total,   setTotal]   = useState<number | null>(null);
  const [status,  setStatus]  = useState<Status>('loading');

  useEffect(() => {
    let cancelled = false;

    // Si el API tarda más de 5s, desaparecer limpiamente
    const timer = setTimeout(() => {
      if (!cancelled) setStatus('empty');
    }, TIMEOUT_MS);

    reviewsApi.list({ limit: 6 })
      .then(({ reviews, average_rating, total }) => {
        if (cancelled) return;
        clearTimeout(timer);
        if (reviews.length > 0) {
          setReviews(reviews);
          setAvg(average_rating !== null ? Number(average_rating) : null);
          setTotal(total ?? null);
          setStatus('done');
        } else {
          setStatus('empty');
        }
      })
      .catch(() => {
        if (!cancelled) { clearTimeout(timer); setStatus('empty'); }
      });

    return () => { cancelled = true; clearTimeout(timer); };
  }, []);

  // Sin reseñas o timeout → ocultar la sección entera (cabecera incluida), para
  // no dejar un titular huérfano sobre un bloque vacío.
  if (status === 'empty') return null;

  // Mientras carga: reservar solo una banda discreta, no la sección completa.
  if (status === 'loading') {
    return (
      <section className="bg-[#F1EFE9] px-5 sm:px-8 lg:px-[52px] py-14">
        <div className="max-w-[1120px] mx-auto flex items-center gap-3 text-[#8A9C90] text-[13px]">
          <span className="flex gap-1 items-center" aria-hidden="true">
            {[0, 1, 2].map(i => (
              <span
                key={i}
                className="w-[5px] h-[5px] rounded-full bg-[#B8CCBF] inline-block animate-pulse"
                style={{ animationDelay: `${i * 180}ms` }}
              />
            ))}
          </span>
          <span>Cargando reseñas…</span>
        </div>
      </section>
    );
  }

  const featured = reviews.length === 1;

  return (
    <section className="relative bg-[#F1EFE9] px-5 sm:px-8 lg:px-[52px] py-16 sm:py-[88px] overflow-hidden">
      {/* Halo lima muy sutil: rompe la planitud del fondo sin robar protagonismo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full opacity-[0.16]"
        style={{ background: 'radial-gradient(circle, #C8DC2E 0%, transparent 68%)' }}
      />

      <div className="relative max-w-[1120px] mx-auto grid md:grid-cols-12 gap-10 md:gap-14 items-start">
        {/* ── Columna izquierda: titular + nota media. Sticky en escritorio para que
              acompañe al scroll de las reseñas en vez de dejar un hueco muerto. ── */}
        <AnimateIn from="left" className="md:col-span-5 md:sticky md:top-24">
          <p className="text-[#172E22] text-[10px] font-bold tracking-[2.5px] uppercase mb-3">Lo que dicen</p>
          <h2 className="font-heading font-bold text-[clamp(30px,3.4vw,42px)] tracking-[-0.5px] text-[#172E22] leading-[1.1]">
            Nuestros clientes
          </h2>

          {avg !== null && (
            <div className="mt-7 flex items-center gap-5">
              <p className="font-heading font-bold text-[56px] leading-none text-[#172E22] tabular-nums">
                <CountUp to={avg} decimals={1} />
              </p>
              <div className="leading-tight">
                <Stars rating={avg} className="text-[15px] tracking-[1px]" />
                <p className="text-[#5A6B60] text-[13px] mt-2">
                  <span className="sr-only">Valoración media {avg.toFixed(1)} sobre 5. </span>
                  {total !== null
                    ? `Sobre ${total} ${total === 1 ? 'reseña verificada' : 'reseñas verificadas'}`
                    : 'Reseñas verificadas'}
                </p>
              </div>
            </div>
          )}

          <p className="text-[#5A6B60] text-[15px] leading-[1.75] mt-6 max-w-[380px]">
            Solo reseñan quienes han comido con nosotros: cada valoración procede de una
            reserva confirmada.
          </p>

          <MagneticEl className="w-fit">
            <Link
              href="/reservations"
              className="inline-flex items-center gap-2 mt-8 text-[#172E22] font-bold text-[12px] tracking-[1.5px] uppercase border-b-2 border-[#C8DC2E] pb-[3px] hover:text-[#8A9C1E] transition-colors duration-200"
            >
              Reservar mesa
            </Link>
          </MagneticEl>
        </AnimateIn>

        {/* ── Columna derecha: las reseñas. El layout se adapta al número real —
              con una sola reseña se convierte en cita destacada en vez de dejar
              dos tercios de rejilla vacíos. ── */}
        <div
          className={
            featured
              ? 'md:col-span-7'
              : 'md:col-span-7 grid sm:grid-cols-2 gap-4'
          }
        >
          {reviews.map((r: Review, i: number) => {
            const initial = r.user_name ? r.user_name.charAt(0).toUpperCase() : '?';
            const date    = new Date(r.created_at).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

            return (
              <AnimateIn key={r.id} delay={i * 70} className="h-full">
                <figure
                  className={`relative h-full flex flex-col bg-white rounded-[16px] overflow-hidden border border-[#E3E0D6] group transition-all duration-300 hover:border-[#C8DC2E]/60 hover:shadow-[0_18px_40px_rgba(23,46,34,0.10)] hover:-translate-y-1 ${
                    featured ? 'p-8 sm:p-11' : 'p-7'
                  }`}
                >
                  {/* Barra lima al hover — mismo patrón que las tarjetas de la carta */}
                  <span
                    aria-hidden="true"
                    className="absolute top-0 left-0 right-0 h-[3px] bg-[#C8DC2E] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"
                  />

                  {/* Comilla decorativa sobredimensionada, solo en la cita destacada */}
                  {featured && (
                    <span
                      aria-hidden="true"
                      className="absolute top-3 right-7 font-heading font-bold text-[120px] leading-[0.8] text-[#C8DC2E]/25 select-none"
                    >
                      &rdquo;
                    </span>
                  )}

                  <Stars
                    rating={r.rating}
                    className={`relative mb-5 tracking-[1px] ${featured ? 'text-[17px]' : 'text-[14px]'}`}
                  />
                  <span className="sr-only">{r.rating} de 5 estrellas.</span>

                  {r.comment && (
                    <blockquote
                      className={`relative text-[#2E4636] flex-1 ${
                        featured
                          ? 'text-[19px] sm:text-[21px] leading-[1.65] mb-8 max-w-[46ch]'
                          : 'text-[14.5px] leading-[1.75] mb-6'
                      }`}
                    >
                      &ldquo;{r.comment}&rdquo;
                    </blockquote>
                  )}

                  <figcaption className="relative flex items-center gap-3 mt-auto pt-5 border-t border-[#EFEDE5]">
                    <span className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-heading font-bold text-[#C8DC2E] bg-[#172E22] shrink-0">
                      {initial}
                    </span>
                    <span>
                      <span className="block text-[14px] font-semibold text-[#172E22]">
                        {r.user_name ?? 'Cliente'}
                      </span>
                      <span className="block text-[11.5px] text-[#8A9E90] mt-0.5 capitalize">{date}</span>
                    </span>
                  </figcaption>
                </figure>
              </AnimateIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
