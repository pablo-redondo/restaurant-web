import Image from 'next/image';
import Link from 'next/link';

const values = [
  {
    num: '01',
    title: 'Respeto al producto',
    desc: 'Cada ingrediente es seleccionado a diario en los mercados de Madrid. Trabajamos con productores locales y de temporada, porque la mejor cocina empieza antes de encender los fogones.',
  },
  {
    num: '02',
    title: 'Técnica al servicio del sabor',
    desc: 'No cocinamos para impresionar, cocinamos para emocionar. La técnica existe para realzar el producto, nunca para ocultarlo. Sencillez elaborada con años de oficio.',
  },
  {
    num: '03',
    title: 'Hospitalidad de verdad',
    desc: 'Un restaurante es, ante todo, un lugar donde la gente se siente bien. Nuestro equipo cuida cada detalle para que cada visita sea memorable, desde la primera copa hasta los postres.',
  },
];

const milestones = [
  { year: '1987', text: 'Alejandro Marqués abre una taberna de 20 cubiertos en Malasaña con una carta de 8 platos.' },
  { year: '1998', text: 'Traslado al local actual en Gran Vía. Reforma del espacio y apertura de la bodega privada.' },
  { year: '2008', text: 'Diego Marqués, segunda generación, se incorpora a la cocina tras formarse en Lyon y San Sebastián.' },
  { year: '2015', text: 'Primera distinción Bib Gourmand Michélin. La carta de temporada se convierte en seña de identidad.' },
  { year: '2019', text: 'Apertura de la terraza interior y la sala privada para eventos. 120 comensales y lista de espera.' },
  { year: '2024', text: 'Nuevo proyecto digital y carta renovada. Sigue siendo un restaurante familiar, como el primer día.' },
];

