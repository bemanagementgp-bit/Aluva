/*
  Arma Kommo para Aluva (se puede correr más de una vez: no duplica).

    KOMMO_SUBDOMINIO=aluva KOMMO_TOKEN=xxxxx node scripts/kommo-setup.mjs

  Crea:
    - embudo "Consultas web" con las etapas del proceso comercial;
    - campos del lead: producto, tipo de obra, zona, canal y los utm_* / fbclid;
    - motivos de descarte (precio, sólo consultaba, fuera de zona…).
  Al final imprime el bloque KOMMO_* para pegar en aluva-config.php.
*/
const SUB = process.env.KOMMO_SUBDOMINIO;
const TOKEN = process.env.KOMMO_TOKEN;
if (!SUB || !TOKEN) { console.error("Faltan KOMMO_SUBDOMINIO y KOMMO_TOKEN"); process.exit(1); }
const BASE = `https://${SUB}.kommo.com/api/v4`;

async function api(metodo, ruta, cuerpo) {
  const r = await fetch(BASE + ruta, {
    method: metodo,
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json", Accept: "application/json" },
    body: cuerpo ? JSON.stringify(cuerpo) : undefined,
  });
  const txt = await r.text();
  if (!r.ok) throw new Error(`${metodo} ${ruta} → HTTP ${r.status}: ${txt.slice(0, 400)}`);
  return txt ? JSON.parse(txt) : {};
}

const EMBUDO = "Consultas web";
const ETAPAS = ["Nueva consulta", "Contactado", "Visita / medición", "Presupuesto enviado", "Negociación"];
const CAMPOS = [
  ["producto", "Producto"], ["tipo_obra", "Tipo de obra"], ["zona", "Zona"], ["canal", "Canal de entrada"],
  ["utm_source", "utm_source"], ["utm_medium", "utm_medium"], ["utm_campaign", "utm_campaign"],
  ["utm_content", "utm_content"], ["utm_term", "utm_term"], ["fbclid", "fbclid"],
];
const MOTIVOS = ["Precio", "Sólo consultaba", "Fuera de zona", "Compró en otro lado", "No responde", "Plazo de entrega", "Producto que no hacemos"];

// 1. Embudo y etapas
const embudos = (await api("GET", "/leads/pipelines"))._embedded?.pipelines ?? [];
let emb = embudos.find((p) => p.name === EMBUDO);
if (!emb) {
  const r = await api("POST", "/leads/pipelines", [{
    name: EMBUDO, sort: 1, is_main: false, is_unsorted_on: true,
    _embedded: { statuses: ETAPAS.map((name, i) => ({ name, sort: (i + 1) * 10 })) },
  }]);
  emb = r._embedded.pipelines[0];
  console.log(`✔ Embudo creado: ${EMBUDO}`);
} else console.log(`· Embudo ya existía: ${EMBUDO}`);
const etapas = (await api("GET", `/leads/pipelines/${emb.id}/statuses`))._embedded.statuses;
const primera = etapas.find((s) => s.name === ETAPAS[0]) ?? etapas.find((s) => s.type === 0 && s.id !== 142 && s.id !== 143);

// 2. Campos del lead
const existentes = [];
for (let p = 1; ; p++) {
  const r = await fetch(`${BASE}/leads/custom_fields?limit=250&page=${p}`, { headers: { Authorization: `Bearer ${TOKEN}` } });
  if (r.status === 204) break;
  const j = await r.json();
  existentes.push(...(j._embedded?.custom_fields ?? []));
  if (!j._links?.next) break;
}
const ids = {};
const faltan = CAMPOS.filter(([, nombre]) => !existentes.some((f) => f.name === nombre));
if (faltan.length) {
  await api("POST", "/leads/custom_fields", faltan.map(([, name], i) => ({ name, type: "text", sort: 500 + i })));
  console.log(`✔ Campos creados: ${faltan.map(([, n]) => n).join(", ")}`);
}
const todos = (await api("GET", "/leads/custom_fields?limit=250"))._embedded.custom_fields;
for (const [clave, nombre] of CAMPOS) ids[clave] = todos.find((f) => f.name === nombre)?.id ?? 0;

// 3. Motivos de descarte (si la cuenta no tiene esta API, se cargan a mano)
try {
  const actuales = (await api("GET", "/leads/loss_reasons"))._embedded?.loss_reasons ?? [];
  const nuevos = MOTIVOS.filter((m) => !actuales.some((a) => a.name === m));
  if (nuevos.length) await api("POST", "/leads/loss_reasons", nuevos.map((name, i) => ({ name, sort: (i + 1) * 10 })));
  console.log(`✔ Motivos de descarte: ${nuevos.length ? "creados " + nuevos.length : "ya estaban"}`);
} catch (e) {
  console.warn(`! No se pudieron crear los motivos de descarte por API (${e.message.slice(0, 120)}).\n  Cargarlos a mano en Ajustes → Embudo → Perdido: ${MOTIVOS.join(", ")}`);
}

console.log(`\nPegar en aluva-config.php:\n
    'KOMMO_EMBUDO' => ${emb.id},
    'KOMMO_ETAPA'  => ${primera?.id ?? 0},
    'KOMMO_CAMPOS' => [
${Object.entries(ids).map(([k, v]) => `        '${k}' => ${v},`).join("\n")}
    ],`);
