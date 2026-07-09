'use client';

import { useEffect, useState } from 'react';
import { reviewsApi } from '@/lib/api';
import type { Review } from '@/types';

const BG_COLORS = ['#2A4A38', '#172E22', '#5A4A2A', '#C85A1E', '#8B2020', '#1A3050'];
const STAR_FILTERS = ['Todas', '┅5', '★ 4', '★ 3', '★ 1-2'] as const;
type StarFilter = typeof STAR_FILTERS[number];

export default function AdminReviewsPage() {
  const [reviews,    setReviews]    = useState<Review[]>([]);
  const [avg,        setAvg]        = useState<number | null>(null);
  const [total,      setTotal]      = useState(0);
  const [loading,    setLoading]    = useState(true);
  const [starFilter, setStarFilter] = useState<StarFilter>('Todas');
  const [search,     setSearch]     = useState('');
  const [sortOrder,  setSortOrder]  = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    reviewsApi.list({ limit: 100 }).then(({ reviews, average_rating, total }) => {
      setReviews(reviews);
      setAvg(average_rating !== null ? Number(average_rating) : null);
      setTotal(total);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = reviews.filter(r => {
    if (starFilter === '┅5'   && r.rating !== 5) return false;
    if (starFilter === '★ 4'  && r.rating !== 4) return false;
    if (starFilter === '★ 3'  && r.rating !== 3) return false;
    if (starFilter === '★ 1-2' && r.rating > 2)  return false;
    if (search) {
      const q = search.toLowerCase();
      if (!(r.comment ?? '').toLowerCase().includes(q) && !(r.user_name ?? '').toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    const diff = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    return sortOrder === 'newest' ? diff : -diff;
  });

  return (
    <div>
      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3 mb-[18px]">
        {[
          { label: 'Total reseñas', value: total,                                delta: 'Reseñas verificadas', color: '#172E22' },
          { label: 'Rating medio',  value: avg !== null ? avg.toFixed(1) : '—', delta: 'Media global',       color: '#B07010' },
          { label: 'Sin responder', value: 0,                                       delta: 'Requieren atención', color: '#DC2626' },
        ].map(({ label, value, delta, color }) => (
          <div key={label} className="bg-white border border-[#C4D5CA] rounded-[4px] p-[18px_20px]">
            <div className="text-[10px] font-bold text-[#5A6B60] uppercase tracking-[0.8px] mb-[10px]">{label}</div>
            <div className="font-heading font-bold text-[30px] leading-none mb-[7px]" style={{ color }}>{value}</div>
            <div className="text-[12px] text-[#5A6B60]">{delta}</div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="bg-white border border-[#C4D5CA] rounded-[4px] p-3 px-4 mb-3 flex flex-wrap gap-2 items-center">
        <div className="flex items-center gap-1.5 bg-[#F0F4F0] border border-[#C4D5CA] rounded-[3px] px-3 py-[7px] flex-1 min-w-[160px]">
          <span aria-hidden="true" className="text-[#5A6B60]">🔍</span>
          <input
            aria-label="Buscar reseña por texto o autor"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar reseña o autor…"
            className="bg-transparent outline-none flex-1 text-[13px] text-[#172E22] placeholder-[#5A6B60]"
          />
        </div>
        <div className="flex gap-1">
          {STAR_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setStarFilter(f)}
              className={`px-3 py-[6px] rounded-[3px] text-[11px] font-bold transition-all ${
                starFilter === f
                  ? 'bg-[#172E22] text-white'
                  : 'border border-[#C4D5CA] text-[#5A6B60] hover:border-[#172E22] hover:text-[#172E22]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <select
          value={sortOrder}
          onChange={e => setSortOrder(e.target.value as 'newest' | 'oldest')}
          className="border border-[#C4D5CA] rounded-[3px] px-3 py-[7px] text-[13px] text-[#172E22] bg-white outline-none"
        >
          <option value="newest">Más recientes</option>
          <option value="oldest">Más antiguas</option>
        </select>
      </div>

      {/* Review list */}
      <div className="flex flex-col gap-3">
        {loading ? (
          <p className="text-[#5A6B60] text-sm text-center py-8">Cargando reseñas...</p>
        ) : sorted.length === 0 ? (
          <p className="text-[#5A6B60] text-sm text-center py-8">No hay reseñas.</p>
        ) : sorted.map((r: Review, i: number) => {
          const stars     = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
          const initial   = r.user_name ? r.user_name.charAt(0).toUpperCase() : '?';
          const date      = new Date(r.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
          const lowRating = r.rating <= 2;
          return (
            <div
              key={r.id}
              className="bg-white border border-[#C4D5CA] rounded-[4px] p-5"
              style={lowRating ? { borderColor: 'rgba(220,38,38,0.3)' } : {}}
            >
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <div className="text-[13px] tracking-[2px]" style={{ color: lowRating ? '#DC2626' : '#C8DC2E' }}>
                  {stars}
                </div>
                <span className="text-[10px] font-bold px-[9px] py-[3px] rounded-[2px] uppercase tracking-[0.5px] bg-[rgba(217,119,6,0.12)] text-[#92400E]">
                  Sin responder
                </span>
                <div className="ml-auto text-[11px] text-[#5A6B60]">{date}</div>
              </div>
              {r.comment && (
                <p className="text-[#5A6B60] text-[13px] leading-[1.75] mb-4">&ldquo;{r.comment}&rdquo;</p>
              )}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold text-white shrink-0"
                    style={{ background: BG_COLORS[i % BG_COLORS.length] }}
                  >
                    {initial}
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-[#172E22]">{r.user_name ?? 'Cliente'}</div>
                    <div className="text-[11px] text-[#5A6B60]">Cliente verificado</div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button className="px-2 py-1 rounded-[2px] text-[11px] font-bold bg-[rgba(13,146,84,0.1)] text-[#065F3A] hover:bg-[rgba(13,146,84,0.2)] transition">
                    ✎ Responder
                  </button>
                  <button className="px-2 py-1 rounded-[2px] text-[11px] font-bold bg-[rgba(220,38,38,0.1)] text-[#991B1B] hover:bg-[rgba(220,38,38,0.2)] transition">
                    Ocultar
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
