import Link from 'next/link';
import Image from 'next/image';

const sections = [
  {
    id: 'entrantes',
    label: 'Para empezar',
    title: 'Entrantes',
    dishes: [
      { name: 'Croquetas de ibérico y trufa', desc: 'Bechamel artesana, jamón ibérico D.O., trufa negra de Teruel · 6 uds.', price: '12', tag: 'Clásico' },
      { name: 'Tartar de atún rojo', desc: 'Atún rojo de almadraba, aguacate, soja, sésamo tostado y yema curada.', price: '18', tag: null },
      { name: 'Alcachofas a la brasa', desc: 'Alcachofas de temporada, alioli de limón ahumado y escamas de sal Maldon.', price: '14', tag: 'Vegetal' },
      { name: 'Burrata con tomate de mercado', desc: 'Burrata fresca, tomate corazón de buey, albahaca y aceite virgen extra.', price: '16', tag: null },
      { name: 'Carpaccio de wagyu', desc: 'Lomo de wagyu madurado, parmesano 24 meses, rúcula silvestre y trufa.', price: '22', tag: 'Firma' },
      { name: 'Vieiras a la plancha', desc: 'Vieiras gallegas, puré de coliflor ahumada, caviar Osetra y cebollino.', price: '26', tag: null },
    ],
  },
  {
    id: 'pescados',
    label: 'Del mar',
    title: 'Pescados',
    dishes: [
      { name: 'Rodaballo salvaje a la plancha', desc: 'Rodaballo del Cantábrico, mantequilla de alcaparras y papas a lo pobre.', price: '38', tag: null },
      { name: 'Lubina al horno con hinojo', desc: 'Lubina salvaje, hinojo braseado, limón confitado y aceite de eneldo.', price: '34', tag: 'Temporada' },
      { name: 'Bacalao confitado al pil pil', desc: 'Lomo de bacalao, pil pil tradicional, pimientos del piquillo y pan cristal.', price: '28', tag: 'Clásico' },
      { name: 'Merluza de pincho a la vasca', desc: 'Merluza del Cantábrico, salsa verde, almejas y espárragos trigueros.', price: '32', tag: null },
    ],
  },
  {
    id: 'carnes',
    label: 'De la tierra',
    title: 'Carnes',
    dishes: [
      { name: 'Chuletón madurado 45 días', desc: 'Buey de Galicia, 800 g, maduración propia. Patatas al horno y pimientos asados.', price: '58', tag: 'Firma' },
      { name: 'Solomillo de ternera gallega', desc: 'Solomillo al punto, salsa de vino tinto Ribera, cebollitas glaseadas y trufa.', price: '42', tag: null },
      { name: 'Pichón asado al horno', desc: 'Pichón de Bresse, salsa de frutos del bosque, foie mi-cuit y brioche.', price: '36', tag: 'Temporada' },
      { name: 'Carrilleras ibéricas estofadas', desc: 'Mejillas de cerdo ibérico 8 horas, puré trufado y cebolla caramelizada.', price: '28', tag: null },
      { name: 'Cochinillo confitado', desc: 'Cochinillo segoviano, piel crujiente, manzana al calvados y reducción de jugo.', price: '32', tag: null },
    ],
  },
  {
    id: 'postres',
    label: 'El final perfecto',
    title: 'Postres',
    dishes: [
      { name: 'Tarta de queso al horno', desc: 'Estilo vasco, compota de frambuesa y galleta de almendra.', price: '10', tag: 'Clásico' },
      { name: 'Coulant de chocolate negro', desc: 'Valrhona 72 %, corazón fundente, helado de vainilla de Madagascar.', price: '11', tag: 'Firma' },
      { name: 'Crema catalana', desc: 'Receta tradicional, caramelo artesano y lavanda de la Sierra de Guadarrama.', price: '9', tag: null },
      { name: 'Sorbete de limón al cava', desc: 'Limón de Murcia, cava Brut Nature y menta fresca.', price: '8', tag: null },
      { name: 'Selección de quesos', desc: 'Tabla de 5 quesos españoles con membrillo, nueces y miel de romero.', price: '16', tag: null },
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
      {/* Hero con imagen de fondo */}
      <section className="relative overflow-hidden" style={{ height: '52vh', minHeight: '360px' }}>
        <Image
          src="/hero.webp"
          alt="Restaurante Marqués"
          fill
          className="object-cover"
          style={{ objectPosition: 'center 55%' }}
          priority
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, rgba(14,28,18,0.93) 0%, rgba(14,28,18,0.70) 45%, rgba(14,28,18,0.25) 100%)' }}
        />
        <div className="relative h-full flex flex-col justify-center px-[52px]">
          <p className="text-[#C8DC2E] text-[11px] font-bold tracking-[2.5px] uppercase mb-4">Temporada 2024</p>
          <h1 className="font-hero font-[800] text-[68px] leading-[1.0] text-white mb-4">Nuestra carta</h1>
          <p className="text-[#B8D8C8] text-[16px] leading-[1.7] max-w-[420px] mb-8">
            Ingredientes de mercado seleccionados cada mañana.
            Carta renovada con cada estación.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link href="/reservations"
              className="px-[26px] py-[12px] bg-[#C8DC2E] text-[#172E22] font-bold text-[14px] rounded-[3px] hover:brightness-105 transition">
              Reservar mesa →
            </Link>
            <Link href="/"
              className="px-[26px] py-[12px] border border-white/20 text-white text-[14px] rounded-[3px] hover:bg-white/8 transition">
              ← Inicio
            </Link>
          </div>
        </div>
      </section>

      {/* Nav de secciones */}
      <nav className="bg-[#172E22] border-b border-[#1E3020] px-[52px] sticky top-[58px] z-40">
        <ul className="flex gap-8 text-[13px] font-medium">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="block py-4 text-[#6A9A80] hover:text-white transition-colors border-b-2 border-transparent hover:border-[#C8DC2E]"
              >
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Secciones */}
      {sections.map((s, si) => {
        const dark = si % 2 === 0;
        const bg        = dark ? 'bg-[#F0F4F0]'   : 'bg-[#172E22]';
        const titleCol  = dark ? 'text-[#172E22]'  : 'text-white';
        const labelCol  = dark ? 'text-[#172E22]'  : 'text-[#C8DC2E]';
        const nameCol   = dark ? 'text-[#172E22]'  : 'text-white';
        const descCol   = dark ? 'text-[#5A6B60]'  : 'text-[#6A9A80]';
        const priceCol  = dark ? 'text-[#172E22]'  : 'text-[#C8DC2E]';
        const divider   = dark ? 'border-[#D8E5DC]': 'border-[#1E3020]';

        return (
          <section key={s.id} id={s.id} className={`${bg} px-[52px] py-[80px]`}>
            <div className="max-w-5xl mx-auto">

              {/* Cabecera */}
              <div className={`flex items-end justify-between mb-10 pb-5 border-b ${divider}`}>
                <div>
                  <p className={`${labelCol} text-[10px] font-bold tracking-[2.5px] uppercase mb-2`}>{s.label}</p>
                  <h2 className={`font-hero font-[800] text-[52px] leading-[1.0] ${titleCol}`}>{s.title}</h2>
                </div>
                <p className={`text-[12px] ${descCol} mb-1 hidden md:block`}>Precios en euros · IVA incluido</p>
              </div>

              {/* Platos — 2 columnas */}
              <div className="grid md:grid-cols-2 gap-x-16">
                {s.dishes.map((dish) => (
                  <div key={dish.name} className={`py-5 border-b ${divider}`}>
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`font-heading font-semibold text-[15px] ${nameCol}`}>{dish.name}</p>
                        {dish.tag && (
                          <span className={`text-[10px] font-bold px-2 py-[2px] rounded-[2px] tracking-[0.5px] ${tagColors[dish.tag]}`}>
                            {dish.tag}
                          </span>
                        )}
                      </div>
                      <p className={`font-heading font-bold text-[16px] shrink-0 ${priceCol}`}>{dish.price} €</p>
                    </div>
                    <p className={`text-[13px] leading-[1.6] ${descCol}`}>{dish.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* Separador imagen */}
      <section className="relative overflow-hidden" style={{ height: '280px' }}>
        <Image
          src="/hero.webp"
          alt="Interior Marqués"
          fill
          className="object-cover"
          style={{ objectPosition: 'center 80%' }}
        />
        <div className="absolute inset-0 bg-[#172E22]/60" />
        <div className="relative h-full flex items-center justify-center text-center px-[52px]">
          <div>
            <p className="text-[#C8DC2E] text-[11px] font-bold tracking-[2.5px] uppercase mb-3">Maridaje</p>
            <p className="font-hero font-[800] text-[32px] text-white leading-[1.1]">
              Bodega con más de 200 referencias
            </p>
            <p className="text-[#8AB5A0] text-[15px] mt-2">Nuestro sumiller te asesora en sala</p>
          </div>
        </div>
      </section>

      {/* Nota alérgenos + CTA */}
      <section className="bg-[#F0F4F0] px-[52px] py-12 border-t border-[#C4D5CA]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <p className="text-[#5A6B60] text-[13px] leading-[1.7] max-w-[560px]">
            Si tienes alguna alergia o intolerancia, comunícaselo a nuestro equipo antes de pedir.
            Disponemos de información detallada sobre los 14 alérgenos de declaración obligatoria.
          </p>
          <Link
            href="/reservations"
            className="shrink-0 px-[28px] py-[13px] bg-[#172E22] text-white font-bold text-[14px] rounded-[3px] hover:bg-[#1E3A2A] transition"
          >
            Reservar mesa →
          </Link>
        </div>
      </section>
    </>
  );
}
