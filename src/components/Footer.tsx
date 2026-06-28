import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[#172E22]">

      {/* Zona de marca */}
      <div className="px-[52px] pt-[64px] pb-[56px] border-b border-white/8 flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div>
          <p className="font-hero font-[800] text-[clamp(36px,5vw,56px)] leading-[1.0] text-white mb-3">
            Restaurante<br />Marqués
          </p>
          <p className="text-[#6A9A80] text-[14px] leading-[1.65] max-w-[340px]">
            Alta cocina de temporada en el corazón de Madrid.<br />
            Desde 1987, cocinamos con respeto al producto.
          </p>
        </div>
        <div className="flex flex-col gap-3 md:items-end">
          <Link
            href="/reservations"
            className="inline-flex items-center gap-3 px-[32px] py-[15px] bg-[#C8DC2E] text-[#172E22] font-bold text-[14px] rounded-[3px] hover:brightness-105 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Reservar mesa →
          </Link>
          <Link
            href="/contacto"
            className="text-[#6A9A80] text-[13px] hover:text-white transition-colors"
          >
            Horarios y cómo llegar ↗
          </Link>
        </div>
      </div>

      {/* Barra legal */}
      <div className="px-[52px] py-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-heading font-bold text-[14px] tracking-[2.5px] uppercase text-[#C8DC2E]">
          MARQUÉS
        </span>

        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px] text-[#6A9A80]">
          <Link href="/nosotros"    className="hover:text-white transition-colors">Nosotros</Link>
          <span className="text-[#2A4A38]">&middot;</span>
          <Link href="/carta"       className="hover:text-white transition-colors">Carta</Link>
          <span className="text-[#2A4A38]">&middot;</span>
          <Link href="/contacto"    className="hover:text-white transition-colors">Contacto</Link>
          <span className="text-[#2A4A38]">&middot;</span>
          <Link href="/privacidad"  className="hover:text-white transition-colors">Privacidad</Link>
          <span className="text-[#2A4A38]">&middot;</span>
          <Link href="/aviso-legal" className="hover:text-white transition-colors">Aviso legal</Link>
        </nav>

        <p className="text-[#3A5A48] text-[12px]">&copy; {year} Restaurante Marqués</p>
      </div>

    </footer>
  );
}
