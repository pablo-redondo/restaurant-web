import Link from 'next/link';

export default function NotFound() {
  return (
    <section
      className="bg-[#172E22] flex flex-col items-center justify-center px-[52px] py-32 text-center"
      style={{ minHeight: 'calc(100vh - 58px)' }}
    >
      <p className="text-[#C8DC2E] text-[11px] font-bold tracking-[2.5px] uppercase mb-5">Error 404</p>
      <h1 className="font-hero font-[800] text-[72px] leading-[1.02] text-white mb-5">
        Página no<br />encontrada
      </h1>
      <p className="text-[#8AB5A0] text-[16px] leading-[1.75] max-w-[400px] mb-10">
        Parece que esta página no existe o se ha movido.
        Prueba desde el inicio o haz una reserva directamente.
      </p>
      <div className="flex gap-3 flex-wrap justify-center">
        <Link
          href="/"
          className="px-[28px] py-[13px] bg-[#C8DC2E] text-[#172E22] font-bold text-[14px] rounded-[3px] hover:brightness-105 transition"
        >
          Volver al inicio
        </Link>
        <Link
          href="/reservations"
          className="px-[28px] py-[13px] border border-white/15 text-white text-[14px] rounded-[3px] hover:bg-white/5 transition"
        >
          Reservar mesa
        </Link>
      </div>
    </section>
  );
}
