import "@/App.css";
import { useLayoutEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { sinSuavizado } from "@/lib/scroll";
import SeoRuta from "@/components/SeoRuta";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Producto from "@/pages/Producto";

// Al cambiar de página se arranca siempre desde arriba, sin animación y antes
// de pintar. Sin esto, la ficha abría a la misma altura de scroll que tenía la
// home (a mitad de página) y el scroll suave global la hacía deslizarse. Los
// enlaces con #ancla los atiende la propia home.
function ScrollArriba() {
  const { pathname, hash } = useLocation();
  useLayoutEffect(() => {
    if (hash) return;
    sinSuavizado(() => window.scrollTo(0, 0));
  }, [pathname, hash]);
  return null;
}

// Las rutas van aparte del enrutador: en el navegador se montan dentro de
// BrowserRouter y en el build (scripts/prerender.mjs) dentro de StaticRouter,
// para escribir cada página como HTML real que los buscadores leen sin JS.
export function Rutas() {
  return (
    <>
      <ScrollArriba />
      <SeoRuta />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/productos/:id" element={<Producto />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Rutas />
    </BrowserRouter>
  );
}

export default App;
