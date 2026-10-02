"use client";
/* Efectos de página: animación de entrada, aparición al hacer scroll y parallax de bandas. */
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function SiteEffects() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const raf = requestAnimationFrame(() => root.classList.add("is-loaded"));

    // Aparición al entrar en pantalla
    const els = document.querySelectorAll<HTMLElement>(".rv, .clip");
    let io: IntersectionObserver | null = null;
    if (!("IntersectionObserver" in window) || reduced) {
      els.forEach((e) => e.classList.add("in"));
    } else {
      io = new IntersectionObserver((entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io?.unobserve(e.target); }
      }), { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
      els.forEach((e) => io!.observe(e));
    }

    // Parallax de bandas de foto
    const bands = document.querySelectorAll<HTMLImageElement>(".band img");
    const tick = () => bands.forEach((img) => {
      const r = img.parentElement!.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
      img.style.transform = `translate3d(0, ${p * -12 - 10}%, 0)`;
    });
    const onScroll = () => requestAnimationFrame(tick);
    if (bands.length && !reduced) { addEventListener("scroll", onScroll, { passive: true }); tick(); }

    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
      removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  return null;
}
