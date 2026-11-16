"use client";
/* Carga el Pixel de Meta y marca cada página vista, también al navegar sin recargar. */
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { cargarPixel, capturarOrigen, evento } from "@/lib/tracking";

export default function MetaPixel() {
  const pathname = usePathname();
  useEffect(() => {
    cargarPixel();
    // Cualquier botón o enlace a WhatsApp (flotante, pie, fichas) cuenta como Contact
    const clic = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href*='wa.me']");
      if (a) evento("Contact", { content_name: location.pathname });
    };
    document.addEventListener("click", clic, true);
    return () => document.removeEventListener("click", clic, true);
  }, []);
  useEffect(() => { capturarOrigen(); evento("PageView"); }, [pathname]);
  return null;
}
