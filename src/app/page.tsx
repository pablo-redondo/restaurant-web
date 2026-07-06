import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import ReviewsSection from './ReviewsSection';
import AnimateIn from '@/components/AnimateIn';
import TextScramble from '@/components/TextScramble';
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
  { tag: 'Firma',     nombre: 'Tataki de atún rojo',    desc: 'Aguacate cremoso, ponzu de yuzu y microbrotes de rábano',   precio: '28€', delay: 0 },
  { tag: 'Temporada', nombre: 'Carrillera de ternera',  desc: 'Cocinada 12 horas, puré de chirivía y salsa Pedro Ximénez', precio: '26€', delay: 100 },
  { tag: 'Clásico',   nombre: 'Tarta de queso La Viña', desc: 'Nuestra versión con coulis de frambuesa y miel de azahar',  precio: '10€', delay: 200 },
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero ── imagen a pantalla completa con degradado, en vez de un bloque de
          color plano idéntico al navbar (que hacía que ambos se fundieran sin separación) ── */}
      <section className="relative overflow-hidden bg-[#08120C]" style={{ minHeight: 'calc(100vh - 58px)' }}>
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
        {/* Scrim radial (oscurece detrás del texto) + degradado vertical, para
            legibilidad sobre una imagen recargada sin perder la foto en los bordes */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 78% 68% at 50% 46%, rgba(8,18,12,0.80) 0%, rgba(8,18,12,0.5) 55%, rgba(8,18,12,0.2) 100%), linear-gradient(180deg, rgba(8,18,12,0.9) 0%, rgba(8,18,12,0.6) 34%, rgba(8,18,12,0.62) 66%, rgba(8,18,12,0.94) 100%)',
          }}
        />

        <div
          className="relative h-full flex flex-col items-center justify-center text-center px-6 py-16 max-w-[860px] mx-auto"
          style={{ textShadow: '0 1px 16px rgba(8,18,12,0.55)' }}
        >
          <p className="anim-fade-up text-[#C8DC2E] text-[11px] font-bold tracking-[3px] uppercase mb-6" style={{ animationDelay: '0.05s' }}>
            <TextScramble text="Desde 1987 · Madrid" delay={50} />
          </p>
          <h1 className="anim-text-reveal font-heading font-bold text-[clamp(44px,7vw,86px)] tracking-[-1.5px] leading-[1.02] text-white mb-7" style={{ animationDelay: '0.18s' }}>
            Una experiencia<br />que{' '}<em className="not-italic text-[#C8DC2E]">no olvidarás</em>
          </h1>
          <p className="anim-fade-up text-[#C8D8CC] text-[17px] leading-[1.75] mb-10 max-w-[540px] mx-auto" style={{ animationDelay: '0.32s' }}>
            Cocina de temporada, ingredientes de mercado y una terraza que enamora en cada estación del año.
          </p>
          <div className="anim-fade-up flex gap-3 flex-wrap justify-center" style={{ animationDelay: '0.44s' }}>
            <MagneticEl>
              <Link href="/reservations" className="inline-block px-[32px] py-[15px] bg-[#C8DC2E] text-[#172E22] font-bold text-[14px] rounded-[3px] hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                Reservar mesa
              </Link>
            </MagneticEl>
            <MagneticEl>
              <Link href="/carta" className="inline-block px-[32px] py-[15px] border border-white/25 text-white text-[14px] rounded-[3px] hover:bg-white/10 hover:border-white/40 transition-all duration-200">
                Ver carta
              </Link>
            </MagneticEl>
          </div>
          <div className="anim-fade-up mt-14 flex flex-wrap justify-center gap-10 sm:gap-16" style={{ animationDelay: '0.54s' }}>
            <div className="group cursor-default">
              <p className="font-heading font-bold text-[36px] text-white tabular-nums leading-none transition-all duration-300 group-hover:text-[#C8DC2E] group-hover:-translate-y-0.5">
                <CountUp to={35} suffix="+" startDelay={650} />
              </p>
              <span className="block mx-auto mt-[10px] h-[2px] w-0 rounded-full bg-[#C8DC2E] transition-all duration-300 group-hover:w-7" />
              <p className="text-[#8AB5A0] text-[10px] font-bold tracking-[1.5px] uppercase mt-[10px] transition-colors group-hover:text-[#C8D8CC]">Años de historia</p>
            </div>
            <div className="group cursor-default">
              <p className="font-heading font-bold text-[36px] text-white tabular-nums leading-none transition-all duration-300 group-hover:text-[#C8DC2E] group-hover:-translate-y-0.5">
                <CountUp to={4.8} suffix="★" decimals={1} startDelay={700} />
              </p>
              <span className="block mx-auto mt-[10px] h-[2px] w-0 rounded-full bg-[#C8DC2E] transition-all duration-300 group-hover:w-7" />
              <p className="text-[#8AB5A0] text-[10px] font-bold tracking-[1.5px] uppercase mt-[10px] transition-colors group-hover:text-[#C8D8CC]">Valoración media</p>
            </div>
            <div className="group cursor-default">
              <p className="font-heading font-bold text-[36px] text-white tabular-nums leading-none transition-all duration-300 group-hover:text-[#C8DC2E] group-hover:-translate-y-0.5">
                <CountUp to={2000} suffix="+" locale="es-ES" startDelay={750} />
              </p>
              <span className="block mx-auto mt-[10px] h-[2px] w-0 rounded-full bg-[#C8DC2E] transition-all duration-300 group-hover:w-7" />
              <p className="text-[#8AB5A0] text-[10px] font-bold tracking-[1.5px] uppercase mt-[10px] transition-colors group-hover:text-[#C8D8CC]">Clientes al mes</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Editorial split ── banda crema con la foto enmarcada (rounded, con margen),
          para crear un corte claro bajo el hero y evitar que dos fotos oscuras se peguen ── */}
      <section className="bg-[#F1EFE9] px-[52px] py-[88px]">
        <div className="max-w-[1120px] mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <AnimateIn from="left" className="relative overflow-hidden rounded-[8px] h-[300px] md:h-[460px] order-1 md:order-none">
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
          <AnimateIn from="right" className="flex flex-col justify-center">
            <p className="text-[#172E22] text-[10px] font-bold tracking-[2.5px] uppercase mb-6">Cocina con alma</p>
            <SplitText
              text="El sabor de lo auténtico"
              as="h2"
              className="font-heading font-bold text-[40px] tracking-[-0.5px] leading-[1.1] text-[#172E22] mb-6"
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
              <Link href="/nosotros" className="inline-flex items-center gap-2 text-[#172E22] font-bold text-[12px] tracking-[1.5px] uppercase border-b-2 border-[#C8DC2E] pb-[3px] hover:text-[#8A9C1E] transition-colors duration-200">
                Nuestra historia
              </Link>
            </MagneticEl>
          </AnimateIn>
        </div>
      </section>

      {/* ── Carta preview ── */}
      <section className="bg-[#172E22] py-[88px] px-[52px]">
        <AnimateIn className="max-w-[1120px] mx-auto flex items-end justify-between mb-[52px]">
          <div>
            <p className="text-[#C8DC2E] text-[10px] font-bold tracking-[2.5px] uppercase mb-3">Nuestra carta</p>
            <h2 className="font-heading font-bold text-[clamp(30px,3.4vw,42px)] tracking-[-0.5px] text-white leading-[1.1]">
              Platos que cuentan<br />una historia
            </h2>
          </div>
          <MagneticEl>
            <Link href="/carta" className="group hidden md:inline-flex items-center gap-2 px-[24px] py-[12px] rounded-full border border-white/20 text-white text-[13px] font-semibold hover:bg-[#C8DC2E] hover:text-[#172E22] hover:border-[#C8DC2E] transition-all duration-200">
              Ver carta
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
          </MagneticEl>
        </AnimateIn>

        <div className="max-w-[1120px] mx-auto grid md:grid-cols-3 gap-4">
          {cartaCards.map(({ tag, nombre, desc, precio, delay }) => (
            <AnimateIn key={nombre} delay={delay} className="h-full">
              <TiltCard className="h-full" intensity={6}>
                <div className="relative h-full flex flex-col p-7 rounded-[10px] border border-white/10 bg-white/[0.03] overflow-hidden cursor-default group hover:border-[#C8DC2E]/40 hover:bg-white/[0.06] hover:-translate-y-1 transition-all duration-300">
                  <span className="absolute top-0 left-0 right-0 h-[3px] bg-[#C8DC2E] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
                  <div className="flex items-start justify-between gap-3 mb-6">
                    <span className="inline-block text-[10px] font-bold tracking-[2px] uppercase px-[10px] py-[4px] rounded-full bg-[#C8DC2E]/10 text-[#C8DC2E] group-hover:bg-[#C8DC2E]/20 transition-colors">
                      {tag}
                    </span>
                    <p className="font-heading font-bold text-[24px] text-white tabular-nums group-hover:text-[#C8DC2E] transition-colors">{precio}</p>
                  </div>
                  <h3 className="font-heading font-bold text-[21px] text-white mb-2 leading-[1.2]">{nombre}</h3>
                  <p className="text-[#8AB5A0] text-[13.5px] leading-[1.65]">{desc}</p>
                </div>
              </TiltCard>
            </AnimateIn>
          ))}
        </div>

        <div className="max-w-[1120px] mx-auto mt-6 md:hidden">
          <Link href="/carta" className="flex items-center justify-center gap-2 px-[24px] py-[13px] rounded-full border border-white/20 text-white text-[13px] font-semibold hover:bg-[#C8DC2E] hover:text-[#172E22] transition-all">
            Ver carta
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className="bg-[#F0F4F0] py-[88px] px-[52px]">
        <AnimateIn>
          <p className="text-[#172E22] text-[10px] font-bold tracking-[2.5px] uppercase mb-3">Lo que dicen</p>
          <h2 className="font-heading font-bold text-[36px] tracking-[-0.5px] text-[#172E22] mb-0">Nuestros clientes</h2>
        </AnimateIn>
        <AnimateIn delay={150}>
          <ReviewsSection />
        </AnimateIn>
      </section>
    </>
  );
}
