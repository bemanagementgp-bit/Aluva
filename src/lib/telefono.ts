/*
  Teléfonos argentinos: acepta como lo escribe la gente ("221 15 675-5077",
  "0221 6755077", "+54 9 11 2345 6789", "15 675 5077"…) y devuelve el formato
  internacional de celular que usan WhatsApp, Kommo y Meta: 549 + área + número
  (10 dígitos sin 0 ni 15). Devuelve null si no se puede armar un número válido.

  Sin código de área se asume La Plata (221), donde está el local.
*/
const AREA_DEFECTO = "221";

export function normalizarTelefono(entrada: string): string | null {
  let d = (entrada || "").replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("54")) d = d.slice(2);
  if (d.startsWith("9") && d.length === 11) d = d.slice(1); // 9 de celular internacional
  if (d.startsWith("0")) d = d.slice(1);                     // 0 de larga distancia

  // Local sin código de área: 15 + 7 dígitos, o 7 dígitos solos (La Plata)
  if (d.length === 9 && d.startsWith("15")) d = d.slice(2);
  if (d.length === 7) d = AREA_DEFECTO + d;

  // Con el 15 de celular después del área: 12 dígitos
  if (d.length === 12) {
    // El área mide 2 (11, Buenos Aires), 3 (221, 351…) o 4 (2293, 2291…) dígitos
    const pos = d.startsWith("11") ? [2] : [3, 4];
    const p = pos.find((i) => d.slice(i, i + 2) === "15");
    if (p === undefined) return null;
    d = d.slice(0, p) + d.slice(p + 2);
  }

  if (d.length !== 10 || !/^(11|[2-9])/.test(d)) return null;
  return "549" + d;
}

