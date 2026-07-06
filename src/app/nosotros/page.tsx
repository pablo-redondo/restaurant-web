import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import AnimateIn from '@/components/AnimateIn';
import TextScramble from '@/components/TextScramble';
import CountUp from '@/components/CountUp';
import MagneticEl from '@/components/MagneticEl';
import ParallaxImage from '@/components/ParallaxImage';
import TiltCard from '@/components/TiltCard';
import SplitText from '@/components/SplitText';

export const metadata: Metadata = {
  title: 'Nuestra historia',
  description: 'Conoce la historia de Restaurante Marqués: casi cuatro décadas en Madrid, dos generaciones en la cocina y una filosofía construida sobre el respeto al producto y la hospitalidad genuina.',
  openGraph: {
    title: 'Nuestra historia · Restaurante Marqués',
    description: 'Desde 1987 en el corazón de Madrid. Conoce a la familia Marqués y su forma de entender la cocina.',
    url: '/nosotros',
    images: [{ url: '/hero.webp', width: 896, height: 1200, alt: 'Interior del restaurante Marqués' }],
  },
};

const values = [
  { num: '01', title: 'Respeto al producto', desc: 'Cada ingrediente es seleccionado a diario en los mercados de Madrid. Trabajamos con productores locales y de temporada, porque la mejor cocina empieza antes de encender los fogones.' },
  { num: '02', title: 'Técnica al servicio del sabor', desc: 'No cocinamos para impresionar, cocinamos para emocionar. La técnica existe para realzar el producto, nunca para ocultarlo. Sencillez elaborada con años de oficio.' },
  { num: '03', title: 'Hospitalidad de verdad', desc: 'Un restaurante es, ante todo, un lugar donde la gente se siente bien. Nuestro equipo cuida cada detalle para que cada visita sea memorable, desde la primera copa hasta los postres.' },
];

const milestones = [
  { year: '1987', text: 'Alejandro Marqués abre una taberna de 20 cubiertos en Malasaña con una carta de 8 platos.' },
  { year: '1998', text: 'Traslado al local actual en Gran Vía. Reforma del espacio y apertura de la bodega privada.' },
  { year: '2008', text: 'Diego Marqués, segunda generación, se incorpora a la cocina tras formarse en Lyon y San Sebastián.' },
  { year: '2015', text: 'Primera distinción Bib Gourmand Michélin. La carta de temporada se convierte en seña de identidad.' },
  { year: '2019', text: 'Apertura de la terraza interior y la sala privada para eventos. 120 comensales y lista de espera.' },
  { year: '2024', text: 'Nuevo proyecto digital y carta renovada. Sigue siendo un restaurante familiar, como el primer día.' },
];

const stats = [
  { to: 120, suffix: '',  label: 'Comensales' },
  { to: 200, suffix: '+', label: 'Referencias de vino' },
  { to: 18,  suffix: '',  label: 'Sala privada' },
];

