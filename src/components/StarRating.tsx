interface Props {
  value: number;
  max?: number;
  onChange?: (v: number) => void;
  size?: 'sm' | 'md' | 'lg';
  onDark?: boolean;
}

export default function StarRating({ value, max = 5, onChange, size = 'md', onDark = false }: Props) {
  const px = { sm: '14px', md: '18px', lg: '28px' };
  const filled = onDark ? '#C8DC2E' : '#B07010';
  const empty  = onDark ? '#4A6A58'  : '#C4D5CA';

  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange?.(i + 1)}
          style={{
            fontSize: px[size],
            color: i < value ? filled : empty,
            lineHeight: 1,
            cursor: onChange ? 'pointer' : 'default',
            background: 'none',
            border: 'none',
            padding: 0,
            transition: 'color 0.15s',
          }}
          aria-label={`${i + 1} estrellas`}
        >
          ★
        </button>
      ))}
    </span>
  );
}
