'use client';

import { useEffect, useState } from 'react';
import { reviewsApi } from '@/lib/api';
import type { Review } from '@/types';

const BG_COLORS = ['#2A4A38', '#C85A1E', '#5A4A2A', '#172E22', '#8B2020', '#1A3050'];

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avg, setAvg] = useState<number | null>(null);

  useEffect(() => {
    reviewsApi.list({ limit: 6 }).then(({ reviews, average_rating }) => {
      setReviews(reviews);
      setAvg(average_rating !== null ? Number(average_rating) : null);
    }).catch(() => {});
  }, []);

  return (
    <div>
      {/* Rating row */}
      <div className="flex items-center gap-4 mt-3 mb-11">
        <span className="font-heading font-bold text-[48px] leading-none text-[#C8DC2E]">
          {avg !== null ? avg.toFixed(1) : '—'}
        </span>
        <div className="text-[#6A9A80] text-[13px] leading-[1.6]">
          ★★★★★<br />
          Más de {reviews.length > 0 ? reviews.length : 240}+ reseñas verificadas
        </div>
      </div>

      {reviews.length === 0 ? (
        <p className="text-[#4A6A58] text-center">Aún no hay reseñas disponibles.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-[14px]">
          {reviews.slice(0, 3).map((r: Review, i: number) => {
            const initial = r.user_name ? r.user_name.charAt(0).toUpperCase() : '?';
            const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
            const date = new Date(r.created_at).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
            return (
              <div key={r.id} className="bg-white border border-white/15 rounded-[4px] p-[28px]">
                <div className="text-[#C8DC2E] text-[12px] tracking-[3px] mb-[14px]">{stars}</div>
                {r.comment && (
                  <p className="text-[#5A6B60] text-[13px] leading-[1.75] mb-[22px]">&ldquo;{r.comment}&rdquo;</p>
                )}
                <div className="flex items-center gap-3">
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
            );
          })}
        </div>
      )}
    </div>
  );
}
