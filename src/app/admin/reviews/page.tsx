'use client';

import { useEffect, useState } from 'react';
import { reviewsApi } from '@/lib/api';
import type { Review } from '@/types';
import StarRating from '@/components/StarRating';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [starFilter, setStarFilter] = useState(0);

  useEffect(() => {
    reviewsApi.list()
      .then((data) => setReviews(data.reviews ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '—';
  const counts = [5, 4, 3, 2, 1].map(s => ({ star: s, n: reviews.filter(r => r.rating === s).length }));

  const filtered = reviews.filter(r => {
    if (starFilter && r.rating !== starFilter) return false;
    if (search) {
      const name = (r.user_name ?? '').toLowerCase();
      const comment = (r.comment ?? '').toLowerCase();
      if (!name.includes(search.toLowerCase()) && !comment.includes(search.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-[#C4D5CA] rounded-card p-5">
          <p className="text-[#5A6B60] text-[10px] font-bold uppercase tracking-[2px] mb-1 font-body">Valoración media</p>
          <p className="font-heading font-bold text-[30px] text-[#B07010]">{avg}</p>
        </div>
        <div className="bg-white border border-[#C4D5CA] rounded-card p-5">
          <p className="text-[#5A6B60] text-[10px] font-bold uppercase tracking-[2px] mb-1 font-body">Total reseñas</p>
          <p className="font-heading font-bold text-[30px] text-[#172E22]">{reviews.length}</p>
        </div>
        <div className="bg-white border border-[#C4D5CA] rounded-card p-5">
          <p className="text-[#5A6B60] text-[10px] font-bold uppercase tracking-[2px] mb-3 font-body">Por estrella</p>
          <div className="space-y-1">
            {counts.map(({ star, n }) => (
              <div key={star} className="flex items-center gap-2 text-xs">
                <span className="text-[#B07010] w-4">{star}★</span>
                <div className="flex-1 bg-[#E2ECE6] rounded-full h-1.5">
                  <div
                    className="bg-[#172E22] h-1.5 rounded-full"
                    style={{ width: reviews.length ? `${(n / reviews.length) * 100}%` : '0%' }}
                  />
                </div>
                <span className="text-[#5A6B60] w-3">{n}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-3 flex-wrap">
        <input
          type="text"
          placeholder="Buscar por nombre o comentario..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] border border-[#C4D5CA] rounded-btn px-4 py-2 text-sm text-[#172E22] focus:outline-none focus:border-[#172E22] bg-white"
        />
        <div className="flex gap-1">
          {[0, 5, 4, 3, 2, 1].map(s => (
            <button
              key={s}
              onClick={() => setStarFilter(s)}
              className="px-3 py-2 rounded-btn text-sm border transition-colors"
              style={{
                background: starFilter === s ? '#172E22' : 'white',
                color: starFilter === s ? '#C8DC2E' : '#5A6B60',
                borderColor: starFilter === s ? '#172E22' : '#C4D5CA',
              }}
            >
              {s === 0 ? 'Todas' : `${s}★`}
            </button>
          ))}
        </div>
      </div>

      {/* Lista */}
      {loading ? (
        <p className="text-[#5A6B60] text-sm">Cargando reseñas...</p>
      ) : filtered.length === 0 ? (
        <p className="text-[#5A6B60] text-sm">No hay reseñas todavía.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map(review => (
            <div
              key={review.id}
              className="bg-white border rounded-card p-5"
              style={{ borderColor: review.rating <= 2 ? 'rgba(220,38,38,0.3)' : '#C4D5CA' }}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="font-semibold text-[#172E22] text-sm">{review.user_name ?? 'Cliente'}</p>
                  <p className="text-[#5A6B60] text-xs">Reserva #{review.reservation_id}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StarRating value={review.rating} size="sm" />
                  <span className="text-[#5A6B60] text-xs">
                    {new Date(review.created_at).toLocaleDateString('es-ES', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
              {review.comment && (
                <p className="text-[#172E22] text-sm">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
