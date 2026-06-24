import Link from 'next/link';
import type { Reservation } from '@/types';
import StatusBadge from './StatusBadge';

interface Props {
  reservation: Reservation;
  showActions?: boolean;
}

export default function ReservationCard({ reservation, showActions = true }: Props) {
  const dateStr = new Date(String(reservation.date).substring(0, 10) + 'T12:00:00')
    .toLocaleDateString('es-ES', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

  return (
    <div className="bg-white border border-[#C4D5CA] rounded-card p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[#5A6B60] text-[10px] font-bold uppercase tracking-[2px] mb-1 font-body">
            Reserva #{reservation.id}
          </p>
          <p className="text-[#172E22] font-semibold capitalize">{dateStr}</p>
          <p className="text-[#B07010] text-sm mt-0.5">
            {reservation.time} · {reservation.guests} comensal{reservation.guests !== 1 ? 'es' : ''}
          </p>
        </div>
        <StatusBadge status={reservation.status} />
      </div>
      {reservation.notes && (
        <p className="text-[#5A6B60] text-sm border-t border-[#C4D5CA] pt-3">{reservation.notes}</p>
      )}
      {showActions && (
        <Link
          href={`/reservations/${reservation.id}`}
          className="text-sm text-[#172E22] font-medium hover:text-[#1A3D2D] transition-colors"
        >
          Ver detalle →
        </Link>
      )}
    </div>
  );
}
