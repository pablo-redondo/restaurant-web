'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { reservationsApi, reviewsApi } from '@/lib/api';
import type { Reservation } from '@/types';
import StatusBadge from '@/components/StatusBadge';
import StarRating from '@/components/StarRating';
import BackButton from '@/components/BackButton';

export default function ReservationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewDone, setReviewDone] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) { router.push('/login'); return; }
    if (!user) return;
    reservationsApi.get(Number(id))
      .then(({ reservation }) => setReservation(reservation))
      .catch((e) => setError(e?.error ?? 'No encontrado'))
      .finally(() => setLoading(false));
  }, [id, user, authLoading, router]);

  const handleCancel = async () => {
    if (!reservation || !confirm('¿Cancelar esta reserva?')) return;
    setCancelling(true);
    try {
      const { reservation: updated } = await reservationsApi.update(reservation.id, { status: 'cancelled' });
      setReservation(updated);
    } catch { alert('Error al cancelar'); }
    finally { setCancelling(false); }
  };

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reservation || rating === 0) return;
    setReviewLoading(true);
    setReviewError('');
    try {
      await reviewsApi.create({ reservation_id: reservation.id, rating, comment: comment || undefined });
      setReviewDone(true);
    } catch (err: unknown) {
      const e = err as { error?: string };
      setReviewError(e?.error ?? 'Error al enviar la reseña');
    } finally { setReviewLoading(false); }
  };

  if (authLoading || loading) {
    return <div className="text-center py-20 text-[#5A6B60]">Cargando...</div>;
  }
  if (error) return <div className="text-center py-20 text-[#991B1B]">{error}</div>;
  if (!reservation) return null;

  const dateStr = new Date(String(reservation.date).substring(0, 10) + 'T12:00:00')
    .toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <BackButton onClick={() => router.back()} className="mb-6" />

      <div className="bg-white border border-[#C4D5CA] rounded-card p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-[#5A6B60] text-[10px] font-bold uppercase tracking-[2px] mb-1 font-body">Reserva</p>
            <h1 className="font-heading font-bold text-2xl text-[#172E22]">#{reservation.id}</h1>
          </div>
          <StatusBadge status={reservation.status} />
        </div>

        <dl className="space-y-3 text-sm">
          {[
            { label: 'Fecha', value: <span className="capitalize">{dateStr}</span> },
            { label: 'Hora', value: reservation.time },
            { label: 'Comensales', value: reservation.guests },
            { label: 'Mesa', value: `#${reservation.table_id}` },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between">
              <dt className="text-[#5A6B60]">{label}</dt>
              <dd className="text-[#172E22] font-medium">{value}</dd>
            </div>
          ))}
          {reservation.notes && (
            <div className="pt-3 border-t border-[#C4D5CA]">
              <dt className="text-[#5A6B60] mb-1">Notas</dt>
              <dd className="text-[#172E22]">{reservation.notes}</dd>
            </div>
          )}
        </dl>

        {reservation.status !== 'cancelled' && (
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="mt-8 w-full py-2.5 rounded-btn border border-[rgba(220,38,38,0.3)] text-[#991B1B] hover:bg-[rgba(220,38,38,0.05)] disabled:opacity-50 transition-colors text-sm"
          >
            {cancelling ? 'Cancelando...' : 'Cancelar reserva'}
          </button>
        )}
      </div>

      {reservation.status === 'confirmed' && (
        <div className="mt-6 bg-white border border-[#C4D5CA] rounded-card p-8">
          <h2 className="font-heading font-bold text-xl text-[#172E22] mb-5">
            {reservation.review_id ? 'Tu reseña' : 'Dejar una reseña'}
          </h2>
          {reviewDone ? (
            <p className="text-[#1A8A50] font-medium">¡Gracias por tu valoración!</p>
          ) : reservation.review_id ? (
            <div className="space-y-3">
              <StarRating value={reservation.review_rating ?? 0} size="lg" />
              {reservation.review_comment && (
                <p className="text-[#3F5A4B] text-[15px] leading-[1.7]">{reservation.review_comment}</p>
              )}
              <p className="text-[#8A9C90] text-[13px]">Ya has valorado esta visita. Solo se admite una reseña por reserva.</p>
            </div>
          ) : (
            <form onSubmit={handleReview} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#5A6B60] uppercase tracking-[2px] mb-2 font-body">Valoración</label>
                <StarRating value={rating} onChange={setRating} size="lg" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#5A6B60] uppercase tracking-[2px] mb-2 font-body">Comentario (opcional)</label>
                <textarea
                  rows={3}
                  maxLength={1000}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full border border-[#C4D5CA] rounded-btn px-4 py-3 text-[#172E22] text-[14px] placeholder-[#C4D5CA] focus:outline-none focus:border-[#172E22] transition-colors resize-none"
                  placeholder="Cuente su experiencia..."
                />
              </div>
              {reviewError && <p className="text-[#991B1B] text-sm">{reviewError}</p>}
              <button
                type="submit"
                disabled={reviewLoading || rating === 0}
                className="px-6 py-2.5 rounded-btn bg-[#172E22] text-white font-semibold text-sm hover:bg-[#1A3D2D] disabled:opacity-50 transition-colors"
              >
                {reviewLoading ? 'Enviando...' : 'Enviar reseña'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
