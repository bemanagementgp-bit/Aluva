/*
  Arma el paquete para el hosting de aluva.com.ar (Apache, public_html).

  1. Copia el proyecto (sin node_modules) a una carpeta temporal FUERA de OneDrive
     y enlaza node_modules ahí. Motivo: OneDrive convierte los archivos de .next en
     reparse points mientras Next compila y la build muere con EINVAL readlink.
     De paso, no toca la .next de `npm run dev`.
  2. Compila el sitio como HTML estático (output: "export") en esa copia.
  3. Copia hosting/.htaccess al resultado y lo comprime en aluva-hosting.zip, con los
     archivos en la raíz del zip, listo para subir a public_html y descomprimir ahí.

  Uso: npm run hosting
*/
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const raiz = process.cwd();
const win = process.platform === "win32";
const obra = join(tmpdir(), "aluva-hosting-build");
const out = join(obra, "out");
const zipNombre = "aluva-hosting.zip";

// shell solo para npx (en Windows es npx.cmd); tar se lanza directo, así los
// nombres con espacios llegan enteros.
const correr = (cmd, args, { cwd = raiz, env = {}, shell = false } = {}) => {
  const r = spawnSync(cmd, args, { cwd, stdio: "inherit", shell, env: { ...process.env, ...env } });
  if (r.status !== 0) { console.error(`\n✖ Falló: ${cmd} ${args.join(" ")}`); process.exit(r.status ?? 1); }
};

console.log(`▸ Preparando copia de trabajo en ${obra}`);
rmSync(obra, { recursive: true, force: true });
mkdirSync(obra, { recursive: true });
for (const e of ["src", "public", "next.config.ts", "tsconfig.json", "package.json"]) {
  cpSync(join(raiz, e), join(obra, e), { recursive: true });
}
symlinkSync(join(raiz, "node_modules"), join(obra, "node_modules"), win ? "junction" : "dir");

console.log("▸ Compilando exportación estática…");
correr("npx", ["next", "build"], { cwd: obra, shell: win, env: { NEXT_OUTPUT: "export", SITE_URL: "https://aluva.com.ar" } });

if (!existsSync(join(out, "index.html"))) { console.error("✖ No apareció out/index.html"); process.exit(1); }
cpSync(join(raiz, "hosting", ".htaccess"), join(out, ".htaccess"));

console.log("▸ Comprimiendo…");
rmSync(join(raiz, zipNombre), { force: true });
const entradas = readdirSync(out);
// bsdtar (el tar.exe de Windows 10+, y el de macOS) sabe escribir zip con --format zip.
// En Windows hay que llamarlo por su ruta: con Git instalado, el "tar" del PATH es el
// GNU tar de Git Bash, que no escribe zip (generó un tar con nombre .zip y cPanel no
// pudo extraerlo). Rutas relativas: bsdtar toma "C:\..." como un host remoto.
const tar = win ? join(process.env.SystemRoot || "C:\\Windows", "System32", "tar.exe") : "tar";
correr(tar, ["--format", "zip", "-cf", join("out", zipNombre), "-C", "out", ...entradas], { cwd: obra });
cpSync(join(out, zipNombre), join(raiz, zipNombre));

// Un zip empieza con "PK"; si no, no se entrega
const firma = readFileSync(join(raiz, zipNombre)).subarray(0, 4);
if (!firma.equals(Buffer.from([0x50, 0x4b, 0x03, 0x04]))) { console.error("✖ El archivo generado no es un zip válido"); process.exit(1); }

const mb = (statSync(join(raiz, zipNombre)).size / 1048576).toFixed(1);
const paginas = entradas.filter((e) => e.endsWith(".html")).sort().join(", ");
console.log(`\n✔ Listo: ${zipNombre} (${mb} MB)\n  Páginas: ${paginas}\n  Subir a public_html y descomprimir ahí (ver hosting/COMO-SUBIR.md).`);
