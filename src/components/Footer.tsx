export default function Footer() {
  return (
    <footer className="bg-[#172E22] py-10">
      <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
        <p className="font-heading font-bold text-[17px] tracking-[2.5px] uppercase text-[#C8DC2E]">
          MARQUÉS
        </p>
        <p className="text-[#7AAD94]">Calle Gran Vía, 45 · Madrid · +34 91 000 0000</p>
        <p className="text-[#4A6A58]">© {new Date().getFullYear()} Restaurante Marqués</p>
      </div>
    </footer>
  );
}
