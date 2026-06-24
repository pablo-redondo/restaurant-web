import Link from 'next/link';
import ReviewsSection from './ReviewsSection';

export default function HomePage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="min-h-[86vh] bg-[#172E22] flex items-center">
        <div className="max-w-6xl mx-auto px-8 md:px-14 w-full grid md:grid-cols-[55fr_45fr] gap-16 items-center py-20">
          <div>
            <p className="text-[#C8DC2E] text-[11px] font-bold tracking-[2.5px] uppercase font-body mb-5">
              Madrid · Desde 1987
            </p>
            <h1 className="font-hero text-[60px] leading-[1.0] font-[800] text-white mb-6">
              ALTA COCINA<br />ESPAÑOLA EN<br />EL CORAZÓN<br />DE MADRID
            </h1>
            <p className="text-[#A8CCBA] text-[15px] leading-relaxed mb-10 max-w-md font-body">
              Carta de temporada, producto local y una sala íntima donde la gastronomía
              y el silencio conviven. Dos soles Repsol desde 2011.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link
                href="/reservations"
                className="px-6 py-3 rounded-btn bg-[#C8DC2E] text-[#172E22] font-semibold text-sm font-body hover:brightness-105 transition"
              >
                Reservar mesa
              </Link>
              <Link
                href="#caracteristicas"
                className="px-6 py-3 rounded-btn border border-[rgba(255,255,255,0.15)] text-white text-sm font-body hover:bg-white/5 transition"
              >
                Conoce más
              </Link>
            </div>
          </div>

          <div className="hidden md:block h-[460px] rounded-card overflow-hidden bg-[#0A160F]">
            <img
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=85"
              alt="Sala Marqués"
              className="w-full h-full object-cover opacity-80"
            />
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="caracteristicas" className="bg-[#F0F4F0] py-[88px] px-[52px]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#5A6B60] text-[11px] font-bold tracking-[2.5px] uppercase font-body mb-3">
              Por qué Marqués
            </p>
            <h2 className="font-heading font-bold text-[38px] tracking-[-0.5px] text-[#172E22] mb-4">
              Tres décadas de excelencia
            </h2>
            <p className="text-[#5A6B60] text-[15px] max-w-lg mx-auto">
              Fundado en 1987, Marqués ha sido durante treinta años referente de la alta cocina
              madrileña.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                num: '01',
                title: 'Producto de temporada',
                desc: 'Trabajamos con productores locales. La carta cambia cada semana según lo que el mercado nos ofrece en su mejor momento.',
              },
              {
                num: '02',
                title: 'Bodega propia',
                desc: 'Más de 400 referencias seleccionadas por nuestra sumiller. Maridajes personalizados para cada menú degustación.',
              },
              {
                num: '03',
                title: 'Experiencia íntima',
                desc: 'Solo 80 plazas. El tamaño exacto para que cada servicio reciba la atención que merece, sin excepciones.',
              },
            ].map(({ num, title, desc }) => (
              <div key={num} className="bg-white border-t-[3px] border-t-[#C8DC2E] rounded-card p-8">
                <p className="font-heading font-bold text-[#B07010] text-lg mb-3">{num}</p>
                <h3 className="font-heading font-bold text-[#172E22] text-xl mb-3">{title}</h3>
                <p className="text-[#5A6B60] text-[14px] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section id="resenas" className="bg-[#172E22] py-[88px] px-[52px]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#4A6A58] text-[11px] font-bold tracking-[2.5px] uppercase font-body mb-3">
              Opiniones
            </p>
            <h2 className="font-heading font-bold text-[38px] tracking-[-0.5px] text-white mb-4">
              Lo que dicen nuestros clientes
            </h2>
          </div>
          <ReviewsSection />
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#F0F4F0] py-20 text-center px-4">
        <p className="text-[#5A6B60] text-[11px] font-bold tracking-[2.5px] uppercase font-body mb-3">
          Reserve ahora
        </p>
        <h2 className="font-heading font-bold text-[38px] tracking-[-0.5px] text-[#172E22] mb-4">
          ¿Listo para su visita?
        </h2>
        <p className="text-[#5A6B60] mb-8 text-[15px]">
          Consulte disponibilidad en tiempo real y asegure su mesa en segundos.
        </p>
        <Link
          href="/reservations"
          className="inline-block px-8 py-3.5 rounded-btn bg-[#172E22] text-white font-semibold text-sm font-body hover:bg-[#1A3D2D] transition-colors"
        >
          Ver disponibilidad
        </Link>
      </section>
    </>
  );
}
