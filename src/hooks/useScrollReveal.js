import { useEffect, useRef, useState } from "react";

export function useScrollReveal({ threshold = 0.15, once = true } = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true);
  }, [threshold, once]);

  return { ref, visible };
}

export function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop || document.body.scrollTop;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? scrolled / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return p;
}

export function useMousePos() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return pos;
}
