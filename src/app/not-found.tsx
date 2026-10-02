import Link from "next/link";
import Shell from "@/components/Shell";
import { Eyebrow } from "@/components/blocks";

export default function NoEncontrada() {
  return (
    <Shell active="inicio" lightFooter>
      <section className="phero blueprint" style={{ minHeight: "70svh" }}>
        <div className="wrap">
          <Eyebrow n="404">Página no encontrada</Eyebrow>
          <div className="phero__row">
            <h1 className="h-giant"><span>Ups</span></h1>
            <p className="lead">Esta página no existe o cambió de lugar.</p>
          </div>
          <div className="btn-row" style={{ marginTop: 32 }}>
            <Link className="btn btn--lime" href="/">Ir al inicio <span className="arr">→</span></Link>
            <Link className="btn btn--ghost" href="/productos">Ver aberturas</Link>
          </div>
        </div>
      </section>
    </Shell>
  );
}
