import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[#0F1F17] px-[52px] pt-14 pb-7">
      <div className="max-w-[1120px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-10 pb-9 border-b border-[#1E3527]">
          <div className="max-w-[280px]">
            <Link href="/" className="font-heading font-semibold text-[18px] tracking-[4px] uppercase text-white">
              MARQUÉS
            </Link>
            <p className="text-[#5A7A68] text-[13px] leading-[1.7] mt-4">
              Cocina de temporada con ingredientes de mercado, en el corazón de Madrid.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-16 gap-y-8">
            <div>
              <p className="text-[#4A6A58] text-[11px] font-bold tracking-[1.5px] uppercase mb-4">Navegación</p>
              <nav className="flex flex-col gap-[10px] text-[13.5px]">
                <Link href="/nosotros" className="text-[#8AB5A0] hover:text-white transition-colors">Nosotros</Link>
                <Link href="/carta" className="text-[#8AB5A0] hover:text-white transition-colors">Carta</Link>
                <Link href="/contacto" className="text-[#8AB5A0] hover:text-white transition-colors">Contacto</Link>
              </nav>
            </div>
            <div>
              <p className="text-[#4A6A58] text-[11px] font-bold tracking-[1.5px] uppercase mb-4">Contacto</p>
              <div className="flex flex-col gap-[10px] text-[13.5px] text-[#8AB5A0]">
                <span>Gran Vía, 45 · Madrid</span>
                <a href="tel:+34910000000" className="hover:text-white transition-colors">+34 91 000 0000</a>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mt-6">
          <p className="text-[12px] text-[#4A6A58]">&copy; {year} Restaurante Marqués</p>
          <div className="flex gap-5 text-[12px] text-[#6E8C7C]">
            <Link href="/privacidad" className="hover:text-white transition-colors">Privacidad</Link>
            <Link href="/aviso-legal" className="hover:text-white transition-colors">Aviso legal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
