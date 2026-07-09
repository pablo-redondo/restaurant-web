'use client';
import { useEffect, useState } from 'react';
import { reviewsApi } from '@/lib/api';
import type { Review } from '@/types';
import AnimateIn from '@/components/AnimateIn';

const TIMEOUT_MS = 5000;

type Status = 'loading' | 'done' | 'empty';

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

  // Sin reseñas o timeout → ocultar sección completamente
  if (status === 'empty') return null;

  const avgRounded = avg !== null ? Math.min(5, Math.max(0, Math.round(avg))) : 5;
  const avgStars   = '★'.repeat(avgRounded) + '☆'.repeat(5 - avgRounded);

  return (
    <div>
      {/* Resumen de valoración — integrado y monocromo, en la paleta del sitio */}
      {status === 'done' ? (
        <div className="flex items-center gap-4 mt-6 mb-12">
          <span className="font-heading font-bold text-[46px] leading-none text-[#172E22]">
            {avg !== null ? avg.toFixed(1) : '—'}
          </span>
          <div className="leading-tight">
            <div className="text-[#172E22] text-[16px] tracking-[3px]">{avgStars}</div>
            <p className="text-[#5A6B60] text-[13px] mt-1.5">
              {total !== null ? `Sobre ${total} reseñas verificadas` : 'Reseñas verificadas'}
            </p>
          </div>
        </div>
      ) : (
        /* Indicador discreto mientras carga — sin tarjetas fantasma */
        <div className="flex items-center gap-3 mt-6 mb-12 text-[#8A9C90] text-[13px]">
          <span className="flex gap-1 items-center">
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
      )}

      {/* Grid de reseñas — solo cuando los datos están listos */}
      {status === 'done' && (
        <div className="grid md:grid-cols-3 gap-5">
          {reviews.map((r: Review, i: number) => {
            const initial = r.user_name ? r.user_name.charAt(0).toUpperCase() : '?';
            const rStars  = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
            const date    = new Date(r.created_at).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
            return (
              <AnimateIn key={r.id} delay={i * 55} className="h-full">
                <div className="relative bg-white border border-[#DDE6DE] rounded-[14px] p-7 h-full flex flex-col overflow-hidden hover:border-[#C8DC2E]/50 hover:shadow-[0_14px_34px_rgba(23,46,34,0.10)] hover:-translate-y-1 transition-all duration-300 group">
                  {/* Barra superior lima al hover — mismo patrón que las tarjetas de la carta */}
                  <span className="absolute top-0 left-0 right-0 h-[3px] bg-[#C8DC2E] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
                  <span className="text-[#172E22] text-[15px] tracking-[3px] mb-5">{rStars}</span>
                  {r.comment && (
                    <p className="text-[#3F5A4B] text-[15px] leading-[1.85] mb-7 flex-1">
                      &ldquo;{r.comment}&rdquo;
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-auto pt-5 border-t border-[#EDF2EF]">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-heading font-bold text-[#C8DC2E] bg-[#172E22] shrink-0">
                      {initial}
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-[#172E22]">{r.user_name ?? 'Cliente'}</p>
                      <p className="text-[11.5px] text-[#8A9E90] mt-0.5 capitalize">{date}</p>
                    </div>
                  </div>
                </div>
              </AnimateIn>
            );
          })}
        </div>
      )}
    </div>
  );
}
