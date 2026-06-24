import Link from 'next/link';
import ReviewsSection from './ReviewsSection';

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center text-center px-4">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/70 via-stone-950/60 to-stone-950" />
        <div className="relative z-10 max-w-2xl">
          <p className="text-amber-400 text-sm tracking-[0.3em] uppercase mb-4">Madrid, desde 1987</p>
          <h1 className="font-serif text-5xl md:text-7xl font-normal text-white mb-6 leading-tight">
            Restaurante<br />Marqués
          </h1>
          <p className="text-stone-300 text-lg mb-10 leading-relaxed">
            Alta cocina clásica española con carta de temporada.<br />
            Una experiencia gastronómica única en el corazón de Madrid.
          </p>
          <Link
            href="/reservations"
            className="inline-block px-8 py-4 bg-amber-500 text-stone-950 font-semibold rounded hover:bg-amber-400 transition-colors tracking-wide"
          >
            Reservar mesa
          </Link>
        </div>
      </section>

      {/* About */}
      <section className="max-w-4xl mx-auto px-4 py-24 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-amber-400 text-xs tracking-[0.25em] uppercase mb-3">Nuestra historia</p>
          <h2 className="font-serif text-3xl md:text-4xl text-stone-100 mb-6">Tres décadas de excelencia</h2>
          <p className="text-stone-400 leading-relaxed mb-4">
            Fundado en 1987 por la familia Marqués, nuestro restaurante ha sido durante más de treinta años
            un referente de la alta cocina española en Madrid.
          </p>
          <p className="text-stone-400 leading-relaxed">
            Trabajamos con productores locales y de temporada para ofrecer una carta que honra los
            sabores de la cocina clásica con técnicas contemporáneas.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { value: '+30', label: 'años de historia' },
            { value: '2', label: 'soles Repsol' },
            { value: '80', label: 'comensales' },
            { value: '100%', label: 'producto de temporada' },
          ].map((stat) => (
            <div key={stat.label} className="bg-stone-900 border border-stone-800 rounded-xl p-6 text-center">
              <p className="font-serif text-3xl text-amber-400 mb-1">{stat.value}</p>
              <p className="text-stone-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Spaces */}
      <section className="bg-stone-900 py-24">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-amber-400 text-xs tracking-[0.25em] uppercase mb-3 text-center">Nuestros espacios</p>
          <h2 className="font-serif text-3xl text-center mb-12">Interior y terraza</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80"
                alt="Salón interior"
                className="w-full h-52 object-cover"
              />
              <div className="p-6 bg-stone-800">
                <h3 className="font-serif text-xl mb-2">Salón interior</h3>
                <p className="text-stone-400 text-sm">Ambiente íntimo y elegante, con decoración clásica y luz cálida.</p>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=800&q=80"
                alt="Terraza"
                className="w-full h-52 object-cover"
              />
              <div className="p-6 bg-stone-800">
                <h3 className="font-serif text-xl mb-2">Terraza</h3>
                <p className="text-stone-400 text-sm">Al aire libre en el corazón de Madrid, ideal para las noches de verano.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="py-24">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-amber-400 text-xs tracking-[0.25em] uppercase mb-3 text-center">Opiniones</p>
          <h2 className="font-serif text-3xl text-center mb-12">Lo que dicen nuestros clientes</h2>
          <ReviewsSection />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-stone-900 border-y border-stone-800 py-20 text-center px-4">
        <h2 className="font-serif text-3xl md:text-4xl mb-4">¿Listo para reservar?</h2>
        <p className="text-stone-400 mb-8">Consulte disponibilidad y asegure su mesa en segundos.</p>
        <Link
          href="/reservations"
          className="inline-block px-8 py-4 bg-amber-500 text-stone-950 font-semibold rounded hover:bg-amber-400 transition-colors"
        >
          Ver disponibilidad
        </Link>
      </section>
    </>
  );
}
