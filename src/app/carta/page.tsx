import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import AnimateIn from '@/components/AnimateIn';
import CountUp from '@/components/CountUp';
import TextScramble from '@/components/TextScramble';
import ParallaxImage from '@/components/ParallaxImage';
import MagneticEl from '@/components/MagneticEl';
import CartaCategoryNav from '@/components/CartaCategoryNav';

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
  'Clásico':   'bg-white text-[#4A6058] border border-[#D8E2DC]',
  'Firma':     'bg-[#172E22] text-[#C8DC2E]',
  'Vegetal':   'bg-[#DCEFDD] text-[#2A6A40]',
  'Temporada': 'bg-[#FCEFCB] text-[#8A6010]',
};

export default function CartaPage() {
  return (
    <>
      {/* ── HERO ── único bloque oscuro de entrada ── */}
      <section className="relative overflow-hidden" style={{ height: '58vh', minHeight: '400px' }}>
        <ParallaxImage speed={0.18}>
          <Image src="/hero.webp" alt="Restaurante Marqués" fill className="object-cover" style={{ objectPosition: 'center 55%' }} priority />
        </ParallaxImage>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(115deg, rgba(8,18,12,0.94) 0%, rgba(8,18,12,0.80) 38%, rgba(8,18,12,0.30) 75%, transparent 100%)' }} />

        <div className="relative h-full flex flex-col justify-end pb-14 px-[52px]">
          <p className="anim-fade-up text-[#C8DC2E] text-[11px] font-bold tracking-[3px] uppercase mb-4" style={{ animationDelay: '0.05s' }}>
            <TextScramble text="Temporada 2024" delay={50} />
          </p>
          <h1 className="anim-text-reveal font-heading font-bold leading-[1.0] text-white mb-5" style={{ fontSize: 'clamp(42px,6vw,68px)', animationDelay: '0.12s' }}>
            Nuestra carta
          </h1>
          <p className="anim-fade-up text-[#C8D8CC] text-[15px] leading-[1.7] max-w-[420px]" style={{ animationDelay: '0.28s' }}>
            Ingredientes de mercado seleccionados cada mañana. Carta renovada con cada estación.
          </p>
        </div>
      </section>

      {/* ── FRANJA DE CIFRAS ── #F0F4F0, el verde-gris base de toda la web ── */}
      <section className="bg-[#F0F4F0] border-b border-[#DDE6DD]">
        <div className="px-[52px] py-9 max-w-5xl mx-auto grid grid-cols-3 divide-x divide-[#DDE6DD]">
          {[
            { to: 37,  suffix: '',  decimals: 0, label: 'años en Madrid',        delay: 200 },
            { to: 4.8, suffix: '★', decimals: 1, label: 'valoración Google',     delay: 300 },
            { to: 200, suffix: '+', decimals: 0, label: 'referencias en bodega', delay: 400 },
          ].map(({ to, suffix, decimals, label, delay }, i) => (
            <AnimateIn key={label} delay={i * 80} className="px-8 first:pl-0 text-center">
              <p className="font-heading font-bold leading-none text-[#172E22] tabular-nums" style={{ fontSize: 'clamp(26px,3.2vw,38px)' }}>
                <CountUp to={to} suffix={suffix} decimals={decimals} startDelay={delay} />
              </p>
              <p className="text-[#5A6B60] text-[12px] mt-2 tracking-[0.3px]">{label}</p>
            </AnimateIn>
          ))}
        </div>
      </section>

      {/* ── NAV DE SECCIONES ── con resaltado activo al hacer scroll ── */}
      <CartaCategoryNav categories={sections.map(({ id, title }) => ({ id, title }))} />

      {/* ── SECCIONES DE PLATOS ── alternando blanco y #F0F4F0, igual que el resto del sitio ── */}
      {sections.map((s, si) => (
        <section key={s.id} id={s.id} className={si % 2 === 0 ? 'bg-white' : 'bg-[#F0F4F0]'}>
          <div className="px-[52px] py-16">
            <div className="max-w-5xl mx-auto">
              <AnimateIn>
                <div className="flex items-end justify-between gap-4 mb-10">
                  <div className="flex items-end gap-5">
                    <span className="font-heading font-bold text-[#C8DC2E] leading-[0.78]" style={{ fontSize: 'clamp(40px,5vw,58px)' }}>
                      {String(si + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <p className="text-[#5A6B60] text-[11px] font-bold tracking-[2.5px] uppercase mb-[5px]">
                        {s.label}
                      </p>
                      <h2 className="font-heading font-bold text-[#172E22] leading-[1]" style={{ fontSize: 'clamp(26px,3.2vw,36px)', letterSpacing: '-0.5px' }}>
                        {s.title}
                      </h2>
                    </div>
                  </div>
                  <p className="text-[#5A6B60] text-[12px] shrink-0 hidden md:block mb-[4px]">
                    Precios en euros · IVA incluido
                  </p>
                </div>
              </AnimateIn>

              <div className="grid md:grid-cols-2 gap-4">
                {s.dishes.map((dish, di) => {
                  const isFirma = dish.tag === 'Firma';
                  return (
                    <AnimateIn key={dish.name} delay={di * 55}>
                      <div className="relative bg-white border border-[#C4D5CA] rounded-[5px] px-[26px] py-6 flex flex-col gap-[9px] overflow-hidden hover:border-[#A8C0B0] hover:shadow-[0_6px_18px_rgba(23,46,34,0.08)] transition-all duration-200 group">
                        {isFirma && <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#C8DC2E]" />}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-[10px] flex-wrap">
                            <p className="font-heading font-bold text-[17px] text-[#172E22] leading-[1.2] group-hover:text-[#2A6A40] transition-colors duration-200">
                              {dish.name}
                            </p>
                            {dish.tag && (
                              <span className={`text-[9.5px] font-bold px-2 py-[3px] rounded-[2px] tracking-[1px] uppercase whitespace-nowrap ${tagColors[dish.tag]}`}>
                                {dish.tag}
                              </span>
                            )}
                          </div>
                          <p className="font-heading font-bold text-[25px] shrink-0 tabular-nums text-[#172E22]">
                            {dish.price} €
                          </p>
                        </div>
                        <p className="text-[#5A6B60] text-[13.5px] leading-[1.6]">{dish.desc}</p>
                        {isFirma && (
                          <p className="flex items-center gap-[6px] text-[#B07010] text-[11px] font-bold tracking-[0.5px] uppercase mt-[3px]">
                            <span className="text-[12px]">✦</span>Plato firma del chef
                          </p>
                        )}
                      </div>
                    </AnimateIn>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ── MARIDAJE ── segundo bloque oscuro, cierre de transición ── */}
      <section className="relative overflow-hidden" style={{ height: '300px' }}>
        <ParallaxImage speed={0.14}>
          <Image src="/hero.webp" alt="Interior Marqués" fill className="object-cover" style={{ objectPosition: 'center 80%' }} />
        </ParallaxImage>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(8,18,12,0.92) 0%, rgba(8,18,12,0.72) 55%, rgba(8,18,12,0.46) 100%)' }} />
        <div className="relative h-full px-[52px] flex items-center">
          <div className="max-w-5xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-10">
            <AnimateIn>
              <p className="text-[#C8DC2E] text-[10px] font-bold tracking-[2.5px] uppercase mb-3">Maridaje perfecto</p>
              <p className="font-heading font-bold text-white leading-[1.15] mb-2" style={{ fontSize: 'clamp(24px,3.2vw,38px)' }}>
                Bodega con más de <span className="text-[#C8DC2E]">200 referencias</span>
              </p>
              <p className="text-[#9FC4B0] text-[14px] mt-1">Nuestro sumiller te asesora en sala</p>
            </AnimateIn>
            <AnimateIn delay={150}>
              <MagneticEl>
                <Link href="/reservations" className="inline-block px-[32px] py-[14px] bg-[#C8DC2E] text-[#172E22] font-bold text-[14px] rounded-[3px] hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap">
                  Reservar mesa
                </Link>
              </MagneticEl>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── ALÉRGENOS ── #F0F4F0, cierra el ciclo igual que la franja de cifras ── */}
      <section className="bg-[#F0F4F0] px-[52px] py-14">
        <div className="max-w-5xl mx-auto pt-9 border-t border-[#C4D5CA] flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="flex-1 min-w-[280px]">
            <p className="text-[#B07010] text-[10.5px] font-bold tracking-[2.5px] uppercase mb-[10px]">
              Información sobre alérgenos
            </p>
            <p className="text-[#3F5A4B] text-[15px] leading-[1.7] max-w-[620px]">
              Disponemos de información detallada sobre los{' '}
              <strong className="text-[#172E22]">14 alérgenos de declaración obligatoria</strong>.
              Si tienes alguna alergia o intolerancia, comunícaselo a nuestro equipo antes de pedir.
            </p>
          </div>
          <MagneticEl>
            <Link href="/contacto" className="inline-block shrink-0 px-9 py-[14px] bg-[#172E22] text-white font-bold text-[13.5px] tracking-[0.4px] rounded-[3px] hover:bg-[#0F1F17] transition-all duration-200">
              Contactar
            </Link>
          </MagneticEl>
        </div>
      </section>
    </>
  );
}
