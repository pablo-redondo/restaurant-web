import Link from 'next/link';

const sections = [
  {
    id: 'entrantes',
    label: 'Para empezar',
    title: 'Entrantes',
    bg: 'bg-[#F0F4F0]',
    titleColor: 'text-[#172E22]',
    labelColor: 'text-[#172E22]',
    borderColor: 'border-[#C4D5CA]',
    nameColor: 'text-[#172E22]',
    descColor: 'text-[#5A6B60]',
    priceColor: 'text-[#172E22]',
    dishes: [
      { name: 'Croquetas de ibérico y trufa', desc: 'Bechamel artesana, jamón ibérico D.O., trufa negra de Teruel. 6 unidades.', price: '12' },
      { name: 'Tartar de atún rojo', desc: 'Atún rojo de almadraba, aguacate, soja, sésamo tostado y yema curada.', price: '18' },
      { name: 'Alcachofas a la brasa', desc: 'Alcachofas de temporada, alioli de limón ahumado y escamas de sal Maldon.', price: '14' },
      { name: 'Burrata con tomate de mercado', desc: 'Burrata fresca, tomate corazón de buey, albahaca y aceite de oliva virgen extra.', price: '16' },
      { name: 'Carpaccio de wagyu', desc: 'Lomo de wagyu madurado, parmesano 24 meses, rúcula silvestre y trufa.', price: '22' },
      { name: 'Vieiras a la plancha', desc: 'Vieiras gallegas, puré de coliflor ahumada, caviar Osetra y cebollino.', price: '26' },
    ],
  },
  {
    id: 'pescados',
    label: 'Del mar',
    title: 'Pescados',
    bg: 'bg-[#172E22]',
    titleColor: 'text-white',
    labelColor: 'text-[#C8DC2E]',
    borderColor: 'border-[#1E3020]',
    nameColor: 'text-white',
    descColor: 'text-[#6A9A80]',
    priceColor: 'text-[#C8DC2E]',
    dishes: [
      { name: 'Rodaballo salvaje a la plancha', desc: 'Rodaballo del Cantábrico, mantequilla de alcaparras y papas a lo pobre.', price: '38' },
      { name: 'Lubina al horno con hinojo', desc: 'Lubina salvaje, hinojo braseado, limón confitado y aceite de eneldo.', price: '34' },
      { name: 'Bacalao confitado', desc: 'Lomo de bacalao al pil pil tradicional, pimientos del piquillo y pan cristal.', price: '28' },
      { name: 'Merluza de pincho a la vasca', desc: 'Merluza del Cantábrico, salsa verde, almejas y espárragos trigueros.', price: '32' },
    ],
  },
  {
    id: 'carnes',
    label: 'De la tierra',
    title: 'Carnes',
    bg: 'bg-[#F0F4F0]',
    titleColor: 'text-[#172E22]',
    labelColor: 'text-[#172E22]',
    borderColor: 'border-[#C4D5CA]',
    nameColor: 'text-[#172E22]',
    descColor: 'text-[#5A6B60]',
    priceColor: 'text-[#172E22]',
    dishes: [
      { name: 'Chuletón madurado 45 días', desc: 'Buey de Galicia, 800 g, maduración propia. Patatas al horno y pimientos asados.', price: '58' },
      { name: 'Solomillo de ternera gallega', desc: 'Solomillo al punto, salsa de vino tinto Ribera, cebollitas glaseadas y trufa.', price: '42' },
      { name: 'Pichón asado al horno', desc: 'Pichón de Bresse, salsa de frutos del bosque, foie mi-cuit y brioche tostado.', price: '36' },
      { name: 'Carrilleras ibéricas', desc: 'Mejillas de cerdo ibérico estofadas 8 horas, puré trufado y cebolla caramelizada.', price: '28' },
      { name: 'Cochinillo confitado', desc: 'Cochinillo segoviano, piel crujiente, manzana al calvados y reducción de jugo.', price: '32' },
    ],
  },
  {
    id: 'postres',
    label: 'El final perfecto',
    title: 'Postres',
    bg: 'bg-[#172E22]',
    titleColor: 'text-white',
    labelColor: 'text-[#C8DC2E]',
    borderColor: 'border-[#1E3020]',
    nameColor: 'text-white',
    descColor: 'text-[#6A9A80]',
    priceColor: 'text-[#C8DC2E]',
    dishes: [
      { name: 'Tarta de queso al horno', desc: 'Estilo vasco, compota de frambuesa y galleta de almendra.', price: '10' },
      { name: 'Coulant de chocolate negro', desc: 'Chocolate Valrhona 72 %, corazón fundente, helado de vainilla de Madagascar.', price: '11' },
      { name: 'Crema catalana con caramelo', desc: 'Receta tradicional, caramelo artesano y lavanda de la Sierra de Guadarrama.', price: '9' },
      { name: 'Sorbete de limón al cava', desc: 'Limón de Murcia, cava Brut Nature y menta fresca.', price: '8' },
      { name: 'Selección de quesos', desc: 'Tabla de 5 quesos españoles con membrillo, nueces y miel de romero.', price: '16' },
    ],
  },
];

