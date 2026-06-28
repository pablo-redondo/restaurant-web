import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import AnimateIn from '@/components/AnimateIn';
import CountUp from '@/components/CountUp';
import TextScramble from '@/components/TextScramble';
import ParallaxImage from '@/components/ParallaxImage';
import MagneticEl from '@/components/MagneticEl';
import TiltCard from '@/components/TiltCard';
import SplitText from '@/components/SplitText';

export const metadata: Metadata = {
  title: 'Carta',
  description: 'Descubre la carta de Restaurante Marqués: entrantes, pescados, carnes y postres elaborados con ingredientes de mercado y productos de temporada en Madrid.',
  openGraph: {
    title: 'Carta · Restaurante Marqués',
    description: 'Cocina de temporada con ingredientes de mercado seleccionados cada mañana. Ver la carta completa.',
    url: '/carta',
    images: [{ url: '/hero.webp', width: 896, height: 1200, alt: 'Restaurante Marqués' }],
  },
};

const sections = [
  {
    id: 'entrantes', label: 'Para empezar', title: 'Entrantes',
    dishes: [
      { name: 'Croquetas de ibérico y trufa',  desc: 'Bechamel artesana, jamón ibérico D.O., trufa negra de Teruel · 6 uds.', price: '12', tag: 'Clásico' },
      { name: 'Tartar de atún rojo',            desc: 'Atún rojo de almadraba, aguacate, soja, sésamo tostado y yema curada.', price: '18', tag: null },
      { name: 'Alcachofas a la brasa',          desc: 'Alcachofas de temporada, alioli de limón ahumado y escamas de sal Maldon.', price: '14', tag: 'Vegetal' },
      { name: 'Burrata con tomate de mercado',  desc: 'Burrata fresca, tomate corazón de buey, albahaca y aceite virgen extra.', price: '16', tag: null },
      { name: 'Carpaccio de wagyu',             desc: 'Lomo de wagyu madurado, parmesano 24 meses, rúcula silvestre y trufa.', price: '22', tag: 'Firma' },
      { name: 'Vieiras a la plancha',           desc: 'Vieiras gallegas, puré de coliflor ahumada, caviar Osetra y cebollino.', price: '26', tag: null },
    ],
  },
  {
    id: 'pescados', label: 'Del mar', title: 'Pescados',
    dishes: [
      { name: 'Rodaballo salvaje a la plancha', desc: 'Rodaballo del Cantábrico, mantequilla de alcaparras y papas a lo pobre.', price: '38', tag: null },
      { name: 'Lubina al horno con hinojo',     desc: 'Lubina salvaje, hinojo braseado, limón confitado y aceite de eneldo.', price: '34', tag: 'Temporada' },
      { name: 'Bacalao confitado al pil pil',   desc: 'Lomo de bacalao, pil pil tradicional, pimientos del piquillo y pan cristal.', price: '28', tag: 'Clásico' },
      { name: 'Merluza de pincho a la vasca',   desc: 'Merluza del Cantábrico, salsa verde, almejas y espárragos trigueros.', price: '32', tag: null },
    ],
  },
  {
    id: 'carnes', label: 'De la tierra', title: 'Carnes',
    dishes: [
      { name: 'Chuletón madurado 45 días',      desc: 'Buey de Galicia, 800 g, maduración propia. Patatas al horno y pimientos asados.', price: '58', tag: 'Firma' },
      { name: 'Solomillo de ternera gallega',   desc: 'Solomillo al punto, salsa de vino tinto Ribera, cebollitas glaseadas y trufa.', price: '42', tag: null },
      { name: 'Pichón asado al horno',          desc: 'Pichón de Bresse, salsa de frutos del bosque, foie mi-cuit y brioche.', price: '36', tag: 'Temporada' },
      { name: 'Carrilleras ibéricas estofadas', desc: 'Mejillas de cerdo ibérico 8 horas, puré trufado y cebolla caramelizada.', price: '28', tag: null },
      { name: 'Cochinillo confitado',           desc: 'Cochinillo segoviano, piel crujiente, manzana al calvados y reducción de jugo.', price: '32', tag: null },
    ],
  },
  {
    id: 'postres', label: 'El final perfecto', title: 'Postres',
    dishes: [
      { name: 'Tarta de queso al horno',    desc: 'Estilo vasco, compota de frambuesa y galleta de almendra.', price: '10', tag: 'Clásico' },
      { name: 'Coulant de chocolate negro', desc: 'Valrhona 72 %, corazón fundente, helado de vainilla de Madagascar.', price: '11', tag: 'Firma' },
      { name: 'Crema catalana',             desc: 'Receta tradicional, caramelo artesano y lavanda de la Sierra de Guadarrama.', price: '9',  tag: null },
      { name: 'Sorbete de limón al cava',   desc: 'Limón de Murcia, cava Brut Nature y menta fresca.', price: '8',  tag: null },
      { name: 'Selección de quesos',        desc: 'Tabla de 5 quesos españoles con membrillo, nueces y miel de romero.', price: '16', tag: null },
    ],
  },
];

