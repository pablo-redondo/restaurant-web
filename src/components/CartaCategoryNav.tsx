'use client';

import { useEffect, useState } from 'react';

type Category = { id: string; title: string };

export default function CartaCategoryNav({ categories }: { categories: Category[] }) {
  const [active, setActive] = useState(categories[0]?.id);

  useEffect(() => {
    const onScroll = () => {
      let current = categories[0]?.id;
      for (const c of categories) {
        const el = document.getElementById(c.id);
        if (el && el.getBoundingClientRect().top - 150 <= 0) current = c.id;
      }
      setActive(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [categories]);

  return (
    <nav
      className="sticky top-[58px] z-40 border-b border-[#C4D5CA]"
      style={{ background: 'rgba(240,244,240,0.97)', backdropFilter: 'blur(14px)' }}
    >
      <div className="max-w-5xl mx-auto px-[52px] overflow-x-auto">
        <ul className="flex gap-2 min-w-max justify-center">
          {categories.map((c, idx) => {
            const isActive = active === c.id;
            return (
              <li key={c.id}>
                <a
                  href={`#${c.id}`}
                  className={`flex items-center gap-[9px] px-[14px] py-[18px] border-b-2 text-[14px] transition-colors duration-200 ${
                    isActive ? 'border-[#C8DC2E] text-[#172E22] font-bold' : 'border-transparent text-[#5A6B60] font-semibold hover:text-[#172E22]'
                  }`}
                >
                  <span
                    className={`flex items-center justify-center w-[21px] h-[21px] rounded-full text-[11px] font-bold transition-colors duration-200 ${
                      isActive ? 'bg-[#C8DC2E] text-[#172E22]' : 'bg-[#E2ECE6] text-[#172E22]'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  {c.title}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
