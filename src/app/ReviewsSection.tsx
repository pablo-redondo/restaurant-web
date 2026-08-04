'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { reviewsApi } from '@/lib/api';
import type { Review } from '@/types';
import AnimateIn from '@/components/AnimateIn';

const TIMEOUT_MS   = 5000;
const PER_PAGE     = 3;      // reseñas visibles a la vez
const ROTATE_MS    = 10000;  // cada cuánto pasa a las siguientes

type Status = 'loading' | 'done' | 'empty';

/** Estrellas decorativas. El valor real se expone aparte como texto accesible. */
function Stars({ rating, className = '' }: { rating: number; className?: string }) {
  const filled = Math.min(5, Math.max(0, Math.round(rating)));
  return (
    <span aria-hidden="true" className={`inline-flex gap-[3px] ${className}`}>
      {[0, 1, 2, 3, 4].map(i => (
        <span key={i} className={i < filled ? 'text-[#8A9C1E]' : 'text-[#C9D2C6]'}>★</span>
      ))}
    </span>
  );
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avg,     setAvg]     = useState<number | null>(null);
  const [total,   setTotal]   = useState<number | null>(null);
  const [status,  setStatus]  = useState<Status>('loading');
  const [page,    setPage]    = useState(0);
  const [paused,  setPaused]  = useState(false);

  useEffect(() => {
    let cancelled = false;

    // Si el API tarda más de 5s, desaparecer limpiamente
    const timer = setTimeout(() => {
      if (!cancelled) setStatus('empty');
    }, TIMEOUT_MS);

    reviewsApi.list({ limit: 9 })
      .then(({ reviews, average_rating, total }) => {
        if (cancelled) return;
        clearTimeout(timer);
        if (reviews.length > 0) {
          setReviews(reviews);
          setAvg(average_rating !== null ? Number(average_rating) : null);
          setTotal(total ?? null);
          setStatus('done');
        } else {
          setStatus('empty');
        }
      })
      .catch(() => {
        if (!cancelled) { clearTimeout(timer); setStatus('empty'); }
      });

    return () => { cancelled = true; clearTimeout(timer); };
  }, []);

  // Grupos de 3: cada uno es una "diapositiva" del carrusel.
  const pages = useMemo(() => {
    const out: Review[][] = [];
    for (let i = 0; i < reviews.length; i += PER_PAGE) out.push(reviews.slice(i, i + PER_PAGE));
    return out;
  }, [reviews]);

  const hasCarousel = pages.length > 1;

  // Rotación automática. Se detiene al pasar el ratón o al enfocar con teclado,
  // y se desactiva si el usuario pide movimiento reducido.
  const pagesLen = pages.length;
  useEffect(() => {
    if (!hasCarousel || paused) return;
    if (typeof window !== 'undefined' &&
        window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    const id = setInterval(() => setPage(p => (p + 1) % pagesLen), ROTATE_MS);
    return () => clearInterval(id);
  }, [hasCarousel, paused, pagesLen]);

  // Sin reseñas o timeout → ocultar la sección entera (cabecera incluida).
  if (status === 'empty') return null;

  if (status === 'loading') {
    return (
      <section className="bg-[#F1EFE9] px-5 sm:px-8 lg:px-[52px] py-12">
        <div className="max-w-[1120px] mx-auto flex items-center gap-3 text-[#8A9C90] text-[13px]">
          <span className="flex gap-1 items-center" aria-hidden="true">
            {[0, 1, 2].map(i => (
              <span
                key={i}
                className="w-[5px] h-[5px] rounded-full bg-[#B8CCBF] inline-block animate-pulse"
                style={{ animationDelay: `${i * 180}ms` }}
              />
            ))}
          </span>
          <span>Cargando reseñas…</span>
        </div>
      </section>
    );
  }

  // Sin carrusel, la rejilla se ajusta al número real para no dejar huecos.
  const visible = pages[0] ?? [];
  const gridCols = hasCarousel || visible.length >= 3
    ? 'sm:grid-cols-3'
    : visible.length === 2
      ? 'sm:grid-cols-2 max-w-[740px] mx-auto'
      : 'max-w-[560px] mx-auto';

  const renderCard = (r: Review, i: number) => {
    const initial = r.user_name ? r.user_name.charAt(0).toUpperCase() : '?';
    const date    = new Date(r.created_at).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

    return (
      <figure
        key={r.id}
        className="relative h-full flex flex-col bg-white rounded-[14px] overflow-hidden border border-[#E3E0D6] p-6 group transition-all duration-300 hover:border-[#C8DC2E]/60 hover:shadow-[0_16px_34px_rgba(23,46,34,0.10)] hover:-translate-y-1"
        style={{ transitionDelay: `${i * 40}ms` }}
      >
        {/* Barra lima al hover — mismo patrón que las tarjetas de la carta */}
        <span
          aria-hidden="true"
          className="absolute top-0 left-0 right-0 h-[3px] bg-[#C8DC2E] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"
        />
        <Stars rating={r.rating} className="text-[13px] tracking-[1px] mb-4" />
        <span className="sr-only">{r.rating} de 5 estrellas.</span>

        {r.comment && (
          <blockquote className="text-[#2E4636] text-[14px] leading-[1.7] mb-5 flex-1 line-clamp-4">
            &ldquo;{r.comment}&rdquo;
          </blockquote>
        )}

        <figcaption className="flex items-center gap-3 mt-auto pt-4 border-t border-[#EFEDE5]">
          <span className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-heading font-bold text-[#C8DC2E] bg-[#172E22] shrink-0">
            {initial}
          </span>
          <span className="min-w-0">
            <span className="block text-[13.5px] font-semibold text-[#172E22] truncate">
              {r.user_name ?? 'Cliente'}
            </span>
            <span className="block text-[11px] text-[#8A9E90] mt-0.5 capitalize">{date}</span>
          </span>
        </figcaption>
      </figure>
    );
  };

  return (
    <section className="relative bg-[#F1EFE9] px-5 sm:px-8 lg:px-[52px] py-14 sm:py-[68px] overflow-hidden">
      {/* Halo lima muy sutil: rompe la planitud del fondo sin robar protagonismo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -right-24 w-[380px] h-[380px] rounded-full opacity-[0.16]"
        style={{ background: 'radial-gradient(circle, #C8DC2E 0%, transparent 68%)' }}
      />

      <div className="relative max-w-[1120px] mx-auto">
        {/* ── Cabecera compacta: titular a la izquierda, nota media a la derecha ── */}
        <AnimateIn className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5 mb-9">
          <div>
            <p className="text-[#172E22] text-[10px] font-bold tracking-[2.5px] uppercase mb-2.5">Lo que dicen</p>
            <h2 className="font-heading font-bold text-[clamp(28px,3vw,38px)] tracking-[-0.5px] text-[#172E22] leading-[1.1]">
              Nuestros clientes
            </h2>
          </div>

          {avg !== null && (
            <div className="flex items-center gap-3.5">
              <p className="font-heading font-bold text-[40px] leading-none text-[#172E22] tabular-nums">
                {avg.toFixed(1)}
              </p>
              <div className="leading-tight">
                <Stars rating={avg} className="text-[13px] tracking-[1px]" />
                <p className="text-[#5A6B60] text-[12.5px] mt-1.5">
                  <span className="sr-only">Valoración media {avg.toFixed(1)} sobre 5. </span>
                  {total !== null
                    ? `Sobre ${total} ${total === 1 ? 'reseña verificada' : 'reseñas verificadas'}`
                    : 'Reseñas verificadas'}
                </p>
              </div>
            </div>
          )}
        </AnimateIn>

        {/* ── Reseñas ── */}
        <AnimateIn delay={120}>
          {hasCarousel ? (
            <div
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onFocusCapture={() => setPaused(true)}
              onBlurCapture={() => setPaused(false)}
            >
              <div
                className="overflow-hidden"
                role="region"
                aria-roledescription="carrusel"
                aria-label="Reseñas de clientes"
              >
                <div
                  className="flex transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
                  style={{ transform: `translateX(-${page * 100}%)` }}
                >
                  {pages.map((group, gi) => (
                    <div
                      key={gi}
                      className="w-full shrink-0 grid sm:grid-cols-3 gap-4 items-stretch"
                      aria-hidden={gi !== page}
                    >
                      {group.map(renderCard)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Paginación: además de indicar, permite saltar de grupo */}
              <div className="flex justify-center items-center gap-2.5 mt-7">
                {pages.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPage(i)}
                    aria-label={`Ver reseñas ${i * PER_PAGE + 1} a ${Math.min((i + 1) * PER_PAGE, reviews.length)}`}
                    aria-current={i === page}
                    className={`h-[6px] rounded-full transition-all duration-300 hover:bg-[#8A9C1E] ${
                      i === page ? 'w-7 bg-[#172E22]' : 'w-[6px] bg-[#C2C9BE]'
                    }`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className={`grid gap-4 items-stretch ${gridCols}`}>
              {visible.map(renderCard)}
            </div>
          )}
        </AnimateIn>
      </div>
    </section>
  );
}
