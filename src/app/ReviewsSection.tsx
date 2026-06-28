'use client';

import { useEffect, useRef, useState } from 'react';
import { reviewsApi } from '@/lib/api';
import type { Review } from '@/types';
import TiltCard from '@/components/TiltCard';

const BG_COLORS = ['#2A4A38', '#C85A1E', '#5A4A2A', '#172E22', '#8B2020', '#1A3050'];

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avg,     setAvg]     = useState<number | null>(null);
  const [total,   setTotal]   = useState<number | null>(null);
  const [active,  setActive]  = useState(0);

  const trackRef  = useRef<HTMLDivElement>(null);
  const isDrag    = useRef(false);
  const startX    = useRef(0);
  const scrollL   = useRef(0);

  useEffect(() => {
    reviewsApi.list({ limit: 6 }).then(({ reviews, average_rating, total }) => {
      setReviews(reviews);
      setAvg(average_rating !== null ? Number(average_rating) : null);
      setTotal(total ?? null);
    }).catch(() => {});
  }, []);

  // Scroll a una tarjeta concreta
  const scrollTo = (idx: number) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.children[idx] as HTMLElement;
    if (card) el.scrollTo({ left: card.offsetLeft - 16, behavior: 'smooth' });
    setActive(idx);
  };

  // Drag con ratón
  const onMouseDown = (e: React.MouseEvent) => {
    const el = trackRef.current;
    if (!el) return;
    isDrag.current = true;
    startX.current = e.pageX - el.offsetLeft;
    scrollL.current = el.scrollLeft;
    el.style.cursor = 'grabbing';
    el.style.userSelect = 'none';
  };

  const onMouseMove = (e: React.MouseEvent) => {
    const el = trackRef.current;
    if (!isDrag.current || !el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    el.scrollLeft = scrollL.current - (x - startX.current) * 1.2;
  };

  const stopDrag = () => {
    const el = trackRef.current;
    if (!el) return;
    isDrag.current = false;
    el.style.cursor = 'grab';
    el.style.removeProperty('user-select');
    // Detectar tarjeta activa
    const idx = Math.round(el.scrollLeft / (el.scrollWidth / Math.max(reviews.length, 1)));
    setActive(Math.max(0, Math.min(idx, reviews.length - 1)));
  };

  // Actualizar dot activo al hacer scroll
  const onScroll = () => {
    const el = trackRef.current;
    if (!el || reviews.length === 0) return;
    const cardW = el.scrollWidth / reviews.length;
    setActive(Math.round(el.scrollLeft / cardW));
  };

  const avgRounded = avg !== null ? Math.min(5, Math.max(0, Math.round(avg))) : 5;
  const avgStars   = '★'.repeat(avgRounded) + '☆'.repeat(5 - avgRounded);
  const displayReviews = reviews.length > 0 ? reviews : [];

  return (
    <div>
      {/* Rating row */}
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

      {displayReviews.length === 0 ? (
        <p className="text-[#4A6A58] text-center py-8">Aún no hay reseñas disponibles.</p>
      ) : (
        <>
          {/* Track draggable */}
          <div
            ref={trackRef}
            className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2"
            style={{
              scrollSnapType: 'x mandatory',
              scrollbarWidth: 'none',
              cursor: 'grab',
              WebkitOverflowScrolling: 'touch',
            }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={stopDrag}
            onMouseLeave={stopDrag}
            onScroll={onScroll}
          >
            <style>{`.reviews-track::-webkit-scrollbar{display:none}`}</style>
            {displayReviews.map((r: Review, i: number) => {
              const initial = r.user_name ? r.user_name.charAt(0).toUpperCase() : '?';
              const rStars  = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
              const date    = new Date(r.created_at).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
              return (
                <div
                  key={r.id}
                  style={{ scrollSnapAlign: 'start', minWidth: 'clamp(280px, 30vw, 340px)', flex: '0 0 auto' }}
                >
                  <TiltCard intensity={5} className="h-full">
                    <div className="bg-white border border-[#E0E8E4] rounded-[4px] p-[28px] h-full flex flex-col hover:border-[#C8DC2E]/40 hover:shadow-[0_4px_20px_rgba(23,46,34,0.08)] transition-all duration-300">
                      <div className="text-[#172E22] text-[12px] tracking-[3px] mb-[14px]">{rStars}</div>
                      {r.comment && (
                        <p className="text-[#5A6B60] text-[13px] leading-[1.75] mb-[22px] flex-1">&ldquo;{r.comment}&rdquo;</p>
                      )}
                      <div className="flex items-center gap-3 mt-auto">
                        <div
                          className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-[13px] font-bold text-white shrink-0"
                          style={{ background: BG_COLORS[i % BG_COLORS.length] }}
                        >
                          {initial}
                        </div>
                        <div>
                          <div className="text-[13px] font-semibold text-[#172E22]">{r.user_name ?? 'Cliente'}</div>
                          <div className="text-[11px] text-[#5A6B60] mt-0.5">{date}</div>
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </div>
              );
            })}
          </div>

          {/* Dots de navegación */}
          {displayReviews.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              {displayReviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  className={`transition-all duration-300 rounded-full ${
                    i === active
                      ? 'w-6 h-[6px] bg-[#172E22]'
                      : 'w-[6px] h-[6px] bg-[#C4D5CA] hover:bg-[#8AB5A0]'
                  }`}
                  aria-label={`Ir a reseña ${i + 1}`}
                />
              ))}
            </div>
          )}

          {/* Hint drag — solo la primera vez */}
          <p className="text-center text-[11px] text-[#8A9C90] mt-3 tracking-[0.5px]">
            Arrastra para ver más reseñas
          </p>
        </>
      )}
    </div>
  );
}
