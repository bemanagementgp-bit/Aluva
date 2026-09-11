/*
  Ejecuta un desplazamiento sin la animación de `scroll-behavior: smooth` que
  el sitio tiene activada en <html>.

  Sirve para los saltos al cambiar de página o al llegar con un #ancla: ahí la
  animación hace que la página nueva aparezca a mitad de camino y se deslice,
  y donde las animaciones no corren (modo ahorro, pestaña en segundo plano)
  queda clavada a mitad de página. Se usa esto en lugar de `behavior: "instant"`
  porque ese valor no existe en navegadores más viejos y ahí tira error.
*/
export function sinSuavizado(desplazar) {
  const html = document.documentElement;
  const anterior = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";
  // El navegador no aplica el cambio de estilo hasta que algo lo obliga a
  // recalcular, y scrollTo no lo obliga: sin esta lectura seguía usando el
  // smooth anterior y el salto no ocurría (medido: la página quedaba donde
  // estaba). Leer el estilo computado fuerza ese recálculo.
  void getComputedStyle(html).scrollBehavior;
  try {
    desplazar();
  } finally {
    html.style.scrollBehavior = anterior;
  }
}
