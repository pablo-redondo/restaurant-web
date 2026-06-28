'use client';
import { useEffect, useState } from 'react';
import { reviewsApi } from '@/lib/api';
import type { Review } from '@/types';
import AnimateIn from '@/components/AnimateIn';

const AVATARS = ['#2A4A38', '#1A3050', '#3A3020', '#172E22', '#402028', '#1A2A40'];
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
      {/* Rating summary */}
      {status === 'done' ? (
        <div className="flex items-center gap-4 mt-3 mb-10">
          <span className="font-heading font-bold text-[48px] leading-none text-[#172E22]">
            {avg !== null ? avg.toFixed(1) : '—'}
          </span>
          <div className="text-[13px] leading-[1.6]">
            <span className="text-[#172E22] tracking-[2px]">{avgStars}</span><br />
            <span className="text-[#5A6B60]">
              {total !== null ? `${total} reseñas verificadas` : 'Reseñas verificadas'}
            </span>
          </div>
        </div>
      ) : (
        /* Indicador discreto mientras carga — sin tarjetas fantasma */
        <div className="flex items-center gap-3 mt-4 mb-10 text-[#8A9C90] text-[13px]">
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
                <div className="bg-white border border-[#E4EDE8] rounded-[4px] p-6 h-full flex flex-col hover:border-[#C8DC2E]/50 hover:shadow-[0_6px_28px_rgba(23,46,34,0.09)] transition-all duration-300 group">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-[#172E22] text-[11px] tracking-[2px]">{rStars}</span>
                    <span className="text-[#C8DC2E] text-[28px] leading-none font-heading font-bold opacity-25 group-hover:opacity-50 transition-opacity select-none">"</span>
                  </div>
                  {r.comment && (
                    <p className="text-[#4A5A50] text-[13px] leading-[1.8] mb-5 flex-1">
                      &ldquo;{r.comment}&rdquo;
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-auto pt-4 border-t border-[#EDF2EF]">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold text-white shrink-0"
                      style={{ background: AVATARS[i % AVATARS.length] }}
                    >
                      {initial}
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-[#172E22]">{r.user_name ?? 'Cliente'}</p>
                      <p className="text-[11px] text-[#8A9E90] mt-0.5">{date}</p>
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