export default function NosotrosPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ height: '70vh', minHeight: '480px' }}>
        <Image
          src="/hero.webp"
          alt="Interior del restaurante Marqués"
          fill
          className="object-cover"
          style={{ objectPosition: 'center 30%' }}
          priority
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, rgba(14,28,18,0.90) 0%, rgba(14,28,18,0.60) 50%, rgba(14,28,18,0.20) 100%)' }}
        />
        <div className="relative h-full flex flex-col justify-end px-[52px] pb-16">
          <p className="text-[#C8DC2E] text-[11px] font-bold tracking-[2.5px] uppercase mb-4">Desde 1987</p>
          <h1 className="font-hero font-[800] text-[72px] leading-[1.0] text-white mb-4">
            Nuestra historia
          </h1>
          <p className="text-[#B8D8C8] text-[17px] leading-[1.7] max-w-[480px]">
            Casi cuatro décadas sirviendo Madrid con la misma pasión y los mismos valores
            con los que empezamos.
          </p>
        </div>
      </section>

      {/* Historia + timeline */}
      <section className="bg-[#F0F4F0] px-[52px] py-[88px]">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[1fr_1fr] gap-20 items-start">

          {/* Texto */}
          <div>
            <p className="text-[#172E22] text-[10px] font-bold tracking-[2.5px] uppercase mb-4">La historia</p>
            <h2 className="font-heading font-bold text-[38px] leading-[1.1] tracking-[-0.5px] text-[#172E22] mb-6">
              Un restaurante familiar desde el primer día
            </h2>
            <p className="text-[#5A6B60] text-[15px] leading-[1.75] mb-5">
              En 1987, Alejandro Marqués abrió una pequeña taberna en el barrio de Malasaña con
              veinte sillas, una carta de ocho platos y la convicción de que la cocina honesta
              siempre tiene cabida en Madrid.
            </p>
            <p className="text-[#5A6B60] text-[15px] leading-[1.75] mb-5">
              Once años después, el local de Gran Vía pasó a ser nuestro hogar. Un espacio
              que hemos ido construyendo despacio, con materiales nobles, sin prisas y con
              el mismo carácter de siempre.
            </p>
            <p className="text-[#5A6B60] text-[15px] leading-[1.75]">
              Hoy somos dos generaciones en la cocina. Diego Marqués, formado en Lyon
              y San Sebastián, aporta técnica y viaje a una cocina que nunca ha olvidado
              sus raíces: el producto, la temporada y el respeto.
            </p>
          </div>

          {/* Timeline */}
          <div className="space-y-0">
            {milestones.map((m, i) => (
              <div key={m.year} className="flex gap-6 pb-8 relative">
                {i < milestones.length - 1 && (
                  <div className="absolute left-[19px] top-[28px] bottom-0 w-px bg-[#C4D5CA]" />
                )}
                <div className="shrink-0 w-10 h-10 rounded-full bg-[#172E22] flex items-center justify-center z-10">
                  <div className="w-2 h-2 rounded-full bg-[#C8DC2E]" />
                </div>
                <div>
                  <p className="font-heading font-bold text-[13px] text-[#C8A020] tracking-[1px] uppercase mb-1">{m.year}</p>
                  <p className="text-[#5A6B60] text-[14px] leading-[1.65]">{m.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Imagen interior */}
      <section className="relative overflow-hidden" style={{ height: '440px' }}>
        <Image
          src="/hero.webp"
          alt="Salón del restaurante Marqués"
          fill
          className="object-cover"
          style={{ objectPosition: 'center 70%' }}
        />
        <div className="absolute inset-0" style={{ background: 'rgba(14,28,18,0.45)' }} />
        <div className="relative h-full flex items-center px-[52px]">
          <blockquote className="max-w-[600px]">
            <p className="font-hero font-[800] text-[36px] leading-[1.15] text-white mb-4">
              &ldquo;Cocinar bien es dar lo mejor de uno mismo en cada plato.
              No hay otra fórmula.&rdquo;
            </p>
            <cite className="text-[#C8DC2E] text-[12px] font-bold tracking-[2px] uppercase not-italic">
              Alejandro Marqués, fundador
            </cite>
          </blockquote>
        </div>
      </section>

      {/* Filosofía */}
      <section className="bg-[#172E22] px-[52px] py-[88px]">
        <div className="max-w-5xl mx-auto">
          <p className="text-[#C8DC2E] text-[10px] font-bold tracking-[2.5px] uppercase mb-4">Cómo cocinamos</p>
          <h2 className="font-heading font-bold text-[38px] tracking-[-0.5px] text-white mb-14">
            Nuestra filosofía
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((v) => (
              <div key={v.num} className="border-t border-white/10 pt-6">
                <p className="font-heading text-[11px] font-bold text-[#C8DC2E] tracking-[1.5px] mb-4 uppercase">{v.num}</p>
                <h3 className="font-heading font-bold text-[20px] text-white mb-3">{v.title}</h3>
                <p className="text-[#6A9A80] text-[14px] leading-[1.7]">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* El espacio */}
      <section className="bg-[#F0F4F0] px-[52px] py-[88px]">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[56fr_44fr] gap-16 items-center">
          <div className="relative overflow-hidden rounded-[4px]" style={{ height: '460px' }}>
            <Image
              src="/hero.webp"
              alt="El salón de Marqués"
              fill
              className="object-cover"
              style={{ objectPosition: 'right 20%' }}
            />
          </div>
          <div>
            <p className="text-[#172E22] text-[10px] font-bold tracking-[2.5px] uppercase mb-4">El espacio</p>
            <h2 className="font-heading font-bold text-[34px] leading-[1.15] tracking-[-0.5px] text-[#172E22] mb-6">
              Un lugar pensado para disfrutar
            </h2>
            <div className="space-y-4 text-[#5A6B60] text-[15px] leading-[1.75]">
              <p>120 comensales en un salón de techos altos, iluminado con lámparas de cristal soplado y revestido en madera de nogal.</p>
              <p>Una bodega privada para grupos y celebraciones con capacidad para 18 personas y acceso directo a nuestra cava de vinos.</p>
              <p>Terraza interior climatizada disponible de marzo a octubre, con entrada propia desde la calle.</p>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { n: '120', l: 'Comensales' },
                { n: '200+', l: 'Referencias\nde vino' },
                { n: '18', l: 'Sala privada' },
              ].map((s) => (
                <div key={s.n} className="border-t-2 border-[#C8DC2E] pt-4">
                  <p className="font-heading font-bold text-[24px] text-[#172E22]">{s.n}</p>
                  <p className="text-[11px] text-[#5A6B60] font-bold tracking-[1px] uppercase mt-1" style={{ whiteSpace: 'pre-line' }}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#172E22] px-[52px] py-16">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="font-heading font-bold text-[28px] text-white mb-2">Ven a conocernos</h2>
            <p className="text-[#6A9A80] text-[15px]">Calle Gran Vía, 45 · Madrid · Lunes a domingo, 13:00†22:30 h</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link
              href="/reservations"
              className="px-[28px] py-[13px] bg-[#C8DC2E] text-[#172E22] font-bold text-[14px] rounded-[3px] hover:brightness-105 transition"
            >
              Reservar mesa →
            </Link>
            <Link
              href="/carta"
              className="px-[28px] py-[13px] border border-white/15 text-white text-[14px] rounded-[3px] hover:bg-white/5 transition"
            >
              Ver carta
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
