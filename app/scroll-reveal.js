"use client";

import { useEffect } from "react";

// Anima los elementos con clase .reveal cuando entran en pantalla al hacer scroll.
export default function ScrollReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll(".reveal"));
    if (els.length === 0) return;

    const reveal = (el) => el.classList.add("in-view");

    // Accesibilidad: si prefiere menos movimiento, mostramos todo de una.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach(reveal);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    els.forEach((el) => observer.observe(el));

    // Red de seguridad: si algo falla, revela todo pasados unos segundos.
    const safety = setTimeout(() => els.forEach(reveal), 3000);

    return () => {
      observer.disconnect();
      clearTimeout(safety);
    };
  }, []);

  return null;
}
