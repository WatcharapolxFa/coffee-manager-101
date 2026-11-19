'use client';

import { useEffect } from 'react';

// Mounted once on the customer menu: drinks and labels rise in as they scroll into view.
// Elements opt in with data-reveal (+ the .reveal class); nothing hides before JS runs.
export function ScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
    const io = new IntersectionObserver(entries => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(el => io.observe(el));
    document.documentElement.classList.add('reveal-ready');
    return () => io.disconnect();
  }, []);
  return null;
}
