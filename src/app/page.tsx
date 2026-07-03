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
          <div className="anim-fade-up mt-12 flex flex-wrap justify-center gap-3" style={{ animationDelay: '0.54s' }}>
            <div className="flex items-center gap-3 rounded-full border border-white/12 bg-white/[0.06] pl-5 pr-6 py-[10px] backdrop-blur-md">
              <span className="font-heading font-bold text-[26px] text-[#C8DC2E] tabular-nums leading-none">
                <CountUp to={35} suffix="+" startDelay={650} />
              </span>
              <span className="text-left text-[#C8D8CC] text-[10.5px] font-bold tracking-[1px] uppercase leading-[1.2]">Años de<br />historia</span>
            </div>
            <div className="flex items-center gap-3 rounded-full border border-white/12 bg-white/[0.06] pl-5 pr-6 py-[10px] backdrop-blur-md">
              <span className="font-heading font-bold text-[26px] text-[#C8DC2E] tabular-nums leading-none">
                <CountUp to={4.8} suffix="★" decimals={1} startDelay={700} />
              </span>
              <span className="text-left text-[#C8D8CC] text-[10.5px] font-bold tracking-[1px] uppercase leading-[1.2]">Valoración<br />media</span>
            </div>
            <div className="flex items-center gap-3 rounded-full border border-white/12 bg-white/[0.06] pl-5 pr-6 py-[10px] backdrop-blur-md">
              <span className="font-heading font-bold text-[26px] text-[#C8DC2E] tabular-nums leading-none">
                <CountUp to={2000} suffix="+" locale="es-ES" startDelay={750} />
              </span>
              <span className="text-left text-[#C8D8CC] text-[10.5px] font-bold tracking-[1px] uppercase leading-[1.2]">Clientes<br />al mes</span>
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
        <AnimateIn className="flex items-end justify-between mb-[52px]">
          <div>
            <p className="text-[#C8DC2E] text-[10px] font-bold tracking-[2.5px] uppercase mb-3">Nuestra carta</p>
            <h2 className="font-heading font-bold text-[36px] tracking-[-0.5px] text-white leading-[1.2]">
              Platos que cuentan<br />una historia
            </h2>
          </div>
          <MagneticEl>
            <Link href="/carta" className="hidden md:inline-block px-[24px] py-[11px] border border-white/15 text-white text-[13px] rounded-[3px] hover:bg-white/8 hover:border-white/30 transition-all duration-200">
              Ver carta completa
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
            Ver carta completa
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