export default function NosotrosPage() {
  return (
    <>
      {/* ── 1. HERO ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ height: '70vh', minHeight: '480px' }}>
        <ParallaxImage speed={0.2}>
          <Image src="/hero.webp" alt="Interior del restaurante Marqués" fill className="object-cover" style={{ objectPosition: 'center 30%' }} priority />
        </ParallaxImage>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(115deg, rgba(8,18,12,0.95) 0%, rgba(8,18,12,0.78) 40%, rgba(8,18,12,0.25) 80%, transparent 100%)' }} />
        <div className="relative h-full flex flex-col justify-end px-5 sm:px-8 lg:px-[52px] pb-16">
          <p className="anim-fade-up text-[#C8DC2E] text-[11px] font-bold tracking-[2.5px] uppercase mb-4" style={{ animationDelay: '0.05s' }}>
            <TextScramble text="Desde 1987" delay={50} />
          </p>
          <h1 className="anim-text-reveal font-heading font-bold text-[clamp(40px,5.5vw,68px)] tracking-[-1px] leading-[1.05] text-white mb-4" style={{ animationDelay: '0.18s' }}>
            Nuestra historia
          </h1>
          <p className="anim-fade-up text-[#B8D8C8] text-[17px] leading-[1.7] max-w-[480px]" style={{ animationDelay: '0.32s' }}>
            Casi cuatro décadas sirviendo Madrid con la misma pasión y los mismos valores con los que empezamos.
          </p>
        </div>
      </section>

      {/* ── 2. HISTORIA + TIMELINE ── bg claro ─────────────── */}
      <section className="bg-[#F0F4F0] px-5 sm:px-8 lg:px-[52px] py-16 sm:py-[88px]">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[1fr_1fr] gap-20 items-start">
          <AnimateIn from="left">
            <p className="text-[#172E22] text-[10px] font-bold tracking-[2.5px] uppercase mb-4">La historia</p>
            <SplitText
              text="Un restaurante familiar desde el primer día"
              as="h2"
              className="font-heading font-bold text-[38px] leading-[1.1] tracking-[-0.5px] text-[#172E22] mb-6"
              baseDelay={60}
              stagger={45}
            />
            <p className="text-[#5A6B60] text-[15px] leading-[1.75] mb-5">
              En 1987, Alejandro Marqués abrió una pequeña taberna en el barrio de Malasaña con veinte sillas, una carta de ocho platos y la convicción de que la cocina honesta siempre tiene cabida en Madrid.
            </p>
            <p className="text-[#5A6B60] text-[15px] leading-[1.75] mb-5">
              Once años después, el local de Gran Vía pasó a ser nuestro hogar. Un espacio que hemos ido construyendo despacio, con materiales nobles, sin prisas y con el mismo carácter de siempre.
            </p>
            <p className="text-[#5A6B60] text-[15px] leading-[1.75]">
              Hoy somos dos generaciones en la cocina. Diego Marqués, formado en Lyon y San Sebastián, aporta técnica y viaje a una cocina que nunca ha olvidado sus raíces.
            </p>
          </AnimateIn>

          <div className="space-y-0">
            {milestones.map((m, i) => (
              <AnimateIn key={m.year} delay={i * 80} from="right">
                <div className="flex gap-6 pb-8 relative">
                  {i < milestones.length - 1 && (
                    <div className="absolute left-[19px] top-[28px] bottom-0 w-px bg-[#C4D5CA]" />
                  )}
                  <div className="shrink-0 w-10 h-10 rounded-full bg-[#172E22] flex items-center justify-center z-10 hover:bg-[#C8DC2E] transition-colors duration-300 group">
                    <div className="w-2 h-2 rounded-full bg-[#C8DC2E] group-hover:bg-[#172E22] transition-colors duration-300" />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-[13px] text-[#C8A020] tracking-[1px] uppercase mb-1">{m.year}</p>
                    <p className="text-[#5A6B60] text-[14px] leading-[1.65]">{m.text}</p>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. FILOSOFÍA ── bg oscuro ───────────────────────── */}
      <section className="bg-[#172E22] px-5 sm:px-8 lg:px-[52px] py-16 sm:py-[88px]">
        <div className="max-w-5xl mx-auto">
          <AnimateIn>
            <p className="text-[#C8DC2E] text-[10px] font-bold tracking-[2.5px] uppercase mb-4">Cómo cocinamos</p>
            <SplitText
              text="Nuestra filosofía"
              as="h2"
              className="font-heading font-bold text-[38px] tracking-[-0.5px] text-white mb-14"
              stagger={70}
            />
          </AnimateIn>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <AnimateIn key={v.num} delay={i * 100}>
                <TiltCard intensity={6} className="h-full">
                  <div className="border-t border-white/10 pt-6 h-full hover:border-[#C8DC2E]/40 transition-colors duration-300 group">
                    <p className="font-heading text-[11px] font-bold text-[#C8DC2E] tracking-[1.5px] mb-4 uppercase">{v.num}</p>
                    <h3 className="font-heading font-bold text-[20px] text-white mb-3 group-hover:text-[#C8DC2E] transition-colors duration-300">{v.title}</h3>
                    <p className="text-[#6A9A80] text-[14px] leading-[1.7]">{v.desc}</p>
                  </div>
                </TiltCard>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. EL ESPACIO ── bg claro ───────────────────────── */}
      <section className="bg-[#F0F4F0] px-5 sm:px-8 lg:px-[52px] py-16 sm:py-[88px]">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[56fr_44fr] gap-16 items-center">
          <AnimateIn from="left" className="relative overflow-hidden rounded-[4px]" style={{ height: '460px' }}>
            <ParallaxImage speed={0.12}>
              <Image src="/hero.webp" alt="El salón de Marqués" fill className="object-cover" style={{ objectPosition: 'right 20%' }} />
            </ParallaxImage>
          </AnimateIn>
          <AnimateIn from="right">
            <p className="text-[#172E22] text-[10px] font-bold tracking-[2.5px] uppercase mb-4">El espacio</p>
            <h2 className="font-heading font-bold text-[34px] leading-[1.15] tracking-[-0.5px] text-[#172E22] mb-6">
              Un lugar pensado para disfrutar
            </h2>
            <div className="space-y-4 text-[#5A6B60] text-[15px] leading-[1.75]">
              <p>120 comensales en un salón de techos altos, iluminado con lámparas de cristal soplado y revestido en madera de nogal.</p>
              <p>Una bodega privada para grupos y celebraciones con capacidad para 18 personas y acceso directo a nuestra cava de vinos.</p>
              <p>Terraza interior climatizada disponible de marzo a octubre, con entrada propia desde la calle.</p>
            </div>

            {/* Stats ── tarjetas separadas con sombra propia y animación hover */}
            <div className="mt-10 grid grid-cols-3 gap-4">
              {stats.map((s, i) => (
                <AnimateIn key={s.label} delay={i * 90}>
                  <div className="group bg-white rounded-[6px] shadow-[0_2px_10px_rgba(23,46,34,0.07)] px-5 py-6 flex flex-col gap-1.5 border border-[#E4EDE8] hover:border-[#C8DC2E] hover:shadow-[0_10px_24px_rgba(23,46,34,0.13)] hover:-translate-y-[3px] transition-all duration-300 ease-out cursor-default">
                    <p className="font-heading font-bold text-[28px] leading-none text-[#172E22] group-hover:text-[#0E1C12] transition-colors duration-300">
                      <CountUp to={s.to} suffix={s.suffix} />
                    </p>
                    <p className="text-[11px] text-[#7A9080] font-bold tracking-[0.8px] uppercase mt-1 leading-snug">{s.label}</p>
                    <span className="block w-6 h-[2px] bg-[#C8DC2E] mt-1 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
                  </div>
                </AnimateIn>
              ))}
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ── 5. CITA ── parallax oscuro, break visual ────────── */}
      <section className="relative overflow-hidden" style={{ height: '400px' }}>
        <ParallaxImage speed={0.15}>
          <Image src="/hero.webp" alt="Salón del restaurante Marqués" fill className="object-cover" style={{ objectPosition: 'center 70%' }} />
        </ParallaxImage>
        <div className="absolute inset-0" style={{ background: 'rgba(8,18,12,0.58)' }} />
        <div className="relative h-full flex items-center px-5 sm:px-8 lg:px-[52px]">
          <AnimateIn>
            <blockquote className="max-w-[640px]">
              <span className="text-[#C8DC2E] text-[48px] font-heading font-bold leading-none opacity-60 select-none block mb-2">"</span>
              <p className="font-heading font-bold text-[clamp(20px,2.6vw,32px)] leading-[1.25] text-white mb-5">
                Cocinar bien es dar lo mejor de uno mismo en cada plato. No hay otra fórmula.
              </p>
              <cite className="text-[#C8DC2E] text-[11px] font-bold tracking-[2px] uppercase not-italic">
                Alejandro Marqués, fundador
              </cite>
            </blockquote>
          </AnimateIn>
        </div>
      </section>

      {/* ── 6. CTA ── bg crema, CONTRASTA con footer verde ─── */}
      <section className="bg-[#F1EFE9] px-5 sm:px-8 lg:px-[52px] py-[72px] border-t border-[#D8D5CF]">
        <AnimateIn className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <p className="text-[#172E22] text-[10px] font-bold tracking-[2.5px] uppercase mb-3">¿Quieres visitarnos?</p>
            <h2 className="font-heading font-bold text-[clamp(26px,3vw,36px)] tracking-[-0.5px] text-[#172E22] mb-2">
              Ven a conocernos
            </h2>
            <p className="text-[#5A6B60] text-[15px]">Calle Gran Vía, 45 · Madrid · Martes a domingo</p>
          </div>
          <div className="flex gap-3 flex-wrap shrink-0">
            <MagneticEl>
              <Link
                href="/reservations"
                className="inline-block px-[28px] py-[13px] bg-[#172E22] text-white font-bold text-[14px] rounded-[3px] hover:bg-[#1E3A2A] hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Reservar mesa
              </Link>
            </MagneticEl>
            <MagneticEl>
              <Link
                href="/carta"
                className="inline-block px-[28px] py-[13px] border border-[#C4D5CA] text-[#172E22] text-[14px] rounded-[3px] hover:bg-[#E8EDE8] transition-all"
              >
                Ver carta
              </Link>
            </MagneticEl>
          </div>
        </AnimateIn>
      </section>
    </>
  );
}
