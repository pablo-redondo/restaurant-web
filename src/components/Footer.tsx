import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[#172E22]">

      {/* Bloque principal */}
      <div className="px-[52px] py-[72px] grid md:grid-cols-2 gap-12 items-center border-b border-white/10">
        {/* Izquierda: ubicación e info */}
        <div>
          <p className="text-[#C8DC2E] text-[10px] font-bold tracking-[2.5px] uppercase mb-5">
            Encúntranos
          </p>
          <h2 className="font-hero font-[800] text-[48px] leading-[1.0] text-white mb-5">
            Gran Vía, 45<br />Madrid
          </h2>
          <div className="space-y-1 text-[#5A8A70] text-[14px]">
            <p>Martes a domingo &middot; Mediodía y noche</p>
            <p>+34 91 000 0000 &middot; info@marquesmadrid.es</p>
          </div>
        </div>

        {/* Derecha: CTA */}
        <div className="flex flex-col items-start md:items-end gap-4">
          <Link
            href="/reservations"
            className="inline-flex items-center gap-3 px-[36px] py-[18px] bg-[#C8DC2E] text-[#172E22] font-bold text-[15px] rounded-[3px] hover:brightness-105 transition"
          >
            Reservar mesa →
          </Link>
          <p className="text-[#3A5A48] text-[12px] md:text-right leading-[1.6]">
            Reserva recomendada,<br className="hidden md:block" /> especialmente en fin de semana.
          </p>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="px-[52px] py-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-heading font-bold text-[15px] tracking-[2.5px] uppercase text-[#C8DC2E]">
          MARQUÉS
        </span>

        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px] text-[#3A5A48]">
          <Link href="/nosotros"   className="hover:text-white transition">Nosotros</Link>
          <span className="text-[#2A4A38]">&middot;</span>
          <Link href="/carta"      className="hover:text-white transition">Carta</Link>
          <span className="text-[#2A4A38]">&middot;</span>
          <Link href="/contacto"   className="hover:text-white transition">Contacto</Link>
          <span className="text-[#2A4A38]">&middot;</span>
          <Link href="/privacidad" className="hover:text-white transition">Privacidad</Link>
          <span className="text-[#2A4A38]">&middot;</span>
          <Link href="/aviso-legal" className="hover:text-white transition">Aviso legal</Link>
        </nav>

        <p className="text-[#2A4A38] text-[12px]">&copy; {year} Restaurante Marqués</p>
      </div>

    </footer>
  );
}
