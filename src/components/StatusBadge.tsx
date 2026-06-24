type Status = 'pending' | 'confirmed' | 'cancelled';

const styles: Record<Status, string> = {
  pending: 'bg-yellow-900/50 text-yellow-300 border border-yellow-700',
  confirmed: 'bg-emerald-900/50 text-emerald-300 border border-emerald-700',
  cancelled: 'bg-red-900/50 text-red-300 border border-red-700',
};

const labels: Record<Status, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  cancelled: 'Cancelada',
};

export default function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
