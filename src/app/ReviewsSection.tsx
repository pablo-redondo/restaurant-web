'use client';

import { useEffect, useState } from 'react';
import { reviewsApi } from '@/lib/api';
import type { Review } from '@/types';
import StarRating from '@/components/StarRating';

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avg, setAvg] = useState<number | null>(null);

  useEffect(() => {
    reviewsApi.list({ limit: 6 }).then(({ reviews, average_rating }) => {
      setReviews(reviews);
      setAvg(average_rating);
    }).catch(() => {});
  }, []);

  if (!reviews.length) {
    return <p className="text-center text-stone-500">Aún no hay reseñas disponibles.</p>;
  }

  return (
    <div className="space-y-6">
      {avg !== null && (
        <div className="flex items-center justify-center gap-3 mb-8">
          <StarRating value={Math.round(avg)} size="lg" />
          <span className="text-amber-400 text-2xl font-serif">{avg.toFixed(1)}</span>
          <span className="text-stone-500">/ 5</span>
        </div>
      )}
      <div className="grid md:grid-cols-2 gap-4">
        {reviews.map((r) => (
          <div key={r.id} className="bg-stone-900 border border-stone-800 rounded-xl p-5">
            <StarRating value={r.rating} size="sm" />
            {r.comment && <p className="text-stone-300 mt-3 text-sm leading-relaxed">“{r.comment}”</p>}
            <p className="text-stone-600 text-xs mt-3">
              {new Date(r.created_at).toLocaleDateString('es-ES')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