const tagColors: Record<string, string> = {
  'Clásico':   'bg-[#E8EDE8] text-[#5A6B60]',
  'Firma':     'bg-[#172E22] text-[#C8DC2E]',
  'Vegetal':   'bg-[#DFF0E0] text-[#2A6A40]',
  'Temporada': 'bg-[#FFF4D6] text-[#8A6010]',
};

export default function CartaPage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ height: '70vh', minHeight: '480px' }}>
        <ParallaxImage speed={0.18}>
          <Image src="/hero.webp" alt="Restaurante Marqués" fill className="object-cover" style={{ objectPosition: 'center 55%' }} priority />
        </ParallaxImage>
        {/* Gradiente editorial — fuerte a la izquierda */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(115deg, rgba(8,18,12,0.97) 0%, rgba(8,18,12,0.88) 30%, rgba(8,18,12,0.45) 62%, transparent 100%)' }} />
        {/* Vignette inferior */}
        <div className="absolute bottom-0 inset-x-0 h-40" style={{ background: 'linear-gradient(to top, rgba(8,18,12,0.55), transparent)' }} />

        <div className="relative h-full flex flex-col justify-end pb-16 px-[52px]">
          <p className="anim-fade-up text-[#C8DC2E] text-[11px] font-bold tracking-[3px] uppercase mb-5" style={{ animationDelay: '0.05s' }}>
            <TextScramble text="Temporada 2024" delay={50} />
          </p>
          <div className="mb-6">
            <span className="anim-text-reveal font-hero font-[800] leading-[0.9] text-white block" style={{ fontSize: 'clamp(56px,8.5vw,100px)', animationDelay: '0.12s' }}>
              Nuestra
            </span>
            <span className="anim-text-reveal font-hero font-[800] leading-[0.9] text-[#C8DC2E] block" style={{ fontSize: 'clamp(56px,8.5vw,100px)', animationDelay: '0.24s' }}>
              carta
            </span>
          </div>
          <p className="anim-fade-up text-[#B0D0C0] text-[15px] leading-[1.75] max-w-[360px] mb-8" style={{ animationDelay: '0.38s' }}>
            Ingredientes de mercado seleccionados cada mañana. Carta renovada con cada estación.
          </p>
          <div className="anim-fade-up flex gap-3 flex-wrap" style={{ animationDelay: '0.50s' }}>
            <MagneticEl>
              <Link href="/reservations" className="inline-block px-[28px] py-[13px] bg-[#C8DC2E] text-[#172E22] font-bold text-[14px] rounded-[3px] hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all">
                Reservar mesa →
              </Link>
            </MagneticEl>
            <MagneticEl>
              <a href="#entrantes" className="inline-block px-[28px] py-[13px] border border-white/25 text-white text-[14px] rounded-[3px] hover:bg-white/10 hover:border-white/45 transition-all">
                Ver carta ↓
              </a>
            </MagneticEl>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ──────────────────────────────────────── */}
      <section className="bg-[#0E1C12] border-b border-[#1A2E1F]">
        <div className="px-[52px] py-10 max-w-5xl mx-auto grid grid-cols-3 divide-x divide-[#1A2E1F]">
          {[
            { to: 37,  suffix: '',   decimals: 0, label: 'años en Madrid',       delay: 200 },
            { to: 4.8, suffix: '★',  decimals: 1, label: 'valoración Google',    delay: 300 },
            { to: 200, suffix: '+',  decimals: 0, label: 'referencias en bodega',delay: 400 },
          ].map(({ to, suffix, decimals, label, delay }, i) => (
            <AnimateIn key={label} delay={i * 80} className="px-8 first:pl-0 text-center">
              <p className="font-hero font-[800] leading-none text-[#C8DC2E] tabular-nums" style={{ fontSize: 'clamp(30px,4vw,46px)' }}>
                <CountUp to={to} suffix={suffix} decimals={decimals} startDelay={delay} />
              </p>
              <p className="text-[#5A8060] text-[12px] mt-2 tracking-[0.4px]">{label}</p>
            </AnimateIn>
          ))}
        </div>
      </section>

      {/* ── SECTION NAV ──────────────────────────────────────── */}
      <nav className="sticky top-[58px] z-40 border-b border-[#C4D5CA]" style={{ background: 'rgba(241,239,233,0.97)', backdropFilter: 'blur(12px)' }}>
        <div className="px-[52px] overflow-x-auto">
          <ul className="flex gap-1 min-w-max py-[9px]">
            {sections.map((s, idx) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="flex items-center gap-[7px] px-4 py-2 rounded-[4px] text-[13px] font-medium text-[#5A6B60] hover:text-[#172E22] hover:bg-[#172E22]/[0.06] transition-all duration-200 group"
                >
                  <span className="text-[9px] font-bold text-[#C8DC2E] opacity-80 group-hover:opacity-100 transition-opacity">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* ── SECCIONES DE PLATOS ──────────────────────────────── */}
      {sections.map((s, si) => {
        const dark     = si % 2 === 0;
        const bg       = dark ? 'bg-[#F0F4F0]'  : 'bg-[#172E22]';
        const titleCol = dark ? 'text-[#172E22]' : 'text-white';
        const labelCol = dark ? 'text-[#8A9E90]' : 'text-[#5A8060]';
        const nameCol  = dark ? 'text-[#172E22]' : 'text-white';
        const descCol  = dark ? 'text-[#5A6B60]' : 'text-[#6A9A80]';
        const priceCol = dark ? 'text-[#172E22]' : 'text-[#C8DC2E]';
        const divider  = dark ? 'border-[#D4E2D8]' : 'border-[#1E3020]';
        const hoverBg  = dark ? 'hover:bg-[#E6EDE8]' : 'hover:bg-[#1C3828]';
        const ghostOp  = dark ? 'rgba(23,46,34,0.032)' : 'rgba(255,255,255,0.028)';

        return (
          <section key={s.id} id={s.id} className={`${bg} px-[52px] py-[90px]`}>
            <div className="max-w-5xl mx-auto">

              {/* Cabecera de sección con número fantasma */}
              <AnimateIn>
                <div className={`relative mb-12 pb-5 border-b ${divider}`}>
                  <span
                    className="absolute top-0 right-0 font-hero font-[800] leading-[1] select-none pointer-events-none"
                    style={{ fontSize: '150px', color: ghostOp }}
                    aria-hidden
                  >
                    {String(si + 1).padStart(2, '0')}
                  </span>
                  <p className={`text-[10px] font-bold tracking-[2.5px] uppercase mb-3 ${labelCol}`}>
                    — {s.label}
                  </p>
                  <div className="flex items-end justify-between gap-4">
                    <SplitText
                      text={s.title}
                      as="h2"
                      className={`font-hero font-[800] leading-[1.0] ${titleCol}`}
                      stagger={65}
                    />
                    <p className={`text-[12px] ${labelCol} mb-[2px] hidden md:block shrink-0`}>
                      Precios en euros · IVA incluido
                    </p>
                  </div>
                </div>
              </AnimateIn>

              {/* Grid de platos */}
              <div className="grid md:grid-cols-2 gap-x-14">
                {s.dishes.map((dish, di) => {
                  const isFirma = dish.tag === 'Firma';
                  return (
                    <AnimateIn key={dish.name} delay={di * 55}>
                      <div
                        className={`py-5 border-b transition-all duration-200 group cursor-default ${divider} ${
                          isFirma
                            ? `border-l-[3px] border-l-[#C8DC2E] -ml-3 pl-[14px] pr-3 ${dark ? 'hover:bg-[#C8DC2E]/[0.06]' : 'hover:bg-[#C8DC2E]/[0.05]'}`
                            : `-mx-3 px-3 rounded-[3px] ${hoverBg}`
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3 mb-[6px]">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className={`font-heading font-semibold text-[15px] ${nameCol} group-hover:text-[#C8DC2E] transition-colors duration-200`}>
                              {dish.name}
                            </p>
                            {dish.tag && (
                              <span className={`text-[10px] font-bold px-[7px] py-[2px] rounded-[2px] tracking-[0.5px] ${tagColors[dish.tag]}`}>
                                {dish.tag}
                              </span>
                            )}
                          </div>
                          <p className={`font-heading font-bold text-[16px] shrink-0 tabular-nums ${priceCol}`}>
                            {dish.price} €
                          </p>
                        </div>
                        <p className={`text-[13px] leading-[1.65] ${descCol}`}>{dish.desc}</p>
                        {isFirma && (
                          <p className="text-[#C8DC2E] text-[10px] font-bold tracking-[1.5px] uppercase mt-[10px] opacity-75">
                            ✦ Plato firma del chef
                          </p>
                        )}
                      </div>
                    </AnimateIn>
                  );
                })}
              </div>

            </div>
          </section>
        );
      })}

      {/* ── MARIDAJE ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ height: '360px' }}>
        <ParallaxImage speed={0.14}>
          <Image src="/hero.webp" alt="Interior Marqués" fill className="object-cover" style={{ objectPosition: 'center 80%' }} />
        </ParallaxImage>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(8,18,12,0.94) 0%, rgba(8,18,12,0.72) 55%, rgba(8,18,12,0.45) 100%)' }} />
        <div className="relative h-full px-[52px] flex items-center">
          <div className="max-w-5xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-10">
            <AnimateIn>
              <p className="text-[#C8DC2E] text-[10px] font-bold tracking-[2.5px] uppercase mb-3">
                Maridaje perfecto
              </p>
              <p className="font-hero font-[800] text-white leading-[1.08] mb-2" style={{ fontSize: 'clamp(30px,4.5vw,50px)' }}>
                Bodega con más de<br />
                <span className="text-[#C8DC2E]">200 referencias</span>
              </p>
              <p className="text-[#7AAA90] text-[14px] mt-1">Nuestro sumiller te asesora en sala</p>
            </AnimateIn>
            <AnimateIn delay={150}>
              <TiltCard intensity={5} className="inline-block">
                <MagneticEl>
                  <Link
                    href="/reservations"
                    className="inline-block px-[34px] py-[15px] bg-[#C8DC2E] text-[#172E22] font-bold text-[15px] rounded-[3px] hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap"
                  >
                    Reservar mesa →
                  </Link>
                </MagneticEl>
              </TiltCard>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── ALÉRGENOS ────────────────────────────────────────── */}
      <section className="bg-[#F0F4F0] px-[52px] py-14 border-t border-[#C4D5CA]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="font-heading font-semibold text-[13px] tracking-[0.3px] text-[#172E22] mb-2">
              Información sobre alérgenos
            </p>
            <p className="text-[#5A6B60] text-[13px] leading-[1.7] max-w-[520px]">
              Si tienes alguna alergia o intolerancia, comunícaselo a nuestro equipo antes de pedir.
              Disponemos de información detallada sobre los 14 alérgenos de declaración obligatoria.
            </p>
          </div>
          <MagneticEl>
            <Link
              href="/contacto"
              className="inline-block shrink-0 px-[28px] py-[13px] border border-[#172E22] text-[#172E22] font-bold text-[14px] rounded-[3px] hover:bg-[#172E22] hover:text-white transition-all duration-200"
            >
              Contactar →
            </Link>
          </MagneticEl>
        </div>
      </section>
    </>
  );
}
