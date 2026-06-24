import Link from 'next/link';
import type { Reservation } from '@/types';
import StatusBadge from './StatusBadge';

interface Props {
  reservation: Reservation;
  showActions?: boolean;
}

export default function ReservationCard({ reservation, showActions = true }: Props) {
  const dateStr = new Date(reservation.date + 'T00:00:00').toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-stone-400 text-xs uppercase tracking-wider mb-1">Reserva #{reservation.id}</p>
          <p className="text-stone-100 font-medium capitalize">{dateStr}</p>
          <p className="text-amber-400 text-sm">{reservation.time} · {reservation.guests} comensal{reservation.guests !== 1 ? 'es' : ''}</p>
        </div>
        <StatusBadge status={reservation.status} />
      </div>
      {reservation.notes && (
        <p className="text-stone-400 text-sm border-t border-stone-800 pt-3">{reservation.notes}</p>
      )}
      {showActions && (
        <Link
          href={`/reservations/${reservation.id}`}
          className="text-sm text-amber-400 hover:text-amber-300 transition-colors"
        >
          Ver detalle →
        </Link>
      )}
    </div>
  );
}
