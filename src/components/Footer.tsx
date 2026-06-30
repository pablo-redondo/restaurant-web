import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[#0F1F17] px-[52px] pt-10 pb-6">
      <div className="max-w-[1120px] mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-6 pb-[26px] border-b border-[#1E3527]">
          <Link href="/" className="font-heading font-semibold text-[18px] sm:text-[20px] tracking-[4px] sm:tracking-[5px] uppercase text-white">
            MARQUÉS
          </Link>

          <div className="flex flex-wrap items-center gap-x-[30px] gap-y-3">
            <Link href="/nosotros" className="text-[13.5px] font-medium text-[#8AB5A0] hover:text-white transition-colors">
              Nosotros
            </Link>
            <Link href="/carta" className="text-[13.5px] font-medium text-[#8AB5A0] hover:text-white transition-colors">
              Carta
            </Link>
            <Link href="/contacto" className="text-[13.5px] font-medium text-[#8AB5A0] hover:text-white transition-colors">
              Contacto
            </Link>
            <Link
              href="/reservations"
              className="bg-[#C8DC2E] text-[#172E22] px-6 py-[11px] rounded-[3px] text-[13px] font-bold tracking-[0.4px] hover:brightness-110 transition-all"
            >
              Reservar mesa
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mt-5">
          <p className="text-[12px] text-[#4A6A58]">&copy; {year} Restaurante Marqués · Gran Vía, 45 · Madrid</p>
          <div className="flex gap-5 text-[12px] text-[#6E8C7C]">
            <Link href="/privacidad" className="hover:text-white transition-colors">Privacidad</Link>
            <Link href="/aviso-legal" className="hover:text-white transition-colors">Aviso legal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
