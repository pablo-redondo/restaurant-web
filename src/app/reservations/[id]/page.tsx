'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { reservationsApi, reviewsApi } from '@/lib/api';
import type { Reservation } from '@/types';
import StatusBadge from '@/components/StatusBadge';
import StarRating from '@/components/StarRating';

export default function ReservationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cancel
  const [cancelling, setCancelling] = useState(false);

  // Review form
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
    if (!reservation) return;
    if (!confirm('¿Cancelar esta reserva?')) return;
    setCancelling(true);
    try {
      const { reservation: updated } = await reservationsApi.update(reservation.id, { status: 'cancelled' });
      setReservation(updated);
    } catch {
      alert('Error al cancelar');
    } finally {
      setCancelling(false);
    }
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
    } finally {
      setReviewLoading(false);
    }
  };

  if (authLoading || loading) return <div className="text-center py-20 text-stone-400">Cargando...</div>;
  if (error) return <div className="text-center py-20 text-red-400">{error}</div>;
  if (!reservation) return null;

  const dateStr = new Date(reservation.date + 'T00:00:00').toLocaleDateString('es-ES', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <button onClick={() => router.back()} className="text-stone-500 hover:text-stone-300 text-sm mb-6">
        ← Volver
      </button>

      <div className="bg-stone-900 border border-stone-800 rounded-xl p-8">
        <div className="flex items-start justify-between mb-6">
          <h1 className="font-serif text-2xl">Reserva #{reservation.id}</h1>
          <StatusBadge status={reservation.status} />
        </div>

        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-stone-500">Fecha</dt>
            <dd className="capitalize text-stone-200">{dateStr}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-stone-500">Hora</dt>
            <dd className="text-stone-200">{reservation.time}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-stone-500">Comensales</dt>
            <dd className="text-stone-200">{reservation.guests}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-stone-500">Mesa</dt>
            <dd className="text-stone-200">#{reservation.table_id}</dd>
          </div>
          {reservation.notes && (
            <div className="pt-3 border-t border-stone-800">
              <dt className="text-stone-500 mb-1">Notas</dt>
              <dd className="text-stone-300">{reservation.notes}</dd>
            </div>
          )}
        </dl>

        {reservation.status !== 'cancelled' && (
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="mt-8 w-full py-2.5 border border-red-800 text-red-400 rounded-lg hover:bg-red-900/30 disabled:opacity-50 transition-colors text-sm"
          >
            {cancelling ? 'Cancelando...' : 'Cancelar reserva'}
          </button>
        )}
      </div>

      {/* Review form — only for confirmed reservations */}
      {reservation.status === 'confirmed' && (
        <div className="mt-8 bg-stone-900 border border-stone-800 rounded-xl p-8">
          <h2 className="font-serif text-xl mb-5">Dejar una reseña</h2>
          {reviewDone ? (
            <p className="text-emerald-400">¡Gracias por tu valoración!</p>
          ) : (
            <form onSubmit={handleReview} className="space-y-4">
              <div>
                <label className="block text-sm text-stone-300 mb-2">Valoración</label>
                <StarRating value={rating} onChange={setRating} size="lg" />
              </div>
              <div>
                <label className="block text-sm text-stone-300 mb-1.5">Comentario (opcional)</label>
                <textarea
                  rows={3}
                  maxLength={1000}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-2.5 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 transition-colors resize-none"
                  placeholder="Cuente su experiencia..."
                />
              </div>
              {reviewError && (
                <p className="text-red-400 text-sm">{reviewError}</p>
              )}
              <button
                type="submit"
                disabled={reviewLoading || rating === 0}
                className="px-6 py-2.5 bg-amber-500 text-stone-950 font-semibold rounded-lg hover:bg-amber-400 disabled:opacity-50 transition-colors"
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
