import type { CSSProperties } from 'react';

type Status = 'pending' | 'confirmed' | 'cancelled';

const styles: Record<Status, CSSProperties> = {
  pending:   { background: 'rgba(217,119,6,0.12)',  color: '#92400E' },
  confirmed: { background: 'rgba(13,146,84,0.10)',  color: '#065F3A' },
  cancelled: { background: 'rgba(220,38,38,0.10)',  color: '#991B1B' },
};

const labels: Record<Status, string> = {
  pending:   'Pendiente',
  confirmed: 'Confirmada',
  cancelled: 'Cancelada',
};

export default function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold font-body"
      style={styles[status]}
    >
      {labels[status]}
    </span>
  );
}
