import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function Reveal({ as: As = "div", delay = 0, className = "", children, ...rest }) {
  const { ref, visible } = useScrollReveal();
  const d = delay ? ` d${delay}` : "";
  return (
    <As ref={ref} className={`reveal${d} ${visible ? "is-visible" : ""} ${className}`} {...rest}>
      {children}
    </As>
  );
}
