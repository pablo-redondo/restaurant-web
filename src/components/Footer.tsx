import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[#172E22] border-t border-white/10">
      {/* Grid principal */}
      <div className="px-[52px] py-16 grid grid-cols-2 md:grid-cols-[1.8fr_1fr_1fr_1fr] gap-10 items-start">
        {/* Marca */}
        <div className="col-span-2 md:col-span-1">
          <p className="font-heading font-bold text-[17px] tracking-[2.5px] uppercase text-[#C8DC2E] mb-4">
            MARQUÉS
          </p>
          <p className="text-[#5A8A70] text-[13px] leading-[1.7] max-w-[220px] mb-5">
            Cocina de temporada en el corazón de Madrid desde 1987. Dos generaciones, una misma pasión.
          </p>
          <p className="text-[#3A5A48] text-[13px]">Calle Gran Vía, 45 · 28013 Madrid</p>
          <p className="text-[#3A5A48] text-[13px] mt-1">+34 91 000 0000</p>
          <p className="text-[#3A5A48] text-[13px] mt-1">info@marquesmadrid.es</p>
        </div>

        {/* Restaurante */}
        <div>
          <p className="text-[#4A7A60] text-[10px] font-bold tracking-[2px] uppercase mb-5">Restaurante</p>
          <ul className="space-y-3">
            <li><Link href="/nosotros" className="text-[#5A8070] text-[13px] hover:text-white transition">Nosotros</Link></li>
            <li><Link href="/carta" className="text-[#5A8070] text-[13px] hover:text-white transition">Carta</Link></li>
            <li><Link href="/contacto" className="text-[#5A8070] text-[13px] hover:text-white transition">Contacto y horarios</Link></li>
          </ul>
        </div>

        {/* Reservas */}
        <div>
          <p className="text-[#4A7A60] text-[10px] font-bold tracking-[2px] uppercase mb-5">Reservas</p>
          <ul className="space-y-3">
            <li><Link href="/reservations" className="text-[#5A8070] text-[13px] hover:text-white transition">Reservar mesa</Link></li>
            <li><Link href="/reservations/me" className="text-[#5A8070] text-[13px] hover:text-white transition">Mis reservas</Link></li>
            <li><Link href="/login" className="text-[#5A8070] text-[13px] hover:text-white transition">Mi cuenta</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <p className="text-[#4A7A60] text-[10px] font-bold tracking-[2px] uppercase mb-5">Legal</p>
          <ul className="space-y-3">
            <li><Link href="/privacidad" className="text-[#5A8070] text-[13px] hover:text-white transition">Política de privacidad</Link></li>
            <li><Link href="/aviso-legal" className="text-[#5A8070] text-[13px] hover:text-white transition">Aviso legal</Link></li>
          </ul>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="px-[52px] py-5 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-2">
        <p className="text-[#2E4A38] text-[12px]">© {year} Restaurante Marqués · Todos los derechos reservados</p>
        <p className="text-[#2E4A38] text-[12px]">Hecho con cuidado en Madrid</p>
      </div>
    </footer>
  );
}
