import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[#172E22] border-t border-white/8">
      <div className="px-[52px] py-6 flex flex-col md:flex-row items-center justify-between gap-4">

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
