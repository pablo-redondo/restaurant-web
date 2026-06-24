interface Props {
  value: number;
  max?: number;
  onChange?: (v: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

export default function StarRating({ value, max = 5, onChange, size = 'md' }: Props) {
  const sizes = { sm: 'text-base', md: 'text-xl', lg: 'text-3xl' };

  return (
    <span className={`inline-flex gap-0.5 ${sizes[size]}`}>
      {Array.from({ length: max }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange?.(i + 1)}
          className={`leading-none transition-colors ${
            i < value ? 'text-amber-400' : 'text-stone-600'
          } ${onChange ? 'cursor-pointer hover:text-amber-300' : 'cursor-default'}`}
          aria-label={`${i + 1} estrellas`}
        >
          ★
        </button>
      ))}
    </span>
  );
}
