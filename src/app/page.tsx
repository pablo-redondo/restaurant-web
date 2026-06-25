import Link from 'next/link';
import Image from 'next/image';
import ReviewsSection from './ReviewsSection';

export default function HomePage() {
  return (
    <>
      {/* ── Hero (full-screen, se extiende detrás del navbar transparente) ── */}
      <section className="-mt-[58px] bg-[#172E22] grid md:grid-cols-[55fr_45fr] min-h-screen">
        <div className="flex flex-col justify-center px-[64px] pt-[96px] pb-20 border-r border-[#1E3020]">
          <p className="text-[#6A9A80] text-[11px] font-bold tracking-[2.5px] uppercase mb-8">
            Desde 1987 · Madrid
          </p>
          <h1 className="font-hero font-[800] text-[60px] leading-[1.05] text-white mb-6">
            Una experiencia<br />que{' '}
            <em className="not-italic text-[#C8DC2E]">no olvidarás</em>
          </h1>
          <p className="text-[#8AB5A0] text-[16px] leading-[1.65] mb-11 max-w-[380px]">
            Cocina de temporada, ingredientes de mercado y una terraza que enamora
            en cada estación del año.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link
              href="/reservations"
              className="px-[30px] py-[14px] bg-[#C8DC2E] text-[#172E22] font-bold text-[14px] rounded-[3px] hover:brightness-105 transition"
            >
              Reservar mesa →
            </Link>
            <button className="px-[30px] py-[14px] border border-white/15 text-white text-[14px] rounded-[3px] hover:bg-white/5 transition">
              Ver carta
            </button>
          </div>
        </div>
        <div className="hidden md:block relative overflow-hidden">
          <Image
            src="/hero.webp"
            alt="Interior del restaurante Marqués"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-[#172E22]/10" />
        </div>
      </section>

      {/* ── Features ── */}
      <section id="caracteristicas" className="bg-[#F0F4F0] py-[88px] px-[52px]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-[52px]">
            <p className="text-[#172E22] text-[10px] font-bold tracking-[2.5px] uppercase mb-[10px]">
              ¿Por qué Marqués?
            </p>
            <h2 className="font-heading font-bold text-[38px] tracking-[-0.5px] text-[#172E22] mb-4">
              Todo pensado para ti
            </h2>
            <p className="text-[#5A6B60] text-[15px] leading-[1.65] max-w-[460px] mx-auto">
              Reserva en segundos, elige tu rincón favorito y disfruta sin preocupaciones.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                num: '01',
                title: 'Reserva en 60 segundos',
                desc: 'Selecciona fecha, hora y mesa directamente desde la web. Sin llamadas, sin esperas.',
              },
              {
                num: '02',
                title: 'Elige tu rincón',
                desc: 'Terraza soleada o sala interior con luz tamizada. Tú decides el ambiente.',
              },
              {
                num: '03',
                title: 'Valoraciones reales',
                desc: 'Solo opinan clientes verificados. Transparencia total para que confíes antes de venir.',
              },
            ].map(({ num, title, desc }) => (
              <div key={num} className="bg-white border-t-[3px] border-t-[#C8DC2E] rounded-[4px] p-9">
                <p className="font-heading text-[11px] font-bold text-[#B07010] tracking-[1.5px] mb-[18px]">{num}</p>
                <h3 className="text-[17px] font-bold text-[#172E22] mb-[10px]">{title}</h3>
                <p className="text-[13px] text-[#5A6B60] leading-[1.65]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section id="resenas" className="bg-[#172E22] py-[88px] px-[52px]">
        <div className="max-w-5xl mx-auto">
          <p className="text-[#C8DC2E] text-[10px] font-bold tracking-[2.5px] uppercase mb-[10px]">
            Lo que dicen
          </p>
          <h2 className="font-heading font-bold text-[38px] tracking-[-0.5px] text-white mb-0">
            Nuestros clientes
          </h2>
          <ReviewsSection />
        </div>
      </section>
    </>
  );
}
