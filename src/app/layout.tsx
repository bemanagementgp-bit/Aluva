import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@/styles/site.css";
import "@/styles/profesionales.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://aluva.vercel.app"),
  title: "Aluva · Aberturas de PVC y aluminio a medida en La Plata",
  description: "Fábrica de aberturas a medida en La Plata: PVC, vidrio templado, aluminio y vidriería con DVH y mamparas.",
  icons: { icon: { url: "/brand/icon-principal.svg", type: "image/svg+xml" }, apple: "/brand/icon-192.png" },
  openGraph: { type: "website", locale: "es_AR", images: ["/brand/og-aluva.jpg"] },
};

export const viewport: Viewport = { themeColor: "#002828" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es-AR">
      <head>
        <link rel="preload" href="/fonts/lgei-headline-bold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
