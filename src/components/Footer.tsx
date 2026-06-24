export default function Footer() {
  return (
    <footer className="bg-stone-950 border-t border-stone-800 py-10 mt-auto">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-stone-500 text-sm">
        <p className="font-serif text-amber-400 tracking-widest uppercase text-base">Marqués</p>
        <p>Calle Gran Vía, 45 · Madrid · +34 91 000 0000</p>
        <p>© {new Date().getFullYear()} Restaurante Marqués</p>
      </div>
    </footer>
  );
}