export default function CartaPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#172E22] px-[52px] py-20">
        <p className="text-[#C8DC2E] text-[11px] font-bold tracking-[2.5px] uppercase mb-5">
          Temporada · 2024
        </p>
        <h1 className="font-hero font-[800] text-[72px] leading-[1.0] text-white mb-6">
          Nuestra carta
        </h1>
        <p className="text-[#8AB5A0] text-[16px] leading-[1.75] max-w-[440px] mb-10">
          Cocina de temporada elaborada con ingredientes de mercado seleccionados
          a diario. Carta renovada cada estación.
        </p>
        <div className="flex gap-3 flex-wrap">
          <Link
            href="/reservations"
            className="px-[28px] py-[13px] bg-[#C8DC2E] text-[#172E22] font-bold text-[14px] rounded-[3px] hover:brightness-105 transition"
          >
            Reservar mesa →
          </Link>
          <Link
            href="/"
            className="px-[28px] py-[13px] border border-white/15 text-white text-[14px] rounded-[3px] hover:bg-white/5 transition"
          >
            ← Volver al inicio
          </Link>
        </div>
      </section>

      {/* Secciones de la carta */}
      {sections.map((s) => (
        <section key={s.id} id={s.id} className={`${s.bg} px-[52px] py-[80px]`}>
          <div className="max-w-5xl mx-auto">

            {/* Cabecera de sección */}
            <div className="flex items-end justify-between mb-10 pb-5 border-b" style={{ borderColor: s.bg === 'bg-[#172E22]' ? '#1E3020' : '#C4D5CA' }}>
              <div>
                <p className={`${s.labelColor} text-[10px] font-bold tracking-[2.5px] uppercase mb-2`}>
                  {s.label}
                </p>
                <h2 className={`font-hero font-[800] text-[52px] leading-[1.0] ${s.titleColor}`}>
                  {s.title}
                </h2>
              </div>
              <p className={`text-[13px] ${s.descColor} mb-1`}>
                Precios en euros · IVA incluido
              </p>
            </div>

            {/* Lista de platos */}
            <div className="grid md:grid-cols-2 gap-x-16 gap-y-0">
              {s.dishes.map((dish) => (
                <div
                  key={dish.name}
                  className="py-5 border-b"
                  style={{ borderColor: s.bg === 'bg-[#172E22]' ? '#1E3020' : '#C4D5CA' }}
                >
                  <div className="flex items-baseline justify-between gap-4 mb-1">
                    <p className={`font-heading font-semibold text-[15px] ${s.nameColor}`}>
                      {dish.name}
                    </p>
                    <p className={`font-heading font-bold text-[16px] shrink-0 ${s.priceColor}`}>
                      {dish.price} €
                    </p>
                  </div>
                  <p className={`text-[13px] leading-[1.6] ${s.descColor}`}>
                    {dish.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Nota alérgenos */}
      <section className="bg-[#F0F4F0] px-[52px] py-12 border-t border-[#C4D5CA]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <p className="text-[#5A6B60] text-[13px] leading-[1.7] max-w-[560px]">
            Si tienes alguna alergia o intolerancia alimentaria, comunícaselo a nuestro
            equipo antes de pedir. Disponemos de información detallada sobre los 14
            alérgenos de declaración obligatoria.
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
