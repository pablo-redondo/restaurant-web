import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import ReviewsSection from './ReviewsSection';
import AnimateIn from '@/components/AnimateIn';
import MagneticEl from '@/components/MagneticEl';
import CountUp from '@/components/CountUp';
import ParallaxImage from '@/components/ParallaxImage';
import TiltCard from '@/components/TiltCard';
import SplitText from '@/components/SplitText';

export const metadata: Metadata = {
  title: 'Restaurante Marqués — Alta cocina en Madrid desde 1987',
  description: 'Restaurante Marqués, cocina de temporada en el corazón de Madrid desde 1987. Reserva tu mesa en Gran Vía, 45.',
  openGraph: {
    title: 'Restaurante Marqués — Alta cocina en Madrid desde 1987',
    description: 'Cocina de temporada, ingredientes de mercado y una sala única en el centro de Madrid.',
    url: '/',
  },
};


const cartaCards = [
  { tag: 'Firma',     nombre: 'Tataki de atún rojo',   desc: 'Aguacate cremoso, ponzu de yuzu y microbrotes de rábano',   precio: '28€', delay: 0 },
  { tag: 'Temporada', nombre: 'Carrillera de ternera', desc: 'Cocinada 12 horas, puré de chirivía y salsa Pedro Ximénez', precio: '26€', delay: 100 },
  { tag: 'Clásico',   nombre: 'Tarta de queso La Viña',desc: 'Nuestra versión con coulis de frambuesa y miel de azahar',  precio: '10€', delay: 200 },
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative bg-[#172E22] grid md:grid-cols-2" style={{ minHeight: 'calc(100vh - 58px)' }}>
        {/* Fondo sutil móvil */}
        <div className="absolute inset-0 md:hidden overflow-hidden">
          <Image src="/hero.webp" alt="" fill className="object-cover opacity-[0.15]" style={{ objectPosition: 'center 15%' }} priority />
        </div>

        {/* Texto */}
        <div className="relative flex flex-col justify-center px-[52px] py-14 border-r border-[#1E3020]">
          <p className="anim-fade-up text-[#6A9A80] text-[11px] font-bold tracking-[2.5px] uppercase mb-7" style={{ animationDelay: '0.05s' }}>
            Desde 1987 · Madrid
          </p>
          <h1 className="anim-text-reveal font-hero font-[800] text-[clamp(48px,7vw,80px)] leading-[1.02] text-white mb-7" style={{ animationDelay: '0.18s' }}>
            Una experiencia<br />que{' '}<em className="not-italic text-[#C8DC2E]">no olvidarás</em>
          </h1>
          <p className="anim-fade-up text-[#8AB5A0] text-[16px] leading-[1.75] mb-9" style={{ animationDelay: '0.32s' }}>
            Cocina de temporada, ingredientes de mercado y una terraza que enamora en cada estación del año.
          </p>
          <div className="anim-fade-up flex gap-3 flex-wrap" style={{ animationDelay: '0.44s' }}>
            <MagneticEl>
              <Link href="/reservations" className="inline-block px-[30px] py-[14px] bg-[#C8DC2E] text-[#172E22] font-bold text-[14px] rounded-[3px] hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                Reservar mesa →
              </Link>
            </MagneticEl>
            <MagneticEl>
              <Link href="/carta" className="inline-block px-[30px] py-[14px] border border-white/15 text-white text-[14px] rounded-[3px] hover:bg-white/10 hover:border-white/30 transition-all duration-200">
                Ver carta
              </Link>
            </MagneticEl>
          </div>
          <div className="anim-fade-up mt-12 pt-6 border-t border-white/10 flex gap-10" style={{ animationDelay: '0.54s' }}>
            <div>
              <p className="font-heading font-bold text-[28px] text-white tabular-nums">
                <CountUp to={35} suffix="+" startDelay={650} />
              </p>
              <p className="text-[#4A7A60] text-[10px] font-bold tracking-[1.5px] uppercase mt-1">Años de historia</p>
            </div>
            <div>
              <p className="font-heading font-bold text-[28px] text-white tabular-nums">
                <CountUp to={4.8} suffix="★" decimals={1} startDelay={700} />
              </p>
              <p className="text-[#4A7A60] text-[10px] font-bold tracking-[1.5px] uppercase mt-1">Valoración media</p>
            </div>
            <div>
              <p className="font-heading font-bold text-[28px] text-white tabular-nums">
                <CountUp to={2000} suffix="+" locale="es-ES" startDelay={750} />
              </p>
              <p className="text-[#4A7A60] text-[10px] font-bold tracking-[1.5px] uppercase mt-1">Clientes al mes</p>
            </div>
          </div>
        </div>

        {/* Imagen con parallax — solo desktop */}
        <div className="hidden md:block relative overflow-hidden">
          <ParallaxImage speed={0.2}>
            <Image
              src="/hero.webp"
              alt="Interior del restaurante Marqués"
              fill
              className="anim-fade-in object-cover"
              style={{ objectPosition: 'center 15%', animationDelay: '0.3s' }}
              priority
            />
          </ParallaxImage>
        </div>
      </section>

      {/* ── Editorial split ── */}
      <section className="grid md:grid-cols-2 overflow-hidden" style={{ minHeight: '540px' }}>
        <AnimateIn from="left" className="hidden md:block relative overflow-hidden">
          <ParallaxImage speed={0.18}>
            <Image
              src="/interior.webp"
              alt="Sala con banquetas de terciopelo verde en Marqués"
              fill
              className="object-cover"
              style={{ objectPosition: 'center 40%' }}
            />
          </ParallaxImage>
        </AnimateIn>
        <AnimateIn from="right" className="bg-[#F1EFE9] flex flex-col justify-center px-[52px] py-16">
          <p className="text-[#172E22] text-[10px] font-bold tracking-[2.5px] uppercase mb-6">Cocina con alma</p>
          <SplitText
            text="El sabor de lo auténtico"
            as="h2"
            className="font-hero font-[800] text-[52px] leading-[1.05] text-[#172E22] mb-6"
            baseDelay={80}
            stagger={60}
          />
          <p className="text-[#5A6B60] text-[16px] leading-[1.75] mb-4">
            Trabajamos con productores locales que comparten nuestra forma de entender la cocina. Cada ingrediente tiene nombre, origen y una historia que vale la pena contar.
          </p>
          <p className="text-[#5A6B60] text-[16px] leading-[1.75] mb-10">
            Desde los campos de Castilla hasta tu mesa, respetamos el producto y la memoria de la cocina española de siempre.
          </p>
          <MagneticEl className="w-fit">
            <Link href="/nosotros" className="inline-flex items-center gap-2 text-[#172E22] font-bold text-[12px] tracking-[1.5px] uppercase border-b-2 border-[#C8DC2E] pb-[3px] hover:gap-3 hover:text-[#8A9C1E] transition-all duration-200">
              Nuestra historia →
            </Link>
          </MagneticEl>
        </AnimateIn>
      </section>

      {/* ── Carta preview ── */}
      <section className="bg-[#172E22] py-[88px] px-[52px]">
        <AnimateIn className="flex items-end justify-between mb-[52px]">
          <div>
            <p className="text-[#C8DC2E] text-[10px] font-bold tracking-[2.5px] uppercase mb-3">Nuestra carta</p>
            <h2 className="font-heading font-bold text-[38px] tracking-[-0.5px] text-white leading-[1.2]">
              Platos que cuentan<br />una historia
            </h2>
          </div>
          <MagneticEl>
            <Link href="/carta" className="hidden md:inline-flex items-center gap-2 px-[24px] py-[12px] border border-white/15 text-white text-[13px] rounded-[3px] hover:bg-white/8 hover:border-white/30 hover:gap-3 transition-all duration-200">
              Ver carta completa →
            </Link>
          </MagneticEl>
        </AnimateIn>

        <div className="grid md:grid-cols-3 divide-x divide-white/10 border border-white/10 rounded-[4px] overflow-hidden">
          {cartaCards.map(({ tag, nombre, desc, precio, delay }) => (
            <AnimateIn key={nombre} delay={delay} className="h-full">
              <TiltCard className="h-full" intensity={6}>
                <div className="p-8 h-full hover:bg-[#1C3828] transition-colors duration-300 cursor-default group">
                  <span className="inline-block text-[10px] font-bold tracking-[2px] uppercase px-[10px] py-[4px] rounded-[2px] mb-6 bg-[#C8DC2E]/10 text-[#C8DC2E] group-hover:bg-[#C8DC2E]/20 transition-colors">
                    {tag}
                  </span>
                  <h3 className="font-heading font-bold text-[20px] text-white mb-2 group-hover:text-[#C8DC2E] transition-colors">{nombre}</h3>
                  <p className="text-[#5A8A70] text-[13px] leading-[1.65] mb-8">{desc}</p>
                  <p className="font-heading font-bold text-[24px] text-white">{precio}</p>
                </div>
              </TiltCard>
            </AnimateIn>
          ))}
        </div>

        <div className="mt-6 md:hidden">
          <Link href="/carta" className="block text-center px-[24px] py-[12px] border border-white/15 text-white text-[13px] rounded-[3px] hover:bg-white/8 transition">
            Ver carta completa →
          </Link>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className="bg-[#F0F4F0] py-[88px] px-[52px]">
        <AnimateIn>
          <p className="text-[#172E22] text-[10px] font-bold tracking-[2.5px] uppercase mb-3">Lo que dicen</p>
          <h2 className="font-heading font-bold text-[38px] tracking-[-0.5px] text-[#172E22] mb-0">Nuestros clientes</h2>
        </AnimateIn>
        <AnimateIn delay={150}>
          <ReviewsSection />
        </AnimateIn>
      </section>
    </>
  );
}
