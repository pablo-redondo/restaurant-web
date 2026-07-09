interface Props {
  message: string;
  onRetry: () => void;
  className?: string;
}

/**
 * Estado de error para listados que consumen la API, con opción de
 * reintentar. Se usa para distinguir "sin datos" (estado vacío legítimo)
 * de "no se pudieron cargar los datos" (fallo de red/API) — ver docs/AUDIT.md.
 */
export default function ErrorState({ message, onRetry, className = '' }: Props) {
  return (
    <div className={`text-center py-10 px-4 ${className}`}>
      <p className="text-[#991B1B] text-sm mb-4">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="px-5 py-2 rounded-btn border border-[#C4D5CA] text-[#5A6B60] text-sm font-medium hover:border-[#172E22] hover:text-[#172E22] transition-colors"
      >
        Reintentar
      </button>
    </div>
  );
}
