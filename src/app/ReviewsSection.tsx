'use client';
import { useEffect, useState } from 'react';
import { reviewsApi } from '@/lib/api';
import type { Review } from '@/types';
import AnimateIn from '@/components/AnimateIn';

const AVATARS = ['#2A4A38', '#1A3050', '#3A3020', '#172E22', '#402028', '#1A2A40'];

function SkeletonCard() {
  return (
    <div className="bg-white border border-[#E8EDE8] rounded-[4px] p-6 animate-pulse">
      <div className="h-2.5 bg-[#DDE8E0] rounded-full w-20 mb-5" />
      <div className="space-y-2.5 mb-7">
        <div className="h-2.5 bg-[#E8F0EC] rounded-full w-full" />
        <div className="h-2.5 bg-[#E8F0EC] rounded-full w-5/6" />
        <div className="h-2.5 bg-[#E8F0EC] rounded-full w-3/4" />
        <div className="h-2.5 bg-[#EFF3F0] rounded-full w-2/3" />
      </div>
      <div className="flex items-center gap-3 pt-4 border-t border-[#EDF2EF]">
        <div className="w-9 h-9 rounded-full bg-[#DDE8E0] shrink-0" />
        <div className="space-y-2">
          <div className="h-2.5 bg-[#E8F0EC] rounded-full w-24" />
          <div className="h-2 bg-[#EFF3F0] rounded-full w-16" />
        </div>
      </div>
    </div>
  );
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avg,     setAvg]     = useState<number | null>(null);
  const [total,   setTotal]   = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reviewsApi.list({ limit: 6 })
      .then(({ reviews, average_rating, total }) => {
        setReviews(reviews);
        setAvg(average_rating !== null ? Number(average_rating) : null);
        setTotal(total ?? null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const avgRounded = avg !== null ? Math.min(5, Math.max(0, Math.round(avg))) : 5;
  const avgStars   = '★'.repeat(avgRounded) + '☆'.repeat(5 - avgRounded);

  return (
    <div>
      {/* Rating summary */}
      {loading ? (
        <div className="flex items-center gap-4 mt-3 mb-10 animate-pulse">
          <div className="h-12 w-16 bg-[#DDE8E0] rounded" />
          <div className="space-y-2">
            <div className="h-3 bg-[#E8F0EC] rounded-full w-28" />
            <div className="h-2.5 bg-[#EFF3F0] rounded-full w-40" />
          </div>
        </div>
      ) : (
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
      )}

      {/* Grid de reseñas */}
      {loading ? (
        <div className="grid md:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-[#5A6B60] text-center py-14 text-[15px]">
          Aún no hay reseñas disponibles.
        </p>
      ) : (
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
