'use client';

import { useEffect, useState } from 'react';
import { reviewsApi } from '@/lib/api';
import type { Review } from '@/types';

function Stars({ value, onDark = false }: { value: number; onDark?: boolean }) {
  const filled = onDark ? '#C8DC2E' : '#B07010';
  const empty  = onDark ? '#4A6A58'  : '#C4D5CA';
  return (
    <span className="inline-flex gap-0.5 text-sm">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ color: i < value ? filled : empty }}>★</span>
      ))}
    </span>
  );
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avg, setAvg] = useState<number | null>(null);

  useEffect(() => {
    reviewsApi.list({ limit: 6 }).then(({ reviews, average_rating }) => {
      setReviews(reviews);
      setAvg(average_rating !== null ? Number(average_rating) : null);
    }).catch(() => {});
  }, []);

  if (!reviews.length) {
    return <p className="text-center text-[#4A6A58]">Aún no hay reseñas disponibles.</p>;
  }

  return (
    <div>
      {avg !== null && (
        <div className="text-center mb-12">
          <p className="font-heading font-bold text-[#C8DC2E] leading-none mb-2" style={{ fontSize: 72 }}>
            {avg.toFixed(1)}
          </p>
          <Stars value={Math.round(avg)} onDark />
          <p className="text-[#4A6A58] text-sm mt-2">{reviews.length}+ reseñas verificadas</p>
        </div>
      )}
      <div className="grid md:grid-cols-3 gap-4">
        {reviews.slice(0, 3).map((r) => (
          <div key={r.id} className="bg-white rounded-card p-6">
            <Stars value={r.rating} />
            {r.comment && (
              <p className="text-[#172E22] text-[14px] leading-relaxed mt-3 mb-4">“{r.comment}”</p>
            )}
            <p className="text-[#172E22] text-sm font-semibold mt-3">{r.user_name ?? 'Cliente'}</p>
            <p className="text-[#5A6B60] text-xs mt-0.5">
              {new Date(r.created_at).toLocaleDateString('es-ES')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
