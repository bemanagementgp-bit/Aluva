/* Íconos SVG del sitio. Heredan el color del texto (currentColor). */
const P = { fill: "none", stroke: "currentColor", strokeWidth: 2 } as const;

const ICONS = {
  ruler: <svg viewBox="0 0 40 40" {...P}><rect x="4" y="13" width="32" height="14" rx="2" /><path d="M10 13v6M16 13v4M22 13v6M28 13v4" /></svg>,
  factory: <svg viewBox="0 0 40 40" {...P}><path d="M4 34V18l9 6v-6l9 6v-6l9 6V6h5v28z" /><path d="M4 34h32" /></svg>,
  thermo: <svg viewBox="0 0 40 40" {...P}><path d="M17 24V7a3 3 0 0 1 6 0v17a7 7 0 1 1-6 0z" /><path d="M20 14v14" /><circle cx="20" cy="29" r="2.5" fill="currentColor" /></svg>,
  sound: <svg viewBox="0 0 40 40" {...P}><path d="M6 15h6l8-7v24l-8-7H6z" /><path d="M27 14l8 12M35 14l-8 12" /></svg>,
  shield: <svg viewBox="0 0 40 40" {...P}><path d="M20 4l13 5v10c0 8-6 14-13 17C13 33 7 27 7 19V9z" /><path d="M14 20l4 4 8-8" /></svg>,
  tools: <svg viewBox="0 0 40 40" {...P}><path d="M24 6a8 8 0 0 0-8 10L5 27l6 6 11-11a8 8 0 0 0 10-8l-5 3-4-4z" /></svg>,
  sun: <svg viewBox="0 0 40 40" {...P}><circle cx="20" cy="20" r="7" /><path d="M20 3v5M20 32v5M3 20h5M32 20h5M8 8l3.5 3.5M28.5 28.5L32 32M8 32l3.5-3.5M28.5 11.5L32 8" /></svg>,
  drop: <svg viewBox="0 0 40 40" {...P}><path d="M20 5s11 12 11 20a11 11 0 0 1-22 0c0-8 11-20 11-20z" /></svg>,
  palette: <svg viewBox="0 0 40 40" {...P}><path d="M20 4a16 16 0 1 0 0 32c2 0 3-1 3-3s-2-3-1-5 3-2 6-2c4 0 8-2 8-7C36 10 29 4 20 4z" /><circle cx="12" cy="18" r="2" /><circle cx="18" cy="11" r="2" /><circle cx="27" cy="12" r="2" /></svg>,
  leaf: <svg viewBox="0 0 40 40" {...P}><path d="M8 32C8 16 18 7 34 6c0 16-9 26-24 26z" /><path d="M8 32l14-14" /></svg>,
  layers: <svg viewBox="0 0 40 40" {...P}><path d="M20 5l16 8-16 8-16-8z" /><path d="M4 20l16 8 16-8M4 27l16 8 16-8" /></svg>,
  sparkle: <svg viewBox="0 0 40 40" {...P}><path d="M20 4l3.5 12.5L36 20l-12.5 3.5L20 36l-3.5-12.5L4 20l12.5-3.5z" /></svg>,
};

export type IconName = keyof typeof ICONS;
export const Icon = ({ name }: { name: IconName }) => ICONS[name];

const S = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;
export const Arrow = () => <svg viewBox="0 0 24 24" {...S}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
export const ArrowL = () => <svg viewBox="0 0 24 24" {...S}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>;
export const Chev = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>;

const L = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, "aria-hidden": true } as const;
export const IPhone = () => <svg viewBox="0 0 24 24" {...L}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></svg>;
export const IMail = () => <svg viewBox="0 0 24 24" {...L}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 6l-10 7L2 6" /></svg>;
export const IPin = () => <svg viewBox="0 0 24 24" {...L}><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0z" /><circle cx="12" cy="10" r="3" /></svg>;
export const IClock = () => <svg viewBox="0 0 24 24" {...L}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>;
export const WA = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1 1 12 21.8zM12 0a12 12 0 0 0-10.3 18.1L0 24l6-1.6A12 12 0 1 0 12 0z" /></svg>
);
